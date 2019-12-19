package com.polygloat.service;

import com.polygloat.DTOs.SourceInfoDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.*;
import com.polygloat.repository.FolderRepository;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TranslationService {

    private TranslationRepository translationRepository;
    private RepositoryRepository repositoryRepository;
    private FolderService folderService;
    private SourceService sourceService;
    private FolderRepository folderRepository;

    @Autowired
    public TranslationService(TranslationRepository translationRepository,
                              RepositoryRepository repositoryRepository,
                              FolderService folderService,
                              SourceService sourceService,
                              FolderRepository folderRepository) {

        this.translationRepository = translationRepository;
        this.repositoryRepository = repositoryRepository;
        this.folderService = folderService;
        this.sourceService = sourceService;
        this.folderRepository = folderRepository;
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
        Set<Translation> allByLanguages = translationRepository.getTranslations(Arrays.asList(abbrs), repositoryId);

        HashMap<String, Object> langTranslations = new LinkedHashMap<>();
        for (Translation translation : allByLanguages) {
            Map<String, Object> map = (Map<String, Object>) langTranslations
                    .computeIfAbsent(translation.getLanguage().getAbbreviation(),
                                     t -> new LinkedHashMap<>());
            addToMap(translation, map);
        }

        return langTranslations;
    }

    //todo optimize!!!
    private Map<String, Object> createMap(Set<Folder> folders, Set<Source> sources, String lang, Set<Translation> translations, Set<Source> allSources) {
        Map<String, Object> result = new HashMap<>();

        folders.forEach(f -> {
            result.put(f.getName(), createMap(f.getChildFolders(), allSources.stream()
                    .filter(s -> s.getFolder() != null && s.getFolder().getId()
                            .equals(f.getId())).collect(Collectors.toSet()), lang, translations, allSources));
        });

        sources.forEach(s -> {
            String translation = translations.stream()
                    .filter(t -> t.getLanguage().getAbbreviation().equals(lang) && t.getSource().getId().equals(s.getId()))
                    .map(Translation::getText).findFirst()
                    .orElse(null);

            result.put(s.getText(), translation);
        });

        return result;
    }

    @Transactional
    public Map<String, Object> getViewData(String[] abbrs, Long repositoryId) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);
        Set<Source> sources = repository.getSources();
        repository.getFolders();
        Set<Translation> translations = translationRepository.getTranslations(Arrays.asList(abbrs), repositoryId);

        return Arrays.stream(abbrs)
                .collect(Collectors.toMap(a -> a,
                                          a -> createMap(repository.getChildFolders(), repository.getChildSources(), a, translations, sources)));
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
