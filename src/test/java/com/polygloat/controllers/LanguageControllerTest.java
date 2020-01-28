package com.polygloat.controllers;

import com.polygloat.ExceptionHandlers;
import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Language;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

import static com.polygloat.controllers.LoggedRequestFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Transactional
class LanguageControllerTest extends LoggedControllerTest implements ITest {

    private final LanguageDTO languageDTO = new LanguageDTO("en", "en");
    private final LanguageDTO languageDTOBlank = new LanguageDTO(null, "");
    private final LanguageDTO languageDTOCorrect = new LanguageDTO("Espanol", "es");


    @Autowired
    LanguageController languageController;
    private MockMvc languageMvc;

    @BeforeEach
    public void setup() {
        languageMvc = MockMvcBuilders.standaloneSetup(languageController).setControllerAdvice(new ExceptionHandlers()).build();
    }


    @Test
    @Rollback
    void createLanguage() throws Exception {
        File test = dbPopulator.createBase(generateUniqueString());
        createLanguageTestValidation(test.getRepository().getId());
        createLanguageCorrectRequest(test.getRepository().getId());
    }

    @Test
    @Rollback
    void editLanguage() throws Exception {
        File test = dbPopulator.createBase(generateUniqueString());
        Language en = test.getRepository().getLanguage("en").orElseThrow(NotFoundException::new);
        LanguageDTO languageDTO = LanguageDTO.fromEntity(en);

        languageDTO.setName("newEnglish");
        languageDTO.setAbbreviation("newEn");
        MvcResult mvcResult = performEdit(test.getRepository().getId(), languageDTO)
                .andExpect(status().isOk()).andReturn();

        LanguageDTO languageDTORes = decodeJson(mvcResult.getResponse().getContentAsString(), LanguageDTO.class);
        assertThat(languageDTORes.getName()).isEqualTo(languageDTO.getName());
        assertThat(languageDTORes.getAbbreviation()).isEqualTo(languageDTO.getAbbreviation());

        Optional<Language> dbLanguage = languageService.findByAbbreviation(languageDTO.getAbbreviation(), test.getRepository());
        assertThat(dbLanguage).isPresent();
        assertThat(dbLanguage.get().getName()).isEqualTo(languageDTO.getName());
    }

    @Test
    @Rollback
    void findAllLanguages() throws Exception {
        File test = dbPopulator.createBase(generateUniqueString());
        MvcResult mvcResult = performFindAll(test.getRepository().getId()).andExpect(status().isOk()).andReturn();
        assertThat(decodeJson(mvcResult.getResponse().getContentAsString(), Set.class)).hasSize(2);
    }

    @Test
    @Rollback
    void deleteLanguage() throws Exception {
        File test = dbPopulator.createBase(generateUniqueString());
        Language en = test.getRepository().getLanguage("en").orElseThrow(NotFoundException::new);

        performDelete(test.getRepository().getId(), en.getId()).andExpect(status().isOk());

        commitTransaction();

        assertThat(languageService.findById(en.getId())).isEmpty();
    }

    private void createLanguageCorrectRequest(Long repoId) throws Exception {
        MvcResult mvcResult = performCreate(repoId, languageDTOCorrect).andExpect(status().isOk()).andReturn();
        LanguageDTO languageDTO = decodeJson(mvcResult.getResponse().getContentAsString(), LanguageDTO.class);

        assertThat(languageDTO.getName()).isEqualTo(languageDTOCorrect.getName());
        assertThat(languageDTO.getAbbreviation()).isEqualTo(languageDTOCorrect.getAbbreviation());

        Optional<Language> es = languageService.findByAbbreviation("es", repoId);
        assertThat(es).isPresent();
        assertThat(es.get().getName()).isEqualTo(languageDTOCorrect.getName());
    }


    void createLanguageTestValidation(Long repoId) throws Exception {
        MvcResult mvcResult = performCreate(repoId, languageDTO)
                .andExpect(status().isBadRequest()).andReturn();

        assertThat(mvcResult.getResponse().getContentAsString()).contains("LANGUAGE_EXISTING_ABBREVIATION");
        assertThat(mvcResult.getResponse().getContentAsString()).contains("LANGUAGE_EXISTING_NAME");

        mvcResult = performCreate(repoId, languageDTOBlank)
                .andExpect(status().isBadRequest()).andReturn();


        assertThat(mvcResult.getResponse().getContentAsString())
                .isEqualTo("{\"STANDARD_VALIDATION\":" +
                        "{\"name\":\"must not be blank\"," +
                        "\"abbreviation\":\"must not be blank\"}}");
    }

    private ResultActions performCreate(Long repositoryId, LanguageDTO content) throws Exception {
        return languageMvc.perform(
                loggedPost("/api/repository/" + repositoryId + "/languages")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(content)));
    }

    private ResultActions performEdit(Long repositoryId, LanguageDTO content) throws Exception {
        return mvc.perform(
                loggedPost("/api/repository/" + repositoryId + "/languages/edit")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(content)));
    }

    private ResultActions performDelete(Long repositoryId, Long languageId) throws Exception {
        return mvc.perform(
                loggedDelete("/api/repository/" + repositoryId + "/languages/" + languageId)
                        .contentType(MediaType.APPLICATION_JSON));
    }

    private ResultActions performFindAll(Long repositoryId) throws Exception {
        return mvc.perform(
                loggedGet("/api/repository/" + repositoryId + "/languages")
                        .contentType(MediaType.APPLICATION_JSON));
    }

}
