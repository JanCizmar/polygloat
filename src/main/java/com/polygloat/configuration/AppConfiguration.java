package com.polygloat.configuration;


import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class AppConfiguration {

    @Value("${polygloat.authentication:true}")
    private boolean authentication;
}
