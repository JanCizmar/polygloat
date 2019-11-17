package com.polygloat.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
public class Repository {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "repository")
    private List<Language> languages;

    @ManyToOne
    private UserAccount createdBy;

    @OneToMany(mappedBy = "repository")
    private List<Permission> permissions;

    @NotBlank
    @Size(min = 3, max = 500)
    private String name;

    public Repository() {
    }

    public Repository(UserAccount createdBy, @NotBlank @Size(min = 3, max = 500) String name, String description) {
        this.createdBy = createdBy;
        this.name = name;
        this.description = description;
    }

    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(List<Language> languages) {
        this.languages = languages;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserAccount getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserAccount createdBy) {
        this.createdBy = createdBy;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
}
