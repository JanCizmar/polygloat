package com.polygloat.service;

import com.polygloat.AbstractTransactionalTest;
import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.queryResults.FileDTO;
import com.polygloat.Exceptions.InvalidPathException;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.repository.RepositoryRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Transactional
@SpringBootTest
class FileServiceTest extends AbstractTransactionalTest {

    private static final Long REPOSITORY_ID = 3L;

    @Autowired
    FileService fileService;

    @Autowired
    RepositoryRepository repositoryRepository;

    @Autowired
    DbPopulatorReal dbPopulator;

    @Autowired
    RepositoryService repositoryService;

    private boolean initialized = false;

    private Repository repository;

    private File createdFileEntity;

    void createTestData() {
        newTransaction();
        File rootFolder = dbPopulator.createBase("Application");

        repository = rootFolder.getRepository();

        this.createdFileEntity = new File("subfolder1", rootFolder, repository);
        File file2 = new File("subfolder2", createdFileEntity, repository);
        File file3 = new File("subfolder3", file2, repository);
        File file4 = new File("subfolder4", file2, repository);
        File file5 = new File("subfolder5", file2, repository);
        entityManager.persist(createdFileEntity);
        entityManager.persist(file2);
        entityManager.persist(file3);
        entityManager.persist(file4);
        entityManager.persist(file5);
        newTransaction();
    }

    void removeTestData() {
        newTransaction();
        File file = entityManager.merge(createdFileEntity);
        fileService.deleteFile(file);
        newTransaction();
    }

    @BeforeEach
    void beforeEach() {
        createTestData();
    }

    @AfterEach
    void afterEach() {
        removeTestData();
    }

    @Test
    void getViewData() {
        dbPopulator.populate("App2");

        newTransaction();

        Repository repository = repositoryService.findByName("App2").orElseThrow(NotFoundException::new);

        LinkedHashSet<FileDTO> allInRepository = fileService.getDataForView(
                repository,
                new HashSet<>(Arrays.asList("en", "de")));
        assertThat(allInRepository).isNotEmpty();
    }

    @Test
    void updateChildMaterializedPathsMiddleItem() {
        File file = fileService.evaluatePath(repository, PathDTO.fromFullPath("subfolder1.subfolder2"))
                .orElseThrow(NotFoundException::new);
        file.setName("newSubfolder2");
        fileService.updateChildMaterializedPaths(file);

        newTransaction();
        entityManager.merge(repository);

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.subfolder2"))
                .orElse(null);
        assertThat(file).isNull();

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.newSubfolder2")).orElse(null);
        assertThat(file).isNotNull();

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.newSubfolder2.subfolder3")).orElse(null);
        assertThat(file).isNotNull();
        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.newSubfolder2.subfolder3")).orElse(null);
        assertThat(file).isNotNull();
        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.newSubfolder2.subfolder5")).orElse(null);
        assertThat(file).isNotNull();
    }

    @Test
    void updateChildMaterializedPathsFirstItem() {
        File file = fileService.evaluatePath(repository, PathDTO.fromFullPath("subfolder1"))
                .orElseThrow(NotFoundException::new);
        file.setName("newSubfolder1");
        fileService.updateChildMaterializedPaths(file);
        newTransaction();

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("newSubfolder1.subfolder2.subfolder3")).orElse(null);
        assertThat(file).isNotNull();
    }

    @Test
    void deleteFileTest() {
        File file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.subfolder2")).orElseThrow(NotFoundException::new);

        fileService.deleteFile(file);

        newTransaction();

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.subfolder2")).orElse(null);
        assertThat(file).isNull();

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("subfolder1.newSubfolder2.subfolder3")).orElse(null);
        assertThat(file).isNull();
    }


    @Test
    void moveFile() {
        assertThatThrownBy(() -> {
            fileService.setFile(1L,
                    PathDTO.fromFullPath("aa.aa"),
                    PathDTO.fromFullPath(Collections.emptyList()));
        }).isInstanceOf(InvalidPathException.class);

        assertThatThrownBy(() -> {
            fileService.setFile(1L,
                    PathDTO.fromFullPath(Collections.emptyList()),
                    PathDTO.fromFullPath("aa.aa"));
        }).isInstanceOf(InvalidPathException.class);


        assertThatThrownBy(() -> {
            fileService.setFile(1L,
                    PathDTO.fromFullPath("aa.aa"),
                    PathDTO.fromFullPath("aa.aa.aa"));
        }).isInstanceOf(InvalidPathException.class);


    }
}
