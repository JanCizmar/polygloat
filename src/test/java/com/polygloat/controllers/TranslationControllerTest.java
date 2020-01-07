package com.polygloat.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polygloat.dtos.request.SourceTranslationsDTO;
import com.polygloat.dtos.response.ViewDataResponse;
import com.polygloat.dtos.response.translations_view.FileViewDataItem;
import com.polygloat.dtos.response.translations_view.ResponseParams;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

import static com.polygloat.controllers.LoggedRequestFactory.loggedGet;
import static com.polygloat.controllers.LoggedRequestFactory.loggedPost;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class TranslationControllerTest extends LoggedControllerTest {
    @Test
    @Rollback
    void getViewDataSearch() throws Exception {
        dbPopulator.populate("app2");

        Repository repository = repositoryService.findByName("app2", userAccount).orElseThrow(NotFoundException::new);

        String searchString = "This";

        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response = performValidViewRequest(repository, "?search=" + searchString);

        assertSearch(response, searchString);
    }

    @Test
    @Rollback
    void getViewDataQueryLanguages() throws Exception {
        Repository repository = dbPopulator.populate(generateUniqueString()).getRepository();

        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response = performValidViewRequest(repository, "?languages=en");

        assertThat(response.getData().size()).isGreaterThan(10);

        for (FileViewDataItem item : response.getData()) {
            assertThat(item.getTranslations()).doesNotContainKeys("de");
        }

        performGetDataForView(repository.getId(), "?languages=langNotExists").andExpect(status().isNotFound());

        //with starting emtpy string
        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response2 = performValidViewRequest(repository, "?languages=,en,de");

        //with trailing empty string
        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response3 = performValidViewRequest(repository, "?languages=,en,de,");

        //with same language multiple times
        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response4 = performValidViewRequest(repository, "?languages=,en,en,,");


    }

    private ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> performValidViewRequest(Repository repository, String queryString) throws Exception {
        MvcResult mvcResult = performGetDataForView(repository.getId(), queryString).andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();

        return mapper.readValue(mvcResult.getResponse().getContentAsString(),
                new TypeReference<ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams>>() {
                });
    }

    @Test
    @Rollback
    void getViewDataQueryPagination() throws Exception {
        Repository repository = dbPopulator.populate(generateUniqueString()).getRepository();

        int limit = 5;
        int allCount = 15;

        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response = performValidViewRequest(repository, String.format("?limit=%d", limit));

        assertThat(response.getData().size()).isEqualTo(limit);
        assertThat(response.getPaginationMeta().getAllCount()).isEqualTo(allCount);
        assertThat(response.getPaginationMeta().getOffset()).isEqualTo(0);


        int offset = 3;

        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> responseOffset = performValidViewRequest(repository, String.format("?limit=%d&offset=%d", limit, offset));

        assertThat(responseOffset.getData().size()).isEqualTo(limit);
        assertThat(responseOffset.getPaginationMeta().getOffset()).isEqualTo(offset);

        response.getData().stream().limit(offset).forEach(i -> assertThat(responseOffset.getData()).doesNotContain(i));

        response.getData().stream().skip(offset).forEach(i -> {
            assertThat(responseOffset.getData()).contains(i);
        });
    }

    @Test
    @Rollback
    void getViewDataMetadata() throws Exception {
        Repository repository = dbPopulator.populate(generateUniqueString()).getRepository();
        int limit = 5;
        ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response = performValidViewRequest(repository, String.format("?limit=%d", limit));

        assertThat(response.getParams().getLanguages()).contains("en", "de");
    }

    private void assertSearch(ViewDataResponse<LinkedHashSet<FileViewDataItem>, ResponseParams> response, String searchString) {
        for (FileViewDataItem item : response.getData()) {
            assertThat(asJsonString(item)).contains(searchString);
        }
    }

    @Test
    @Rollback
    void getTranslations() throws Exception {
        dbPopulator.populate("app");

        Repository repository = repositoryService.findByName("app", userAccount).orElseThrow(NotFoundException::new);

        MvcResult mvcResult = mvc.perform(
                loggedGet("/api/repository/" + repository.getId().toString() + "/translations/en,de")
                        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> result = mapper.readValue(mvcResult.getResponse().getContentAsString(), Map.class);
        assertThat(result).containsKeys("en", "de");
    }

    @Test
    @Rollback
    void getSourceTranslations() throws Exception {
        dbPopulator.populate("app4");

        Repository repository = repositoryService.findByName("app4", userAccount).orElseThrow(NotFoundException::new);

        MvcResult mvcResult = mvc.perform(
                loggedGet("/api/repository/" + repository.getId().toString() +
                        "/translations/source/home.news.This_is_another_translation_in_news_folder")
                        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> result = mapper.readValue(mvcResult.getResponse().getContentAsString(), Map.class);
        assertThat(result).containsKeys("en", "de");
    }

    @Test
    @Rollback
    void setTranslations() throws Exception {
        File app = dbPopulator.createBase("app5");

        SourceTranslationsDTO sourceTranslationsDTO = getSourceTranslationsDTO();

        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repository/" + app.getRepository().getId() + "/translations")
                        .contentType(MediaType.APPLICATION_JSON).content(asJsonString(sourceTranslationsDTO)))
                .andExpect(status().isOk()).andReturn();

        File file = fileService.evaluatePath(app.getRepository(), sourceTranslationsDTO.getNewSourcePath()).orElse(null);

        assertThat(file).isNotNull();
        assertThat(file.getSource()).isNotNull();

        commitTransaction();
    }

    @Test
    @Rollback
    void setTranslationsModify() throws Exception {
        File app = dbPopulator.createBase("app6");

        SourceTranslationsDTO sourceTranslationsDTO = getSourceTranslationsDTO();

        //create old tranlation
        translationService.setTranslations(app.getRepository().getId(), sourceTranslationsDTO);

        commitTransaction();

        //modify source text
        sourceTranslationsDTO.setOldSourceText(sourceTranslationsDTO.getNewSourceText());
        sourceTranslationsDTO.setNewSourceText("newSourceText");

        MvcResult mvcResult = mvc.perform(
                loggedPost("/api/repository/" + app.getRepository().getId() + "/translations")
                        .contentType(MediaType.APPLICATION_JSON).content(asJsonString(sourceTranslationsDTO)))
                .andExpect(status().isOk()).andReturn();


        commitTransaction();

        //evaluate new path
        File file = fileService.evaluatePath(app.getRepository(), sourceTranslationsDTO.getNewSourcePath()).orElse(null);

        //should be present
        assertThat(file).isNotNull();
        assertThat(file.getSource()).isNotNull();

        //old path should not be present
        file = fileService.evaluatePath(app.getRepository(), sourceTranslationsDTO.getOldSourcePath()).orElse(null);
        assertThat(file).isNull();
    }

    private SourceTranslationsDTO getSourceTranslationsDTO() {
        HashMap<String, String> translations = new HashMap<>();
        translations.put("en", "en text");
        translations.put("de", "de text");

        return new SourceTranslationsDTO(
                "home.news",
                translations,
                null,
                "This_is_another_translation_in_news_folder");
    }

    private ResultActions performGetDataForView(Long repositoryId, String queryString) throws Exception {
        return mvc.perform(
                loggedGet("/api/repository/" + repositoryId + "/translations/view" + queryString)
                        .contentType(MediaType.APPLICATION_JSON));
    }

}
