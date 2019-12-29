package com.polygloat.DTOs.request;

import com.polygloat.DTOs.request.validators.annotations.RepositoryRequest;
import com.polygloat.model.Language;
import lombok.Getter;

import javax.validation.constraints.NotBlank;

@RepositoryRequest
public class LanguageDTO {
    @Getter
    private Long id;

    @Getter
    @NotBlank
    private String name;

    @Getter
    @NotBlank
    private String abbreviation;

    public LanguageDTO(@NotBlank String name, @NotBlank String abbreviation) {
        this.name = name;
        this.abbreviation = abbreviation;
    }

    public static LanguageDTO fromEntity(Language language) {
        LanguageDTO languageDTO = new LanguageDTO(language.getName(), language.getAbbreviation());
        languageDTO.id = language.getId();
        return languageDTO;
    }
}
