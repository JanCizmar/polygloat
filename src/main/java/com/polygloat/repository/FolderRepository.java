package com.polygloat.repository;

import com.polygloat.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> getAllByRepositoryIdAndParentId(Long repository_id, Long parent_id);

    Set<Folder> getAllByRepositoryId(Long repositoryId);
}
