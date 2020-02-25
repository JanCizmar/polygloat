package com.polygloat.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.AbstractTransactionalTest;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.SourceRepository;
import com.polygloat.security.payload.LoginRequest;
import com.polygloat.service.LanguageService;
import com.polygloat.service.RepositoryService;
import com.polygloat.service.TranslationService;
import com.polygloat.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public abstract class AbstractControllerTest extends AbstractTransactionalTest implements ITest {
    @Autowired
    protected MockMvc mvc;

    @Autowired
    DbPopulatorReal dbPopulator;
    @Autowired
    RepositoryService repositoryService;

    @Autowired
    TranslationService translationService;

    @Autowired
    LanguageService languageService;

    @Autowired
    SourceRepository sourceRepository;

    @Autowired
    UserAccountService userAccountService;

    @Autowired
    public ObjectMapper mapper;

    <T> T decodeJson(String json, Class<T> clazz) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, clazz);
        }
        catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    protected DefaultAuthenticationResult defaultLogin() throws Exception {

        String userName = "ben";
        String password = "benspassword";

        String response = doAuthentication(userName, password)
                .getResponse().getContentAsString();

        UserAccount userAccount = userAccountService.getByUserName(userName).orElseThrow(NotFoundException::new);

        return new DefaultAuthenticationResult((String) mapper.readValue(response, HashMap.class).get("accessToken"), userAccount);
    }

    protected MvcResult doAuthentication(String username, String password) throws Exception {

        LoginRequest request = new LoginRequest();

        request.setUsername(username);
        request.setPassword(password);

        String jsonRequest = mapper.writeValueAsString(request);

        return mvc.perform(post("/api/public/generatetoken")
                                   .content(jsonRequest)
                                   .accept(MediaType.ALL)
                                   .contentType(MediaType.APPLICATION_JSON))
                .andReturn();
    }

}
