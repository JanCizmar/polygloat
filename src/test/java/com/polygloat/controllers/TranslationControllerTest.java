package com.polygloat.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
class TranslationControllerTest extends AbstractControllerTest {

    @Test
    void getViewData() throws Exception {
        dbPopulator.populate("app");

        Repository repository = repositoryService.findByName("app").orElseThrow(NotFoundException::new);

        MvcResult mvcResult = mvc.perform(
                get("/api/public/repository/" + repository.getId().toString() + "/translations/view/en,de")
                        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();

        List<Map<String, Object>> list = mapper.readValue(mvcResult.getResponse().getContentAsString(), List.class);

        Map<String, Object> first = list.get(0);
        assertThat(first).containsKeys("fullPath", "translations", "source");
    }

    @Test
    void getTranslations() throws Exception {
        dbPopulator.populate("app");

        Repository repository = repositoryService.findByName("app").orElseThrow(NotFoundException::new);

        MvcResult mvcResult = mvc.perform(
                get("/api/public/repository/" + repository.getId().toString() + "/translations/en,de")
                        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> result = mapper.readValue(mvcResult.getResponse().getContentAsString(), Map.class);
        assertThat(result).containsKeys("en", "de");
    }

    @Test
    void getSourceTranslations() throws Exception {
        dbPopulator.populate("app");

        Repository repository = repositoryService.findByName("app").orElseThrow(NotFoundException::new);

        MvcResult mvcResult = mvc.perform(
                get("/api/public/repository/" + repository.getId().toString() +
                        "/translations/source/home.news.This_is_another_translation_in_news_folder")
                        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> result = mapper.readValue(mvcResult.getResponse().getContentAsString(), Map.class);
        assertThat(result).containsKeys("en", "de");
    }

    @Test
    void setTranslations() throws Exception {
        File app = dbPopulator.createBase("app");

        HashMap<String, String> translations = new HashMap<>();
        translations.put("en", "en text");
        translations.put("de", "de text");

        SourceTranslationsDTO sourceTranslationsDTO = new SourceTranslationsDTO(
                "home.news",
                translations,
                null,
                "This_is_another_translation_in_news_folder");

        MvcResult mvcResult = mvc.perform(
                post("/api/public/repository/" + app.getRepository().getId() + "/translations")
                        .contentType(MediaType.APPLICATION_JSON).content(asJsonString(sourceTranslationsDTO)))
                .andExpect(status().isOk()).andReturn();

        File file = fileService.evaluatePath(app.getRepository(), sourceTranslationsDTO.getNewSourceInfo()
                .getPath()).orElse(null);

        assertThat(file).isNotNull();
        assertThat(file.getSource()).isNotNull();

        newTransaction();
    }

    @Test
    void deleteTranslation() {
    }

}
