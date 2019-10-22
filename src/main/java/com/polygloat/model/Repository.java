package com.polygloat.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Repository {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany
    private List<Language> languages;

    private String name;

    private String description;
}
