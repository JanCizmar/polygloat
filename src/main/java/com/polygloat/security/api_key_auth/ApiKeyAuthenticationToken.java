package com.polygloat.security.api_key_auth;

import com.polygloat.model.ApiKey;
import lombok.EqualsAndHashCode;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Collections;

@EqualsAndHashCode(callSuper = true)
public class ApiKeyAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private ApiKey apiKey;

    public ApiKeyAuthenticationToken(ApiKey apiKey) {
        super(apiKey.getUserAccount(), null, Collections.singleton(() -> "api"));
        this.apiKey = apiKey;
    }

    public ApiKey getApiKey() {
        return apiKey;
    }
}
