package com.polygloat.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity
public class Source extends AuditModel {
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
        ArrayList<String> path = new ArrayList<>();
        Folder parent = this.getFolder();
        int nesting = 0;
        while (parent != null) {
            if (nesting >= 1000) {
                throw new RuntimeException("Nesting limit exceeded.");
            }
            path.add(parent.getName());
            parent = parent.getParent();
            nesting++;
        }
        Collections.reverse(path);
        return path;
    }
}
