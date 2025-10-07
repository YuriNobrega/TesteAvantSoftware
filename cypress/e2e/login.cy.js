describe('Login - Validação de inputs', () => {
  beforeEach(() => {
    cy.visit('https://qe-test.recrutamento.avantsoft.com.br/login')
  })

  it('Foco automático no campo e-mail ao abrir a página', () => {
      cy.focused().should('have.attr', 'id', 'email')
    })

    it('Exibe erro ao tentar logar sem preencher e-mail e senha', () => {
      cy.get('button[type="submit"]').click()
      cy.get('input[id="email"]').then($input => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
      })
      cy.get('input[id="password"]').then($input => {
        expect($input[0].checkValidity()).to.be.false
        expect($input[0].validationMessage).to.contain('Preencha este campo')
      })
    })

  it('Exibe erro ao tentar logar com e-mail sem "@"', () => {
    cy.get('input[id="email"]').type('admin')
    cy.get('input[id="password"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.get('input[id="email"]').then($input => {
      expect($input[0].checkValidity()).to.be.false
      expect($input[0].validationMessage).to.contain('Inclua um "@"')
    })
  })
  

  it('Exibe erro ao tentar logar preenchendo apenas o e-mail', () => {
    cy.get('input[id="email"]').type('admin@teste.com')
    cy.get('button[type="submit"]').click()
    cy.get('input[id="password"]').then($input => {
      expect($input[0].checkValidity()).to.be.false
      expect($input[0].validationMessage).to.contain('Preencha este campo')
    })
  })

  it('Exibe erro para senha incorreta', () => {
    cy.get('input[id="email"]').type('admin@teste.com')
    cy.get('input[id="password"]').type('senhaerrada')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
  })

  it('Existe uma forma de colocar que esqueci minha senha', () => {
    cy.contains('Esqueci minha senha').should('be.visible')
  })

  it('Restringe tamanho máximo do campo senha', () => {
      const longPassword = 'a'.repeat(256) // Exemplo para tamanho máximo 255
      cy.get('input[id="password"]').type(longPassword)
      cy.screenshot()
      cy.get('input[id="password"]').invoke('val').should('have.length.lte', 255)
      
    })

    it('Mantém e-mail preenchido após erro de senha', () => {
      cy.get('input[id="email"]').type('admin@teste.com')
      cy.get('input[id="password"]').type('senhaerrada')
      cy.get('button[type="submit"]').click()
      cy.get('input[id="email"]').should('have.value', 'admin@teste.com')
    })

    it('Campo senha é do tipo password (escondido)', () => {
      cy.get('input[id="password"]').should('have.attr', 'type', 'password')
    })

  it('Realiza login com dados válidos', () => {
    cy.get('input[id="email"]').type('admin@teste.com')
    cy.get('input[id="password"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login') // Deve ir para a dashboard após login
  })
})
