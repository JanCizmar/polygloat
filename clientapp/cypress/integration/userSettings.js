/// <reference types="cypress" />
import {login} from "./shared";
import {getAnyContainingText} from "./xPath";

require('cypress-xpath');

context('Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
        login();
    });

    it('Will access api keys', () => {
        cy.xpath("//*[@aria-controls='user-menu']").click();
        cy.xpath(getAnyContainingText("Api keys")).click();

    });

});
