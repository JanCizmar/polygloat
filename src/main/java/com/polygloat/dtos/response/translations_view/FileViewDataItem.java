package com.polygloat.dtos.response.translations_view;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.polygloat.dtos.query_results.FileDTO;
import lombok.Value;

import java.util.Map;

@Value
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileViewDataItem {
    private String fullPath;

    private boolean isSource;

    private Map<String, String> translations;

    public FileViewDataItem(FileDTO fileDTO) {
        this.fullPath = fileDTO.getPath().getFullPathString();
        this.isSource = fileDTO.isHasSource();
        this.translations = fileDTO.getTranslations();
    }

    @JsonCreator
    public FileViewDataItem(@JsonProperty("fullPath") String fullPath, @JsonProperty("source") boolean isSource, @JsonProperty("translations") Map<String, String> translations) {
        this.fullPath = fullPath;
        this.isSource = isSource;
        this.translations = translations;
    }
}
