package com.polygloat.security;


import com.polygloat.constants.ApiScope;
import com.polygloat.controllers.AbstractControllerTest;
import com.polygloat.dtos.response.ApiKeyDTO.ApiKeyDTO;
import com.polygloat.model.Repository;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testng.annotations.Test;

import java.util.Set;

import static com.polygloat.Assertions.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
public class ApiKeyAuthenticationTest extends AbstractControllerTest {

    @Test
    public void accessWithApiKey_failure() throws Exception {
        MvcResult mvcResult = mvc.perform(get("/uaa/en")).andExpect(status().isForbidden()).andReturn();
        assertThat(mvcResult).error();
    }

    @Test
    public void accessWithApiKey_success() throws Exception {
        Repository base = this.dbPopulator.createBase(generateUniqueString());
        ApiKeyDTO apiKey = this.apiKeyService.createApiKey(base.getCreatedBy(), Set.of(ApiScope.values()), base);
        mvc.perform(get("/uaa/en?ak=" + apiKey.getKey())).andExpect(status().isOk()).andReturn();
    }

    @Test
    public void accessWithApiKey_failure_api_path() throws Exception {
        Repository base = this.dbPopulator.createBase(generateUniqueString());
        ApiKeyDTO apiKey = this.apiKeyService.createApiKey(base.getCreatedBy(), Set.of(ApiScope.values()), base);
        mvc.perform(get("/api/repositories")).andExpect(status().isForbidden()).andReturn();
    }
}
