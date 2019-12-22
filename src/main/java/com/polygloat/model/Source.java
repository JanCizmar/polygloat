package com.polygloat.model;

import com.polygloat.DTOs.IPathItem;
import com.polygloat.DTOs.PathDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
public class Source extends AuditModel implements IPathItem {
    @Id
    @GeneratedValue
    @Getter
    @Setter
    private Long id;

    @OneToOne(mappedBy = "source", optional = false)
    @Getter
    @Setter
    private File file;

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE)
    @Getter
    @Setter
    private Set<Translation> translations = new HashSet<>();

    public Optional<Translation> getTranslation(String abbr) {
        return this.getTranslations().stream().filter(t -> t.getLanguage().getAbbreviation().equals(abbr)).findFirst();
    }

    public PathDTO getPath() {
        return PathDTO.fromPathAndName(this.getFile().getPath().getFullPath(), getFile().getName());
    }

    public String getText() {
        return getFile().getName();
    }
}
