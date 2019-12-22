package com.polygloat.DTOs;

import com.polygloat.Exceptions.InvalidPathException;
import lombok.Data;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@Data
public class PathDTO {
    public static final String DELIMITER_REGEX = "\\.";

    private LinkedList<String> fullPath = new LinkedList<>();

    private PathDTO() {
    }

    public static PathDTO fromFullPath(String fullPath) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.add(Arrays.asList(fullPath.split(DELIMITER_REGEX, 0)));
        return pathDTO;
    }

    public static PathDTO fromFullPath(List<String> path) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.add(path);
        return pathDTO;
    }

    public static PathDTO fromPathAndName(String path, String name) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.add(validate(Arrays.asList(path.split(DELIMITER_REGEX, 0))));
        pathDTO.add(name);
        return pathDTO;
    }

    public static PathDTO fromPathAndName(List<String> path, String name) {
        PathDTO pathDTO = new PathDTO();
        pathDTO.add(path);
        pathDTO.add(name);
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

    static private String validate(String item) {
        if (item.contains(".")) {
            throw new InvalidPathException();
        }
        if (item.isEmpty()) {
            throw new InvalidPathException();
        }
        return item;
    }

    static private List<String> validate(List<String> list) {
        list.forEach(PathDTO::validate);
        return list;
    }

    private void add(String item) {
        this.fullPath.add(validate(item));
    }

    private void add(List<String> list) {
        this.fullPath.addAll(validate(list));
    }

}
