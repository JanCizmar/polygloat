package com.polygloat.model;

import com.polygloat.dtos.request.LanguageDTO;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"repository_id", "name"}),
        @UniqueConstraint(columnNames = {"repository_id", "abbreviation"})

})
@Where(clause = "deleted = 'false'")
public class Language extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "language")

    @Getter
    @Setter
    private Set<Translation> translations;

    @ManyToOne
    @Getter
    @Setter
    private Repository repository;

    @Getter
    @Setter
    private String abbreviation;

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    private boolean deleted = false;

    public static Language fromRequestDTO(LanguageDTO dto) {
        Language language = new Language();
        language.setName(dto.getName());
        language.setAbbreviation(dto.getAbbreviation());
        return language;
    }

    public void updateByDTO(LanguageDTO dto) {
        this.name = dto.getName();
        this.abbreviation = dto.getAbbreviation();
    }
}
