import {getAnyContainingAriaLabelAttribute} from "./xPath";

export const clickAdd = () => {
    cy.xpath(getAnyContainingAriaLabelAttribute("add")).click();
};