/// <reference types="cypress" />
import {login} from "./shared";
import {getAnyContainingAriaLabelAttribute, getAnyContainingText} from "./xPath";

require('cypress-xpath');

context('Api keys', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/apiKeys');
        login();
    });

    it('Will add an api key', () => {
        cy.xpath(getAnyContainingText("Api Key:")).its("length").then(n => {
            cy.log(getAnyContainingAriaLabelAttribute("add"));
            cy.xpath(getAnyContainingAriaLabelAttribute("add")).click();
            cy.xpath(getAnyContainingText("generate", "button")).click();
            cy.xpath(getAnyContainingText("Api Key:")).its("length").should('be.greaterThan', n);
            cy.xpath(getAnyContainingText("Api Key:")).last().xpath("./../../..//*[@aria-label='delete']").click();
            cy.xpath(getAnyContainingText("confirm")).click();
        });
    })
});
