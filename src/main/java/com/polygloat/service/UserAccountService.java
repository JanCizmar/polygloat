package com.polygloat.service;

import com.polygloat.exceptions.NotFoundException;
import com.polygloat.model.UserAccount;
import com.polygloat.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public UserAccount getImplicitUser() {
        return this.userAccountRepository.findAll().stream().findFirst().orElseThrow(NotFoundException::new);
    }
}
