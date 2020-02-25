package com.polygloat.controllers;

import com.polygloat.dtos.request.LanguageDTO;
import com.polygloat.model.UserAccount;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static com.polygloat.controllers.LoggedRequestFactory.loggedPost;

public abstract class SignedInControllerTest extends AbstractControllerTest {
    UserAccount userAccount;

    @BeforeEach
    public void beforeEach() throws Exception {
        if (userAccount == null) {
            DefaultAuthenticationResult defaultAuthenticationResult = defaultLogin();
            LoggedRequestFactory.init(defaultAuthenticationResult.getToken());
            this.userAccount = defaultAuthenticationResult.getEntity();
        }
    }

    public ResultActions performPost(String url, Object content) throws Exception {
        return mvc.perform(loggedPost(url).contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)));
    }
}
