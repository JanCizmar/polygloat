package com.polygloat.Assertions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.api.AbstractAssert;
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public class ErrorMessageAssert extends AbstractAssert<ErrorMessageAssert, MvcResult> {

    public ErrorMessageAssert(MvcResult mvcResult) {
        super(mvcResult, ErrorMessageAssert.class);
    }

    public StandardValidationMessageAssert isStandardValidation() {
        Map<String, String> standardValidation = getMap().get("STANDARD_VALIDATION");
        if (standardValidation == null) {
            failWithMessage("Error response is not standard validation type.");
        }
        return new StandardValidationMessageAssert(standardValidation);
    }

    private Map<String, Map<String, String>> getMap() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(actual.getResponse().getContentAsString(), new TypeReference<>() {
            });
        } catch (JsonProcessingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Can not parse error response.");
        }
    }
}
