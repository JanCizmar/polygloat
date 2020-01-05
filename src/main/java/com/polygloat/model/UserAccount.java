package com.polygloat.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
})
public class UserAccount extends AuditModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String username;

    @OneToMany(mappedBy = "createdBy")
    @Getter
    @Setter
    private Set<Repository> createdRepositories = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @Getter
    @Setter
    private Set<Permission> permissions;

    public UserAccount() {
    }

    public UserAccount(String username) {
        this.username = username;
    }

}
