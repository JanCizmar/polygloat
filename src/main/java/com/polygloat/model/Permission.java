package com.polygloat.model;

import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true, of = {"id"})
@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permission extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    private UserAccount user;

    @OneToOne
    private Invitation invitation;

    @ManyToOne
    private Repository repository;

    @Enumerated(EnumType.STRING)
    private RepositoryPermissionType type;

    @AllArgsConstructor
    public enum RepositoryPermissionType {
        VIEW(1),
        TRANSLATE(2),
        EDIT(3),
        MANAGE(4);

        @Getter
        private final int power;
    }
}
