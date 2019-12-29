package com.polygloat.DTOs.request.validators;

import com.polygloat.DTOs.request.LanguageDTO;
import com.polygloat.DTOs.request.validators.exceptions.ValidationException;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.Language;
import com.polygloat.model.Repository;
import com.polygloat.service.LanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.LinkedHashSet;
import java.util.Optional;

@Component
public class LanguageValidator {
    private LanguageService languageService;

    @Autowired
    public LanguageValidator(LanguageService languageService) {
        this.languageService = languageService;
    }

    public void validateEdit(LanguageDTO dto) {
        LinkedHashSet<ValidationError> validationErrors = new LinkedHashSet<>();

        //handle edit validation
        Language language = languageService.findById(dto.getId()).orElseThrow(NotFoundException::new);

        Repository repository = language.getRepository();

        if (!language.getName().equals(dto.getName())) {
            validateNameUniqueness(dto, repository).ifPresent(validationErrors::add);
        }
        if (!language.getAbbreviation().equals(dto.getAbbreviation())) {
            validateAbbreviationUniqueness(dto, repository).ifPresent(validationErrors::add);
        }

        if (!validationErrors.isEmpty()) {
            throw new ValidationException(validationErrors);
        }
    }

    public void validateCreate(LanguageDTO dto, Repository repository) {
        LinkedHashSet<ValidationError> validationErrors = new LinkedHashSet<>();

        //handle create validation
        validateAbbreviationUniqueness(dto, repository).ifPresent(validationErrors::add);
        validateNameUniqueness(dto, repository).ifPresent(validationErrors::add);

        if (!validationErrors.isEmpty()) {
            throw new ValidationException(validationErrors);
        }
    }

    private Optional<ValidationError> validateNameUniqueness(LanguageDTO dto, Repository repository) {
        if (languageService.findByName(dto.getName(), repository).isPresent()) {
            return Optional.of(new ValidationError(ValidationErrorType.LANGUAGE_EXISTING_NAME));
        }
        return Optional.empty();
    }

    private Optional<ValidationError> validateAbbreviationUniqueness(LanguageDTO dto, Repository repository) {
        if (languageService.findByAbbreviation(dto.getAbbreviation(), repository).isPresent()) {
            return Optional.of(new ValidationError(ValidationErrorType.LANGUAGE_EXISTING_ABBREVIATION));
        }
        return Optional.empty();
    }
}
