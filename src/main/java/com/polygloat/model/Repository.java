package com.polygloat.model;

import lombok.*;
import org.hibernate.annotations.Where;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "created_by_id"}),
})
@Where(clause = "deleted = 'false'")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString(of={"id", "name"})
public class Repository extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "repository")
    private Set<Language> languages = new LinkedHashSet<>();

    @ManyToOne
    private UserAccount createdBy;

    @OneToMany(mappedBy = "repository")
    private Set<Permission> permissions = new LinkedHashSet<>();

    @NotBlank
    @Size(min = 3, max = 500)
    private String name;

    private String description;

    private boolean deleted = false;

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
