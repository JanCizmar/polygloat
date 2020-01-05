package com.polygloat.model;

import com.polygloat.dtos.PathDTO;
import com.polygloat.model.hooks.FileHooks;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "parent_id"}),
        @UniqueConstraint(columnNames = {"repository_id", "name", "materialized_path"})
})
@EntityListeners({FileHooks.class})
public class File extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @Getter
    @Setter
    private Source source;

    @Getter
    @Setter
    @Size(min = 1, max = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @Getter
    private File parent;

    @Setter
    @Getter
    @ManyToOne
    private Repository repository;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @Getter
    @Setter
    private Set<File> children = new LinkedHashSet<>();

    @Getter
    @Column(name = "materialized_path")
    private String materializedPath;

    @Transient
    @Getter
    @Setter
    private String oldName;

    @Transient
    @Getter
    @Setter
    private String oldMaterializedPath;

    public File() {
    }

    public File(String name, File parent, Repository repository) {
        this.name = name;
        this.setParent(parent);
        this.repository = repository;
    }

    public PathDTO getOldPath() {
        return PathDTO.fromPathAndName(oldMaterializedPath, oldName);
    }

    public PathDTO getPath() {
        if (this.isRoot()) {
            return null;
        }

        if (this.materializedPath == null) {
            throw new IllegalStateException("Path is not initialized yet");
        }
        return PathDTO.fromPathAndName(materializedPath, name);
    }

    public boolean isFolder() {
        return this.getSource() == null;
    }

    public File getChild(String name) {
        return this.getChildren().stream().filter(c -> c.getName().equals(name)).findFirst().orElse(null);
    }

    public void setParent(File parent) {
        this.parent = parent;
        materializedPath = createMaterializedPath();
    }

    private String createMaterializedPath() {

        //root has no path
        if (this.isRoot()) {
            return null;
        }

        //root's children have empty path
        if (this.parent.isRoot()) {
            return "";
        }

        return this.parent.getPath().getFullPathString();
    }

    public boolean isRoot() {
        return this.parent == null && this.getName() == null;
    }
}
