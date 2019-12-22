package com.polygloat.service;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.model.Translation;
import com.polygloat.repository.FileRepository;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private TranslationRepository translationRepository;
    private RepositoryRepository repositoryRepository;
    private FolderService folderService;
    private SourceService sourceService;
    private FileRepository fileRepository;

    @Autowired
    public TranslationService(TranslationRepository translationRepository,
                              RepositoryRepository repositoryRepository,
                              FolderService folderService,
                              SourceService sourceService,
                              FileRepository fileRepository) {

        this.translationRepository = translationRepository;
        this.repositoryRepository = repositoryRepository;
        this.folderService = folderService;
        this.sourceService = sourceService;
        this.fileRepository = fileRepository;
    }

    @SuppressWarnings("unchecked")
    private void addToMap(Translation translation, Map<String, Object> map) {
        for (String folderName : translation.getSource().getPath().getPath()) {
            Object childMap = map.computeIfAbsent(folderName, k -> new LinkedHashMap<>());
            if (childMap instanceof Map) {
                map = (Map<String, Object>) childMap;
                continue;
            }
            throw new RuntimeException("Translation source collapsing with folder name");
        }
        map.put(translation.getSource().getText(), translation.getText());
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
    private Map<String, Object> createMap(Set<File> folders, Set<Source> sources, String lang,
                                          Set<Translation> translations, Set<Source> allSources) {
        Map<String, Object> result = new LinkedHashMap<>();

        folders.stream().sorted(Comparator.comparing(File::getName)).forEach(f -> {
            result.put(f.getName(), createMap(f.getChildren(), allSources.stream()
                    .filter(s -> s.getFile().getParent() != null && s.getFile().getParent().getId()
                            .equals(f.getId())).collect(Collectors.toSet()), lang, translations, allSources));
        });

        sources.stream().sorted(Comparator.comparing(Source::getText)).forEach(s -> {
            String translation = translations.stream()
                    .filter(t -> t.getLanguage().getAbbreviation().equals(lang)
                            && t.getSource().getId().equals(s.getId()))
                    .map(Translation::getText).findFirst()
                    .orElse(null);

            result.put(s.getText(), translation);
        });

        return result;
    }

    @Transactional
    public Map<String, Object> getViewData(String[] abbrs, Long repositoryId) {
        /*Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        Set<Source> sources = repository.getSources();

        Set<Translation> translations = translationRepository.getTranslations(Arrays.asList(abbrs), repositoryId);

        return Arrays.stream(abbrs)
                .collect(Collectors.toMap(a -> a,
                        a -> createMap(repository.getChildFolders(), repository.getChildSources(),
                                a, translations, sources), (a, b) -> b, LinkedHashMap::new));*/
        return null;
    }

    public Map<String, String> getSourceTranslations(Long repositoryId, PathDTO fullPath) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        File file = repository.getRootFolder().evaluatePath(fullPath).orElseThrow(NotFoundException::new);

        Source source = file.getSource();

        if (source != null) {
            return source.getTranslations().stream()
                    .collect(Collectors.toMap(t -> t.getLanguage().getAbbreviation(), Translation::getText));
        }

        throw new NotFoundException();
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
