/// <reference types="cypress" />
import {createRepository, deleteRepository, host, login} from "./shared";
import {getAnyContainingText} from "./xPath";
import {clickAdd} from "./global";

require('cypress-xpath');

context('Api keys', () => {
    beforeEach(() => {
        cy.visit(host + '/apiKeys');
        login();
    });

    it('Will add an api key', () => {
        createRepository();
        cy.visit(host + '/apiKeys');
        create();
        cy.xpath(getAnyContainingText("Api Key:")).its("length").then(n => {
            create();
            cy.xpath(getAnyContainingText("Api Key:")).its("length").should('be.greaterThan', n);
            del();
        });
        del();
        deleteRepository("Repository");
    })
});


const create = () => {
    clickAdd();
    cy.xpath(getAnyContainingText("generate", "button")).click();
};

const del = () => {
    cy.xpath(getAnyContainingText("Api Key:")).last().xpath("./../../..//*[@aria-label='delete']").click();
    cy.xpath(getAnyContainingText("confirm")).click();
};