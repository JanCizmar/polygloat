package com.polygloat.DTOs.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.polygloat.DTOs.PathDTO;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SourceTranslationsDTO {
    @Getter
    private String path;

    @Getter
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

    @JsonIgnore
    public PathDTO getOldSourcePath() {
        //probably new translation
        if (oldSourceText == null || oldSourceText.isEmpty()) {
            return null;
        }
        return PathDTO.fromPathAndName(path, oldSourceText);
    }

    @JsonIgnore
    public PathDTO getNewSourcePath() {
        return PathDTO.fromPathAndName(path, getNewSourceName());
    }

}
