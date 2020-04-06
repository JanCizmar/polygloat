/// <reference types="cypress" />
import {login} from "./shared";

require('cypress-xpath');

context('Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    it('Will login', () => {
        login();
    });
});
