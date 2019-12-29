package com.polygloat.DTOs.request.validators.exceptions;

import com.polygloat.DTOs.request.validators.ValidationError;
import com.polygloat.DTOs.request.validators.ValidationErrorType;
import lombok.Getter;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

public class ValidationException extends RuntimeException {
    @Getter
    private Set<ValidationError> validationErrors = new LinkedHashSet<>();

    public ValidationException(ValidationErrorType type, String... parameters) {
        this.validationErrors.add(new ValidationError(type, parameters));
    }


    public ValidationException(Collection<ValidationError> validationErrors) {
        this.validationErrors.addAll(validationErrors);
    }
}
