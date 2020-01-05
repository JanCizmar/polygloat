package com.polygloat.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.dtos.request.AbstractRepositoryDTO;
import com.polygloat.dtos.request.CreateRepositoryDTO;
import com.polygloat.dtos.request.EditRepositoryDTO;
import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.dtos.response.RepositoryDTO;
import com.polygloat.model.File;
import com.polygloat.model.Language;
import com.polygloat.model.Repository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static com.polygloat.controllers.LoggedRequestFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Transactional
class RepositoryControllerTest extends LoggedControllerTest {
    private final LanguageDTO languageDTO = new LanguageDTO("English", "en");

    @Test
    @Rollback
    void createRepository() throws Exception {
        dbPopulator.createBase("test");

        testCreateValidationSize();

        testCreateValidationUniqueness();

        testCreateCorrectRequest();
    }

    private void testCreateCorrectRequest() throws Exception {
        CreateRepositoryDTO request = new CreateRepositoryDTO("aaa", Collections.singleton(languageDTO));

        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repositories")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(request)))
                .andExpect(status().isOk())
                .andReturn();

        Optional<Repository> aa = repositoryService.findByName("aaa", userAccount);

        assertThat(aa).isPresent();

        Repository repository = aa.orElse(null);

        assertThat(repository.getLanguages()).isNotEmpty();

        Language language = repository.getLanguages().stream().findFirst().orElse(null);

        assertThat(language).isNotNull();

        assertThat(language.getAbbreviation()).isEqualTo("en");

        assertThat(language.getName()).isEqualTo("English");

        assertThat(repository.getRootFolder()).isNotNull();
    }

    private void testCreateValidationSize() throws Exception {
        CreateRepositoryDTO request = new CreateRepositoryDTO("aa", Collections.singleton(languageDTO));

        //test validation
        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repositories")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(request)))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).contains("name");
        assertThat(mvcResult.getResponse().getContentAsString()).contains("STANDARD_VALIDATION");
    }

    private void testCreateValidationUniqueness() throws Exception {
        CreateRepositoryDTO request = new CreateRepositoryDTO("test", Collections.singleton(languageDTO));

        //test validation
        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repositories")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(request)))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString())
                .isEqualTo("{\"STANDARD_VALIDATION\":{\"name\":\"NAME_EXISTS\"}}");
    }


    @Test
    @Rollback
    void editRepository() throws Exception {
        File test = dbPopulator.createBase("test");
        File test2 = dbPopulator.createBase("test2");

        testEditValidationUniqueness(test2.getRepository().getId());

        testEditCorrectRequest(test);
    }

    private void testEditCorrectRequest(File test) throws Exception {
        AbstractRepositoryDTO request = new EditRepositoryDTO(test.getId(), "new test");

        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repositories/edit")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(request)))
                .andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();
        RepositoryDTO response = mapper.readValue(mvcResult.getResponse().getContentAsString(), RepositoryDTO.class);

        assertThat(response.getName()).isEqualTo("new test");
        assertThat(response.getId()).isEqualTo(test.getId());

        Optional<Repository> found = repositoryService.findByName("new test", userAccount);

        assertThat(found).isPresent();
    }

    private void testEditValidationUniqueness(Long repositoryId) throws Exception {
        EditRepositoryDTO request = new EditRepositoryDTO(repositoryId, "test");

        //test validation
        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repositories/edit")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(request)))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(mvcResult.getResponse().getContentAsString())
                .isEqualTo("{\"STANDARD_VALIDATION\":{\"name\":\"NAME_EXISTS\"}}");
    }

    @Test
    @Rollback
    void deleteRepository() throws Exception {
        File test = dbPopulator.createBase("test");

        MvcResult mvcResult = mvc.perform(
                loggedDelete("/api/repositories/" + test.getRepository().getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        commitTransaction();

        Optional<Repository> repository = repositoryService.findById(test.getRepository().getId());

        assertThat(repository).isEmpty();
    }


    @Test
    @Rollback
    void findAll() throws Exception {
        File test = dbPopulator.createBase("test");
        File test1 = dbPopulator.createBase("test1");
        File test2 = dbPopulator.createBase("test2");

        MvcResult mvcResult = mvc.perform(
                loggedGet("/api/repositories/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        ObjectMapper mapper = new ObjectMapper();

        Set set = mapper.readValue(mvcResult.getResponse().getContentAsString(), Set.class);
        assertThat(set).hasSize(3);
    }
}
