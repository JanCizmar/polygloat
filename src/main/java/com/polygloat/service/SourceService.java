package com.polygloat.service;

import com.polygloat.DTOs.SourceInfoDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.SourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.Optional;

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

    private Source getOrCreateSource(Repository repository, SourceInfoDTO sourceInfoDTO) {
        File file = fileService.getOrCreatePath(repository, sourceInfoDTO.getPath());

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

    private Optional<Source> getSource(Repository repository, SourceInfoDTO sourceInfoDTO) {
        File file = fileService.evaluatePath(repository, sourceInfoDTO.getPath()).orElseThrow(NotFoundException::new);
        return Optional.ofNullable(file.getSource());
    }

    public void deleteSource(Long repositoryId, String sourcePath) {
        SourceInfoDTO sourceInfoDTO = new SourceInfoDTO(sourcePath);
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
        sourceRepository.delete(getSource(repository, sourceInfoDTO).orElseThrow(NotFoundException::new));
    }

    public Source getCreateOrModifySource(Repository repository, SourceTranslationsDTO data) {
        //if creating new translation old source info is null

        SourceInfoDTO sourceToRetrieve = data.getNewSourceInfo();
        if (data.getOldSourceInfo() != null) {
            //if old source (modifying a source), retrieve old one
            sourceToRetrieve = data.getOldSourceInfo();
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
