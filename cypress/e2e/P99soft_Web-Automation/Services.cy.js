const { it } = require("mocha");
require('cypress-xpath');

describe('P99Soft Homepage Tests', () => {
    it('should load the homepage and verify basic elements', () => {
        cy.visit('https://www.p99soft.com');
    })
    it('should verify that the path element is visible', () => {    
        cy.visit('https://www.p99soft.com'); 
        cy.xpath('(//*[name()="path"])[12]')
          .should('be.visible');
    });

    it('should verify that the service tab on the header is visible', () => {
        cy.visit('https://www.p99soft.com');
        cy.xpath('(//a[@class="elementor-item"])')
          .should('be.visible');
    })
    it('Service tab Drop-Downs', () => {
        cy.visit('https://www.p99soft.com');
        cy.wait(2000); 
        cy.get('.elementor-widget-nav-menu.vamtam-has-theme-widget-styles.vamtam-menu-indicator')
          .should('be.visible');
    
        cy.get('ul.elementor-nav-menu > li[class*=mega-menu]').then(($elements) => {
            console.log($elements);
    });
    
        cy.get('a.elementor-item')
          .contains('Digital Transformation')
          .should('be.visible')
          .click(); 
     
        
})
})