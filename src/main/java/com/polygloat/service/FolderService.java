package com.polygloat.service;

import com.polygloat.DTOs.FolderDTO;
import com.polygloat.DTOs.PathDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.repository.FileRepository;
import com.polygloat.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;

@Service
public class FolderService {

    private FileRepository fileRepository;
    private RepositoryRepository repositoryRepository;

    @Autowired
    public FolderService(FileRepository fileRepository, RepositoryRepository repositoryRepository) {
        this.fileRepository = fileRepository;
        this.repositoryRepository = repositoryRepository;
    }

    public File getOrCreatePath(Repository repository, PathDTO path) {
        LinkedList<String> fullPath = path.getFullPath();

        if (fullPath.isEmpty()) {
            throw new IllegalArgumentException("Can not create root folder - path is empty");
        }

        File parent = repository.getRootFolder();
        boolean parentCreated = false;
        for (String item : fullPath) {
            File folder = null;
            if (!parentCreated) {
                //if parent was just created, dont try to retrieve the folder from db, it just can't exist
                folder = parent.getChild(item);
            }
            if (folder == null) {
                if (!parent.isFolder()) {
                    throw new IllegalStateException("Can not set non-directory file as parent");
                }
                folder = new File();
                folder.setName(item);
                folder.setRepository(repository);
                folder.setParent(parent);
                fileRepository.save(folder);
                parentCreated = true;
            }
            parent = folder;
        }
        return parent;
    }

    public File setFolder(Long repositoryId, FolderDTO folderDTO) {
        return setFolder(repositoryId, null, folderDTO);
    }

    public File setFolder(Long repositoryId, FolderDTO oldFolderDTO, FolderDTO newFolderDTO) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        File oldFolder = null;

        if (oldFolderDTO != null) {
            oldFolder = repository.getRootFolder().evaluatePath(oldFolderDTO.getPath()).orElse(null);
        }

        if (oldFolder != null) {
            if (!oldFolder.getPath().getPath().equals(newFolderDTO.getPath().getPath())) {
                File parent = getOrCreatePath(repository, newFolderDTO.getPath());
                oldFolder.setParent(parent);
            }
            oldFolder.setName(newFolderDTO.getName());
            fileRepository.save(oldFolder);
            return oldFolder;
        }

        return getOrCreatePath(repository, newFolderDTO.getPath());
    }

    public void deleteFolder(Long repositoryId, PathDTO pathDTO) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        File folder = repository.getRootFolder().evaluatePath(pathDTO).orElseThrow(NotFoundException::new);

        fileRepository.delete(folder);
    }
}
