package com.polygloat.dtos.response.ApiKeyDTO;

import com.polygloat.model.ApiKey;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiKeyDTO {
    private Long id;

    private String key;

    private String userName;

    public static ApiKeyDTO fromEntity(ApiKey apiKey) {
        return ApiKeyDTO.builder().key(apiKey.getKey()).id(apiKey.getId()).userName(apiKey.getUserAccount().getName()).build();
    }
}
