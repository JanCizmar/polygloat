package com.polygloat.controllers;

import com.polygloat.DTOs.request.LanguageDTO;
import com.polygloat.model.File;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Transactional
class LanguageControllerTest extends AbstractControllerTest {

    private final LanguageDTO languageDTO = new LanguageDTO("en", "en");

    @Test
    @Rollback
    void createLanguage() throws Exception {
        File test = dbPopulator.createBase("test");

        MvcResult mvcResult = mvc.perform(
                post("/api/public/repository/" + test.getRepository().getId() + "/languages")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(languageDTO)))
                .andExpect(status().isBadRequest())
                .andReturn();
    }

}
