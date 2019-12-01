package com.polygloat.DTOs;

import java.util.Map;

public class SourceTranslationsDTO {
    private String source;
    private Map<String, String> translations;

    public String getSource() {
        return source;
    }

    public SourceInfoDTO getSourceInfo() {
        return new SourceInfoDTO(source);
    }

    public Map<String, String> getTranslations() {
        return translations;
    }
}
