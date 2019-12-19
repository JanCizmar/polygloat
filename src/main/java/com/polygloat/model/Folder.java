package com.polygloat.model;

import com.polygloat.DTOs.IPathItem;
import com.polygloat.DTOs.PathDTO;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "repository_id", "parent_id"})
})
public class Folder extends AuditModel implements IPathItem, IFolder {
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
    private Set<Folder> childFolders;

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

    @Override
    public Set<Source> getChildSources() {
        return this.getSourceTexts();
    }

    public Set<Folder> getChildFolders() {
        return childFolders;
    }

    public void setChildFolders(Set<Folder> childFolders) {
        this.childFolders = childFolders;
    }

    public ArrayList<String> getFullPath() {
        ArrayList<String> path = new ArrayList<>();
        Folder sParent = this;
        int nesting = 0;
        while (sParent != null) {
            if (nesting >= 1000) {
                throw new RuntimeException("Nesting limit exceeded.");
            }
            path.add(sParent.getName());
            sParent = sParent.getParent();
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

    @Override
    public PathDTO getPathObject() {
        return PathDTO.fromFullPath(getFullPath());
    }
}
