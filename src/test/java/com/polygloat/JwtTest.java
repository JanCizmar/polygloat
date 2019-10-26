package com.polygloat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.configuration.WebSecurityConfig;
import com.polygloat.security.payload.LoginRequest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.*;

import java.util.HashMap;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class JwtTest {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private MockMvc mvc;

    @Test
    void generatesTokenForValidUser() throws Exception {
        String response = doAuthentication("ben", "benaspassword")
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

    private MvcResult doAuthentication(String username, String password) throws Exception {

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

    @Test
    void userWithTokenHasAccess() throws Exception {
        String response = doAuthentication("ben", "benspassword")
                .getResponse().getContentAsString();

        String token = (String) mapper.readValue(response, HashMap.class).get("accessToken");

        MvcResult mvcResult = mvc.perform(get("/translations")
                .accept(MediaType.ALL)
                .header("Authorization", String.format("Bearer %s", token))
                .contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        assertThat(mvcResult.getResponse().getStatus()).isEqualTo(200);

    }


}
