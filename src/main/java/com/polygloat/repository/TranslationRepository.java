package com.polygloat.repository;

import com.polygloat.model.Translation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    @EntityGraph(attributePaths = {"source.file.repository.languages",
            "source.file.parent.parent.parent.parent.parent"})
    @Query("from Translation t where t.source.file.repository.id = :repositoryId and t.language.abbreviation in :languages")
    Set<Translation> getTranslations(Set<String> languages, Long repositoryId);
}
