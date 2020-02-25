package com.polygloat.dtos.request;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.polygloat.constants.ApiScope;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class EditApiKeyDTO {
    @NotNull
    private Long id;

    @NotEmpty
    private Set<ApiScope> scopes;

    @JsonSetter("scopes")
    public void setScopes(@NotEmpty Set<String> scopes) {
        this.scopes = scopes.stream().map(ApiScope::fromValue).collect(Collectors.toSet());
    }
}
