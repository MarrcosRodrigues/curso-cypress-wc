///<reference types="cypress" />

describe('Desafio', () => {
    beforeEach(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => {
        cy.reload()
    })

    it('Desafio', () => {

        const stub = cy.stub().as('alerta')

        cy.on('window:alert', stub)
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')
        })
        
        cy.get('#formNome').type('Cypress')
        
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio')
        })
        
        cy.get('#formSobrenome').type('Sobrenome')
        
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio')
        })
        
        cy.get('#formSexoMasc').click().should('be.checked')

        cy.get('#formCadastrar').click()

        cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')
        
    })

})