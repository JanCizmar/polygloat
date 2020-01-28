package com.polygloat.dtos.request;

import com.polygloat.model.Language;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

public class LanguageDTO {
    @Getter
    private Long id;

    @Getter
    @Setter
    @NotBlank
    private String name;

    @Getter
    @Setter
    @NotBlank
    private String abbreviation;

    public LanguageDTO() {
    }

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
