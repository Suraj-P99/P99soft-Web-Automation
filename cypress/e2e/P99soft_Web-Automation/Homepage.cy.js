const { it } = require("mocha");
require('cypress-xpath');

describe('P99Soft Homepage Tests', () => {
    it('should load the homepage and verify basic elements', () => {
        cy.visit('https://www.p99soft.com');
        cy.contains('Your IT Challenges, Our Expert Solutions'); 
    });

    it('should verify that the logo inside the header is visible', () => {
        cy.visit('https://www.p99soft.com');
        cy.get("img[alt='logo']")
          .should('be.visible')
          .and('have.attr', 'alt', 'logo');
    });

    it('should verify that the path element is visible', () => {    
        cy.visit('https://www.p99soft.com'); 
        cy.xpath('(//*[name()="path"])[12]')
          .should('be.visible');
    });

    //it('should verify a specific link works', () => {
       

   
});
