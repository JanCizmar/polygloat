package com.polygloat.service;

import com.polygloat.constants.ApiScope;
import com.polygloat.exceptions.PermissionException;
import com.polygloat.model.Permission;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.PermissionRepository;
import com.polygloat.security.AuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SecurityService {
    private final AuthenticationFacade authenticationFacade;
    private final PermissionService permissionService;
    private final ApiKeyService apiKeyService;

    @Transactional
    public void grantFullAccessToRepo(UserAccount userAccount, Repository repository) {
        Permission permission = Permission.builder().type(Permission.RepositoryPermissionType.MANAGE).repository(repository).user(userAccount).build();
        permissionService.create(permission);
    }

    @Transactional
    public void grantFullAccessToRepo(Repository repository) {
        grantFullAccessToRepo(getActiveUser(), repository);
    }

    private Optional<Permission> getRepositoryPermission(Long repositoryId) {
        return permissionService.getRepositoryPermission(repositoryId, getActiveUser());
    }

    public Permission getAnyRepositoryPermission(Long repositoryId) {
        Optional<Permission> repositoryPermission = getRepositoryPermission(repositoryId);
        if (repositoryPermission.isEmpty()) {
            throw new PermissionException();
        }

        return repositoryPermission.get();
    }


    public Permission checkRepositoryPermission(Long repositoryId, Permission.RepositoryPermissionType requiredPermission) {
        Permission usersPermission = getAnyRepositoryPermission(repositoryId);
        if (requiredPermission.getPower() > usersPermission.getType().getPower()) {
            throw new PermissionException();
        }
        return usersPermission;
    }


    public void checkApiKeyScopes(Set<ApiScope> scopes, Repository repository) {
        if (!apiKeyService.getAvailableScopes(getActiveUser(), repository).containsAll(scopes)) {
            throw new PermissionException();
        }
    }

    private UserAccount getActiveUser() {
        return this.authenticationFacade.getUserAccount();
    }
}
