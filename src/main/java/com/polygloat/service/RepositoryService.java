package com.polygloat.service;

import com.polygloat.model.Repository;
import com.polygloat.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RepositoryService {

    private RepositoryRepository repositoryRepository;

    @Autowired
    public RepositoryService(RepositoryRepository repositoryRepository) {
        this.repositoryRepository = repositoryRepository;
    }

    public Optional<Repository> findByName(String name) {
        return repositoryRepository.findByName(name);
    }

}
