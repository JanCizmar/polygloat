package com.polygloat.repository;

import com.polygloat.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByAbbreviationAndRepository(String abbreviation, com.polygloat.model.Repository repository);

    Optional<Language> findByNameAndRepository(String name, com.polygloat.model.Repository repository);
}
