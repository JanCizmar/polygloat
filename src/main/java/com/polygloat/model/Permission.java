package com.polygloat.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Permission {
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    private UserAccount user;

    @ManyToOne
    private Repository repository;

    private boolean canView;

    private boolean canSuggest;

    private boolean canEdit;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserAccount getUser() {
        return user;
    }

    public void setUser(UserAccount user) {
        this.user = user;
    }

    public Repository getRepository() {
        return repository;
    }

    public void setRepository(Repository repository) {
        this.repository = repository;
    }

    public boolean isCanView() {
        return canView;
    }

    public void setCanView(boolean canView) {
        this.canView = canView;
    }

    public boolean isCanSuggest() {
        return canSuggest;
    }

    public void setCanSuggest(boolean canSuggest) {
        this.canSuggest = canSuggest;
    }

    public boolean isCanEdit() {
        return canEdit;
    }

    public void setCanEdit(boolean canEdit) {
        this.canEdit = canEdit;
    }
}
