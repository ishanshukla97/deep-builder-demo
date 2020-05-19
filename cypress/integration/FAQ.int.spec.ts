/// <reference types="cypress" />

describe('FAQ page', () => {
    it('displays FAQs when clicked on FAQ button', () => {
        cy.viewport(1024, 768)
        .visit('/')
        cy.findByText('FAQ')
        .click()
        .wait(10)
        cy.findByText('Frequently Answered Questions')
        .location().should((loc: any) => {
            expect(loc.pathname).to.eq('/faq')
        })
    });
});
