package com.polygloat.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private int id;

    @Getter
    @Setter
    private String username;

    @OneToMany(mappedBy = "createdBy")
    @Getter
    @Setter
    private Set<Repository> createdRepositories = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @Getter
    @Setter
    private Set<Permission> permissions;

    public UserAccount() {
    }

    public UserAccount(String username) {
        this.username = username;
    }

}
