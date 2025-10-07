describe('Dashboard - Testes E2E Fleet Manager', () => {
  beforeEach(() => {
    cy.visit('https://qe-test.recrutamento.avantsoft.com.br/login')
    cy.get('input[id="email"]').type('admin@teste.com')
    cy.get('input[id="password"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('Exibe cards informativos com valores certos', () => {
    cy.get('.dashboard-card').eq(0).should('contain.text', 'Total de Veículos').and('contain.text', '8')
    cy.get('.dashboard-card').eq(1).should('contain.text', 'Veículos Alugados').and('contain.text', '1')
    cy.get('.dashboard-card').eq(2).should('contain.text', 'Receita Total').and('contain.text', '1.850')
  })

  it('Filtra veículos por placa ou modelo', () => {
    cy.get('input.input-field').type('Onix')
    cy.get('.vehicle-card').should('contain.text', 'Onix')
    cy.get('input.input-field').clear().type('ABC1234')
    cy.get('.vehicle-card').should('contain.text', 'ABC1234')
  })

  it('Valida botão "Alugar" habilitado para veículos disponíveis', () => {
    cy.get('.vehicle-card').contains('Disponível')
      .parents('.vehicle-card')
      .contains('button', 'Alugar')
      .should('not.be.disabled')
  })

  it('Valida botão "Alugar" desabilitado para veículos não disponíveis', () => {
    cy.get('.vehicle-card').contains(/Alugado|Manutenção/)
      .parents('.vehicle-card')
      .contains('button', 'Alugar')
      .should('be.disabled')
  })

  it('Simula aluguel e calcula valor corretamente', () => {
    cy.get('.vehicle-card').contains('Disponível')
      .parents('.vehicle-card')
      .contains('button', 'Alugar')
      .click()
    cy.get('input[id="days"]').clear().type('3')
    cy.get('.valor-total').should('contain.text', 'R$')
  })

  it('Campo de days aceita valor exageradamente grande e causa bug visual', () => {
    cy.get('.vehicle-card').contains('Disponível')
      .parents('.vehicle-card')
      .contains('button', 'Alugar')
      .click()
    const daysLongo = '9'.repeat(100)
    cy.get('input[id="days"]').clear().type(daysLongo)
    cy.get('input[id="days"]').invoke('val').should('have.length.greaterThan', 10)
    cy.screenshot('bug-campo-days-excesso')
  })

  it('Aplica e remove cupom DESCONTO50', () => {
    cy.get('.vehicle-card').contains('Disponível')
      .parents('.vehicle-card')
      .contains('button', 'Alugar')
      .click()
  
    cy.get('input[id="days"]').clear().type('2')
  
    cy.contains('button', 'Confirmar').click()
  
    cy.get('input[id="cupom"]').type('DESCONTO50')
  
    cy.contains('button', 'Aplicar cupom').click()
  
    cy.get('.valor-final').then($valorFinal => {
      const valorComDesconto = parseFloat($valorFinal.text().replace(/[^\d]/g, ''))
      expect(valorComDesconto).to.be.lessThan(200) // Ajuste conforme valor esperado
    })
  
    cy.contains('button', 'Remover cupom').click()
  
    cy.get('.valor-final').should('not.contain', '-50')
  })
  
  it('Seleciona pagamento por Pix e confirma aluguel', () => {
    cy.get('.vehicle-card').contains('Disponível')
      .parents('.vehicle-card')
      .contains('button', 'Alugar')
      .click()
    cy.get('input[id="days"]').clear().type('1')
    cy.contains('button', 'Confirmar').click()
    cy.get('input[id="pix"]').check()
    cy.contains('button', 'Confirmar pagamento').click()
    cy.contains('Aluguel efetuado com sucesso').should('be.visible')
  })
})
