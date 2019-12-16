package com.polygloat.DTOs;

import java.util.Arrays;
import java.util.LinkedList;

public class FolderDTO {
    private String name;
    private String path;


    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public LinkedList<String> getPathList() {
        if (path == null || path.isEmpty()) {
            return new LinkedList<>();
        }
        return new LinkedList<>(Arrays.asList(path.split("\\.")));
    }

    public LinkedList<String> getFullPathList() {
        LinkedList<String> pathList = getPathList();
        pathList.add(name);
        return pathList;
    }
}
