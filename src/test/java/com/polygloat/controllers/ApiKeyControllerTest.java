package com.polygloat.controllers;

import com.polygloat.constants.ApiScope;
import com.polygloat.controllers.ITest;
import com.polygloat.controllers.SignedInControllerTest;
import com.polygloat.dtos.request.CreateApiKeyDTO;
import com.polygloat.model.ApiKey;
import com.polygloat.model.Repository;
import com.polygloat.service.ApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class ApiKeyControllerTest extends SignedInControllerTest implements ITest {

    private Repository repository;

    @Autowired
    private ApiKeyService service;


    @Rollback
    @Test
    void create() throws Exception {
        repository = dbPopulator.createBase("test");

        commitTransaction();

        CreateApiKeyDTO requestDto = CreateApiKeyDTO.builder().repositoryId(repository.getId()).scopes(Set.of(ApiScope.TRANSLATIONS_VIEW, ApiScope.SOURCES_EDIT)).build();

        performPost("/api/apiKeys", requestDto).andExpect(status().isOk()).andReturn();

        Set<ApiKey> allByUser = service.getAllByUser(repository.getCreatedBy());

        assertThat(allByUser).size().isEqualTo(1);
        checkKey(allByUser.stream().findAny().get().getKey());
    }


    private void checkKey(String key) {
        assertThat(arrayDistinctCount(key.chars().boxed().toArray())).isGreaterThan(10);
    }

    private <T> int arrayDistinctCount(T[] array) {
        return Arrays.stream(array).collect(Collectors.toSet()).size();
    }
}
