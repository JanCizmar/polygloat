package com.polygloat.service;

import com.polygloat.model.Permission;
import com.polygloat.model.Repository;
import com.polygloat.repository.PermissionRepository;
import com.polygloat.security.AuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final EntityManager entityManager;
    private final AuthenticationFacade authenticationFacade;

    public Set<Permission> getAllOfRepository(Repository repository) {
        return this.permissionRepository.getAllByRepositoryAndUserNotNull(repository);
    }

    public Optional<Permission> findById(Long id) {
        return permissionRepository.findById(id);
    }

    public void delete(Permission permission) {
        permissionRepository.delete(permission);
    }
}
