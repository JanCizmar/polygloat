package com.polygloat.dtos.request;

import com.polygloat.model.Permission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PermissionEditDto {
    private Long permissionId;
    private Permission.RepositoryPermissionType type;
}
