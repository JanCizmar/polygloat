/// <reference types="cypress" />
import {getAnyContainingText, getInput} from "./xPath";
import {clickAdd} from "./global";

require('cypress-xpath');

export const host = process.env.host || "http://localhost:8080";
export const defaultUsername = process.env.defaultUsername || "admin";
export const defaultPassword = process.env.defaultPassword || "admin";

export const login = (username = defaultUsername, password = defaultPassword) => {
    cy.xpath('//input[@name="username"]')
        .type(username).should('have.value', username);
    cy.xpath('//input[@name="password"]')
        .type(password).should('have.value', password);
    cy.xpath("//span[contains(text(), 'Login')]").click();
    cy.xpath(getAnyContainingText("Login")).should("not.be.visible");
};

export const createRepository = (name = "Repository", languages = [{name: "English", abbreviation: "en"}]) => {
    cy.visit(host + "/repositories");
    clickAdd();
    cy.xpath(getInput("name")).type(name);
    cy.xpath(getInput("languages.0.name")).type(languages[0].name);
    cy.xpath(getInput("languages.0.abbreviation")).type(languages[0].abbreviation);
    cy.xpath(getAnyContainingText("SAVE")).click();
};

export const deleteRepository = (name = "Repository") => {
    cy.visit(host + "/repositories");
    cy.xpath(getAnyContainingText(name)).click();
    cy.xpath(getAnyContainingText("Delete repository")).click();
};