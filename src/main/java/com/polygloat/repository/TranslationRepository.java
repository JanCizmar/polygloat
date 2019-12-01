package com.polygloat.repository;

import com.polygloat.model.Translation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {

    //@Query("from Translation t join t.language l, t.source s where l.abbreviation = :abbr and s.")
    //List<Translation> getAllByLanguage(@Param("abbr") String abbr, @Param("repoId") int repositoryId);

    List<Translation> getAllByLanguageAbbreviationAndSourceRepositoryId(String language_abbreviation,
                                                                        Long repository_id);

    List<Translation> getAllByLanguageAbbreviationInAndSourceRepositoryId(Collection<String> language_abbreviation,
                                                                          Long source_repository_id);

    List<Translation> getAllBySourceRepositoryIdAndSourceText(Long source_repository_id, String source_text);

    List<Translation> getAllBySourceRepositoryIdAndSourceTextIn(Long source_repository_id,
                                                                Collection<String> source_text);
}
