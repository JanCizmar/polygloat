package com.polygloat.model;

import com.polygloat.DTOs.IPathItem;
import com.polygloat.DTOs.PathDTO;
import com.polygloat.Exceptions.NotFoundException;

import java.util.LinkedList;
import java.util.Optional;
import java.util.Set;

public interface IFolder {
    Set<Source> getChildSources();

    Set<Folder> getChildFolders();

    default Optional<Source> getSource(String name) {
        return this.getChildSources().stream().filter(s -> s.getText().equals(name)).findFirst();
    }

    default IPathItem evaluatePath(PathDTO pathDTO) {
        LinkedList<String> fullPath = pathDTO.getFullPath();
        if (pathDTO.getFullPath().size() == 1) {
            Source source = getSource(pathDTO.getName()).orElse(null);
            if (source != null) {
                return source;
            }
        }
        if (pathDTO.getFullPath().size() > 1) {
            String itemName = fullPath.removeFirst();
            Folder folder = this.getChildFolders().stream().filter(f -> f.getName()
                    .equals(itemName)).findFirst()
                    .orElseThrow(NotFoundException::new);
            return folder.evaluatePath(PathDTO.fromFullPath(fullPath));
        }
        throw new NotFoundException();
    }
}
