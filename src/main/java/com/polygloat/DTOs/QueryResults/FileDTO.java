package com.polygloat.DTOs.QueryResults;

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
    private Map<String, String> translations = new LinkedHashMap<>();

    public FileDTO(Object... queryResult) {
        LinkedList<Object> data = new LinkedList<>(Arrays.asList(queryResult));

        this.path = PathDTO.fromPathAndName((String) data.removeFirst(), (String) data.removeFirst());

        for (int i = 0; i < data.size(); i = i + 2) {
            this.translations.put((String) data.get(i), (String) data.get(i + 1));
        }
    }
}
