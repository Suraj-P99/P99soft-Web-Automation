const { it } = require("mocha");
require('cypress-xpath');

describe('P99Soft Automation Tests', () => {

  // before(() => {
  //    cy.task('Slack_Notify',{message: 'Starting tests for P99Soft website...'});
  //  });

  // afterEach(function () {
  //   const status = this.currentTest.state;
  //   const message = `Test ${this.currentTest.title} ${status === 'passed' ? 'passed' : 'failed'}`;
  //   cy.task('Slack_Notify', { message });
  // });

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

  // Services tab
  it('should verify that the service tab on the header is visible', () => {
    cy.visit('https://www.p99soft.com');
    cy.xpath('(//a[@class="elementor-item"])')
      .should('be.visible');
  });

  // Company tab
  it('should verify that the company tab is visible', () => {
    cy.visit('https://www.p99soft.com');
    cy.xpath('//a[@id="sm-1724310930254137-3"]').first()
    .should('be.visible');

  });

 
  it('should verify that the Case Studies tab is visible', () => {
    cy.visit('https://www.p99soft.com');
    cy.xpath('(//a[@class="elementor-item"])[26]')
      .should('be.visible');
  });

  // Blog tab
  it('should verify that the Blog tab is visible', () => {
    cy.visit('https://www.p99soft.com');
    cy.xpath('(//a[@class="elementor-item"])[27]')
      .should('be.visible');
  });

  // Resources tab
  it('should verify that the Resources tab is visible', () => {
    cy.visit('https://www.p99soft.com');
    //cy.xpath('(//a[@id="sm-17242165347422874-5"])[1]')
    cy.xpath('(//a[contains(@class, "elementor-item") and contains(@class, "elementor-item-anchor") and contains(@class, "has-submenu") and contains(@class, "highlighted") and @aria-haspopup="true" and @aria-expanded="true"])', { timeout: 10000 }) // Increase timeout to 10 seconds
  .should('be.visible');

  });

  // Careers tab
  it('should verify that the Careers tab is visible', () => {
    cy.visit('https://www.p99soft.com');
    cy.xpath('(//a[@class="elementor-item elementor-item-active"])[6]')
      .should('be.visible');
  });

  // Contact tab
  it('should verify that the Contact tab is visible', () => {
    cy.visit('https://www.p99soft.com');
    cy.xpath('(//span[@class="elementor-button-text"])[3]')
      .should('be.visible');
  });

});
//       after(() => {
//       cy.task('Slack_Notify', 'Tests for P99Soft website completed.');
//       sendSlackNotification(message);

// })



      //  it('should navigate to the Contact page and verify form elements', () => {
  //    // Click on the 'Contact' link in the navigation
  //    cy.get('a[href="/contact"]').click();
    
  //    // Verify the URL includes '/contact'
  //    cy.url().should('include', '/contact');

  //    // Verify the presence of form elements
  //    cy.get('input[name="name"]').should('be.visible');
  //    cy.get('input[name="email"]').should('be.visible');
  //    cy.get('textarea[name="message"]').should('be.visible');
  //    cy.get('button[type="submit"]').should('be.visible');
  //  });

  //  it('should submit the contact form successfully', () => {
  //    // Fill out the contact form
  //    cy.get('input[name="name"]').type('Suraj');
  //    cy.get('input[name="email"]').type('suraj.gagare@example.com');
  //    cy.get('textarea[name="message"]').type('Hello');
    
  //    // Submit the form
  //    cy.get('button[type="submit"]').click();
    
  //    // Verify that a success message or confirmation appears
  //    cy.get('.success-message').should('contain.text', 'Thank you for your message!');
  //  });

  //  it('should verify the presence of the logo image', () => {
  //    // Verify the logo image is visible
  //    cy.get('img[alt="logo"]').should('be.visible');

  //    // Verify the logo image src attribute
  //    cy.get('img[alt="logo"]').should('have.attr', 'src', 'https://p99soft.com/wp-content/uploads/2023/03/logo.png');
  //  });

  //  it('should verify a specific link works', () => {
  //    // Click on a specific link (for example, a "Services" link)
  //    cy.get('a[href="/services"]').click();
    
  //    // Verify the URL includes '/services'
  //    cy.url().should('include', '/services');

  //    // Verify the presence of an H1 element with expected text
  //    cy.get('h1').should('contain.text', 'Our Services');

