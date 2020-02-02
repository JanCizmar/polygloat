package com.polygloat.service;

import com.polygloat.constants.Message;
import com.polygloat.dtos.PathDTO;
import com.polygloat.dtos.query_results.SourceDTO;
import com.polygloat.dtos.request.validators.exceptions.ValidationException;
import com.polygloat.dtos.response.SourceResponseDTO;
import com.polygloat.dtos.response.ViewDataResponse;
import com.polygloat.dtos.response.translations_view.ResponseParams;
import com.polygloat.exceptions.InternalException;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Language;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.model.Translation;
import com.polygloat.repository.TranslationRepository;
import com.polygloat.service.query_builders.TranslationsViewBuilder;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TranslationService {

    private final TranslationRepository translationRepository;
    private final SourceService sourceService;
    private final EntityManager entityManager;
    private final RepositoryService repositoryService;
    private final LanguageService languageService;

    @SuppressWarnings("unchecked")
    private void addToMap(Translation translation, Map<String, Object> map) {
        for (String folderName : translation.getSource().getPath().getPath()) {
            Object childMap = map.computeIfAbsent(folderName, k -> new LinkedHashMap<>());
            if (childMap instanceof Map) {
                map = (Map<String, Object>) childMap;
                continue;
            }
            throw new InternalException(Message.DATA_CORRUPTED);
        }
        map.put(translation.getSource().getName(), translation.getText());
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getTranslations(Set<String> abbrs, Long repositoryId) {
        Set<Translation> allByLanguages = translationRepository.getTranslations(abbrs, repositoryId);

        HashMap<String, Object> langTranslations = new LinkedHashMap<>();
        for (Translation translation : allByLanguages) {
            Map<String, Object> map = (Map<String, Object>) langTranslations
                    .computeIfAbsent(translation.getLanguage().getAbbreviation(),
                            t -> new LinkedHashMap<>());
            addToMap(translation, map);
        }

        return langTranslations;
    }

    public Set<Translation> getSourceTranslations(Long repositoryId, PathDTO path, Set<String> languages) {
        Repository repository = repositoryService.findById(repositoryId).orElseThrow(NotFoundException::new);
        Source source = sourceService.getSource(repository, path).orElseThrow(NotFoundException::new);
        return translationRepository.getTranslations(source, repository, languages);
    }
/*
    @Transactional
    public void setTranslations(Long repositoryId, SourceTranslationsDTO data) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        Source source = sourceService.getCreateOrModifySource(repository, data);
        for (String lang : data.getTranslations().keySet()) {
            Translation translation = source.getTranslation(lang).orElse(null);
            if (translation == null) {
                translation = new Translation();
                translation.setLanguage(repository.getLanguage(lang).orElseThrow(NotFoundException::new));
                translation.setSource(source);
            }
            translation.setText(data.getTranslations().get(lang));
            translationRepository.save(translation);
        }
    }*/


    public Translation getOrCreate(Source source, Language language) {
        return get(source, language).orElseGet(() -> Translation.builder().language(language).source(source).build());
    }

    public Optional<Translation> get(Source source, Language language) {
        return translationRepository.findOneBySourceAndLanguage(source, language);
    }

    public ViewDataResponse<LinkedHashSet<SourceResponseDTO>, ResponseParams> getViewData(
            Set<String> languages, Long repositoryId, int limit, int offset, String search
    ) {
        Repository repository = repositoryService.findById(repositoryId).orElseThrow(NotFoundException::new);

        if (languages == null) {
            languages = repository.getLanguages().stream().map(Language::getAbbreviation).collect(Collectors.toSet());
        }

        TranslationsViewBuilder.Result data = TranslationsViewBuilder.getData(entityManager, repository, languages, search, limit, offset);
        return new ViewDataResponse<>(data.getData()
                .stream()
                .map(queryResult -> SourceResponseDTO.fromQueryResult(new SourceDTO((Object[]) queryResult)))
                .collect(Collectors
                        .toCollection(LinkedHashSet::new)), 0, data.getCount(), new ResponseParams(search, languages));
    }

    public void setTranslation(Source source, String abbreviation, String text) {
        Language language = languageService.findByAbbreviation(abbreviation, source.getRepository())
                .orElseThrow(() -> new NotFoundException(Message.LANGGUAGE_NOT_FOUND));
        Translation translation = getOrCreate(source, language);
        translation.setText(text);
        translationRepository.save(translation);
    }

    public void setForSource(Source source, Map<String, String> translations) {
        for (String abbr : translations.keySet()) {
            if (translations.get(abbr) == null || translations.get(abbr).isEmpty()) {
                throw new ValidationException(Message.TRANSLATION_TEXT_IS_REQUIRED);
            }
            setTranslation(source, abbr, translations.get(abbr));
        }
    }
}
