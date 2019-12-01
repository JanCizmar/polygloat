package com.polygloat.repository;

import com.polygloat.model.Folder;
import com.polygloat.model.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SourceRepository extends JpaRepository<Source, Long> {
    Optional<Source> findSourceByFolderAndRepositoryAndText(Folder folder, com.polygloat.model.Repository repository, String text);
}
