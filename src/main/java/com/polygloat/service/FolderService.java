package com.polygloat.service;

import com.polygloat.model.Folder;
import com.polygloat.model.Repository;
import com.polygloat.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.Optional;

@Service
public class FolderService {


    private FolderRepository folderRepository;

    @Autowired
    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
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
}
