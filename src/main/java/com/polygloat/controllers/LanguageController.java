package com.polygloat.controllers;

import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.dtos.request.validators.LanguageValidator;
import com.polygloat.exceptions.NotFoundException;
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
@RequestMapping("/api/repository/{repositoryId}/languages")
public class LanguageController implements IController {
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

    @PostMapping(value = "")
    public LanguageDTO createLanguage(@PathVariable("repositoryId") Long repositoryId,
                                      @RequestBody @Valid LanguageDTO dto) {
        Repository repository = repositoryService.findById(repositoryId).orElseThrow(NotFoundException::new);

        languageValidator.validateCreate(dto, repository);
        Language language = languageService.createLanguage(dto, repository);
        return LanguageDTO.fromEntity(language);
    }

    @PostMapping(value = "/edit")
    public LanguageDTO editLanguage(@RequestBody @Valid LanguageDTO dto) {

        languageValidator.validateEdit(dto);

        return LanguageDTO.fromEntity(languageService.editLanguage(dto));
    }

    @GetMapping(value = "")
    public Set<LanguageDTO> getAll() {
        return languageService.findAll().stream().map(LanguageDTO::fromEntity)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @DeleteMapping(value = "/{id}")
    public void deleteLanguage(@PathVariable Long id) {
        languageService.deleteLanguage(id);
    }
}
