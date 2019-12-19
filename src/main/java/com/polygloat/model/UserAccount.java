package com.polygloat.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class UserAccount {
    @Id
    @GeneratedValue
    private int id;

    private String username;

    @OneToMany(mappedBy = "createdBy")
    private Set<Repository> createdRepositories = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Permission> permissions;

    public UserAccount() {
    }

    public UserAccount(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Set<Repository> getCreatedRepositories() {
        return createdRepositories;
    }

    public void setCreatedRepositories(Set<Repository> createdRepositories) {
        this.createdRepositories = createdRepositories;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }
}
