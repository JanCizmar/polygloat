package com.polygloat.service;

import com.polygloat.DTOs.FolderDTO;
import com.polygloat.DTOs.PathDTO;
import com.polygloat.development.DbPopulatorReal;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.RepositoryRepository;
import com.polygloat.repository.UserRepository;
import org.hibernate.Hibernate;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TranslationServiceTest {

    @Autowired
    TranslationService translationService;

    @Autowired
    FolderService folderService;

    @Test
    @Transactional
    void testGetViewData() {
        Map<String, Object> viewData = translationService.getViewData(new String[] {"en", "de"}, 2L);
        assertThat(viewData.get("en")).isInstanceOf(Map.class);
        //assertThat(((Map)viewData.get("en")).get("sampleApp"))
    }

    @Test
    @Transactional
    void viewDataContainingEmptyFolders() {
        folderService.setFolder(2L, new FolderDTO("aaa", "sampleApp"));
    }

    @Test
    @Transactional
    void getTranslations() {
        Map<String, Object> viewData = translationService.getTranslations(new String[] {"en", "de"}, 2L);
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

}
