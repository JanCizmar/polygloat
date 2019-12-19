package com.polygloat.model;

import com.polygloat.DTOs.IPathItem;
import com.polygloat.DTOs.PathDTO;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.*;

@Entity
public class Source extends AuditModel implements IPathItem {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Repository repository;

    @ManyToOne
    private Folder folder;

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE)
    private Set<Translation> translations = new HashSet<>();

    @NotNull
    @NotBlank
    @Pattern(regexp = "^[^.]*$")
    private String text;

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Folder getFolder() {
        return folder;
    }

    public void setFolder(Folder folder) {
        this.folder = folder;
    }

    public Optional<Translation> getTranslation(String abbr) {
        return this.getTranslations().stream().filter(t -> t.getLanguage().getAbbreviation().equals(abbr)).findFirst();
    }

    public Set<Translation> getTranslations() {
        return translations;
    }

    public void setTranslations(Set<Translation> translations) {
        this.translations = translations;
    }

    public List<String> getPath() {
        if (this.getFolder() == null) {
            return new LinkedList<>();
        }
        return this.getFolder().getFullPath();
    }

    @Override
    public PathDTO getPathObject() {
        return PathDTO.fromPathAndName(getPath(), getText());
    }
}
