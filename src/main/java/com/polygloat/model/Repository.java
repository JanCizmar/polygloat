package com.polygloat.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Entity
public class Repository {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "repository")
    private List<Language> languages;

    @OneToMany(mappedBy = "repository", fetch = FetchType.EAGER)
    private List<Source> sources;

    @ManyToOne
    private UserAccount createdBy;

    @OneToMany(mappedBy = "repository")
    private List<Permission> permissions;

    @OneToMany(mappedBy = "repository")
    private List<Folder> folders;

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

    public List<Source> getSources() {
        return sources;
    }

    public void setSources(List<Source> sources) {
        this.sources = sources;
    }

    /**
     * !! this returns all folders of repository, not just child folders
     *
     * @return All repository folders
     */
    public List<Folder> getFolders() {
        return folders;
    }

    public List<Folder> getChildFolders() {
        return folders.stream().filter(f -> f.getParent() == null).collect(Collectors.toList());
    }

    public void setFolders(List<Folder> folders) {
        this.folders = folders;
    }

    public Optional<Language> getLanguage(String abbreviation) {
        return this.getLanguages().stream()
                .filter(l -> l.getAbbreviation()
                        .equals(abbreviation))
                .findFirst();
    }
}
