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
})

describe('can connect two op nodes', () => {
    it('can add 2 op node', () => {
        cy.viewport(1024, 720).visit('/')
        cy.findByText('input').drag('[data-testid=playground-widget-main]', {position: 'left'})
        cy.findByText('conv2d').drag('[data-testid=playground-widget-main]')
    })
    it('can link them together', () => {
        cy.get('[data-name=out]').eq(0).drag('[data-name=in]', {nth: 1});
    })
})

//@todo
describe('can download a simple model')
describe('displays error incorrect model is downloaded')
describe('populates link labels with shapes')