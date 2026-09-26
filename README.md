# DEVSECOPS-SHIFT-LEFT

**FIAP — DevSecOps: Shift Left na prática**

Laboratório de segurança automatizada com GitHub Actions, Gitleaks e Semgrep. O objetivo é identificar problemas durante o desenvolvimento, assim que uma alteração chega ao repositório.

> **Experimento didático:** o valor em [config.js](config.js) é o segredo **falso** fornecido no enunciado. Ele foi mantido de propósito para demonstrar a detecção. O pipeline vermelho é parte do resultado esperado desta etapa.

## Integrantes do grupo

| Integrante | RM |
| --- | --- |
| Enricco Rossi de Souza Carvalho Miranda | 551717 |
| Gabriel Marquez Trevisan | 99227 |
| Guilherme Silva dos Santos | 551168 |
| Danilo Urze Aldred | 99465 |
| Laura Claro Mathias | 98747 |

## Atendimento ao enunciado

**Atividade:** Semgrep + Gitleaks — labs da aula 17.  
**Prazo informado:** 02/10/2026, às 23h59.

O enunciado solicita realizar os laboratórios, apresentar evidências e concluir como as duas ferramentas poderiam ser adaptadas à rotina da empresa dos integrantes. Não especifica que as evidências precisam ser capturas de tela.

| Requisito | Onde está documentado |
| --- | --- |
| Fazer os labs da aula 17 | Seções 3 a 8, com o procedimento, os arquivos e os resultados. |
| Evidenciar a execução | Seção 10, com links das execuções e trechos reais dos logs; seção 11, com o caminho para conferência no GitHub. |
| Concluir como adaptar à empresa | Seção 14, com uma proposta genérica de adoção na rotina de desenvolvimento, preservando as informações internas. |

## 1. Objetivo e conceitos

**DevSecOps** integra práticas de segurança ao desenvolvimento e à operação do software. **Shift Left** significa antecipar essas verificações no ciclo de desenvolvimento: encontrar o problema enquanto o código está sendo alterado facilita sua correção.

Neste projeto, um `push` ou uma `pull_request` inicia o workflow **Security Scan**. Ele executa dois jobs independentes:

| Componente | Função neste laboratório |
| --- | --- |
| GitHub Actions | Executa automaticamente as etapas descritas no arquivo YAML. |
| Gitleaks | Procura padrões de segredos, como chaves de acesso e tokens, nas alterações do Git analisadas pela Action. |
| Semgrep | Faz análise estática: examina os arquivos sem executar a aplicação e procura padrões de código potencialmente inseguros. |
| Revisor humano | Interpreta os alertas, considera o contexto e decide como corrigir o problema. |

**Workflow** é a automação completa; **job** é um conjunto de etapas executado em um ambiente próprio; **step** é cada ação ou comando desse job. Neste workflow, a falha de um scanner não impede a execução do outro.

O pipeline registra sucesso ou falha. O bloqueio obrigatório de um merge depende de regras de proteção da branch, que não fazem parte da configuração deste laboratório.

## 2. Estrutura do repositório

| Arquivo | Conteúdo |
| --- | --- |
| [README.md](README.md) | Integrantes, explicações, comandos, evidências e resposta da atividade. |
| [.github/workflows/security.yml](.github/workflows/security.yml) | Workflow com os jobs `gitleaks` e `semgrep`. |
| [config.js](config.js) | Constante JavaScript com o segredo falso usado no teste. |

O projeto serve para demonstrar os scanners. Não há uma aplicação web para iniciar, banco de dados ou deploy no Azure.

## 3. LAB 1 — Preparando o repositório

Foi utilizado o repositório público **DEVSECOPS-SHIFT-LEFT**, indicado para esta atividade. Ele estava vazio e recebeu um README inicial.

Um repositório novo separa este laboratório do antigo `webapp-fiap`. Assim, problemas de um workflow de deploy anterior, como credenciais vencidas do Azure, não interferem na avaliação dos scanners.

O arquivo de automação foi criado no caminho:

```text
.github/workflows/security.yml
```

