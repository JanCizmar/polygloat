package com.polygloat.controllers;

import com.polygloat.model.UserAccount;
import org.junit.jupiter.api.BeforeEach;

public abstract class LoggedControllerTest extends AbstractControllerTest {
    UserAccount userAccount;

    @BeforeEach
    public void beforeEach() throws Exception {
        if (userAccount == null) {
            DefaultAuthenticationResult defaultAuthenticationResult = defaultLogin();
            LoggedRequestFactory.init(defaultAuthenticationResult.getToken());
            this.userAccount = defaultAuthenticationResult.getEntity();
        }
    }
}
