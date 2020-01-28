package com.polygloat.dtos.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
public class SignUp {
    @NotBlank
    String name;

    @Email
    String email;

    @Min(8)
    @Max(100)
    String password;
}
