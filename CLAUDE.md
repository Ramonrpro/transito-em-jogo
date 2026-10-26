# Trânsito em Jogo

PWA mobile-first, em pt-BR, para estudar a prova teórica do Detran (caça-palavras, simulado, histórico, ajustes). Stack: Vite + React + TypeScript, HashRouter, IndexedDB (API nativa), Vitest e Playwright.

## Regras

- Todo texto de interface em português do Brasil (pt-BR).
- **Antes de criar ou conferir qualquer conteúdo, consultar `pesquisa/00-REFERENCIA-COMPACTA.md`.** Os arquivos `pesquisa/01` a `06` têm os detalhes.
- Mobile-first: funciona a partir de 360 px, alvos de toque de pelo menos 44 px, ações na parte de baixo, respeitar `env(safe-area-inset-bottom)`.
- Sem requisições de rede em tempo de execução, sem anúncios ou analytics, sem pedidos de permissão ao abrir.
- Os JSON de `src/conteudo/` são gerados; não editar à mão (alterar a fonte e regenerar). Mudar enunciado, alternativas, correta ou placa de uma questão publicada muda a sua `versao`; revisões de provas antigas passam a mostrá-la como "atualizada".

## Documentos

- Spec: `docs/superpowers/specs/2026-10-26-app-transito-design.md`
- Planos: `docs/superpowers/plans/` (etapa atual: `2026-10-26-etapa-2-caca-palavras.md`)

## Endereço definitivo

`https://ramonrpro.github.io/transito-em-jogo/`. O `base` do Vite é `/transito-em-jogo/` e nunca deve mudar: o progresso dos usuários fica no IndexedDB da origem e links/instalações do PWA dependem desse caminho. Mudar o endereço faria todo mundo perder o histórico.

## Comandos

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: checagem de tipos e build de produção (o `prebuild` roda `conteudo:check`)
- `npm run preview`: serve o build
- `npm test`: testes unitários (Vitest)
- `npm run e2e`: testes de ponta a ponta (Playwright, celular Pixel 7)

## Commits

Pequenos; toda mensagem termina com a linha `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
