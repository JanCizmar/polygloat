package com.polygloat.DTOs.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.polygloat.DTOs.queryResults.FileDTO;
import lombok.Getter;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileViewDataItem {
    @Getter
    private String fullPath;

    @Getter
    private boolean isSource;

    @Getter
    private Map<String, String> translations;

    public FileViewDataItem(FileDTO fileDTO) {
        this.fullPath = fileDTO.getPath().getFullPathString();
        this.isSource = fileDTO.isHasSource();
        this.translations = fileDTO.getTranslations();
    }
}
