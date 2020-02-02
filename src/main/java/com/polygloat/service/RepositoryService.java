package com.polygloat.service;

import com.polygloat.dtos.request.CreateRepositoryDTO;
import com.polygloat.dtos.request.EditRepositoryDTO;
import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.dtos.response.RepositoryDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.PermissionRepository;
import com.polygloat.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))

public class RepositoryService {

    private final RepositoryRepository repositoryRepository;
    private final EntityManager entityManager;
    private final LanguageService languageService;
    private final SecurityService securityService;
    private final PermissionRepository permissionRepository;

    @Transactional
    public Optional<Repository> findByName(String name, UserAccount userAccount) {
        return repositoryRepository.findByNameAndCreatedBy(name, userAccount);
    }

    @Transactional
    public Optional<Repository> findById(Long id) {
        return repositoryRepository.findById(id);
    }


    @Transactional
    public Repository createRepository(CreateRepositoryDTO dto, UserAccount createdBy) {
        Repository repository = new Repository();
        repository.setName(dto.getName());
        repository.setCreatedBy(createdBy);

        securityService.grantFullAccessToRepo(repository);

        for (LanguageDTO language : dto.getLanguages()) {
            languageService.createLanguage(language, repository);
        }

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


    @Transactional
    public Set<RepositoryDTO> findAllPermitted(UserAccount userAccount) {
        return permissionRepository.findAllByUser(userAccount).stream()
                .map(permission -> RepositoryDTO.fromEntityAndPermission(permission.getRepository(), permission))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @Transactional
    public void deleteRepository(Long id) {
        Repository repository = this.findById(id).orElseThrow(NotFoundException::new);
        repository.setDeleted(true);
        entityManager.persist(repository);
    }
}
