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

    @Value("${spring.ldap.embedded.port}")
    private String ldapPort;

    //Getting values from properties file
    @Value("${polygloat.ldap.url}")
    private String ldapUrls;
    @Value("${polygloat.ldap.base.dn}")
    private String ldapBaseDn;
    @Value("${polygloat.ldap.username}")
    private String ldapSecurityPrincipal;
    @Value("${polygloat.ldap.password}")
    private String ldapPrincipalPassword;
    @Value("${polygloat.ldap.user.dn-pattern}")
    private String ldapUserDnPattern;
    @Value("${polygloat.ldap.enabled}")
    private String ldapEnabled;

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
        auth
                .ldapAuthentication()
                .contextSource()
                .url(ldapUrls + ldapBaseDn)
                .managerDn(ldapSecurityPrincipal)
                .managerPassword(ldapPrincipalPassword)
                .and()
                .userDnPatterns(ldapUserDnPattern);
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
