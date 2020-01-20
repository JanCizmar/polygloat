package com.polygloat.security;

import com.polygloat.configuration.AppConfiguration;
import com.polygloat.model.UserAccount;
import com.polygloat.service.UserAccountService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFacade {
    private AppConfiguration configuration;
    private UserAccountService userAccountService;

    AuthenticationFacade(AppConfiguration configuration, UserAccountService userAccountService) {

        this.configuration = configuration;
        this.userAccountService = userAccountService;
    }

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public UserAccount getUserAccount() {
        if (!configuration.isAuthentication()) {
            return userAccountService.getImplicitUser();
        }

        return (UserAccount) this.getAuthentication().getPrincipal();

    }
}
