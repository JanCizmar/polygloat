package com.polygloat.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
public class Folder extends AuditModel {
    @Id
    @GeneratedValue
    private Long id;

    @OneToMany
    private List<Source> sourceTexts;

    @NotBlank
    @Size(min = 1, max = 200)
    private String name;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Source> getSourceTexts() {
        return sourceTexts;
    }

    public void setSourceTexts(List<Source> sourceTexts) {
        this.sourceTexts = sourceTexts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
