package com.polygloat.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class UserAccount {
    @Id
    @GeneratedValue
    private int id;

    private String username;

    @OneToMany(mappedBy = "createdBy")
    private List<Repository> createdRepositories;

    @OneToMany(mappedBy = "user")
    private List<Permission> permissions;

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

    public List<Repository> getCreatedRepositories() {
        return createdRepositories;
    }

    public void setCreatedRepositories(List<Repository> createdRepositories) {
        this.createdRepositories = createdRepositories;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
}
