package com.polygloat.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
public class Translation extends AuditModel{
    @Id
    @GeneratedValue
    private Long id;

    @NotBlank
    @Size(min = 3, max = 100)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
