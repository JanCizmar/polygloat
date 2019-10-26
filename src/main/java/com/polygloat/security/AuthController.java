package com.polygloat.security;

import com.polygloat.MessageConstants;
import com.polygloat.security.JwtTokenProvider;
import com.polygloat.security.payload.ApiResponse;
import com.polygloat.security.payload.JwtAuthenticationResponse;
import com.polygloat.security.payload.LoginRequest;
import com.polygloat.security.payload.ValidateTokenRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/public")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    
    @Autowired
    JwtTokenProvider tokenProvider;

    @SuppressWarnings({ "unchecked", "rawtypes" })
	@PostMapping("/generatetoken")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    	if(loginRequest.getUsername().isEmpty() || loginRequest.getPassword().isEmpty()) {
    		 return new ResponseEntity(new ApiResponse(false, MessageConstants.USERNAME_OR_PASSWORD_INVALID),
                     HttpStatus.BAD_REQUEST);
    	}
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        String jwt = tokenProvider.generateToken(authentication).toString();
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }
}
