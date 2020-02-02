package com.polygloat.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SetTranslationsDTO {
    /**
     * Source full path is stored as name in entity
     */
    private String sourceFullPath;

    /**
     * Map of language abbreviation -> text
     */
    private Map<String, String> translations;
}
