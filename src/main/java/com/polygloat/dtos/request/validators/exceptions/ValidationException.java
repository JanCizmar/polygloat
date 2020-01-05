package com.polygloat.dtos.request.validators.exceptions;

import com.polygloat.dtos.request.validators.ValidationError;
import com.polygloat.dtos.request.validators.ValidationErrorType;
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
