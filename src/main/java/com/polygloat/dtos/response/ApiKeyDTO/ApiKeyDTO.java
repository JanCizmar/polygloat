package com.polygloat.dtos.response.ApiKeyDTO;

import com.polygloat.constants.ApiScope;
import com.polygloat.model.ApiKey;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@ApiModel
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyDTO {
    private Long id;

    @ApiModelProperty(value = "Resulting user's api key")
    private String key;

    private String userName;

    private Long repositoryId;

    private String repositoryName;

    private Set<String> scopes;

    public static ApiKeyDTO fromEntity(ApiKey apiKey) {
        return ApiKeyDTO.builder()
                .key(apiKey.getKey())
                .id(apiKey.getId())
                .userName(apiKey.getUserAccount().getName())
                .repositoryId(apiKey.getRepository().getId())
                .repositoryName(apiKey.getRepository().getName())
                .scopes(apiKey.getScopes().stream().map(ApiScope::getValue).collect(Collectors.toSet()))
                .build();
    }
}
