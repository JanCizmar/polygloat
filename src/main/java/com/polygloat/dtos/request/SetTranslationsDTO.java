package com.polygloat.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SetTranslationsDTO {
    /**
     * Source full path is stored as name in entity
     */
    @NotNull
    @NotBlank
    private String sourceFullPath;

    /**
     * Map of language abbreviation -> text
     */
    @NotEmpty
    private Map<String, String> translations;
}
