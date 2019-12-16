package com.polygloat.service;

import com.polygloat.DTOs.SetFolderRequestDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Folder;
import com.polygloat.model.Repository;
import com.polygloat.repository.FolderRepository;
import com.polygloat.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.Optional;

@Service
public class FolderService {


    private FolderRepository folderRepository;
    private RepositoryRepository repositoryRepository;

    @Autowired
    public FolderService(FolderRepository folderRepository, RepositoryRepository repositoryRepository) {
        this.folderRepository = folderRepository;
        this.repositoryRepository = repositoryRepository;
    }

    public Folder getFolder(Folder parent, String name) {
        return parent.getChildFolders().stream().filter(c -> c.getName().equals(name)).findFirst().orElse(null);
    }

    public Folder getFolderInRoot(Repository repository, String name) {
        return repository.getFolders().stream()
                .filter(folder -> folder.getName().equals(name) && folder.getParent() == null)
                .findFirst().orElse(null);
    }

    @Transactional
    public Folder getOrCreatePath(Repository repository, LinkedList<String> path) {
        if (path.size() < 1) {
            return null;
        }
        String folderName = path.removeFirst();
        Folder parent = getFolderInRoot(repository, folderName);
        boolean parentCreated = false;
        if (parent == null) {
            parent = new Folder();
            parent.setName(folderName);
            parent.setRepository(repository);
            folderRepository.save(parent);
            parentCreated = true;
        }
        for (String item : path) {
            Folder folder = null;
            if (!parentCreated) {
                //if parent was just created, dont try to retrieve the folder from db, it just can't exist
                folder = getFolder(parent, item);
            }
            if (folder == null) {
                folder = new Folder();
                folder.setName(item);
                folder.setRepository(repository);
                folder.setParent(parent);
                folderRepository.save(folder);
                parentCreated = true;
            }
            parent = folder;
        }
        return parent;
    }

    @SuppressWarnings("unchecked")
    public Optional<Folder> getFolder(Repository repository, LinkedList<String> path) {
        Folder folder;
        path = (LinkedList<String>) path.clone();

        String pathItem = path.pollFirst();
        folder = repository.getChildFolders().stream().filter(f -> f.getName().equals(pathItem))
                .findFirst().orElse(null);

        while (!path.isEmpty() && folder != null) {
            String fPathItem = path.pollFirst();
            folder = folder.getChildFolders().stream().filter(f -> f.getName().equals(fPathItem))
                    .findFirst().orElse(null);
        }
        return Optional.ofNullable(folder);
    }

    public void setFolder(Long repositoryId, SetFolderRequestDTO data) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        Folder oldFolder = getFolder(repository, data.getOldFolder().getFullPathList()).orElse(null);

        if (oldFolder != null) {
            if (!oldFolder.getPath().equals(data.getNewFolder().getPathList())) {
                Folder parent = getOrCreatePath(repository, data.getNewFolder().getPathList());
                oldFolder.setParent(parent);
            }
            oldFolder.setName(data.getNewFolder().getName());
            folderRepository.save(oldFolder);
            return;
        }

        getOrCreatePath(repository, data.getNewFolder().getFullPathList());
    }

    public void deleteFolder(Long repositoryId, LinkedList<String> fullPath) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        Folder folder = getFolder(repository, fullPath).orElseThrow(NotFoundException::new);

        folderRepository.delete(folder);
    }
}
