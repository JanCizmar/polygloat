package com.polygloat.repository;

import com.polygloat.model.Translation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    //@Query("from Translation t join t.language l, t.source s where l.abbreviation = :abbr and s.")
    //List<Translation> getAllByLanguage(@Param("abbr") String abbr, @Param("repoId") int repositoryId);

    List<Translation> getAllByLanguageAbbreviationAndSourceRepositoryId(String language_abbreviation,
                                                                        Long repository_id);

    List<Translation> getAllByLanguageAbbreviationInAndSourceRepositoryIdOrderBySourceText(
            Collection<String> language_abbreviation,
            Long source_repository_id);

    List<Translation> getAllBySourceRepositoryIdAndSourceText(Long source_repository_id, String source_text);

    List<Translation> getAllBySourceRepositoryIdAndSourceTextIn(Long source_repository_id,
                                                                Collection<String> source_text);

    @EntityGraph(attributePaths = {"source.repository.folders"})
    @Query("from Translation t where t.language.abbreviation in :languages and t.source.repository.id = :repositoryId")
    Set<Translation> getTranslations(List<String> languages, Long repositoryId);
}
