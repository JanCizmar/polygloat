package com.polygloat.security.controllers;

import com.polygloat.dtos.response.UserDTO;
import com.polygloat.security.AuthenticationFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {

    private final AuthenticationFacade authenticationFacade;

    @GetMapping("")
    public UserDTO getInfo() {
       return UserDTO.fromEntity(authenticationFacade.getUserAccount());
    }
}

