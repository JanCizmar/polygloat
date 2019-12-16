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

    @RequestMapping(value = "/{languages}", method = RequestMethod.GET)
    public Map<String, Object> getTranslations(@PathVariable("repositoryId") Long repositoryId,
                                               @PathVariable("languages") String languages) {
        return translationService.getTranslations(parseLanguages(languages), repositoryId);
    }

    @RequestMapping(value = "/source/{sourceText}", method = RequestMethod.GET)
    public Map<String, String> getSourceTranslations(@PathVariable("repositoryId") Long repositoryId,
                                                     @PathVariable("sourceText") String fullPath) {
        return translationService.getSourceTranslations(repositoryId, fullPath);
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

    @RequestMapping(value = "/view/{languages}", method = RequestMethod.GET)
    public Map<String, Object> getViewTranslations(@PathVariable("repositoryId") Long repositoryId,
                                                   @PathVariable("languages") String languages) {
        return translationService.getViewData(parseLanguages(languages), repositoryId);
    }

    private String[] parseLanguages(String languages) {
        return languages.split(",");
    }
}
