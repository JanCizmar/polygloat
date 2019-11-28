package com.polygloat;

import com.polygloat.development.DbPopulatorReal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Application {


    private static ConfigurableApplicationContext ctx;

    @Autowired
    public Application(DbPopulatorReal populator) {
        //populator.populate();
    }

    public static void main(String[] args) {
        ctx = SpringApplication.run(Application.class, args);
        //SpringApplication.exit(ctx);
    }

}
