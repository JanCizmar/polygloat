package com.polygloat.service;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.repository.RepositoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Arrays;
import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class FileServiceTest {
    @Autowired
    FileService fileService;

    @Autowired
    RepositoryRepository repositoryRepository;

    @Autowired
    DbPopulatorReal dbPopulator;

    @Autowired
    EntityManager entityManager;

    private boolean initialized = false;

    @BeforeEach
    void beforeClass() {
        if (!initialized) {
            dbPopulator.populate();
            TestTransaction.flagForCommit();
            TestTransaction.end();
            entityManager.clear();
            TestTransaction.start();
            initialized = true;
        }
    }

    @Test
    void findAllInRepository() {
        fileService.findAllInRepository(repositoryRepository.findById(3L).orElse(null),
                new HashSet<>(Arrays.asList("en", "de")));
    }

    @Test
    void updateChildMaterializedPaths() {
        Repository repository = repositoryRepository.findById(3L).orElse(null);
        File file = fileService.evaluatePath(repository, PathDTO.fromFullPath("home.news")).orElse(null);
        file.setName("newNews");
        fileService.updateChildMaterializedPaths(file);

        TestTransaction.flagForCommit();
        TestTransaction.end();
        entityManager.clear();
        TestTransaction.start();

        entityManager.merge(repository);

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("home.news.This_is_another_translation_in_news_folder"))
                .orElse(null);
        assertThat(file).isNull();

        file = fileService.evaluatePath(repository,
                PathDTO.fromFullPath("home.newNews.This_is_another_translation_in_news_folder")).orElse(null);
        assertThat(file).isNotNull();
    }

}
