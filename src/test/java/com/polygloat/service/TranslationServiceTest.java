package com.polygloat.service;

import com.polygloat.DTOs.PathDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.model.Repository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class TranslationServiceTest {

    @Autowired
    TranslationService translationService;

    @Autowired
    FileService fileService;

    @Autowired
    EntityManager entityManager;

    @Autowired
    DbPopulatorReal dbPopulator;

    @Autowired
    RepositoryService repositoryService;

    @Test
    @Transactional
    void getTranslations() {
        dbPopulator.populate("App");
        Repository app = repositoryService.findByName("App").orElseThrow(NotFoundException::new);

        Map<String, Object> viewData = translationService.getTranslations(new HashSet<>(Arrays.asList("en", "de")), app.getId());
        assertThat(viewData.get("en")).isInstanceOf(Map.class);
    }

    Object evaluatePath(Map<String, Object> map, PathDTO path) {
        LinkedList<String> pathList = path.getFullPath();

        Object o = map.get(pathList.removeFirst());

        if (pathList.isEmpty()) {
            return o;
        }
        if (o instanceof Map) {
            return evaluatePath((Map<String, Object>) o, PathDTO.fromFullPath(pathList));
        }

        throw new IllegalStateException("Can not evaluate path");
    }

    @Test
    @Transactional
    void getSourceTranslations() {
        dbPopulator.populate("App");
        Repository app = repositoryService.findByName("App").orElseThrow(NotFoundException::new);

        Map<String, String> map = translationService.getSourceTranslations(app.getId(),
                PathDTO.fromFullPath("home.news.This_is_another_translation_in_news_folder"));
        assertThat(map.get("en")).isInstanceOf(String.class);
        map = translationService.getSourceTranslations(app.getId(),
                PathDTO.fromFullPath("Hello_world"));
        assertThat(map.get("en")).isInstanceOf(String.class);
    }

}
