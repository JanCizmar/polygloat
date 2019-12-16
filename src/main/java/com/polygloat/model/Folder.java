package com.polygloat.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "repository_id", "parent_id"})
})
public class Folder extends AuditModel {
    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.REMOVE)
    private Set<Source> sourceTexts = new HashSet<>();

    @NotNull
    @NotBlank
    @Size(min = 1, max = 200)
    private String name;

    @ManyToOne
    private Repository repository;

    @ManyToOne
    private Folder parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<Folder> childFolders;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Source> getSourceTexts() {
        return sourceTexts;
    }

    public void setSourceTexts(Set<Source> sourceTexts) {
        this.sourceTexts = sourceTexts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public Folder getParent() {
        return parent;
    }

    public void setParent(Folder parent) {
        this.parent = parent;
    }

    public List<Folder> getChildFolders() {
        return childFolders;
    }

    public void setChildFolders(List<Folder> childFolders) {
        this.childFolders = childFolders;
    }

    public Optional<Source> getSource(String name) {
        return this.getSourceTexts().stream().filter(s -> s.getText().equals(name)).findFirst();
    }

    public ArrayList<String> getFullPath() {
        ArrayList<String> path = new ArrayList<>();
        Folder parent = this;
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

    public List<String> getPath() {
        LinkedList<String> fullPath = new LinkedList<>(getFullPath());
        fullPath.removeLast();
        return fullPath;
    }
}
