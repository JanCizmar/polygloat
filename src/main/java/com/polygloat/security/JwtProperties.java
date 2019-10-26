package com.polygloat.security;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtProperties {
    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    public Key getKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public int getJwtExpirationInMs() {
        return jwtExpirationInMs;
    }
}
