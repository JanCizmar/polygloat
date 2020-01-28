package com.polygloat.constants;

import lombok.Getter;

public enum Message {
    THIRD_PARTY_AUTH_NO_EMAIL(),
    THIRD_PARTY_UNAUTHORIZED(),
    THIRD_PARTY_UNKNOWN_ERROR("third_party_auth_unknown_error"),
    THIRD_PARTY_AUTH_ERROR_MESSAGE(),
    USERNAME_OR_PASSWORD_INVALID(),
    BAD_CREDENTIALS(),
    USERNAME_ALREADY_EXISTS(), REGISTRATIONS_NOT_ALLOWED(), OPERATION_NOT_PERMITTED(),
    INVITATION_CODE_DOES_NOT_EXIST_OR_EXPIRED(),
    USER_ALREADY_HAS_PERMISSIONS();

    @Getter
    String code;

    Message(String code) {
        this.code = code;
    }

    Message() {
        this.code = this.name().toLowerCase();
    }
}
