package com.polygloat.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
public class Repository {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "repository")
    private Set<Language> languages;

    @OneToMany(mappedBy = "repository", fetch = FetchType.EAGER)
    private Set<Source> sources;

    @ManyToOne
    private UserAccount createdBy;

    @OneToMany(mappedBy = "repository")
    private Set<Permission> permissions;

    @OneToMany(mappedBy = "repository")
    private Set<Folder> folders;

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

    public Set<Language> getLanguages() {
        return languages;
    }

    public void setLanguages(Set<Language> languages) {
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

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Source> getSources() {
        return sources;
    }

    public void setSources(Set<Source> sources) {
        this.sources = sources;
    }

    /**
     * !! this returns all folders of repository, not just child folders
     *
     * @return All repository folders
     */
    public Set<Folder> getFolders() {
        return folders;
    }

    public Set<Folder> getChildFolders() {
        return folders.stream().filter(f -> f.getParent() == null).collect(Collectors.toSet());
    }

    public void setFolders(Set<Folder> folders) {
        this.folders = folders;
    }

    public Optional<Language> getLanguage(String abbreviation) {
        return this.getLanguages().stream()
                .filter(l -> l.getAbbreviation()
                        .equals(abbreviation))
                .findFirst();
    }

    public Set<Source> getChildSources() {
        return this.getSources().stream().filter(s -> s.getFolder() == null).collect(Collectors.toSet());
    }
}
