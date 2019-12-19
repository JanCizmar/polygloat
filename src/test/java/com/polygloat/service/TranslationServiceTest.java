package com.polygloat.service;

import com.polygloat.DTOs.FolderDTO;
import com.polygloat.DTOs.PathDTO;
import com.polygloat.model.Folder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.LinkedList;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class TranslationServiceTest {

    @Autowired
    TranslationService translationService;

    @Autowired
    FolderService folderService;

    @Autowired
    EntityManager entityManager;

    @Test
    void testGetViewData() {
        Map<String, Object> viewData = translationService.getViewData(new String[]{"en", "de"}, 2L);
        assertThat(viewData.get("en")).isInstanceOf(Map.class);
        //assertThat(((Map)viewData.get("en")).get("sampleApp"))
    }

    @Test
    void viewDataContainingEmptyFolders() {
        Folder folder = folderService.setFolder(2L, new FolderDTO("aaa", "sampleApp"));

        TestTransaction.flagForCommit();
        TestTransaction.end();
        entityManager.clear();
        TestTransaction.start();

        Map<String, Object> viewData = translationService.getViewData(new String[]{"en", "de"}, 2L);
        Object o = evaluatePath(viewData, PathDTO.fromFullPath("en.sampleApp.aaa"));
        assertThat(o).isInstanceOf(Map.class);
        assertThat(((Map) o).size()).isEqualTo(0);
    }

    @Test
    @Transactional
    void getTranslations() {
        Map<String, Object> viewData = translationService.getTranslations(new String[]{"en", "de"}, 2L);
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
        Map<String, String> map = translationService.getSourceTranslations(2L,
                PathDTO.fromFullPath("home.news.This_is_another_translation_in_news_folder"));
        assertThat(map.get("en")).isInstanceOf(String.class);
        map = translationService.getSourceTranslations(2L,
                PathDTO.fromFullPath("Hello_world"));
        assertThat(map.get("en")).isInstanceOf(String.class);
    }

}
