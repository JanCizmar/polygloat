package com.polygloat.model;

import com.polygloat.DTOs.PathDTO;
import com.sun.istack.Nullable;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "parent_id"})
})
public class File extends AuditModel {
    @Id
    @GeneratedValue
    @Getter
    @Setter
    private Long id;

    @OneToOne
    @Getter
    @Setter
    private Source source;

    @Nullable
    @Getter
    @Setter
    @Size(min = 1, max = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @Getter
    @Setter
    private File parent;

    @Setter
    @Getter
    @ManyToOne
    private Repository repository;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @Getter
    @Setter
    private Set<File> children;

    public PathDTO getPath() {
        ArrayList<String> path = new ArrayList<>();
        File sParent = this;
        int nesting = 0;
        while (sParent != null && sParent.getName() != null) {
            if (nesting >= 1000) {
                throw new RuntimeException("Nesting limit exceeded.");
            }
            path.add(sParent.getName());
            sParent = sParent.getParent();
            nesting++;
        }
        Collections.reverse(path);
        return PathDTO.fromFullPath(path);
    }

    public Optional<File> evaluatePath(PathDTO pathDTO) {
        LinkedList<String> fullPath = pathDTO.getFullPath();
        if (pathDTO.getFullPath().isEmpty()) {
            return Optional.of(this);
        }

        String itemName = fullPath.removeFirst();
        File file = this.children.stream().filter(f -> f.getName()
                .equals(itemName)).findFirst().orElse(null);

        if (file == null) {
            return Optional.empty();
        }

        return file.evaluatePath(PathDTO.fromFullPath(fullPath));
    }

    public boolean isFolder() {
        return this.getSource() == null;
    }

    public File getChild(String name) {
        return this.getChildren().stream().filter(c -> c.getName().equals(name)).findFirst().orElse(null);
    }
}
