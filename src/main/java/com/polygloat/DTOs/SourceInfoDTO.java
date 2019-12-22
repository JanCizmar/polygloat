package com.polygloat.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.LinkedList;

public class SourceInfoDTO implements IPathItem {
    private LinkedList<String> pathList;
    @Getter
    @Setter
    private String sourceText;

    /**
     * @param fullPath string of full path with source name as the last item of path
     */
    public SourceInfoDTO(String fullPath) {
        pathList = new LinkedList<>(Arrays.asList(fullPath.split("\\.")));
        this.sourceText = pathList.removeLast();
    }

    /**
     * @param path       without the source name as the last item of path
     * @param sourceText the source name
     */
    public SourceInfoDTO(String path, String sourceText) {
        this.sourceText = sourceText;
        if (path.isEmpty()) {
            pathList = new LinkedList<>();
            return;
        }
        pathList = new LinkedList<>(Arrays.asList(path.split("\\.")));
    }

    @Override
    public PathDTO getPath() {
        return PathDTO.fromPathAndName(this.pathList, this.sourceText);
    }
}
