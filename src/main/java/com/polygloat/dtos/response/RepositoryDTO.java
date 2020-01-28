package com.polygloat.dtos.response;

import com.polygloat.exceptions.InvalidStateException;
import com.polygloat.model.Permission;
import com.polygloat.model.Repository;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RepositoryDTO {
    Long id;

    String name;

    Permission.RepositoryPermissionType permissionType;

    public static RepositoryDTO fromEntity(Repository repository) {
        Permission permission = repository.getPermissions().stream().findAny().orElseThrow(InvalidStateException::new);
        return new RepositoryDTO(repository.getId(), repository.getName(), permission.getType());
    }
}
