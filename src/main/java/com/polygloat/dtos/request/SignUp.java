package com.polygloat.dtos.request;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class SignUp {
    @NotBlank
    String name;

    @Email
    @NotBlank
    String email;

    @Length(min = 8, max = 100)
    @NotBlank
    String password;

    String invitationCode;
}