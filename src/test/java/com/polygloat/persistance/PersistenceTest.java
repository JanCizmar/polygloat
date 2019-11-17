package com.polygloat.persistance;

import com.polygloat.development.DbPopulator;
import com.polygloat.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class PersistenceTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TranslationRepository translationRepository;

    @Autowired
    SourceRepository sourceRepository;

    @Autowired
    RepositoryRepository repositoryRepository;

    @Autowired
    LanguageRepository languageRepository;

    @Autowired
    FolderRepository folderRepository;

    @Autowired
    DbPopulator populator;

    @Test
    public void testPopulateDb() {
        populator.populate();
    }

}
