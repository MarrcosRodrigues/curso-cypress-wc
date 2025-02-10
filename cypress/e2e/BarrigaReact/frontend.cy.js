/// <reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv'

describe('Should test at a functional level', () => {
    after(() => {
        cy.clearLocalStorage()
    })
    
    beforeEach(() => {
        buildEnv()
        cy.login('tcypress@teste.com', 'senha errada')
        cy.get(loc.MENU.HOME).click()
    })

    it('should test the responsiveness', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
    })

    it('Should create an account', () => {
        cy.intercept({
                method: 'POST',
                url: '/contas'
            }, 
            { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 }
        ).as('saveConta')

        cy.acessarMenuConta()

        cy.intercept({
                method: 'GET',
                url: '/contas'
            },
            [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        ).as('contasSave')

        cy.inserirConta('Conta de teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.intercept({
                method: 'PUT',
                url: '/contas/**'
            },
            { id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1 }
        )

        // cy.get(':nth-child(7) > :nth-child(2) > .fa-edit')
        cy.acessarMenuConta()

        cy.get('td').contains('Banco').find('.far.fa-edit').click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create an account with same name', () => {
        cy.intercept({
            method: 'POST',
            url: '/contas'
        }, { 
            statusCode: 400,
            body: {"error": "Já existe uma conta com esse nome!" }
        }).as('saveContaMesmoNome')

        cy.acessarMenuConta()

        cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })

    it('Should create a transaction', () => {
        cy.intercept({
                method: 'POST',
                url: '/transacoes'
            },
            { 
                "id": 31433, 
                "descricao": "asdasd", 
                "envolvido": "sdfsdfs", 
                "observacao": null, 
                "tipo": "DESP", 
                "data_transacao": "2019-11-13T03:00:00.000Z", 
                "data_pagamento": "2019-11-13T03:00:00.000Z", 
                "valor": "232.00", 
                "status": false, 
                "conta_id": 42069, 
                "usuario_id": 1, 
                "transferencia_id": null, 
                "parcelamento_id": null 
            }
        )

        cy.intercept({
                method: 'GET',
                url: '/extrato/**'
            },
            {fixture: 'movimentacaoSalva.json'}
        )

        cy.get(loc.MENU.MOVIMENTACAO).click();

        cy.get(loc.MOVIMENTACAOS.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAOS.VALOR).type('123')
        cy.get(loc.MOVIMENTACAOS.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAOS.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAOS.STATUS).click()
        cy.get(loc.MOVIMENTACAOS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.get('span').contains('Desc').should('exist')
    })

    it('Should get balance', () => {
        cy.intercept({
                method: 'GET',
                url: '/transacoes/**'
            },
            {
                "conta": "Conta para saldo",
                "id": 31436,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2019-11-13T03:00:00.000Z",
                "data_pagamento": "2019-11-13T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 42079,
                "usuario_id": 1,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        )

        cy.intercept({
                method: 'PUT',
                url: '/transacoes/**'
            },
            {
                "conta": "Conta para saldo",
                "id": 31436,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2019-11-13T03:00:00.000Z",
                "data_pagamento": "2019-11-13T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 42079,
                "usuario_id": 1,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        )

        cy.get(loc.MENU.HOME).click()
        cy.get('td').contains('Carteira').next().should('contain', '100,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.get('span').contains('Movimentacao 1, calculo saldo').parent().parent().next().find('.fas.fa-edit').click()
        // cy.wait(1000)
        cy.get(loc.MOVIMENTACAOS.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAOS.STATUS).click()
        cy.get(loc.MOVIMENTACAOS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.intercept({
                method: 'GET',
                url: '/saldo'
            },
            [{
                conta_id: 999,
                conta: "Carteira",
                saldo: "4034.00"
            },
            {
                conta_id: 9909,
                conta: "Banco",
                saldo: "10000000.00"
            },
            ]
        ).as('saldoFinal')

        cy.get(loc.MENU.HOME).click()
        cy.get('td').contains('Carteira').next().should('contain', '4.034')
    
    })

    it('Should remove a transaction', () => {
        cy.intercept({
                method: 'DELETE',
                url: '/transacoes/**'
            }, 
            {statusCode: 204}
        ).as('del')

        cy.get(loc.MENU.EXTRATO).click()
        cy.get('span').contains('Movimentacao para exclusao').parent().parent().next().find('.far.fa-trash-alt').click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')
    })

    it('Should validate data send to create an account', () => {
        const reqStub = cy.stub()
        cy.intercept({
                method: 'POST',
                url: '/contas'
            },
            (req) => {
                console.log(req.headers)
                expect(req.body.nome).to.be.empty
                expect(req.headers).to.have.property('authorization')

                req.reply({id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 })
            }
        ).as('saveConta')

        cy.acessarMenuConta()

        cy.intercept({
                method: 'GET',
                url: '/contas'
            },
            [
                { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
                { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
                { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
            ]
        ).as('contasSave')

        cy.inserirConta('{CONTROL}')
        //cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
        
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should test colors', () => {
        cy.intercept({
                method: 'GET',
                url: '/extrato/**'
            },
            [
                { "conta": "Conta para movimentacoes", "id": 31434, "descricao": "Receita paga", "envolvido": "AAA", "observacao": null, "tipo": "REC", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 42077, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta com movimentacao", "id": 31435, "descricao": "Receita pendente", "envolvido": "BBB", "observacao": null, "tipo": "REC", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1500.00", "status": false, "conta_id": 42078, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 31436, "descricao": "Despesa paga", "envolvido": "CCC", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "3500.00", "status": true, "conta_id": 42079, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 31437, "descricao": "Despesa pendente", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1000.00", "status": false, "conta_id": 42079, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null }
            ]
        )

        cy.get(loc.MENU.EXTRATO).click()
        cy.get('span').contains('Receita paga').parent().parent().parent().parent().should('have.class', 'receitaPaga')
        cy.get('span').contains('Receita pendente').parent().parent().parent().parent().should('have.class', 'receitaPendente')
        cy.get('span').contains('Despesa paga').parent().parent().parent().parent().should('have.class', 'despesaPaga')
        cy.get('span').contains('Despesa pendente').parent().parent().parent().parent().should('have.class', 'despesaPendente')
        // cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
        // cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
        // cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
        // cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
    })
})