Esse caminho permite que o GitHub reconheça o YAML como um workflow do Actions.

## 4. LAB 2 — Ativando o Gitleaks

Primeiro, foi publicado somente o job do Gitleaks. Ele faz o checkout do código e executa a ferramenta de detecção de segredos.

- `runs-on: ubuntu-latest`: utiliza um runner Linux hospedado pelo GitHub.
- `fetch-depth: 0`: disponibiliza o histórico completo do Git no checkout.
- `GITHUB_TOKEN`: token temporário fornecido automaticamente pelo GitHub Actions.
- `GITLEAKS_ENABLE_COMMENTS: "false"`: mantém os resultados nos logs e resumos, sem comentários automáticos em pull requests.

A primeira execução terminou com sucesso, antes da inclusão do segredo falso.

**Evidência:** [execução #1 — Gitleaks com repositório limpo](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208036267).

## 5. LAB 3 — Abrindo e sincronizando no terminal

O clone, a sincronização e a leitura do histórico foram realizados no ambiente usado na implementação. Para ter os arquivos no computador do aluno, é necessário fazer o clone nesse computador.

Com o Git instalado, abra um terminal na pasta desejada:

```bash
git clone https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT.git
cd DEVSECOPS-SHIFT-LEFT
git pull --ff-only
git log --oneline -10
git status
```

| Comando | O que faz |
| --- | --- |
| `git clone` | Baixa o repositório e cria uma pasta local. |
| `cd DEVSECOPS-SHIFT-LEFT` | Entra na pasta do projeto. |
| `git pull --ff-only` | Traz as alterações remotas quando é possível avançar o histórico local sem criar um merge. |
| `git log --oneline -10` | Mostra os dez commits mais recentes de forma resumida. |
| `git status` | Mostra a branch e as alterações locais pendentes. |

Se a pasta já existir, entre nela e execute somente os comandos de sincronização e conferência.

Após uma edição feita diretamente no GitHub, use `git pull --ff-only` antes de continuar trabalhando localmente. Se houver históricos divergentes, esse comando interrompe a operação para que a diferença seja analisada.

## 6. LAB 4 — O vazamento proposital

Foi criado o arquivo `config.js` com a constante `AWS_KEY` e **exatamente o valor falso do enunciado**. O conteúdo está no [arquivo de teste](config.js); o valor completo não é repetido neste README para não gerar outra ocorrência de segredo na documentação.

O fluxo de comandos solicitado na atividade, após criar o arquivo, é:

```bash
git add config.js
git commit -m "feat: adiciona config"
git push origin main
```

Esses comandos ilustram o envio de uma alteração nova. **O arquivo já foi publicado neste repositório**, portanto não é necessário recriá-lo para conferir o resultado.

O commit publicado para o experimento foi [`2e88431`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/2e88431a959c9aa924e993bcde0cda4da8492bbc). Para consultar o conteúdo exato dessa etapa:

```bash
git show 2e88431a959c9aa924e993bcde0cda4da8492bbc:config.js
```

### Resultado observado

O Gitleaks identificou:

| Campo do log | Resultado |
| --- | --- |
| Arquivo | `config.js` |
| Linha | 1 |
| Regra | `aws-access-token` |
| Ocorrências | 1 |
| Conclusão do job | `failure` — falha proposital |

**Evidência:** [execução #2 — detecção do segredo falso](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208085739).

A ferramenta reconhece o padrão do valor. Essa detecção não significa que a credencial simulada tenha acesso real a uma conta AWS.

## 7. LAB 5 — Adicionando o segundo job

O mesmo arquivo `.github/workflows/security.yml` foi editado para adicionar o job `semgrep` ao lado de `gitleaks`, dentro de `jobs`.

A indentação do YAML define essa estrutura. O Semgrep precisa ser um job próprio, com suas etapas dentro de `steps`.

Após publicar a edição, a cópia local foi sincronizada. O workflow passou a iniciar os dois scanners em cada evento configurado.

## 8. LAB 6 — Ativando o Semgrep

O job utiliza o container `semgrep/semgrep`, que já contém a ferramenta instalada. Depois do checkout, executa o comando do material:

```bash
semgrep ci --config auto
```

A variável `SEMGREP_RULES: p/default` também foi mantida conforme o enunciado. A opção explícita `--config auto` solicita a seleção automática das regras para o projeto.

O Semgrep foi executado sem cadastrar `SEMGREP_APP_TOKEN`. Nas execuções verificadas, foram utilizadas regras da comunidade.

### O que o Semgrep encontrou

Na primeira execução, houve **4 ocorrências bloqueantes**:

1. O segredo falso em `config.js`.
2. Três usos de Actions por referências mutáveis: os dois checkouts e a Gitleaks Action.

Referências como `v6` e `v3` são tags que podem apontar para outro commit no futuro. Para corrigir esse alerta, as Actions foram fixadas pelo SHA completo do commit correspondente.

Depois da correção, o Semgrep executou **1.074 regras em 3 arquivos** e apontou **somente o segredo falso**. A análise terminou normalmente, mas o job retornou código 1 por causa dessa ocorrência bloqueante.

**Evidências:** [execução #3 — alertas iniciais](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208123754) e [execução #4 — após a correção](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208190399).

## 9. Workflow completo utilizado

O conteúdo abaixo corresponde ao arquivo [security.yml](.github/workflows/security.yml):

```yaml
name: Security Scan

on: [push, pull_request]

permissions:
  contents: read

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout com historico completo
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
        with:
          fetch-depth: 0
      - name: Detectar segredos com Gitleaks
        uses: gitleaks/gitleaks-action@e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e # v3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_ENABLE_COMMENTS: "false"

  semgrep:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    container:
      image: semgrep/semgrep
    steps:
      - name: Checkout do codigo
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6
      - name: Analisar codigo com Semgrep
        run: semgrep ci --config auto
        env:
          SEMGREP_RULES: p/default
```

### Como ler a configuração

| Configuração | Explicação |
| --- | --- |
| `name: Security Scan` | Nome exibido na aba Actions. |
| `on: [push, pull_request]` | Eventos que iniciam a automação. |
| `permissions: contents: read` | Limita a permissão do token do workflow à leitura do conteúdo. |
| `jobs.gitleaks` e `jobs.semgrep` | Dois jobs independentes; não há dependência com `needs`. |
| `timeout-minutes: 10` | Limite de execução de cada job. |
| `actions/checkout@...` | Baixa o código na versão que será analisada. |
| `fetch-depth: 0` | Disponibiliza o histórico completo para o job do Gitleaks. |
| `gitleaks/gitleaks-action@...` | Executa o scanner de segredos. |
| `container.image: semgrep/semgrep` | Ambiente do job do Semgrep. |
| `run: semgrep ci --config auto` | Inicia a análise estática do Semgrep. |

O material original usa Checkout v4 e Gitleaks Action v2. A implementação utiliza **Checkout v6** e **Gitleaks Action v3**, seguindo a migração oficial para Node 24. Os SHAs fixados identificam o código dessas Actions; os comentários `# v6` e `# v3` facilitam a leitura.

A imagem do Semgrep e as regras automáticas continuam sendo obtidas conforme a configuração do enunciado. A fixação dos SHAs das Actions não fixa esses outros componentes.

## 10. Evidências e interpretação dos resultados

Execuções abaixo conferidas em **25/09/2026, horário de São Paulo**, incluindo os logs dos scanners. Os números e quantidades descrevem essas execuções específicas.

| Execução | Alteração | Resultado observado |
| --- | --- | --- |
| [#1](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208036267) | Ativação do Gitleaks | Sucesso antes do segredo falso. |
| [#2](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208085739) | Inclusão de `config.js` | Gitleaks falhou por 1 segredo, conforme o Lab 4. |
| [#3](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208123754) | Inclusão do Semgrep | Semgrep apontou o segredo e 3 referências mutáveis de Actions. |
| [#4](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208190399) | Fixação das Actions por SHA | Semgrep apontou somente o segredo falso; Gitleaks passou no commit do workflow. |
| [#5](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208296508) | Documentação inicial das evidências | Semgrep manteve 1 ocorrência bloqueante em `config.js`; Gitleaks passou no commit da documentação. |

### Evidências técnicas dos logs

Os trechos abaixo foram obtidos dos logs reais do GitHub Actions. Foram removidos apenas os códigos de cor do terminal. Os horários com `Z` estão em UTC; correspondem à noite de 25/09/2026 em São Paulo.

**Evidência A — Gitleaks identifica o segredo falso**

[Log de origem: execução #2, job Gitleaks](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208085739).

```text
2026-09-26T01:20:30.2332139Z Finding:     const AWS_KEY = "REDACTED";
2026-09-26T01:20:30.2333069Z Secret:      REDACTED
2026-09-26T01:20:30.2339441Z RuleID:      aws-access-token
2026-09-26T01:20:30.2341019Z File:        config.js
2026-09-26T01:20:30.2341461Z Line:        1
2026-09-26T01:20:30.2343723Z Fingerprint: 2e88431a959c9aa924e993bcde0cda4da8492bbc:config.js:aws-access-token:1
2026-09-26T01:20:30.2347096Z 1:20AM WRN leaks found: 1
```

O próprio Gitleaks ocultou o valor com `REDACTED`. O arquivo, a linha, a regra e a contagem demonstram que a falha ocorreu pela detecção do segredo.

**Evidência B — Semgrep analisa o projeto e bloqueia a ocorrência**

[Log de origem: execução #4, job Semgrep](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/36208190399).

```text
2026-09-26T01:22:34.9240685Z   versions    - semgrep 1.177.0 on python 3.12.14                              
2026-09-26T01:22:36.3005350Z   Scanning 3 files tracked by git with 1074 Code rules:
2026-09-26T01:22:37.1231544Z │ 1 Blocking Code Finding │
2026-09-26T01:22:37.1235753Z    ❯❯❱ generic.secrets.security.detected-aws-access-key-id-value.detected-aws-access-key-id-value
2026-09-26T01:22:37.1252176Z     generic.secrets.security.detected-aws-access-key-id-value.detected-aws-access-key-id-value
2026-09-26T01:22:37.1305384Z ✅ CI scan completed successfully.
2026-09-26T01:22:37.1306433Z  • Findings: 1 (1 blocking)
2026-09-26T01:22:37.1309103Z  • Rules run: 1074
2026-09-26T01:22:37.1310125Z  • Targets scanned: 3
2026-09-26T01:22:37.1310629Z  • Parsed lines: ~100.0%
2026-09-26T01:22:37.1312493Z CI scan completed successfully.
2026-09-26T01:22:37.2877822Z   Has findings for blocking rules so exiting with code 1
2026-09-26T01:22:38.2477841Z ##[error]Process completed with exit code 1.
```

A mensagem `CI scan completed successfully` indica que a análise terminou. O código 1 indica que o resultado possui uma ocorrência bloqueante. Portanto, o scanner executou corretamente e o teste demonstrou a detecção esperada.

### Por que o pipeline está vermelho?

O segredo falso continua no arquivo de teste para demonstrar a detecção. O Semgrep o encontra e marca seu job como falho. Como pelo menos um job falhou, o workflow também apresenta falha.

Nesta etapa, a falha por detecção é o resultado didático esperado. Erros de download, permissões, sintaxe ou instalação seriam problemas diferentes e precisariam ser investigados.

### Por que o Gitleaks aparece verde em commits posteriores?

Nos logs das execuções de `push` registradas, a Gitleaks Action usou `--log-opts=-1`, analisando as adições do último commit.

Por isso, o commit que introduziu o segredo falhou. Os commits seguintes, que alteraram somente o workflow ou o README, passaram no Gitleaks. O Semgrep continuou encontrando o segredo no arquivo atual.

**`fetch-depth: 0` não significa, sozinho, que todo o histórico será analisado em cada execução.** Ele disponibiliza o histórico; o comando do scanner define o trecho analisado.

### O que um resultado verde significa?

Significa que aquela execução não identificou ocorrências bloqueantes dentro do escopo e das regras utilizadas. Não é uma garantia de ausência de vulnerabilidades e não substitui a revisão humana.

## 11. Como conferir a atividade no GitHub

1. Abra a [aba Actions](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions).
2. Na **execução #2**, abra o job `gitleaks` e a etapa **Detectar segredos com Gitleaks**. Confira `config.js`, linha 1, regra `aws-access-token` e `leaks found: 1`.
3. Na **execução #4** ou **#5**, abra o job `semgrep` e a etapa **Analisar codigo com Semgrep**. Confira o resumo com 1 ocorrência bloqueante.
4. Compare as execuções #3 e #4 para observar a correção das referências mutáveis.
5. Confira o [histórico de commits](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commits/main) para ver as etapas publicadas separadamente.

Se forem solicitadas capturas de tela, essas execuções fornecem as evidências da detecção e da execução dos dois jobs. Os links acima permitem consultar diretamente os resultados.

## 12. Histórico das etapas publicadas

| Commit | Etapa |
| --- | --- |
| [`1014d10`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/1014d10b87b781af05a3df96fa19290452390700) | Preparação do repositório e README inicial. |
| [`de072a4`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/de072a40bcf3e443a0f182dbfdaaec72da23b717) | Ativação do Gitleaks. |
| [`2e88431`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/2e88431a959c9aa924e993bcde0cda4da8492bbc) | Publicação do segredo falso do Lab 4. |
| [`aaa3d51`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/aaa3d51910ebef8897c3a47d04f33ddfd184c826) | Inclusão do Semgrep. |
| [`1a256eb`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/1a256eb65fa29aff6a75b92201f9c49ebcaf69af) | Correção dos alertas sobre referências mutáveis das Actions. |
| [`a502458`](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/commit/a502458db45cd8b51f564619fbc6c44953aaaef1) | Registro inicial das evidências e da resposta da atividade. |

## 13. Questão relâmpago

**Se a máquina revisa o código, o revisor humano perde o emprego?**

Não. As ferramentas automatizam verificações repetitivas e apontam possíveis problemas, como segredos expostos e padrões inseguros. O revisor humano continua responsável por avaliar o contexto, as regras de negócio, a arquitetura, os falsos positivos e as correções.

Neste laboratório, a ferramenta reconhece um padrão de credencial, enquanto a pessoa sabe que o valor é um exemplo falso usado na aula. Em um projeto real, é essa análise de contexto que orienta a decisão e a correção. A automação complementa a revisão humana.

## 14. Conclusão — adaptação à rotina de desenvolvimento da empresa

### Contexto profissional descrito de forma genérica

Para relacionar o laboratório à rotina profissional de um dos integrantes, consideramos uma empresa de desenvolvimento de software que mantém projetos internos e realiza entregas para clientes. A proposta é apresentada de forma genérica, sem identificar produtos, clientes, tecnologias internas ou características de projetos reais.

A adaptação consiste em incorporar o Gitleaks e o Semgrep às etapas já existentes de desenvolvimento, revisão e entrega, para que a equipe receba alertas enquanto as alterações ainda estão em análise.

### Como as ferramentas seriam utilizadas

| Situação genérica | Aplicação proposta |
| --- | --- |
| Arquivos de configuração e código-fonte | Usar o Gitleaks para procurar possíveis senhas, tokens e outras credenciais incluídas acidentalmente nos arquivos ou no histórico do Git. |
| Alterações em aplicações e serviços | Usar o Semgrep com regras adequadas às linguagens utilizadas para identificar padrões de código potencialmente inseguros. |
| Workflows de integração contínua | Analisar as configurações de automação e corrigir problemas como referências mutáveis de Actions, observados neste laboratório. |
| Revisão de código e entrega | Apresentar os resultados aos revisores e exigir a correção das ocorrências bloqueantes antes de integrar ou liberar uma alteração. |

Os exemplos são possibilidades de aplicação das ferramentas e não descrevem incidentes ou características de sistemas específicos. Credenciais reais seriam fornecidas por mecanismos de configuração protegidos, sem serem versionadas junto com o código.

### Proposta de adaptação da rotina

1. **Iniciar com um projeto piloto.** Escolher um repositório, configurar os scanners e realizar uma primeira análise do código e do histórico. A equipe avaliaria os achados existentes, os falsos positivos e os responsáveis pelas correções.

2. **Verificar antes do commit.** Integrar o Gitleaks ao fluxo local para identificar credenciais antes de seu envio ao repositório remoto. O Semgrep também poderia ser executado nas alterações relevantes para antecipar o retorno ao desenvolvedor.

3. **Executar os dois scanners nos pull requests.** Adicionar jobs independentes ao pipeline e manter seus resultados disponíveis para a revisão. As verificações no CI seriam obrigatórias mesmo quando já executadas localmente.

4. **Definir critérios para integração e entrega.** Configurar regras de proteção das branches para exigir os checks de segurança e a revisão humana. Um job vermelho, sozinho, não impede um merge: essa exigência precisa estar configurada no repositório. A liberação de uma versão dependeria dos critérios definidos pela equipe.

5. **Tratar os alertas.** O autor da alteração faria a correção com acompanhamento de um revisor. Exceções para falsos positivos precisariam de justificativa, responsável e revisão periódica. Um segredo real exposto exigiria revogação ou rotação; apagá-lo apenas da versão atual não o remove do histórico.

6. **Acompanhar e melhorar o processo.** Revisar os conjuntos de regras e as versões das ferramentas, definir varreduras periódicas e medir o tempo de execução, a taxa de falsos positivos e o tempo de correção. O escopo de análise do Git seria configurado explicitamente, considerando que o laboratório mostrou uma verificação apenas do último commit em eventos de push.

### Adoção e confidencialidade

A implantação seria gradual, começando pela calibração dos alertas no projeto piloto e evoluindo para verificações obrigatórias nas alterações novas. Os resultados seriam acessíveis somente às pessoas autorizadas e os relatórios não exibiriam valores de credenciais.

As ferramentas seriam executadas em infraestrutura aprovada pela empresa, conforme suas regras de acesso e tratamento de dados. Os conjuntos de regras seriam homologados para cada projeto. Exemplos usados em treinamentos ou publicações seriam fictícios ou genéricos, preservando informações internas.

A escolha entre a Gitleaks Action e a execução direta da Gitleaks CLI dependeria da infraestrutura e dos requisitos da equipe. No caso de uma organização GitHub, seria necessário observar a exigência de licença da Action descrita na documentação oficial.

### Resultado esperado e conclusão

O laboratório demonstrou que as ferramentas podem identificar problemas concretos: o Gitleaks detectou o segredo falso quando ele foi publicado, e o Semgrep apontou tanto esse valor quanto referências mutáveis no workflow. A correção dessas referências deixou apenas a ocorrência criada intencionalmente para o exercício.

Na empresa, a proposta permitiria antecipar a identificação de problemas, padronizar verificações repetitivas e oferecer evidências para a revisão de código. Sua eficácia seria acompanhada durante o piloto, antes da ampliação para outros projetos.

Concluímos que a inclusão do Gitleaks e do Semgrep na rotina de desenvolvimento fortalece a prevenção de falhas sem substituir a análise humana. Os desenvolvedores e revisores continuariam responsáveis por avaliar o contexto, validar os alertas e escolher as correções, em conjunto com testes e outros controles de qualidade.

## 15. Referências

- [Gitleaks Action: configuração, migração para v3 e licença para organizações](https://github.com/gitleaks/gitleaks-action#readme).
- [Gitleaks CLI e integração de pré-commit](https://github.com/gitleaks/gitleaks#readme).
- [Semgrep: exemplos de configuração para CI](https://semgrep.dev/docs/semgrep-ci/sample-ci-configs).
- [Semgrep: referência da linha de comando](https://semgrep.dev/docs/cli-reference).
- [Semgrep Community Edition e regras locais](https://github.com/semgrep/semgrep#readme).
- [Semgrep: controle de métricas](https://semgrep.dev/docs/metrics).
- [Workflow utilizado neste projeto](.github/workflows/security.yml).
- [Execuções do GitHub Actions](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions).
