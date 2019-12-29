package com.polygloat.service;

import com.polygloat.DTOs.request.CreateRepositoryDTO;
import com.polygloat.DTOs.request.EditRepositoryDTO;
import com.polygloat.DTOs.request.LanguageDTO;
import com.polygloat.Exceptions.NotFoundException;
import com.polygloat.model.File;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class RepositoryService {

    private RepositoryRepository repositoryRepository;
    private EntityManager entityManager;
    private LanguageService languageService;

    @Autowired
    public RepositoryService(RepositoryRepository repositoryRepository,
                             EntityManager entityManager,
                             LanguageService languageService) {
        this.repositoryRepository = repositoryRepository;
        this.entityManager = entityManager;
        this.languageService = languageService;
    }

    @Transactional
    public Optional<Repository> findByName(String name) {
        return repositoryRepository.findByName(name);
    }

    @Transactional
    public Optional<Repository> findById(Long id) {
        return repositoryRepository.findById(id);
    }


    @Transactional
    public Set<Repository> getRepositories(UserAccount userAccount) {
        return userAccount.getCreatedRepositories();
    }

    @Transactional
    public Repository createRepository(CreateRepositoryDTO dto, UserAccount createdBy) {
        Repository repository = new Repository();
        repository.setName(dto.getName());
        repository.setCreatedBy(createdBy);

        File root = new File();
        root.setRepository(repository);
        repository.setRootFolder(root);

        for (LanguageDTO language : dto.getLanguages()) {
            languageService.createLanguage(language, repository);
        }

        entityManager.persist(root);
        entityManager.persist(repository);
        return repository;
    }

    @Transactional
    public Repository editRepository(EditRepositoryDTO dto) {
        Repository repository = repositoryRepository.findById(dto.getRepositoryId())
                .orElseThrow(NotFoundException::new);
        repository.setName(dto.getName());
        entityManager.persist(repository);
        return repository;
    }

    public Set<Repository> findAll() {
        return new LinkedHashSet<>(repositoryRepository.findAll());
    }

    @Transactional
    public void deleteRepository(Long id) {
        Repository repository = this.findById(id).orElseThrow(NotFoundException::new);
        repository.setDeleted(true);
        entityManager.persist(repository);
    }

}
