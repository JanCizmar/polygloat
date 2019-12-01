package com.polygloat.controllers;

import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.service.SourceService;
import com.polygloat.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repository/{repositoryId}/translations")
public class TranslationController {

    private TranslationService translationService;
    private SourceService sourceService;

    @Autowired
    public TranslationController(TranslationService translationService, SourceService sourceService) {

        this.translationService = translationService;
        this.sourceService = sourceService;
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
    public void setTranslations(@RequestBody SourceTranslationsDTO data,
                                @PathVariable("repositoryId") Long repositoryId) {
        translationService.setTranslations(repositoryId, data);
    }

    @RequestMapping(value = "/{sourcePath}", method = RequestMethod.DELETE)
    public void deleteTranslation(@PathVariable("repositoryId") Long repositoryId,
                                  @PathVariable("sourcePath") String sourcePath) {
        sourceService.deleteSource(repositoryId, sourcePath);
    }
}
