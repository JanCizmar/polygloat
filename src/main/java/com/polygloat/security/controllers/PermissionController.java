package com.polygloat.security.controllers;

import com.polygloat.dtos.response.PermissionDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.Permission;
import com.polygloat.model.Repository;
import com.polygloat.service.PermissionService;
import com.polygloat.service.RepositoryService;
import com.polygloat.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/permission")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PermissionController {

    private final SecurityService securityService;
    private final RepositoryService repositoryService;
    private final PermissionService permissionService;

    @GetMapping("/list/{repositoryId}")
    public Set<PermissionDTO> getRepositoryPermissions(@PathVariable("repositoryId") Long id) {
        Repository repository = repositoryService.findById(id).orElseThrow(NotFoundException::new);
        securityService.checkManageRepositoryPermission(id);
        return permissionService.getAllOfRepository(repository).stream().map(PermissionDTO::fromEntity).collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @DeleteMapping("/{permissionId}")
    public void deletePermission(@PathVariable("permissionId") Long id) {
        Permission permission = permissionService.findById(id).orElseThrow(NotFoundException::new);
        securityService.checkManageRepositoryPermission(permission.getRepository().getId());
        permissionService.delete(permission);
    }
}

