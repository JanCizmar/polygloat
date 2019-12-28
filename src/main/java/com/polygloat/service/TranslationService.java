package com.polygloat.service;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.DTOs.queryResults.FileDTO;
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
    private FileService fileService;
    private SourceService sourceService;
    private FileRepository fileRepository;

    @Autowired
    public TranslationService(TranslationRepository translationRepository,
                              RepositoryRepository repositoryRepository,
                              FileService fileService,
                              SourceService sourceService,
                              FileRepository fileRepository) {

        this.translationRepository = translationRepository;
        this.repositoryRepository = repositoryRepository;
        this.fileService = fileService;
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

    @Transactional
    public LinkedHashSet<FileDTO> getViewData(Set<String> langs, Long repositoryId) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        return fileService.getDataForView(repository, langs);

    }

    public Map<String, String> getSourceTranslations(Long repositoryId, PathDTO fullPath) {
        Repository repository = repositoryRepository.findById(repositoryId).orElseThrow(NotFoundException::new);

        File file = fileService.evaluatePath(repository, fullPath).orElseThrow(NotFoundException::new);

        Source source = file.getSource();

        if (source != null) {
            return source.getTranslations().stream()
                    .collect(Collectors.toMap(t -> t.getLanguage().getAbbreviation(), Translation::getText));
        }

        throw new NotFoundException();
    }

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
    }
}
