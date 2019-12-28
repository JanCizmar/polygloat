package com.polygloat.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SourceTranslationsDTO {
    private String path;
    private Map<String, String> translations;

    @NotNull
    @Getter
    private String oldSourceText;

    @NotBlank
    @NotNull
    @Getter
    private String newSourceName;

    public SourceTranslationsDTO(String path, Map<String, String> translations,
                                 @NotNull String oldSourceText,
                                 @NotBlank @NotNull String newSourceName) {
        this.path = path;
        this.translations = translations;
        this.oldSourceText = oldSourceText;
        this.newSourceName = newSourceName;
    }

    public String getPath() {
        return path;
    }

    @JsonIgnore
    public SourceInfoDTO getOldSourceInfo() {
        //probably new translation
        if (oldSourceText == null || oldSourceText.isEmpty()) {
            return null;
        }
        return new SourceInfoDTO(path, oldSourceText);
    }

    @JsonIgnore
    public SourceInfoDTO getNewSourceInfo() {
        return new SourceInfoDTO(path, getNewSourceName());
    }

    public Map<String, String> getTranslations() {
        return translations;
    }

}
