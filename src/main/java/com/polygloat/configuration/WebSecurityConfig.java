package com.polygloat.configuration;

import com.polygloat.security.JwtTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private JwtTokenFilter jwtTokenFilter;
    private AppConfiguration configuration;

    @Autowired
    public WebSecurityConfig(JwtTokenFilter jwtTokenFilter, AppConfiguration configuration) {
        this.jwtTokenFilter = jwtTokenFilter;
        this.configuration = configuration;
    }

    @Value("${spring.ldap.embedded.port:#{null}}")
    private Integer embeddedLdapPort;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        if (configuration.isAuthentication()) {
            http
                    .csrf().disable().cors().and()
                    //if jwt token is provided in header, this filter will manualy authorize user, so the request is not gonna reach the ldap auth
                    .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                    .authorizeRequests()
                    .antMatchers("/api/public/**").permitAll()
                    .anyRequest().authenticated()
                    .and().sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();
            return;
        }

        http
                .csrf().disable()
                .cors().and()
                .authorizeRequests().anyRequest().permitAll();
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        if (configuration.isLdapAuthentication()) {
            auth
                    .ldapAuthentication()
                    .contextSource()
                    .url(configuration.getLdapUrls() + configuration.getLdapBaseDn())
                    .managerDn(configuration.getLdapSecurityPrincipal())
                    .managerPassword(configuration.getLdapPrincipalPassword())
                    .and()
                    .userDnPatterns(configuration.getLdapUserDnPattern());
            return;
        }
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
