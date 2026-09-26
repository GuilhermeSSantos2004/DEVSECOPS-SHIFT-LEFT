# DEVSECOPS-SHIFT-LEFT

Laboratório FIAP de DevSecOps: introdução de verificações de segurança no início do desenvolvimento (Shift Left).

## Objetivo

Configurar o GitHub Actions com Gitleaks para identificar segredos no Git e Semgrep para analisar padrões de código potencialmente inseguros.

Este é um repositório público e dedicado à atividade, sem o workflow antigo de deploy no Azure.

## Etapas

1. Preparar o repositório com este README.
2. Criar `.github/workflows/security.yml` com o Gitleaks.
3. Clonar e sincronizar o repositório pelo Git.
4. Adicionar `config.js` com o segredo **falso** fornecido no enunciado e verificar a falha proposital.
5. Adicionar o job independente do Semgrep ao mesmo workflow.
6. Conferir os dois jobs na aba [Actions](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions).

## Questão relâmpago

**Se a máquina revisa o código, o revisor humano perde o emprego?**

Não. As ferramentas automatizam verificações repetitivas e apontam possíveis problemas. O revisor humano avalia o contexto, as regras de negócio, a arquitetura, os falsos positivos e as correções. A automação complementa a revisão humana; um pipeline verde não garante que o sistema esteja livre de vulnerabilidades.
