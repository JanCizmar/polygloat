package com.polygloat.Assertions;

import org.springframework.test.web.servlet.MvcResult;

public class Assertions extends org.assertj.core.api.Assertions {
    public static ErrorMessageAssert assertErrorMessage(MvcResult mvcResult) {
        return new ErrorMessageAssert(mvcResult);
    }
}
