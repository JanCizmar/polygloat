package com.polygloat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryRepository extends JpaRepository<com.polygloat.model.Repository, Long> {
    Optional<com.polygloat.model.Repository> findByName(String name);
}
