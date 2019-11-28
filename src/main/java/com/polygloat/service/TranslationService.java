package com.polygloat.service;

import com.polygloat.DTOs.SourceTranslations;
import com.polygloat.model.Folder;
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

    @Autowired
    public TranslationService(TranslationRepository translationRepository, RepositoryRepository repositoryRepository) {

        this.translationRepository = translationRepository;
        this.repositoryRepository = repositoryRepository;
    }

    private List<String> getPath(Source source) {
        ArrayList<String> path = new ArrayList<>();
        Folder parent = source.getFolder();
        int nesting = 0;
        while (parent != null) {
            if (nesting >= 1000) {
                throw new RuntimeException("Nesting limit exceeded.");
            }
            path.add(parent.getName());
            parent = parent.getParent();
            nesting++;
        }
        Collections.reverse(path);
        return path;
    }

    @SuppressWarnings("unchecked")
    private void addToMap(Translation translation, Map<String, Object> map) {
        for (String folderName : getPath(translation.getSource())) {
            Object childMap = map.computeIfAbsent(folderName, k -> new HashMap<String, Object>());
            if (childMap instanceof Map) {
                map = (Map<String, Object>) childMap;
                continue;
            }
            throw new RuntimeException("Translation source collapsing with folder name");
        }

        map.put(translation.getSource().getText(), translation.getText());
    }

    public Map<String, Object> getTranslations(String abbr, Long repositoryId) {
        List<Translation> allByLanguage = translationRepository
                .getAllByLanguageAbbreviationAndSourceRepositoryId(abbr, repositoryId);

        Map<String, Object> folders = new HashMap<>();

        for (Translation translation : allByLanguage) {
            addToMap(translation, folders);
        }

        return folders;
    }

    private Stream<Translation> getTranslationEntityStream(Long repositoryId, String path) {
        LinkedList<String> pathList = new LinkedList<>(Arrays.asList(path.split("\\.")));
        String sourceText = pathList.removeLast();

        List<Translation> translations = translationRepository
                .getAllBySourceRepositoryIdAndSourceText(repositoryId, sourceText);

        return translations.stream()
                .filter(t -> getPath(t.getSource()).equals(pathList));
    }

    public Map<String, String> getSourceTranslations(Long repositoryId, String path) {
        return getTranslationEntityStream(repositoryId, path)
                .collect(Collectors.toMap(t -> t.getLanguage().getAbbreviation(), Translation::getText));
    }

    private Folder createPath() {
        return null;
    }

    private Translation createTranslation(Long repositoryId,
                                          String languageAbbr,
                                          String sourceText,
                                          String translatedText) {
        return null;
    }

    public SourceTranslations setTranslations(Long repositoryId, SourceTranslations data) {
        Map<String, Translation> entityMap = this.getTranslationEntityStream(repositoryId, data.getSource())
                .collect(Collectors.toMap(t -> t.getLanguage().getAbbreviation(), t -> t));
        for (String lang : data.getTranslations().keySet()) {
            Translation translation = entityMap.get(lang);
            if (translation == null) {
                //createTranslation();
            } else {
                translation.setText(data.getTranslations().get(lang));
                translationRepository.save(translation);
            }
        }

        return data;
    }
}
