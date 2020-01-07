package com.polygloat.controllers;

import com.polygloat.dtos.PathDTO;
import com.polygloat.dtos.request.SourceTranslationsDTO;
import com.polygloat.dtos.response.ViewDataResponse;
import com.polygloat.dtos.response.translations_view.FileViewDataItem;
import com.polygloat.dtos.response.translations_view.ResponseParams;
import com.polygloat.service.FileService;
import com.polygloat.service.SourceService;
import com.polygloat.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/repository/{repositoryId}/translations")
public class TranslationController implements IController {

    private TranslationService translationService;
    private SourceService sourceService;
    private FileService fileService;

    @Autowired
    public TranslationController(TranslationService translationService, SourceService sourceService, FileService fileService) {
        this.translationService = translationService;
        this.sourceService = sourceService;
        this.fileService = fileService;
    }

    @RequestMapping(value = "/{languages}", method = RequestMethod.GET)
    public Map<String, Object> getTranslations(@PathVariable("repositoryId") Long repositoryId,
                                               @PathVariable("languages") String languages) {
        return translationService.getTranslations(parseLanguages(languages).orElse(null), repositoryId);
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

    @RequestMapping(value = "/view", method = RequestMethod.GET)
    public ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> getViewData(@PathVariable("repositoryId") Long repositoryId,
                                                                                         @RequestParam(name = "languages", required = false) String languages,
                                                                                         @RequestParam(name = "limit", defaultValue = "50") int limit,
                                                                                         @RequestParam(name = "offset", defaultValue = "0") int offset,
                                                                                         @RequestParam(name = "search", required = false) String search
    ) {
        return fileService.getViewData(parseLanguages(languages).orElse(null), repositoryId, offset, limit, search);
    }

    private Optional<Set<String>> parseLanguages(String languages) {
        if (languages == null) {
            return Optional.empty();
        }
        return Optional.of(new HashSet<>(Arrays.stream(
                languages.split(","))
                //filter out empty strings
                .filter(i ->
                        !i.isEmpty()
                )
                .collect(Collectors.toList())));
    }
}
