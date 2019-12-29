package com.polygloat.controllers;

import com.polygloat.DTOs.request.validators.ValidationError;
import com.polygloat.DTOs.request.validators.ValidationErrorType;
import com.polygloat.DTOs.request.validators.exceptions.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.*;

public abstract class AbstractController {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return Collections.singletonMap(ValidationErrorType.STANDARD_VALIDATION.name(), errors);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ValidationException.class)
    public Map<String, List<String>> handleCustomValidationExceptions(ValidationException ex) {
        Map<String, List<String>> errors = new HashMap<>();
        for (ValidationError validationError : ex.getValidationErrors()) {
            errors.put(validationError.getType().name(), Arrays.asList(validationError.getParameters()));
        }
        return errors;
    }
}
