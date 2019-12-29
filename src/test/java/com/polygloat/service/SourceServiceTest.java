package com.polygloat.service;

import com.polygloat.repository.RepositoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class SourceServiceTest {
    @Autowired
    FileService fileService;

    @Autowired
    RepositoryRepository repositoryRepository;

    @Test
    void findAllInRepository() {
        fileService.getDataForView(repositoryRepository.findById(3L).orElse(null),
                new HashSet<>(Arrays.asList("en", "de")));

    }
}
