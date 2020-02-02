package com.polygloat.service;

import com.polygloat.dtos.request.SignUp;
import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserAccountService {
    private UserAccountRepository userAccountRepository;

    @Autowired
    public UserAccountService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public Optional<UserAccount> getByUserName(String username) {
        return userAccountRepository.findByUsername(username);
    }

    public Optional<UserAccount> get(Long id) {
        return userAccountRepository.findById(id);
    }

    public void createUser(UserAccount userAccount) {
        this.userAccountRepository.save(userAccount);
    }

    public UserAccount createUser(SignUp request) {
        String encodedPassword = encodePassword(request.getPassword());
        UserAccount account = UserAccount.builder()
                .name(request.getName())
                .username(request.getEmail())
                .password(encodedPassword).build();
        this.createUser(account);
        return account;
    }

    public UserAccount getImplicitUser() {
        final String username = "___implicit_user";
        return this.userAccountRepository.findByUsername(username).orElseGet(() -> {
            UserAccount account = UserAccount.builder().name("No auth user").username(username).role(UserAccount.Role.ADMIN).build();
            this.createUser(account);
            return account;
        });
    }

    public Optional<UserAccount> findByThirdParty(String type, String id) {
        return this.userAccountRepository.findByThirdPartyAuthTypeAndThirdPartyAuthId(type, id);
    }

    @Transactional
    public void setResetPasswordCode(UserAccount userAccount, String code) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        userAccount.setResetPasswordCode(bCryptPasswordEncoder.encode(code));
        userAccountRepository.save(userAccount);
    }

    @Transactional
    public void setUserPassword(UserAccount userAccount, String password) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        userAccount.setPassword(bCryptPasswordEncoder.encode(password));
        userAccountRepository.save(userAccount);
    }

    @Transactional
    public boolean isResetCodeValid(UserAccount userAccount, String code) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder.matches(code, userAccount.getResetPasswordCode());
    }

    @Transactional
    public void removeResetCode(UserAccount userAccount) {
        userAccount.setResetPasswordCode(null);
    }

    private String encodePassword(String rawPassword) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder.encode(rawPassword);
    }
}
