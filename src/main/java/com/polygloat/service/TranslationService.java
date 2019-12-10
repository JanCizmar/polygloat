package com.polygloat.service;

import com.polygloat.DTOs.SourceInfoDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Language;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.model.Translation;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TranslationService {

    private TranslationRepository translationRepository;
    private RepositoryRepository repositoryRepository;
    private FolderService folderService;
    private SourceService sourceService;

    @Autowired
    public TranslationService(TranslationRepository translationRepository,
                              RepositoryRepository repositoryRepository,
                              FolderService folderService,
                              SourceService sourceService) {

        this.translationRepository = translationRepository;
        this.repositoryRepository = repositoryRepository;
        this.folderService = folderService;
        this.sourceService = sourceService;
    }

    @SuppressWarnings("unchecked")
    private void addToMap(Translation translation, Map<String, Object> map) {
        for (String folderName : translation.getSource().getPath()) {
            Object childMap = map.computeIfAbsent(folderName, k -> new LinkedHashMap<>());
            if (childMap instanceof Map) {
                map = (Map<String, Object>) childMap;
                continue;
            }
            throw new RuntimeException("Translation source collapsing with folder name");
        }
        map.put(translation.getSource().getText(), translation.getText());
    }

    public Map<String, Object> getTranslations(String abbr, Long repositoryId) {
        String[] abbrs = abbr.split(",");

        if (abbrs.length == 1) {
            abbr = abbrs[0];
            List<Translation> allByLanguage = translationRepository
                    .getAllByLanguageAbbreviationAndSourceRepositoryId(abbr, repositoryId);

            Map<String, Object> folders = new HashMap<>();

            for (Translation translation : allByLanguage) {
                addToMap(translation, folders);
            }

            return folders;
        }
        return getTranslations(abbrs, repositoryId);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getTranslations(String[] abbrs, Long repositoryId) {
        List<Translation> allByLanguages = translationRepository
                .getAllByLanguageAbbreviationInAndSourceRepositoryIdOrderBySourceText(Arrays.asList(abbrs), repositoryId);

        HashMap<String, Object> langTranslations = new LinkedHashMap<>();
        for (Translation translation : allByLanguages) {
            Map map = (Map) langTranslations.computeIfAbsent(translation.getLanguage().getAbbreviation(),
                    t -> new LinkedHashMap<>());
            addToMap(translation, map);
        }

        return langTranslations;
    }


    private Stream<Translation> getTranslationEntityStream(Long repositoryId, String path) {
        SourceInfoDTO sourceInfo = new SourceInfoDTO(path);

        List<Translation> translations = translationRepository
                .getAllBySourceRepositoryIdAndSourceText(repositoryId, sourceInfo.sourceText);

        return translations.stream()
                .filter(t -> t.getSource().getPath().equals(sourceInfo.pathList));
    }

    public Map<String, String> getSourceTranslations(Long repositoryId, String fullPath) {
        //get all languages and init map with empty strings
        Map<String, String> translations = this.repositoryRepository
                .findById(repositoryId).orElseThrow(NotFoundException::new)
                .getLanguages().stream().collect(Collectors.toMap(Language::getAbbreviation, l -> ""));

        //add defined languages
        translations.putAll(getTranslationEntityStream(repositoryId, fullPath)
                .collect(Collectors.toMap(t -> t.getLanguage().getAbbreviation(), Translation::getText)));

        return translations;
    }

    public void setTranslations(Long repositoryId, SourceTranslationsDTO data) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
        Source source = sourceService.getCreateOrModifySource(repository, data.getOldSourceInfo(), data.getNewSourceName());
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
    }
}
