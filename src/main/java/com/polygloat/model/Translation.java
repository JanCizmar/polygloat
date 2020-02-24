package com.polygloat.model;

import lombok.*;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"source_id", "language_id"}),
})
@Data
public class Translation extends AuditModel {
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Field
    @EqualsAndHashCode.Include
    @Column(columnDefinition = "text")
    private String text;

    @ManyToOne
    private Source source;

    @ManyToOne
    private Language language;

}
