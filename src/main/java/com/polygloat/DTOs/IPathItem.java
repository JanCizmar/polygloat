package com.polygloat.DTOs;

import java.util.LinkedList;

public interface IPathItem {

    PathDTO getPathObject();

    default LinkedList<String> getPathList() {
        return getPathObject().getPath();
    }

    default LinkedList<String> getFullPathList() {
        return getPathObject().getFullPath();
    }

}
