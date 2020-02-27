package com.polygloat.controllers;

import com.polygloat.constants.ApiScope;
import com.polygloat.dtos.request.CreateApiKeyDTO;
import com.polygloat.dtos.request.EditApiKeyDTO;
import com.polygloat.dtos.response.ApiKeyDTO.ApiKeyDTO;
import com.polygloat.model.ApiKey;
import com.polygloat.model.Repository;
import com.polygloat.service.ApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MvcResult;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.polygloat.Assertions.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class ApiKeyControllerTest extends SignedInControllerTest implements ITest {

    private Repository repository;
    private ApiKeyDTO apiKeyDTO;

    @Autowired
    private ApiKeyService service;

    @Test(testName = "setup")
    void setup() {
        repository = dbPopulator.createBase(generateUniqueString());
        commitTransaction();
    }

    @Test(dependsOnMethods = "setup", testName = "create_success")
    void create_success() throws Exception {
        CreateApiKeyDTO requestDto = CreateApiKeyDTO.builder().repositoryId(repository.getId()).scopes(Set.of(ApiScope.TRANSLATIONS_VIEW, ApiScope.SOURCES_EDIT)).build();
        MvcResult mvcResult = null;
        mvcResult = performPost("/api/apiKeys", requestDto).andExpect(status().isOk()).andReturn();
        apiKeyDTO = mapResponse(mvcResult, ApiKeyDTO.class);
        Optional<ApiKey> apiKey = service.getApiKey(apiKeyDTO.getKey());
        assertThat(apiKey).isPresent();
        checkKey(apiKey.get().getKey());
        commitTransaction(); //otherwise the transaction is rolled back after test - other tests are depending on this
    }

    @Test(dependsOnMethods = "setup")
    void create_failure_no_scopes() throws Exception {
        CreateApiKeyDTO requestDto = CreateApiKeyDTO.builder().repositoryId(repository.getId()).scopes(Set.of()).build();
        MvcResult mvcResult = performPost("/api/apiKeys", requestDto).andExpect(status().isBadRequest()).andReturn();
        assertThat(mvcResult).error().isStandardValidation().onField("scopes").isEqualTo("must not be empty");
        assertThat(mvcResult).error().isStandardValidation().errorCount().isEqualTo(1);
    }

    @Test(dependsOnMethods = "setup")
    void create_failure_no_repository() throws Exception {
        CreateApiKeyDTO requestDto = CreateApiKeyDTO.builder().scopes(Set.of(ApiScope.TRANSLATIONS_VIEW)).build();
        MvcResult mvcResult = performPost("/api/apiKeys", requestDto).andExpect(status().isBadRequest()).andReturn();
        assertThat(mvcResult).error().isStandardValidation().onField("repositoryId").isEqualTo("must not be empty");
        assertThat(mvcResult).error().isStandardValidation().errorCount().isEqualTo(1);
    }

    @Test(dependsOnMethods = {"setup", "create_success"})
    void edit_success() throws Exception {
        Set<ApiScope> newScopes = Set.of(ApiScope.TRANSLATIONS_EDIT);
        EditApiKeyDTO editDto = EditApiKeyDTO.builder().id(apiKeyDTO.getId()).scopes(newScopes).build();
        performPost("/api/apiKeys/edit", editDto).andExpect(status().isOk()).andReturn();
        Optional<ApiKey> apiKey = service.getApiKey(apiKeyDTO.getId());
        assertThat(apiKey).isPresent();
        assertThat(apiKey.get().getScopes()).isEqualTo(newScopes);
    }

    @Test(dependsOnMethods = {"setup", "create_success"})
    void edit_failure_no_scopes() throws Exception {
        Set<ApiScope> newScopes = Set.of();
        EditApiKeyDTO editDto = EditApiKeyDTO.builder().id(apiKeyDTO.getId()).scopes(newScopes).build();
        MvcResult mvcResult = performPost("/api/apiKeys/edit", editDto).andExpect(status().isBadRequest()).andReturn();
        assertThat(mvcResult).error().isStandardValidation().onField("scopes").isEqualTo("must not be null");
    }

    private void checkKey(String key) {
        assertThat(arrayDistinctCount(key.chars().boxed().toArray())).isGreaterThan(10);
    }

    private <T> int arrayDistinctCount(T[] array) {
        return Arrays.stream(array).collect(Collectors.toSet()).size();
    }
}
