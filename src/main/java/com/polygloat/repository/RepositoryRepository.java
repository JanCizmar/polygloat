package com.polygloat.repository;

import com.polygloat.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashSet;
import java.util.Optional;

@Repository
public interface RepositoryRepository extends JpaRepository<com.polygloat.model.Repository, Long> {
    Optional<com.polygloat.model.Repository> findByNameAndCreatedBy(String name, UserAccount userAccount);

    LinkedHashSet<com.polygloat.model.Repository> findAllByCreatedBy(UserAccount userAccount);
}
