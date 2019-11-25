package com.polygloat.DTOs;

import com.polygloat.model.Translation;

public class TranslationDTO {

    private String source;

    private String translatedText;

    private String languageAbbr;


    public TranslationDTO(String source, String translatedText, String languageAbbr) {
        this.source = source;
        this.translatedText = translatedText;
        this.languageAbbr = languageAbbr;
    }


    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }


    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getLanguageAbbr() {
        return languageAbbr;
    }

    public void setLanguageAbbr(String languageAbbr) {
        this.languageAbbr = languageAbbr;
    }

    public static TranslationDTO fromEntity(Translation t) {
        return new TranslationDTO(t.getSource().getText(), t.getText(), t.getLanguage().getAbbreviation());
    }
}
