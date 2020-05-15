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

const addTwoNode = (name1: string, name2: string) => {
    cy.findByText(name1).drag('[data-testid=playground-widget-main]', {position: 'left'})
    cy.findByText(name2).drag('[data-testid=playground-widget-main]')
}

describe('build simple model and download', () => {
    it('can add 2 op node', () => {
        cy.viewport(1024, 720).visit('/')
        addTwoNode('input', 'conv2d')
    })
    
    it('can link them together', () => {
        cy.get('[data-name=out]').eq(0).drag('[data-name=in]', {nth: 1}).wait(2000);
    })

    it('displays error when invalid model is downloaded', () => {
        cy.findByTestId('btn-download').click()
        cy.get('.Toastify__toast-body')
    })

    it('can register layer configuration', () => {
        cy.findAllByText('input').eq(1).click();
        cy.findByText('shape').siblings('input').type('150,150,3');
        cy.findAllByText('conv2d').eq(1).click();
        cy.findByText('filters').siblings('input').type('10')
        cy.findByText('kernelSize').siblings('input').type('2,2')
        cy.findByTestId('playground-widget-main').click()
    })

    it('populates link labels on click download', () => {
        cy.findByTestId('btn-download').click().wait(10)
        cy.findByTestId('playground-widget-main').click()
        cy.findByText('???,150,150,3')
    })
})
