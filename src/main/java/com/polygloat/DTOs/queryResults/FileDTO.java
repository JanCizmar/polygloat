package com.polygloat.DTOs.queryResults;

import com.polygloat.DTOs.PathDTO;
import lombok.Getter;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Map;

public class FileDTO {
    @Getter
    private PathDTO path;

    @Getter
    private boolean hasSource;

    @Getter
    private Map<String, String> translations = new LinkedHashMap<>();

    public FileDTO(Object... queryResult) {
        LinkedList<Object> data = new LinkedList<>(Arrays.asList(queryResult));

        //remove starting "."
        String fullPath = ((String) data.removeFirst()).replaceFirst("^\\.?(.*)$", "$1");

        this.path = PathDTO.fromFullPath(fullPath);

        this.hasSource = data.removeFirst() != null;

        for (int i = 0; i < data.size(); i = i + 2) {
            String key = (String) data.get(i);
            String value = (String) data.get(i + 1);

            //remove not existing langs or folders
            if (key == null) {
                continue;
            }

            this.translations.put(key, value);
        }
    }
}
