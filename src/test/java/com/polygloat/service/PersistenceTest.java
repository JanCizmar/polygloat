package com.polygloat.service;

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
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TranslationServiceTest {

    @Autowired
    TranslationService translationService;

    @Test
    @Transactional
    void testGetViewData() {
        Map<String, Object> viewData = translationService.getViewData(new String[]{"en", "de"}, 2L);
        assertThat(viewData.get("en")).isInstanceOf(Map.class);
    }

    @Test
    @Transactional
    void getTranslations() {
        Map<String, Object> viewData = translationService.getTranslations(new String[]{"en", "de"}, 2L);
        assertThat(viewData.get("en")).isInstanceOf(Map.class);
    }

}
