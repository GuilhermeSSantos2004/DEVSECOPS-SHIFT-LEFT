# DEVSECOPS-SHIFT-LEFT

Laboratórios FIAP de **DevSecOps — Shift Left na prática**: colocar verificações de segurança no início do desenvolvimento, a cada `push` e `pull_request`.

> Repositório didático. O segredo em [config.js](config.js) é **falso**, fornecido no enunciado e mantido de propósito para demonstrar a detecção. O pipeline vermelho faz parte do experimento.

## Laboratórios realizados

| Lab | Entrega |
| --- | --- |
| 1 — Preparar o repositório | Repositório público, dedicado à atividade, com README e sem o antigo deploy no Azure. |
| 2 — Ativar o Gitleaks | Job `gitleaks` em [.github/workflows/security.yml](.github/workflows/security.yml), com `fetch-depth: 0` e `GITHUB_TOKEN`. |
| 3 — Clonar e sincronizar | Clone, sincronização com `git pull` e conferência com `git log` realizados no ambiente de execução. Comandos para o computador do aluno abaixo. |
| 4 — Vazamento proposital | `config.js` com exatamente o valor falso do enunciado, publicado em commit separado; detecção comprovada no Actions. |
| 5 — Editar o workflow | Segundo job adicionado ao mesmo arquivo e sincronização local conferida. |
| 6 — Ativar o Semgrep | Container `semgrep/semgrep`, comando `semgrep ci --config auto` e variável `SEMGREP_RULES: p/default`, conforme o material. |

Os jobs são independentes: uma falha no Gitleaks não impede que o Semgrep execute. O `GITHUB_TOKEN` é fornecido pelo GitHub Actions; não foi necessário cadastrar uma credencial AWS ou um token do Semgrep.

## Evidências verificadas

Execuções conferidas em **25/09/2026, horário de São Paulo**, incluindo os logs dos scanners.

| Etapa | Resultado observado | Evidência |
| --- | --- | --- |
| Gitleaks antes do segredo falso | Sucesso. | [Execução #1](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208036267) |
| Commit do vazamento proposital | Gitleaks falhou por **1 segredo** em `config.js:1`, regra `aws-access-token`. | [Execução #2 — Lab 4](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208085739) |
| Primeira execução com Semgrep | Varredura concluída; bloqueio por **4 ocorrências**: o segredo falso e 3 referências mutáveis de Actions. | [Execução #3 — Labs 5 e 6](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208123754) |
| Após corrigir as referências das Actions | Semgrep executou **1.074 regras** em **3 arquivos** e bloqueou somente o segredo falso de `config.js:1`. | [Execução #4 — configuração validada](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208190399) |

**O bloqueio restante é intencional.** O Semgrep concluiu a análise e retornou código 1 porque encontrou a credencial simulada; não houve erro de instalação ou de sintaxe do workflow.

### Por que o Gitleaks pode aparecer verde em um commit posterior?

Nas execuções de `push` registradas, a Action usou `--log-opts=-1`, verificando as adições do último commit. O commit que introduziu o segredo falhou, como exige o Lab 4. Nos commits posteriores, que só alteraram o workflow, o Gitleaks passou.

Isso **não significa que o segredo foi removido**. `fetch-depth: 0` disponibiliza o histórico completo no checkout, mas não obriga a Action a analisar todo esse histórico em cada execução. O Semgrep continuou identificando o valor falso no arquivo atual.

## Ajustes de compatibilidade e segurança

- O material usa Checkout v4 e Gitleaks Action v2. Foram usadas as versões **Checkout v6** e **Gitleaks Action v3**, seguindo a migração oficial para Node 24.
- Após o alerta do Semgrep, ambas as Actions foram fixadas pelo **SHA completo do commit**, com comentários indicando as versões. Isso impede que uma mudança futura na tag altere silenciosamente o código da Action executada.
- O workflow tem permissão de leitura do conteúdo, limite de 10 minutos por job e comentários automáticos do Gitleaks desativados.
- O comando e a variável de ambiente do Semgrep foram preservados conforme o enunciado. A configuração explícita `--config auto` solicita a seleção automática de regras.

## Abrir no seu computador — Lab 3

O clone realizado durante a implementação fica no ambiente de execução. Para ter o projeto no seu computador, abra o terminal na pasta desejada e execute:

```bash
git clone https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT.git
cd DEVSECOPS-SHIFT-LEFT
git pull --ff-only
git log --oneline -8
```

Se já tiver clonado, entre na pasta e execute apenas `git pull --ff-only` e `git log --oneline -8`.

## Como conferir a entrega

1. Abra a [aba Actions](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions).
2. Na **execução #2**, abra o job `gitleaks` e a etapa **Detectar segredos com Gitleaks**. O log identifica `config.js`, linha 1, e `leaks found: 1`.
3. Na **execução #4**, abra `semgrep` e a etapa **Analisar codigo com Semgrep**. O resumo apresenta **1 ocorrência bloqueante**, referente ao segredo falso.
4. Confira o [workflow](.github/workflows/security.yml), o [arquivo de teste](config.js) e o [histórico de commits](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commits/main).

## Questão relâmpago

**Se a máquina revisa o código, o revisor humano perde o emprego?**

Não. As ferramentas automatizam verificações repetitivas e apontam possíveis problemas, como segredos expostos e padrões inseguros. O revisor humano avalia o contexto, as regras de negócio, a arquitetura, os falsos positivos e as correções. A automação complementa a revisão humana; um pipeline verde não garante que o sistema esteja livre de vulnerabilidades.

## Referências

- [Gitleaks Action: configuração e migração para v3](https://github.com/gitleaks/gitleaks-action#readme).
- [Semgrep: exemplos de configuração para CI](https://semgrep.dev/docs/semgrep-ci/sample-ci-configs).
- [Semgrep: referência da linha de comando](https://semgrep.dev/docs/cli-reference).
