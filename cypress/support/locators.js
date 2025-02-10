const locators = { 
    LOGIN: {
        USER: '[data-test=email]',
        PASSWORD: '[data-test=passwd]',
        BTN_LOGIN: '.btn'
    },
    MENU: {
        HOME: '[data-test="menu-home"]',
        SETTINGS: '[title=settings]',
        CONTAS: '[href="/contas"]',
        MOVIMENTACAO: '[data-test="menu-movimentacao"]',
        EXTRATO: '[data-test="menu-extrato"]',
        RESET: '[href="/reset"]'
    },
    CONTAS: {
        NOME: '[data-test="nome"]',
        BTN_SALVAR: '.btn'
    },
    MOVIMENTACAOS: {
        DESCRICAO: '[data-test="descricao"]',
        VALOR: '[data-test="valor"]',
        INTERESSADO: '[data-test="envolvido"]',
        CONTA: '[data-test="conta"]',
        STATUS: '[data-test="status"]',
        BTN_SALVAR: '.btn-primary'
    },
    EXTRATO: {
        LINHAS: '.col-12.col-md-9'
    },
    MESSAGE: '.toast-message'
}

export default locators;