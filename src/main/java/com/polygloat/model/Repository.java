package com.polygloat.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "created_by_id"}),
        @UniqueConstraint(columnNames = {"root_folder_id"}),
})
@Where(clause = "deleted = 0")
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "repository")
    private Set<Language> languages = new LinkedHashSet<>();

    @Getter
    @Setter
    @ManyToOne
    private UserAccount createdBy;

    @Getter
    @Setter
    @OneToMany(mappedBy = "repository")
    private Set<Permission> permissions;

    @Getter
    @Setter
    @OneToOne(optional = false)
    private File rootFolder;

    @Getter
    @Setter
    @OneToMany(mappedBy = "repository")
    private Set<File> files = new LinkedHashSet<>();

    @Getter
    @Setter
    @NotBlank
    @Size(min = 3, max = 500)
    private String name;

    @Getter
    @Setter
    private String description;

    @Getter
    @Setter
    private boolean deleted = false;

    public Repository() {
    }

    public Repository(UserAccount createdBy, @NotBlank @Size(min = 3, max = 500) String name, String description) {
        this.createdBy = createdBy;
        this.name = name;
        this.description = description;
    }

    public Optional<Language> getLanguage(String abbreviation) {
        return this.languages.stream()
                .filter(l -> l.getAbbreviation()
                        .equals(abbreviation))
                .findFirst();
    }
}
