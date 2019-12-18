package com.polygloat.DTOs;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class PathDTO {
    private LinkedList<String> fullPath = new LinkedList<>();

    private PathDTO() {
    }

    public static PathDTO fromFullPath(String fullPath) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.fullPath.addAll(Arrays.asList(fullPath.split("\\.", 0)));
        return pathDTO;
    }

    public static PathDTO fromFullPath(List<String> path) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.fullPath.addAll(path);
        return pathDTO;
    }

    public static PathDTO fromPathAndName(String path, String name) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.fullPath.addAll(Arrays.asList(path.split("\\.", 0)));
        pathDTO.fullPath.add(name);
        return pathDTO;
    }

    public static PathDTO fromPathAndName(List<String> path, String name) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.fullPath.addAll(path);
        pathDTO.fullPath.add(name);
        return pathDTO;
    }

    public String getName() {
        return fullPath.getLast();
    }

    public LinkedList<String> getPath() {
        LinkedList<String> path = new LinkedList<>(this.fullPath);
        path.removeLast();
        return path;
    }

    public LinkedList<String> getFullPath() {
        return new LinkedList<>(this.fullPath);
    }

}
