/// <reference types="cypress" />


describe('model builder page', () => {
    beforeEach(() => {
        cy.viewport(1024, 768)
        .visit('/')
    })
    
    const moveNodeToPlayground = (name: string) => {
        cy.findByText(name).drag('[data-testid=playground-widget-main]')
    };

    it('can add tensorflow preset node to playground', () => {
        moveNodeToPlayground('Densenet (Conv Block)');
        cy
        .findAllByTestId('op-node')
        .should('have.length.greaterThan', 2)
    });

    it('can add tensorflow op node to playground', () => {
        moveNodeToPlayground('conv2d');
        cy
        .findByTestId('op-node')
        .children()
        .first()
        .should('have.text', 'conv2d')
    });

    it('populates property pane on op node selection', () => {
        moveNodeToPlayground('conv2d');
        cy.findByTestId('op-node').click();
        cy.findByText('filters');
        cy.findByText('kernelSize');
        cy.findByText('strides');
        cy.findByText('name');
    });

    it('can connect two op nodes', () => {
        cy.findByText('input').drag('[data-testid=playground-widget-main]', {position: 'left'})
        cy.findByText('conv2d').drag('[data-testid=playground-widget-main]')
        
        cy.get('[data-name=out]').eq(0).drag('[data-name=in]', {nth: 1});

    })
})