package com.polygloat.controllers;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.DTOs.SetFileRequestDTO;
import com.polygloat.DTOs.SourceTranslationsDTO;
import com.polygloat.model.File;
import com.polygloat.model.Source;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class FileControllerTest extends AbstractControllerTest {

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

    @Test
    void deleteFile() throws Exception {
        File root = dbPopulator.createBase("app");

        SourceTranslationsDTO sourceTranslationsDTO = getSourceTranslationsDTO();
        translationService.setTranslations(root.getRepository().getId(), sourceTranslationsDTO);
        PathDTO path = sourceTranslationsDTO.getNewSourcePath();

        newTransaction();

        Optional<File> file = fileService.evaluatePath(root.getRepository(), path);

        assertThat(file).isPresent();

        Source source = file.orElse(null).getSource();
        assertThat(source).isNotNull();
        Long sourceId = source.getId();

        MvcResult mvcResult = mvc.perform(
                delete("/api/public/repository/" + root.getRepository().getId() + "/file/" +
                        path.getFullPathString()).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();

        newTransaction();

        file = fileService.evaluatePath(root.getRepository(), path);
        assertThat(file).isEmpty();

        Optional<Source> source1 = sourceRepository.findById(sourceId);
        assertThat(source1).isEmpty();
    }

    @Test
    void setFile() throws Exception {
        File root = dbPopulator.createBase("app");

        //test move
        fileService.getOrCreatePath(root.getRepository(), PathDTO.fromFullPath("aa.aa.aa"));
        fileService.getOrCreatePath(root.getRepository(), PathDTO.fromFullPath("aa.bb.cc"));

        MvcResult mvcResult = mvc.perform(
                post("/api/public/repository/" + root.getRepository().getId() + "/file")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(new SetFileRequestDTO("aa.aa.aa", "aa.bb.cc"))))
                .andExpect(status().isBadRequest()).andReturn();

        mvcResult = mvc.perform(
                post("/api/public/repository/" + root.getRepository().getId() + "/file")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(new SetFileRequestDTO("aa.aa.aa", "aa.bb.cc.aa"))))
                .andExpect(status().isOk()).andReturn();

        Optional<File> file = fileService.evaluatePath(root.getRepository(), PathDTO.fromFullPath("aa.bb.cc.aa"));

        assertThat(file).isPresent();

        mvcResult = mvc.perform(
                post("/api/public/repository/" + root.getRepository().getId() + "/file")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(new SetFileRequestDTO("aa.aa.aa", "aa.aa.aa.aa"))))
                .andExpect(status().isBadRequest()).andReturn();

        mvcResult = mvc.perform(
                post("/api/public/repository/" + root.getRepository().getId() + "/file")
                        .contentType(MediaType.APPLICATION_JSON).content(
                        asJsonString(new SetFileRequestDTO("aa.aa.aa", "aa.ee"))))
                .andExpect(status().isOk()).andReturn();

        file = fileService.evaluatePath(root.getRepository(), PathDTO.fromFullPath("aa.ee"));

        assertThat(file).isPresent();
    }

}
