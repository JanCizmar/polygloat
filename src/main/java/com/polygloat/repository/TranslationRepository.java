package com.polygloat.repository;

import com.polygloat.model.Translation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    @EntityGraph(attributePaths = {"source.file.repository.languages",
            "source.file.parent.parent.parent.parent.parent"})
    @Query("from Translation t join fetch Source s on t.source = s join fetch File f on f.source = s " +
            "join fetch Repository r on r = f.repository " +
            "where t.source.file.repository.id = :repositoryId and t.language.abbreviation in :languages")
    Set<Translation> getTranslations(List<String> languages, Long repositoryId);
}
