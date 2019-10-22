package com.polygloat.model;

import javax.persistence.*;
import java.util.List;

@Entity
public class Language extends AuditModel {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany
    private List<Translation> traslations;

    @ManyToOne
    private Repository repository;

    private String abbreviation;

    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Translation> getTraslations() {
        return traslations;
    }

    public void setTraslations(List<Translation> traslations) {
        this.traslations = traslations;
    }

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
