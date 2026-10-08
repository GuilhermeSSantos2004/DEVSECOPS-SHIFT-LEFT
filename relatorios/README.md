# Evidencias dos labs Semgrep e Gitleaks

Execucoes de 08/10/2026 UTC. As iscas deste exercicio nao sao credenciais validas. O escopo de SAST e app/; os achados historicos ficticios continuam deliberadamente visiveis no Gitleaks.

## SAST

Semgrep 1.177.0, configuracao auto:

| Estado | ERROR | WARNING | INFO | Total |
| --- | ---: | ---: | ---: | ---: |
| Antes | 9 | 7 | 1 | 17 |
| Depois de SQL parametrizado e shell=False com acoes fixas | 5 | 7 | 1 | 13 |
| Bonus, auto + regras da guilda | 0 | 0 | 0 | 0 |

Regras customizadas antes: eval 1, shell=True 1, segredo fixo 3, exit 1. Depois: eval 1, shell=True 0, segredo fixo 3, exit 1. O bonus retornou 0 findings e exit 0. A unica supressao e a regra informativa CSRF, com justificativa no codigo de uma API sem sessao/cookie nem estado persistido; nenhum ERROR foi suprimido.

Commit inicial: fed95eb78119d2ebc7ed15d0c8aca5ec20f7beb2. Duas correcoes: bd6a1cd0118ff625964ab5b93e05ffed2eaabafe.

## Historico, excecao e hook

O provedor bloqueou a publicacao do .env original por protecao de segredos. O teste foi adaptado para um clone efemero no runner com um token Holocron aleatorio, sintetico e sem validade. Seus commits nao foram enviados ao remoto. Este teste comprova o comportamento das ferramentas, mas nao mede o .env original completo.

[Run 37709326575](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/37709326575): git com historico completo 4; dir com .env local 4; dir depois de apagar .env 2; git depois de ignorar somente um fingerprint 3. Os quatro comandos retornaram 1 por findings. O mesmo token Holocron acionou holocron-token e generic-api-key; ignorar somente uma ocorrencia nao elimina a outra.

O hook com Gitleaks 8.24.3 bloqueou o commit: hook_commit_exit=1, leaks found: 2. Na primeira tentativa, uma isca AWS nao foi detectada, por isso o teste foi repetido com Holocron. As saidas redigidas estao no artifact evidencia-lab2.

## CI e bonus

[Run com tolerancia 37709557263](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/37709557263): Semgrep success; Gitleaks failure; workflow success. Demonstra o efeito perigoso de continue-on-error no job de segredos.

[Run final 37709622134](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/actions/runs/37709622134): Semgrep success; Gitleaks failure por iscas historicas. continue-on-error ja foi removido. O Semgrep usa --error e o Gitleaks analisa o historico completo. Um CI vermelho por iscas historicas faz parte do exercicio e nao deve ser silenciado sem criterio.

[PR rascunho do bonus #1](https://github.com/GuilhermeSSantos2004/DEVSECOPS-SHIFT-LEFT/pull/1). Sete verificacoes Flask passaram: consulta legitima, rejeicao de SQL injection, acao permitida, rejeicao de comando arbitrario, decimal valido, rejeicao de codigo arbitrario e NaN. Sintaxe JavaScript validada. O PR nao foi mesclado.
