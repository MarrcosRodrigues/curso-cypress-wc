///<reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'


describe('Work with tests', () => {
    
    beforeEach(() => {
        cy.visit('https://barrigareact.wcaquino.me/')
        cy.login('tcypress@teste.com', '123')
        cy.resetApp()
    })
    
    const numeroAleat = Math.random()
    it('Realizar conta', () => {
        cy.acessarMenuConta()
        cy.inserirConta(`Conta ${numeroAleat}`)
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
    })
    
    it('Alterar conta', () => {
        cy.acessarMenuConta()
        
        //Encontrando item na tela para alterar
        cy.get('td').contains('Conta para alterar').find('.far.fa-edit').click()
        cy.get(loc.CONTAS.NOME).clear().type(`Conta ${numeroAleat} Alterada`)
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.wait(cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!'))
        
    })
    
    it('Não deve criar conta com o mesmo nome', () => {
        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
        // cy.resetApp()
    })
    
    it('Realizar movimentação', () => {
        cy.get(loc.MENU.MOVIMENTACAO).click();
        
        cy.get(loc.MOVIMENTACAOS.DESCRICAO).type('Descrição')
        cy.get(loc.MOVIMENTACAOS.VALOR).type('100')
        cy.get(loc.MOVIMENTACAOS.INTERESSADO).type('Cypress')
        cy.get(loc.MOVIMENTACAOS.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTACAOS.STATUS).click()
        cy.get(loc.MOVIMENTACAOS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')
        cy.get('span').contains('Descrição').should('exist')
    })
    
    it('Consultar saldo', () => {
        cy.get(loc.MENU.HOME).click()
        cy.get('td').contains('Conta para saldo').next().should('contain', '534')
        
        cy.get(loc.MENU.EXTRATO).click()
        cy.get('span').contains('Movimentacao 1, calculo saldo').parent().parent().next().find('.fas.fa-edit').click()
        cy.get(loc.MOVIMENTACAOS.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAOS.STATUS).click()
        cy.get(loc.MOVIMENTACAOS.BTN_SALVAR).click()
        //Validação do valor atualizado
        cy.get(loc.MENU.HOME).click()
        cy.get('td').contains('Conta para saldo').next().should('contain', '4.034')
        
        //Resetando
        // cy.resetApp()
    })
    
    it('Remover uma movimentação', () => {
        cy.get(loc.MENU.EXTRATO).click();
        cy.get('span').contains('Movimentacao para exclusao').parent().parent().next().find('.far.fa-trash-alt').click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
        // cy.resetApp()
    })
})