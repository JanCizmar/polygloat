package com.polygloat.service;

import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Language;
import com.polygloat.model.Repository;
import com.polygloat.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LanguageService {
    private LanguageRepository languageRepository;

    private EntityManager entityManager;

    @Autowired
    public LanguageService(LanguageRepository languageRepository,
                           EntityManager entityManager) {
        this.languageRepository = languageRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    public Language createLanguage(LanguageDTO dto, Repository repository) {
        Language language = Language.fromRequestDTO(dto);
        language.setRepository(repository);
        repository.getLanguages().add(language);
        entityManager.persist(language);
        return language;
    }

    @Transactional
    public void deleteLanguage(Long id) {
        Language language = languageRepository.findById(id).orElseThrow(NotFoundException::new);
        language.setDeleted(true);
    }

    @Transactional
    public Language editLanguage(LanguageDTO dto) {
        Language language = languageRepository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        language.updateByDTO(dto);
        entityManager.persist(language);
        return language;
    }

    @Transactional
    public Set<Language> findAll(Long repositoryId) {
        return new LinkedHashSet<>(languageRepository.findAllByRepositoryId(repositoryId));
    }

    public Optional<Language> findById(Long id) {
        return languageRepository.findById(id);
    }

    public Optional<Language> findByAbbreviation(String abbreviation, Repository repository) {
        return languageRepository.findByAbbreviationAndRepository(abbreviation, repository);
    }

    public Optional<Language> findByAbbreviation(String abbreviation, Long repositoryId) {
        return languageRepository.findByAbbreviationAndRepositoryId(abbreviation, repositoryId);
    }

    public Optional<Language> findByName(String name, Repository repository) {
        return languageRepository.findByNameAndRepository(name, repository);
    }

    public Set<String> getDefaultLanguagesForView(Repository repository) {
        return repository.getLanguages().stream().limit(2).map(Language::getAbbreviation).collect(Collectors.toSet());
    }
}
