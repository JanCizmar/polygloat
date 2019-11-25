package com.polygloat.service;

import com.polygloat.DTOs.TranslationDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Translation;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private TranslationRepository translationRepository;
    private RepositoryRepository repositoryRepository;

    @Autowired
    public TranslationService(TranslationRepository translationRepository, RepositoryRepository repositoryRepository) {

        this.translationRepository = translationRepository;
        this.repositoryRepository = repositoryRepository;
    }

    public List<TranslationDTO> getTranslations(String abbr, Long repositoryId) {
        List<Translation> allByLanguage = translationRepository
                .getAllByLanguageAbbreviationAndSourceRepositoryId(abbr, repositoryId);

        return allByLanguage.stream()
                .map(t -> TranslationDTO.fromEntity(t))
                .collect(Collectors.toList());
    }

    public List<TranslationDTO> getSourceTranslations(Long repositoryId, String sourceText) {
        List<Translation> translations = translationRepository
                .getAllBySourceRepositoryIdAndSourceText(repositoryId, sourceText);

        return translations.stream()
                .map(t -> new TranslationDTO(t.getSource().getText(), t.getText(), t.getLanguage().getAbbreviation()))
                .collect(Collectors.toList());
    }

    public List<TranslationDTO> setTranslations(Long repositoryId, List<TranslationDTO> translationDTOs) {
        //get translation entities from db and iterate
        List<Translation> translationEntities = this.translationRepository.getAllBySourceRepositoryIdAndSourceTextIn(
                repositoryId,
                translationDTOs.stream().map(TranslationDTO::getSource).collect(Collectors.toList()));
        for (Translation translation : translationEntities) {
            //find corresponding translation in send array
            TranslationDTO translationDTO = translationDTOs.stream()
                    .filter(t -> t.getSource().equals(translation.getSource().getText()) &&
                            t.getLanguageAbbr().equals(translation.getLanguage().getAbbreviation()))
                    .findFirst()
                    .orElseThrow(NotFoundException::new);
            //set the new text
            translation.setText(translationDTO.getTranslatedText());
            //save
            translationRepository.save(translation);
        }
        return translationEntities.stream().map(TranslationDTO::fromEntity).collect(Collectors.toList());
    }
}
