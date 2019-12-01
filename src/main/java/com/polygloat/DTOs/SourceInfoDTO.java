package com.polygloat.DTOs;

import java.util.Arrays;
import java.util.LinkedList;

public class SourceInfoDTO {
    public LinkedList<String> pathList;
    public String sourceText;

    public SourceInfoDTO(String fullPath) {
        pathList = new LinkedList<>(Arrays.asList(fullPath.split("\\.")));
        sourceText = pathList.removeLast();
    }
}
