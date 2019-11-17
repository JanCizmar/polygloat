package com.polygloat.service;

import com.polygloat.DTOs.TranslationDTO;
import com.polygloat.model.Translation;
import com.polygloat.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private TranslationRepository translationRepository;

    @Autowired
    public TranslationService(TranslationRepository translationRepository) {

        this.translationRepository = translationRepository;
    }

    public List<TranslationDTO> getTranslations(String abbr, Long repositoryId) {
        List<Translation> allByLanguage = translationRepository.getAllByLanguageAbbreviationAndSourceRepositoryId(abbr, repositoryId);
        return allByLanguage.stream()
                .map(t -> new TranslationDTO(t.getSource().getText(), t.getText(), t.getLanguage().getAbbreviation()))
                .collect(Collectors.toList());
    }

  /*  Map<String, String> getTranslationMap(Language lang) {

    }*/
}
