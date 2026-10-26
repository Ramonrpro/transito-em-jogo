# Trânsito em Jogo

PWA para estudar a prova teórica do Detran, em português do Brasil. Tem simulado, histórico de provas e ajustes, e funciona offline depois de instalado.

## Endereço definitivo

https://ramonrpro.github.io/transito-em-jogo/

Este endereço **não pode mudar**: o histórico de cada pessoa fica guardado no navegador, preso à origem do site, e as instalações do PWA dependem desse caminho. Mudar o endereço faria todo mundo perder o progresso. Por isso o `base` do Vite é `/transito-em-jogo/`.

## Comandos

- `npm run dev`: servidor de desenvolvimento
- `npm test`: testes unitários (Vitest)
- `npm run e2e`: testes de ponta a ponta (Playwright, celular Pixel 7)
- `npm run build`: checagem de tipos, verificação do conteúdo e build de produção
- `npm run conteudo:questoes`: gera as questões em `src/conteudo/`
- `npm run conteudo:placas`: gera as placas em `src/conteudo/`
- `npm run conteudo:check`: confere o conteúdo gerado

Os JSON de `src/conteudo/` são gerados; não edite à mão, altere a fonte e gere de novo.

## Conteúdo

Todo conteúdo deve ser conferido com `pesquisa/00-REFERENCIA-COMPACTA.md` antes de entrar no app. Os arquivos `pesquisa/01` a `06` têm os detalhes.

## Publicação

A cada push na branch `main`, o workflow `.github/workflows/publicar.yml` roda os testes, faz o build e publica no GitHub Pages.
