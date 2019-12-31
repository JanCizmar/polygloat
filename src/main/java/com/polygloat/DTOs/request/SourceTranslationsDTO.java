package com.polygloat.DTOs.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.polygloat.DTOs.PathDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SourceTranslationsDTO {
    @Getter
    @Setter
    private String path;

    @Getter
    @Setter
    private Map<String, String> translations;

    @NotNull
    @Getter
    @Setter
    private String oldSourceText;

    @NotBlank
    @NotNull
    @Getter
    @Setter
    private String newSourceText;

    public SourceTranslationsDTO(String path, Map<String, String> translations,
                                 @NotNull String oldSourceText,
                                 @NotBlank @NotNull String newSourceText) {
        this.path = path;
        this.translations = translations;
        this.oldSourceText = oldSourceText;
        this.newSourceText = newSourceText;
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
        return PathDTO.fromPathAndName(path, getNewSourceText());
    }

}
