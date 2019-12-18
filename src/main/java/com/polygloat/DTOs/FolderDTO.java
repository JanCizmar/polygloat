package com.polygloat.DTOs;

import java.util.Arrays;
import java.util.LinkedList;

public class FolderDTO implements IPathItem {
    private String name;
    private String path;

    public FolderDTO() {
    }

    public FolderDTO(String name, String path) {
        this.name = name;
        this.path = path;
    }

    public String getName() {
        return name;
    }

    @Override
    public PathDTO getPathObject() {
        return PathDTO.fromPathAndName(this.path, this.name);
    }
}
