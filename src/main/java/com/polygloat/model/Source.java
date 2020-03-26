package com.polygloat.model;

import com.polygloat.dtos.PathDTO;
import lombok.*;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.IndexedEmbedded;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@EqualsAndHashCode(exclude = {"translations", "repository"}, callSuper = true)
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"repository_id", "name"}, name = "source_repository_id_name"),
})
public class Source extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Field
    //@Analyzer(impl = Analyzer.class)
    private String name;

    @ManyToOne
    @IndexedEmbedded(depth = 1)
    private Repository repository;

    @Builder.Default
    @IndexedEmbedded(includePaths = {"text"})
    @OneToMany(mappedBy = "source")
    private Set<Translation> translations = new HashSet<>();

    public Optional<Translation> getTranslation(String abbr) {
        return this.getTranslations().stream().filter(t -> t.getLanguage().getAbbreviation().equals(abbr)).findFirst();
    }

    public PathDTO getPath() {
        return PathDTO.fromFullPath(this.getName());
    }

}
