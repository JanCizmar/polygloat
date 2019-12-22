package com.polygloat.DTOs;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

public class SourceTranslationsDTO {
    private String path;
    private Map<String, String> translations;

    @NotNull
    private String oldSourceName;

    @NotBlank
    @NotNull
    private String newSourceName;

    public String getPath() {
        return path;
    }

    public SourceInfoDTO getOldSourceInfo() {
        return new SourceInfoDTO(path, oldSourceName);
    }

    public SourceInfoDTO getNewSourceInfo() {
        return new SourceInfoDTO(path, getNewSourceName());
    }

    public Map<String, String> getTranslations() {
        return translations;
    }

    public String getOldSourceName() {
        return oldSourceName != null ? oldSourceName : path;
    }

    public String getNewSourceName() {
        return newSourceName;
    }

    public void setNewSourceName(String newSourceName) {
        this.newSourceName = newSourceName;
    }
}
