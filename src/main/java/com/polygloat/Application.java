package com.polygloat;

import com.polygloat.development.DbPopulatorReal;
import io.sentry.Sentry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Application {
    @Autowired
    public Application(DbPopulatorReal populator,
                       @Value("${app.populate:true}") boolean populate,
                       @Value("${sentry.enabled:false}") boolean sentry,
                       @Value("${sentry.dsn:null}") String sentryDSN) {
        if (populate) {
            populator.autoPopulate();
        }
        if (sentry) {
            Sentry.init(sentryDSN);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
