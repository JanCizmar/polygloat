package com.polygloat.service;

import com.polygloat.DTOs.SourceInfoDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Folder;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.SourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SourceService {


    private SourceRepository sourceRepository;
    private FolderService folderService;
    private RepositoryRepository repositoryRepository;

    @Autowired
    public SourceService(SourceRepository sourceRepository,
                         FolderService folderService,
                         RepositoryRepository repositoryRepository) {
        this.sourceRepository = sourceRepository;
        this.folderService = folderService;
        this.repositoryRepository = repositoryRepository;
    }

    public Source getOrCreateSource(Repository repository, SourceInfoDTO sourceInfoDTO) {
        Folder folder = folderService.getOrCreatePath(repository, sourceInfoDTO.pathList);
        return folder.getSource(sourceInfoDTO.sourceText).orElseGet(() -> {
            Source s = new Source();
            s.setRepository(repository);
            s.setFolder(folder);
            s.setText(sourceInfoDTO.sourceText);
            sourceRepository.save(s);
            return s;
        });
    }

    private Optional<Source> getSource(Repository repository, SourceInfoDTO sourceInfoDTO) {
        if (sourceInfoDTO.pathList.isEmpty()) {
            return sourceRepository
                    .findSourceByFolderAndRepositoryAndText(null, repository, sourceInfoDTO.sourceText);
        }
        Folder folder = folderService.getFolder(repository, sourceInfoDTO.pathList).orElse(null);
        if (folder == null) {
            return Optional.empty();
        }
        return folder.getSources().stream().filter(s -> s.getText().equals(sourceInfoDTO.sourceText)).findFirst();
    }

    public void deleteSource(Long repositoryId, String sourcePath) {
        SourceInfoDTO sourceInfoDTO = new SourceInfoDTO(sourcePath);
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
        sourceRepository.delete(getSource(repository, sourceInfoDTO).orElseThrow(NotFoundException::new));
    }
}
