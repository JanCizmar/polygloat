package com.polygloat.controllers;

import com.polygloat.constants.Message;
import com.polygloat.dtos.PathDTO;
import com.polygloat.dtos.request.SetTranslationsDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Repository;
import com.polygloat.model.Source;
import com.polygloat.service.RepositoryService;
import com.polygloat.service.SecurityService;
import com.polygloat.service.SourceService;
import com.polygloat.service.TranslationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repository/{repositoryId}/translations")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PublicController implements IController {

    private final TranslationService translationService;
    private final SourceService sourceService;
    private final RepositoryService repositoryService;
    private final SecurityService securityService;


    @GetMapping(value = "/{languages}")
    public Map<String, Object> getTranslations(@PathVariable("repositoryId") Long repositoryId,
                                               @PathVariable("languages") String languages) {
        return translationService.getTranslations(parseLanguages(languages).orElse(null), repositoryId);
    }

    @GetMapping(value = "/source/{sourceFullPath}/{languages}")
    public Map<String, String> getSourceTranslations(@PathVariable("repositoryId") Long repositoryId,
                                                     @PathVariable("sourceFullPath") String fullPath,
                                                     @PathVariable("languages") String langs) {
        PathDTO pathDTO = PathDTO.fromFullPath(fullPath);
        return translationService.getSourceTranslationsResult(repositoryId, pathDTO, parseLanguages(langs).orElse(null));
    }

    @GetMapping(value = "/source/{sourceFullPath}")
    public Map<String, String> getSourceTranslations(@PathVariable("repositoryId") Long repositoryId,
                                                     @PathVariable("sourceFullPath") String fullPath) {
        PathDTO pathDTO = PathDTO.fromFullPath(fullPath);
        return translationService.getSourceTranslationsResult(repositoryId, pathDTO, null);
    }

    @PostMapping("")
    private void setTranslations(@PathVariable("repositoryId") Long repositoryId, @RequestBody @Valid SetTranslationsDTO dto) {
        Repository repository = repositoryService.findById(repositoryId).orElseThrow(() -> new NotFoundException(Message.REPOSITORY_NOT_FOUND));
        Source source = sourceService.getOrCreateSource(repository, PathDTO.fromFullPath(dto.getSourceFullPath()));
        translationService.setForSource(source, dto.getTranslations());
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