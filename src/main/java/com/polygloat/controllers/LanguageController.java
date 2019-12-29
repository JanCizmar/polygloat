package com.polygloat.controllers;

import com.polygloat.DTOs.request.LanguageDTO;
import com.polygloat.DTOs.request.validators.LanguageValidator;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Language;
import com.polygloat.model.Repository;
import com.polygloat.service.LanguageService;
import com.polygloat.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/public/repository/{repositoryId}/languages")
public class LanguageController extends AbstractController {
    private LanguageService languageService;
    private RepositoryService repositoryService;
    private LanguageValidator languageValidator;

    @Autowired
    public LanguageController(LanguageService languageService,
                              RepositoryService repositoryService,
                              LanguageValidator languageValidator) {
        this.languageService = languageService;
        this.repositoryService = repositoryService;
        this.languageValidator = languageValidator;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public LanguageDTO createLanguage(@PathVariable("repositoryId") Long repositoryId,
                                      @RequestBody @Valid LanguageDTO dto) {
        Repository repository = repositoryService.findById(repositoryId).orElseThrow(NotFoundException::new);

        languageValidator.validateCreate(dto, repository);
        Language language = languageService.createLanguage(dto, repository);
        return LanguageDTO.fromEntity(language);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    public LanguageDTO editLanguage(@RequestBody @Valid LanguageDTO dto) {

        languageValidator.validateEdit(dto);

        return LanguageDTO.fromEntity(languageService.editLanguage(dto));
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public Set<LanguageDTO> getAll() {
        return languageService.findAll().stream().map(LanguageDTO::fromEntity)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void deleteRepository(@PathVariable Long id) {
        languageService.deleteLanguage(id);
    }
}
