/// <reference types="cypress" />
require('cypress-xpath');

export const login = () => {
    cy.xpath('//input[@name="username"]')
        .type('ben@ben.cz').should('have.value', 'ben@ben.cz');
    cy.xpath('//input[@name="password"]')
        .type('ben').should('have.value', 'ben');
    cy.xpath("//span[contains(text(), 'Login')]").click();
};