package com.polygloat.service;

import com.polygloat.constants.ApiScope;
import com.polygloat.dtos.request.CreateRepositoryDTO;
import com.polygloat.dtos.request.EditRepositoryDTO;
import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.dtos.response.RepositoryDTO;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.ApiKey;
import com.polygloat.model.Repository;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.ApiKeyRepository;
import com.polygloat.repository.PermissionRepository;
import com.polygloat.repository.RepositoryRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.Scope;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final PermissionService permissionService;
    private final SecureRandom random;

    public String createApiKey(UserAccount userAccount, Set<ApiScope> scopes, Repository repository) {
        ApiKey apiKey = ApiKey.builder().key(new BigInteger(130, random).toString(32)).userAccount(userAccount).build();
        apiKeyRepository.save(apiKey);
        return apiKey.getKey();
    }

    public Set<ApiKey> getAllByUser(UserAccount userAccount) {
        return apiKeyRepository.getAllByUserAccount(userAccount);
    }

    public Set<ApiKey> getAllByRepository(Long repositoryId) {
        return apiKeyRepository.getAllByRepositoryId(repositoryId);
    }

    public Optional<ApiKey> getApiKey(String apiKey) {
        return apiKeyRepository.findByKey(apiKey);
    }

    public void deleteApiKey(ApiKey apiKey) {
        apiKeyRepository.delete(apiKey);
    }

    public Set<ApiScope> getAvailableScopes(UserAccount userAccount, Repository repository) {
        return Arrays.stream(
                permissionService.getRepositoryPermission(repository.getId(), userAccount).orElseThrow(NotFoundException::new).getType().getAvailableScopes()
        ).collect(Collectors.toSet());
    }
}
