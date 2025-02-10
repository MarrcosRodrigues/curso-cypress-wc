///<reference types="cypress" />

describe('Work with basics elements', () => {
    beforeEach(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => {
        cy.reload()
    })

    it('using jquery selector', () => {
        // cy.get(':nth-child(3) > :nth-child(3) > [type="button"]')
        // cy.get('table#tabelaUsuarios tbody > tr td:nth-child(3) > input')
        cy.get('table#tabelaUsuarios tbody > tr:eq(0) td:nth-child(3) > input').click()
        cy.get('[onclick*="Francisco"]').click()
        cy.get('#tabelaUsuarios td:contains("Doutorado"):eq(0) ~ td:eq(3) > input').type('Opa')
        cy.get('#tabelaUsuarios tr:contains(\'Doutorado\'):eq(0) td:eq(6) input')
    })

})