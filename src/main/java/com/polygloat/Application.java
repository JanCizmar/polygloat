package com.polygloat;

import com.polygloat.development.DbPopulatorReal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Application {

    @Value("${app.populate:true}")
    private boolean populate;

    @Autowired
    public Application(DbPopulatorReal populator) {
        if (populate) {
            populator.populate();

        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
