package com.polygloat.service;

import com.polygloat.repository.RepositoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;

@SpringBootTest
@Transactional
class SourceServiceTest {
    @Autowired
    FileService fileService;

    @Autowired
    RepositoryRepository repositoryRepository;

    @Test
    void findAllInRepository() {
        fileService.findAllInRepository(repositoryRepository.findById(3L).orElse(null),
                new HashSet<>(Arrays.asList("en", "de")));


    }
}
