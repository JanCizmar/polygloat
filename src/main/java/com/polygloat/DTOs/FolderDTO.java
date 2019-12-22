package com.polygloat.DTOs;

public class FolderDTO implements IPathItem {
    private String name;
    private String path;

    public FolderDTO(String name, String path) {
        this.name = name;
        this.path = path;
    }

    public String getName() {
        return name;
    }

    @Override
    public PathDTO getPath() {
        return PathDTO.fromPathAndName(path, name);
    }
}
