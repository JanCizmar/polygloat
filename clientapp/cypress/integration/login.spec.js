/// <reference types="cypress" />
import {host, login} from "./shared";

require('cypress-xpath');

context('Login', () => {
    beforeEach(() => {
        cy.visit(host);
    });

    it('Will login', () => {
        login();
    });
});
