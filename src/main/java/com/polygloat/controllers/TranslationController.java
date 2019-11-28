package com.polygloat.controllers;

import com.polygloat.DTOs.SourceTranslations;
import com.polygloat.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/public/repository/{repositoryId}/translations")
public class TranslationController {

    private TranslationService translationService;

    @Autowired
    public TranslationController(TranslationService translationService) {

        this.translationService = translationService;
    }

    @RequestMapping(value = "/{language}", method = RequestMethod.GET)
    public Map<String, Object> getTranslations(@PathVariable("repositoryId") Long repositoryId,
                                               @PathVariable("language") String language) {
        return translationService.getTranslations(language, repositoryId);
    }

    @RequestMapping(value = "/source/{sourceText}", method = RequestMethod.GET)
    public Map<String, String> getSourceTranslations(@PathVariable("repositoryId") Long repositoryId,
                                                     @PathVariable("sourceText") String sourceText) {
        return translationService.getSourceTranslations(repositoryId, sourceText);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public SourceTranslations setTranslations(@RequestBody SourceTranslations data,
                                              @PathVariable("repositoryId") Long repositoryId) {
        return translationService.setTranslations(repositoryId, data);
    }
}
