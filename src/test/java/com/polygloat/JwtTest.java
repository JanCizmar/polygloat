package com.polygloat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.controllers.AbstractControllerTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class JwtTest extends AbstractControllerTest {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private MockMvc mvc;

    @Test
    void generatesTokenForValidUser() throws Exception {
        String response = doAuthentication("ben", "benspassword")
                .getResponse().getContentAsString();

        HashMap result = new ObjectMapper().readValue(response, HashMap.class);

        assertThat(result.get("accessToken")).isNotNull();
        assertThat(result.get("tokenType")).isEqualTo("Bearer");
    }

    @Test
    void DoesNotGenerateTokenForInValidUser() throws Exception {
        MvcResult mvcResult = doAuthentication("bena", "benaspassword");
        assertThat(mvcResult.getResponse().getStatus()).isEqualTo(403);
    }


    @Test
    void userWithTokenHasAccess() throws Exception {
        String response = doAuthentication("ben", "benspassword")
                .getResponse().getContentAsString();

        String token = (String) mapper.readValue(response, HashMap.class).get("accessToken");

        MvcResult mvcResult = mvc.perform(get("/api/repositories")
                .accept(MediaType.ALL)
                .header("Authorization", String.format("Bearer %s", token))
                .contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        assertThat(mvcResult.getResponse().getStatus()).isEqualTo(200);

    }


}
