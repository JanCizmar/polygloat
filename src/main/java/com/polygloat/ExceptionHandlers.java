package com.polygloat;

import com.polygloat.dtos.request.validators.ValidationError;
import com.polygloat.dtos.request.validators.ValidationErrorType;
import com.polygloat.dtos.request.validators.exceptions.ValidationException;
import com.polygloat.exceptions.ErrorException;
import com.polygloat.exceptions.ErrorResponseBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.*;

@ControllerAdvice
public class ExceptionHandlers {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(Collections.singletonMap(ValidationErrorType.STANDARD_VALIDATION.name(), errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, List<String>>> handleCustomValidationExceptions(ValidationException ex) {
        Map<String, List<String>> errors = new HashMap<>();
        for (ValidationError validationError : ex.getValidationErrors()) {
            errors.put(validationError.getType().name(), Arrays.asList(validationError.getParameters()));
        }
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ErrorException.class)
    public ResponseEntity<ErrorResponseBody> handleServerError(ErrorException ex) {
        return new ResponseEntity<>(ex.getErrorResponseBody(), ex.getHttpStatus());
    }
}
