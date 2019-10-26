package com.polygloat.model;

import javax.persistence.*;
@Entity
public class Translation extends AuditModel{
    @Id
    @GeneratedValue
    private Long id;

    @Column(columnDefinition = "text")
    private String text;

    @ManyToOne
    private Source source;

    @ManyToOne
    private Language language;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }
}
