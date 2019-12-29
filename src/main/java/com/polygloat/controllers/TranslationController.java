package com.polygloat.controllers;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.request.SourceTranslationsDTO;
import com.polygloat.DTOs.response.FileViewDataItem;
import com.polygloat.service.SourceService;
import com.polygloat.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repository/{repositoryId}/translations")
public class TranslationController extends AbstractController {

    private TranslationService translationService;
    private SourceService sourceService;

    @Autowired
    public TranslationController(TranslationService translationService, SourceService sourceService) {

        this.translationService = translationService;
        this.sourceService = sourceService;
    }

    @RequestMapping(value = "/{languages}", method = RequestMethod.GET)
    public Map<String, Object> getTranslations(@PathVariable("repositoryId") Long repositoryId,
                                               @PathVariable("languages") String languages) {
        return translationService.getTranslations(parseLanguages(languages), repositoryId);
    }

    @RequestMapping(value = "/source/{sourceFullPath}", method = RequestMethod.GET)
    public Map<String, String> getSourceTranslations(@PathVariable("repositoryId") Long repositoryId,
                                                     @PathVariable("sourceFullPath") String fullPath) {
        PathDTO pathDTO = PathDTO.fromFullPath(fullPath);
        return translationService.getSourceTranslations(repositoryId, pathDTO);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public void setTranslations(@RequestBody SourceTranslationsDTO data,
                                @PathVariable("repositoryId") Long repositoryId) {
        translationService.setTranslations(repositoryId, data);
    }

    @RequestMapping(value = "/view/{languages}", method = RequestMethod.GET)
    public Set<FileViewDataItem> getViewData(@PathVariable("repositoryId") Long repositoryId,
                                             @PathVariable("languages") String languages) {
        return translationService.getViewData(parseLanguages(languages), repositoryId).stream()
                .map(FileViewDataItem::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Set<String> parseLanguages(String languages) {
        return new HashSet<>(Arrays.asList(languages.split(",")));
    }
}
