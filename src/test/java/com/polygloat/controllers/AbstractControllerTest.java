package com.polygloat.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.AbstractTransactionalTest;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.repository.SourceRepository;
import com.polygloat.service.FileService;
import com.polygloat.service.RepositoryService;
import com.polygloat.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

public abstract class AbstractControllerTest extends AbstractTransactionalTest {
    @Autowired
    protected MockMvc mvc;
    @Autowired
    DbPopulatorReal dbPopulator;
    @Autowired
    RepositoryService repositoryService;
    @Autowired
    FileService fileService;
    @Autowired
    TranslationService translationService;

    @Autowired
    SourceRepository sourceRepository;

    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            final String jsonContent = mapper.writeValueAsString(obj);
            return jsonContent;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
