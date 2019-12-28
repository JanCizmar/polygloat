package com.polygloat.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.AbstractTransactionalTest;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.service.FileService;
import com.polygloat.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public abstract class AbstractControllerTest extends AbstractTransactionalTest {
    @Autowired
    protected MockMvc mvc;
    @Autowired
    DbPopulatorReal dbPopulator;
    @Autowired
    RepositoryService repositoryService;
    @Autowired
    FileService fileService;

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
