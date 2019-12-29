package com.polygloat.DTOs.request.validators;

import lombok.Getter;

public class ValidationError {
    @Getter
    private String[] parameters;

    @Getter
    private ValidationErrorType type;

    public ValidationError(ValidationErrorType type, String... parameters) {
        this.parameters = parameters;
        this.type = type;
    }
}
