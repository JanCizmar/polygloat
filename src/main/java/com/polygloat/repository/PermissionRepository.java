package com.polygloat.repository;

import com.polygloat.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashSet;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    LinkedHashSet<Permission> findAllByRepositoryIdAndUserId(Long repositoryId, Long userId);

    LinkedHashSet<Permission> getAllByRepositoryAndUserNotNull(com.polygloat.model.Repository repository);
}
