# Pendências deixadas pela etapa 1 (Simulado)

Publicada em 26/10/2026 em `https://ramonrpro.github.io/transito-em-jogo/`. A revisão final classificou estes pontos como "pode esperar". Os planos das etapas 2–4 devem considerar estes itens.

## Robustez e dados
- `src/dados/db.ts`: qualquer erro ao abrir o banco cai para memória, inclusive `VersionError`. Se um deploy com versão nova do banco for revertido, o histórico parece vazio. Tratar `VersionError` à parte, com a mensagem "Atualize o app".
- `src/simulado/fluxo.ts`: a entrega grava a tentativa e depois ~30 atualizações do caderno de erros em transações separadas, então não é atômica.
- `fluxo.ts`, `TelaQuestao.tsx` e `InicioSimulado.tsx` ainda não tratam ids que saíram do banco:
  - "Refazer erradas" pode incluir esses ids;
  - a tela da questão fica em branco;
  - o contador "já viu X de Y" pode passar de Y.
- `Banco.serializar` não tem proteção contra chamada aninhada (deadlock). Hoje nenhuma chamada é aninhada.
- `abrirBanco` espera sem prazo se uma aba antiga nunca fechar.
- `substituirTudo` não aborta se houver um throw síncrono no meio. A validação de `itens` na cópia de segurança é rasa.
- `scripts/build-placas.ts`:
  - o download não é atômico e não tem timeout;
  - mudar `ARQUIVO_FORCADO` sem `--forcar` deixa o SVG antigo com o crédito novo.

## Interface e acessibilidade (etapa 4)
- Foco perdido ao desabilitar as alternativas; a barra de progresso não tem nome acessível; o mapa das questões não tem `aria-current` e o estado "atual" esconde se a questão foi respondida ou marcada.
- O diálogo de confirmação fica aberto sobre o resultado se o tempo zerar com ele aberto.
- O aviso de erro (`.aviso-rejeicao`) pode sobrepor o aviso de atualização, e ocupa 2 linhas no topo.
- Cores fixas fora dos tokens: `#fef9c3` (ponto fraco), `#b91c1c`, `#166534`. Revisitar junto com o tema escuro.
- Links dos créditos menores que 44 px.
- Chrome, Firefox e Edge no iPhone recebem a instrução do Safari, e o botão Compartilhar fica em outro lugar nesses navegadores.
- `ProvedorDados` mostra tela em branco breve até abrir o banco.
- "Por assunto: " aparece sem nome quando a área é nula (`Resultado.tsx`).

## Conteúdo
- Conferir se outras questões cuja alternativa correta foi ajustada em relação ao banco oficial também merecem o aviso "no banco oficial…" (leg-079, leg-105, leg-114).
- `public/placas/R-22.svg` tem 432 KB, 36% do peso das placas. Otimizar com svgo dentro do script.
- O bundle principal tem ~620 kB (155 kB gzip) e gera aviso de tamanho no build.

## Testes
- Faltam testes:
  - fluxo Android do convite de instalação (`beforeinstallprompt`), regra dos 3 dias e app já instalado;
  - desempate e limiar 2/3 do resultado;
  - rótulo "Erradas" no histórico;
  - virada de mês/ano em `formatarQuando`;
  - estado limpo depois de apagar ou restaurar.
- Stubs de `URL.createObjectURL`/`revokeObjectURL` só são restaurados no caminho de sucesso dos testes de Ajustes.
- O teste da trava `encerrando` na tela não exercita a trava de fato, porque a tela já navegou para o resultado.

## Publicação
- O GitHub avisou que as actions de artefato rodam em Node 20, que está obsoleto, e que `ubuntu-latest` muda para Ubuntu 26. Atualizar as versões das actions quando houver novas.
