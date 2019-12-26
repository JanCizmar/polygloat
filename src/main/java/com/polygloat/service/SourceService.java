package com.polygloat.service;

import com.polygloat.DTOs.SourceInfoDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.SourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        if (file.isFolder()) {
            throw new IllegalArgumentException("Requested file is folder");
        }

        Source source = file.getSource();

        if (source == null) {
            Source s = new Source();
            s.setFile(file);
            sourceRepository.save(s);
            return s;
        }

        return source;
    }

    @Transactional
    public Source getCreateOrModifySource(Repository repository, SourceInfoDTO sourceInfoDTO, String newSourceText) {

        //if creating new translation (the sourceText is "") setting the source name to newSource name
        if (sourceInfoDTO.getSourceText().isEmpty()) {
            sourceInfoDTO.setSourceText(newSourceText);
        }

        Source source = getOrCreateSource(repository, sourceInfoDTO);

        File file = source.getFile();
        file.setName(newSourceText);

        entityManager.persist(file);
        sourceRepository.save(source);

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

}
