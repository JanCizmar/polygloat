package com.polygloat.repository;

import com.polygloat.model.Language;
import com.polygloat.model.Source;
import com.polygloat.model.Translation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    @Query("from Translation t where t.source.repository.id = :repositoryId and t.language.abbreviation in :languages")
    Set<Translation> getTranslations(Set<String> languages, Long repositoryId);

    @Query("from Translation t join fetch Source s on t.source = s where s = :source and s.repository = :repository and t.language.abbreviation in :languages")
    Set<Translation> getTranslations(Source source, com.polygloat.model.Repository repository, Collection<String> languages);

    Optional<Translation> findOneBySourceAndLanguage(Source source, Language language);
}
