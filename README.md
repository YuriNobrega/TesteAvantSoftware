# Relatório Completo de Testes Automatizados - Fleet Manager

## Sumário

- Testes Tela de Login
- Testes Dashboard
- Bugs, Limitações e Recomendações
- Exemplos de códigos Cypress
- Conclusão

---

## 1. Testes Tela de Login

### Casos testados

- Validação de inputs vazios com mensagens nativas do browser.
- Erro para e-mail sem “@” utilizando validação nativa `validationMessage`.
- Erro para senha incorreta com mensagem personalizada.
- Persistência do e-mail preenchido após erro.
- Campo senha do tipo oculto.
- Login com dados válidos redireciona para dashboard.

### Observações

- Erros relacionados a mensagens nativas do navegador geram alertas visuais que não ficam no DOM, portanto foram validados via JS usando `checkValidity()` e `validationMessage`.
- Cenários de entrada errada com erro visual claro.

---

## 2. Testes Dashboard

### Positivos

- Cards informativos exibem valores corretos (8 veículos cadastrados, 1 alugado, receita 1.850).
- Pesquisa via barra funciona para placa e nome.
- Botão “Alugar” está habilitado para veículos “Disponível” e desabilitado para os demais.
- Simulação de aluguel atualiza valor total de forma correta.

### Negativos e Bugs

- Campo “Dias” aceita valor exageradamente longo, quebrando layout do modal e permitindo confirmação inválida.
- Logout trava mostrando “redirecionando” e não sai da dashboard.
- Fluxos de aplicação de cupom e seleção de pagamento bloqueados pela indisponibilidade de veículos após testes vários.

---

## 3. Bugs e Recomendações

| Bug                                       | Descrição                                     | Impacto  | Sugestão                                                     |
|-------------------------------------------|-----------------------------------------------|----------|--------------------------------------------------------------|
| Campo dias aceita valor enorme            | Bug visual e funcional no modal de aluguel    | Alto     | Limitar entrada no campo dias e validação                     |
| Logout trava no “redirecionando”          | Usuário não consegue sair do sistema          | Alto     | Corrigir fluxo e endpoint de logout                           |
| Veículos ficam indisponíveis após testes  | Bloqueio de testes de cupom e pagamento       | Médio    | Criar ambiente com reset de dados ou mock para testes isolados|

---

## 4. Conclusão

Os testes automatizados criados cobrem com profundidade grande parte do fluxo do sistema, desde a entrada no login até o fluxo principal do dashboard. Foram identificadas falhas importantes que impactam a experiência do usuário e a manutenção do sistema.
