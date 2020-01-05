package com.polygloat.dtos.response.translations_view;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class ResponseParams {
    private String search;
    private Set<String> languages;

    public ResponseParams() {

    }
}
