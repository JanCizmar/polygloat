package com.polygloat.model;

import java.util.Optional;
import java.util.Set;

public interface IFolder {
    Set<Source> getChildSources();

    Set<File> getChildFolders();

    default Optional<Source> getSource(String name) {
        return this.getChildSources().stream().filter(s -> s.getText().equals(name)).findFirst();
    }


}
