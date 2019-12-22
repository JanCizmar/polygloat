package com.polygloat.DTOs;

import java.util.LinkedList;

public interface IPathItem {

    PathDTO getPath();

    default LinkedList<String> getPathList() {
        return getPath().getPath();
    }

    default LinkedList<String> getFullPathList() {
        return getPath().getFullPath();
    }

}
