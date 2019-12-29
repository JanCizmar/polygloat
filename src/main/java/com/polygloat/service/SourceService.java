package com.polygloat.service;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.SourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;

@Service
public class SourceService {


    private SourceRepository sourceRepository;
    private FileService fileService;
    private RepositoryRepository repositoryRepository;
    private EntityManager entityManager;

    @Autowired
    public SourceService(SourceRepository sourceRepository,
                         FileService fileService,
                         RepositoryRepository repositoryRepository,
                         EntityManager entityManager) {
        this.sourceRepository = sourceRepository;
        this.fileService = fileService;
        this.repositoryRepository = repositoryRepository;
        this.entityManager = entityManager;
    }

    private Source getOrCreateSource(Repository repository, PathDTO path) {
        File file = fileService.getOrCreatePath(repository, path);

        if (file.isFolder() && file.getChildren() != null && !file.getChildren().isEmpty()) {
            throw new IllegalArgumentException("Requested file is folder");
        }

        Source source = file.getSource();

        if (source == null) {
            source = new Source();
            source.setFile(file);
            file.setSource(source);
            return source;
        }

        entityManager.persist(file);
        entityManager.persist(source);

        return source;
    }

    public Source getCreateOrModifySource(Repository repository, SourceTranslationsDTO data) {
        //if creating new translation old source info is null

        PathDTO sourceToRetrieve = data.getNewSourcePath();
        if (data.getOldSourcePath() != null) {
            //if old source (modifying a source), retrieve old one
            sourceToRetrieve = data.getOldSourcePath();
        }

        Source source = getOrCreateSource(repository, sourceToRetrieve);

        File file = source.getFile();

        //new source info is always set, so setting the new name
        file.setName(data.getNewSourceName());

        entityManager.persist(file);
        sourceRepository.save(source);

        return source;
    }
}
