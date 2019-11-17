package com.polygloat.DTOs;

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
}
