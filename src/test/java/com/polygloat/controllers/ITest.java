package com.polygloat.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.UUID;

public interface ITest {
    default String asJsonString(Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final String jsonContent = mapper.writeValueAsString(obj);
            return jsonContent;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    default String generateUniqueString() {
        return UUID.randomUUID().toString();
    }
}
