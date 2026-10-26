# Etapa 1 — Simulado: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** publicar em `https://ramonrpro.github.io/transito-em-jogo/` um PWA instalável e offline com:
- o simulado completo (prova, treino, por assunto, refazer erradas);
- resultado e revisão;
- caderno de erros;
- histórico básico;
- cópia de segurança;
- créditos.

**Architecture:**
- **Site estático** em Vite + React + TypeScript, com rotas por hash.
- **Conteúdo gerado de `pesquisa/`:** scripts transformam os arquivos em JSON versionado. Questões e placas são validadas antes de cada build.
- **Lógica pura em módulos testáveis:** sorteio, tentativa e cronômetro. A persistência fica em IndexedDB atrás de um repositório. As telas só combinam as duas coisas.

**Tech Stack:**
- **App:** Vite, React, TypeScript e react-router-dom (HashRouter).
- **PWA:** vite-plugin-pwa (Workbox).
- **Dados:** idb.
- **Testes:** Vitest + @testing-library/react + jsdom + fake-indexeddb, e Playwright para o fluxo completo.
- **Scripts:** tsx.
- **Ícones:** sharp.

Use as versões estáveis atuais.

**Spec:** `docs/superpowers/specs/2026-10-26-app-transito-design.md`. Esta é a etapa 1 da §8.1. As etapas 2–4 ganham planos próprios depois que esta for publicada.

**Desvio consciente da spec:** as 120 imagens de placa e a tela de créditos entram **nesta** etapa, não na 2. Motivo: 61 questões do simulado mostram uma placa.

## Global Constraints

- **Endereço definitivo:**
  - base `/transito-em-jogo/`, repositório `Ramonrpro/transito-em-jogo`;
  - não mudar depois da publicação, porque o histórico fica preso à origem.
- **Texto da interface:**
  - todo em pt-BR, com gênero neutro (ex.: "PASSOU ✔" / "NÃO PASSOU");
  - os textos entre aspas deste plano são a redação final.
- **Prova:**
  - 30 questões de 4 alternativas;
  - aprovação com **≥ 20** acertos;
  - **60 min** (3.600.000 ms);
  - cotas por área **1:8 · 2:4 · 3:13 · 4:5**.
- **Nomes das áreas:**
  - 1 "Placas e sinalização";
  - 2 "Infrações";
  - 3 "Circulação e direção defensiva";
  - 4 "Socorros, meio ambiente e manutenção".
- **Conteúdo:**
  - Os JSON em `src/conteudo/` são **gerados**; nunca editar à mão. Para mudar, altere o script ou a transformação e gere de novo.
  - Qualquer fato novo de conteúdo deve ser conferido em `pesquisa/00-REFERENCIA-COMPACTA.md`.
- **Rede e privacidade:**
  - nenhuma requisição de rede em tempo de uso, com tudo empacotado;
  - sem anúncios e sem analytics;
  - nenhum pedido de permissão ao abrir;
  - `navigator.storage.persist()` só depois de uma ação da pessoa (iniciar um simulado).
- **Mobile-first:**
  - funciona a partir de 360 px de largura;
  - alvos de toque ≥ 44 px;
  - ações na parte de baixo;
  - respeita `env(safe-area-inset-bottom)`.
- **Dados da pessoa:**
  - IndexedDB `transito-em-jogo`, versão 1;
  - atualização do app **nunca** apaga dados;
  - stores novos nas próximas etapas sobem a versão do banco e o `formato` da cópia, com migração.
- **Imagens de placa:**
  - só de `public/placas/{codigo}.svg`, geradas pelo script da Task 3;
  - o `alt` **nunca** revela a resposta (usar `alt="Imagem da placa"`).
- **Commits:**
  - pequenos, um por passo "Commit";
  - mensagem terminando com a linha `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

1. **Prova expira com o app fechado ou a tela bloqueada.** Ao reabrir, a prova é entregue automaticamente com as respostas salvas e o tempo registrado é exatamente 60:00. *(Task 6, `retomarOuEncerrar`)*
2. **Restaurar um arquivo inválido, corrompido ou de versão mais nova.** Aparece uma mensagem clara e o histórico atual fica intacto. *(Task 5 e Task 9)*
3. **Prova antiga cita uma questão que saiu do banco** (ex.: `sin-033`) ou foi alterada. Histórico e revisão não quebram e mostram um aviso no lugar da questão. *(Task 7)*
4. **Navegador sem IndexedDB** (aba anônima, Safari privado). O app funciona na sessão com armazenamento em memória e avisa que o histórico não será salvo. *(Task 5 e Task 6)*
5. **Toques repetidos rápidos**, como responder duas vezes seguidas, tocar "Entregar" duas vezes ou deixar o cronômetro zerar junto com um toque. Só o estado final é gravado, a entrega acontece uma vez e o caderno de erros não conta em dobro. *(Task 6, `fluxo`)*

---

## Estrutura de arquivos

```
CLAUDE.md                         instruções do projeto (consultar a referência sempre)
index.html  vite.config.ts  playwright.config.ts  tsconfig*.json  package.json
.github/workflows/publicar.yml
scripts/
  build-questoes.ts               pesquisa/04+05 → src/conteudo/questoes.json
  build-placas.ts                 pesquisa/02 → placas.json + creditos.json + public/placas/*.svg
  folha-placas.ts                 folha de conferência visual (tmp/, fora do git)
  check-conteudo.ts               validações (roda no prebuild)
  gerar-icones.ts                 public/icons/*.png a partir de icone.svg
public/placas/*.svg  public/icons/*
src/
  main.tsx  App.tsx  estilos.css
  util/aleatorio.ts               rng com semente + embaralhar
  util/tempo.ts                   formatarMinSeg, formatarData
  conteudo/  tipos.ts areas.ts transformar.ts placasParser.ts validar.ts index.ts *.json
  simulado/  tipos.ts regras.ts sorteio.ts tentativa.ts fluxo.ts
             telas/ InicioSimulado.tsx TelaQuestao.tsx Resultado.tsx Revisao.tsx
             componentes/ Cronometro.tsx MapaQuestoes.tsx PorQue.tsx ImagemPlaca.tsx
  dados/     db.ts repositorio.ts backup.ts
  historico/ TelaHistorico.tsx
  ajustes/   TelaAjustes.tsx TelaCreditos.tsx
  app/       BarraNavegacao.tsx Topo.tsx Confirmar.tsx contexto.tsx
             instalacao.ts ConviteInstalar.tsx AvisoAtualizacao.tsx
e2e/  navegacao.spec.ts prova.spec.ts offline.spec.ts
```

Os testes de unidade ficam ao lado do arquivo testado (`*.test.ts(x)`).

---

### Task 1: Esqueleto do app, navegação e repositório git

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `playwright.config.ts`, `.gitignore`, `CLAUDE.md`, `src/main.tsx`, `src/App.tsx`, `src/estilos.css`, `src/app/BarraNavegacao.tsx`, `src/app/Topo.tsx`
- Test: `src/App.test.tsx`, `e2e/navegacao.spec.ts`

**Interfaces:**
- Produces:
  - `ABAS: ReadonlyArray<{ rota: string; rotulo: string; icone: string }>` em `BarraNavegacao.tsx`. Nesta etapa vale `[{rota:'/simulado',rotulo:'Simulado',icone:'📝'},{rota:'/historico',rotulo:'Histórico',icone:'📊'}]`. As próximas etapas acrescentam itens.
  - `<Topo titulo: string />`, com o link de engrenagem para `#/ajustes` (aria-label "Ajustes").
  - Rotas em `App.tsx`:
    - `/` → `/simulado`
    - `/simulado`, `/simulado/:id`, `/simulado/:id/resultado`, `/simulado/:id/revisao`
    - `/historico`, `/ajustes`, `/ajustes/creditos`
  - Telas ainda não implementadas renderizam só o `<Topo>` com o título.
  - Scripts npm: `dev`, `build` (com `prebuild`), `preview`, `test` (`vitest run`), `e2e` (`playwright test`).

- [ ] **Step 1: Criar o projeto**

  Gerar com `npm create vite@latest . -- --template react-ts` (a pasta já tem `pesquisa/` e `docs/`, então não apagar nada).

  Instalar react-router-dom, idb, vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom, fake-indexeddb, @playwright/test, tsx.

  Configurar:
  - `vite.config.ts`: `base: '/transito-em-jogo/'`; Vitest com `environment: 'jsdom'` e setup que importa `@testing-library/jest-dom` e `fake-indexeddb/auto`.
  - `index.html`: `lang="pt-BR"`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, `<meta name="theme-color" content="#111111">`, `<title>Trânsito em Jogo</title>`.
  - `.gitignore`: `node_modules`, `dist`, `tmp`, `.superpowers/`, `test-results`, `playwright-report`.
  - `playwright.config.ts`: projeto com `devices['Pixel 7']`; `webServer` rodando `npm run build && npm run preview -- --port 4173`; `baseURL` `http://localhost:4173/transito-em-jogo/`.

- [ ] **Step 2: Escrever os testes que falham**

```tsx
// src/App.test.tsx
test('abre no simulado e mostra a barra inferior com Simulado e Histórico', async () => {
  window.location.hash = '#/';
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Simulado' })).toBeInTheDocument();
  const nav = screen.getByRole('navigation');
  expect(within(nav).getByText('Simulado')).toBeInTheDocument();
  expect(within(nav).getByText('Histórico')).toBeInTheDocument();
});
test('engrenagem leva a Ajustes', async () => {
  render(<App />);
  await userEvent.click(screen.getByLabelText('Ajustes'));
  expect(await screen.findByRole('heading', { name: 'Ajustes' })).toBeInTheDocument();
});
```

```ts
// e2e/navegacao.spec.ts
test('navega entre abas no celular', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Simulado' })).toBeVisible();
  await page.getByRole('navigation').getByText('Histórico').click();
  await expect(page.getByRole('heading', { name: 'Histórico' })).toBeVisible();
});
```

- [ ] **Step 3: Rodar e ver falhar.** Rodar `npm test`. Esperado: FAIL (App sem rotas/barra).

- [ ] **Step 4: Implementar `App`, `BarraNavegacao`, `Topo` e `estilos.css`**

  Definir em `:root` os tokens:
  - `--cor-texto:#111`, `--cor-fundo:#FAFAF9`, `--cor-amarelo:#FACC15`, `--cor-verde:#16A34A`, `--cor-vermelho:#DC2626`, `--cor-borda:#E5E7EB`, `--cor-suave:#6B7280`;
  - `body` com `background: var(--cor-fundo)`.

  A barra inferior fica fixa, com `padding-bottom: env(safe-area-inset-bottom)` e item ativo em `--cor-texto`. O visual segue os rascunhos em `.superpowers/brainstorm/15327-1793007766/content/`.

- [ ] **Step 5: Rodar `npm test` e `npm run e2e`.** Esperado: PASS.

- [ ] **Step 6: Escrever o `CLAUDE.md`**, com:
  - Idioma pt-BR.
  - **Antes de criar ou conferir qualquer conteúdo, consultar `pesquisa/00-REFERENCIA-COMPACTA.md`.** Os arquivos 01–06 têm os detalhes.
  - Caminhos da spec e dos planos.
  - O endereço definitivo e o motivo de não mudar.
  - "JSON de `src/conteudo/` são gerados".
  - Os comandos npm.

- [ ] **Step 7: `git init`, commit inicial**

  Incluir `pesquisa/`, `docs/` e o esqueleto: `git add -A && git commit -m "feat: esqueleto do app com navegação"`.

---

### Task 2: Conteúdo — questões

**Files:**
- Create: `src/conteudo/tipos.ts`, `src/conteudo/areas.ts`, `src/conteudo/transformar.ts`, `src/conteudo/validar.ts`, `src/conteudo/index.ts`, `scripts/build-questoes.ts`, `scripts/check-conteudo.ts`, `src/conteudo/questoes.json` (gerado)
- Test: `src/conteudo/areas.test.ts`, `src/conteudo/transformar.test.ts`, `src/conteudo/validar.test.ts`

**Interfaces:**
- Produces:
```ts
export type Area = 1 | 2 | 3 | 4;
export interface Questao {
  id: string; area: Area; tema: string; subtema: string;
  enunciado: string; alternativas: [string, string, string, string]; correta: 0 | 1 | 2 | 3;
  explicacao: string; baseLegal: string; placa: string | null; fonte: string;
  respostaBancoOficial: string | null;   // preenchido só quando o banco oficial marca outra resposta
}
export const NOMES_AREA: Record<Area, string>;            // textos das Global Constraints
export function areaDe(tema: string, subtema: string): Area;
export function transformarQuestoes(brutas: QuestaoBruta[]): Questao[];   // QuestaoBruta = formato de pesquisa/04 e 05
export function validarQuestoes(qs: Questao[], codigosPlacas: ReadonlySet<string> | null): string[]; // erros; [] = ok; null pula a regra da placa
// src/conteudo/index.ts
export const QUESTOES: Questao[]; export const QUESTOES_POR_ID: ReadonlyMap<string, Questao>;
```
- Scripts npm:
  - `conteudo:questoes` executa `tsx scripts/build-questoes.ts`;
  - `conteudo:check` executa `tsx scripts/check-conteudo.ts`;
  - `prebuild` executa `npm run conteudo:check`.

**Regras de `areaDe`:**
- `sinalizacao` → 1;
- `legislacao` com subtema `infracoes`, `penalidades` ou `crimes` → 2;
- os demais `legislacao` e todo `direcao_defensiva` → 3;
- `primeiros_socorros`, `meio_ambiente` e `mecanica` → 4;
- qualquer outro tema → lança `Error`.

**Regras de `transformarQuestoes`:**
- Processa as questões na ordem do arquivo 04 e depois do 05.
- Remove `sin-033`.
- Remove duplicatas por enunciado normalizado (minúsculas, sem pontuação), **só entre questões sem placa**, mantendo a primeira. Os pares conhecidos são `leg-111`/`dd-019`, `leg-091`/`dd-034` e `leg-131`/`ma-025`, e saem as do arquivo 05.
- Preenche `respostaBancoOficial` a partir deste mapa exato:

```ts
const RESPOSTAS_BANCO_OFICIAL: Record<string, string> = {
  'leg-074': 'Sim, desde que tenham condições de cuidar de sua própria segurança',
  'leg-113': 'Sempre, mesmo de dia, em rodovias',
  'leg-118': 'De 4 a 10 anos ou até 1,45 m',
  'sin-026': 'Infração grave',
  'ps-009': 'Posicionar-se contra o vento',
};
```

**Regras de `validarQuestoes`:** cada uma gera uma mensagem com o id da questão.
- exatamente 4 alternativas não vazias e distintas;
- `correta` entre 0 e 3;
- id único;
- `enunciado`, `explicacao` e `baseLegal` não vazios;
- `placa` nula ou presente em `codigosPlacas`;
- cada área com pelo menos a sua cota da prova.

- [ ] **Step 1: Escrever os testes que falham**

```ts
test.each([
  ['sinalizacao','placas-advertencia',1], ['legislacao','infracoes',2], ['legislacao','penalidades',2],
  ['legislacao','crimes',2], ['legislacao','habilitacao',3], ['direcao_defensiva','curvas',3],
  ['primeiros_socorros','hemorragia',4], ['meio_ambiente','residuos',4], ['mecanica','freios',4],
])('areaDe(%s,%s) = %i', (t, s, a) => expect(areaDe(t, s)).toBe(a));
test('areaDe tema desconhecido lança', () => expect(() => areaDe('x','y')).toThrow());

test('transformarQuestoes nas fontes reais', () => {
  const qs = transformarQuestoes([...lerJson('pesquisa/04-questoes-legislacao-sinalizacao.json'),
                                  ...lerJson('pesquisa/05-questoes-demais-modulos.json')]);
  expect(qs).toHaveLength(379);                         // 383 − sin-033 − 3 duplicatas
  expect(qs.find(q => q.id === 'sin-033')).toBeUndefined();
  expect(qs.map(q => q.id)).not.toContain('dd-019');
  expect(qs.find(q => q.id === 'leg-074')!.respostaBancoOficial)
    .toBe('Sim, desde que tenham condições de cuidar de sua própria segurança');
  expect(qs.filter(q => q.respostaBancoOficial).map(q => q.id).sort())
    .toEqual(['leg-074','leg-113','leg-118','ps-009','sin-026']);
});

test('validarQuestoes acusa cada problema', () => {
  const base = transformarQuestoes(fixtureValida)[0];
  const ruins = [
    { ...base, id: 'a', alternativas: ['x','y','z'] },
    { ...base, id: 'b', correta: 4 },
    { ...base, id: 'c', placa: 'R-999' },
    { ...base, id: 'd', explicacao: '' },
    { ...base, id: 'e', alternativas: ['x','x','y','z'] },
    { ...base, id: 'e' },                                // id repetido
  ] as Questao[];
  const erros = validarQuestoes(ruins, new Set(['R-1']));
  for (const id of ['a','b','c','d','e']) expect(erros.some(e => e.includes(id))).toBe(true);
});
```

- [ ] **Step 2: Rodar `npm test -- conteudo`.** Esperado: FAIL (módulos inexistentes).

- [ ] **Step 3: Implementar** `tipos.ts`, `areas.ts`, `transformar.ts` e `validar.ts`. Em seguida, `scripts/build-questoes.ts`, que lê 04 e 05, chama `transformarQuestoes` e grava `src/conteudo/questoes.json` com 2 espaços.

  Se a contagem não der 379, **liste as duplicatas e confira antes de mexer no teste**.

- [ ] **Step 4: Gerar o conteúdo e rodar os testes.** Rodar `npm run conteudo:questoes && npm test -- conteudo && npm run conteudo:check`. Esperado: PASS e "0 erros".

  Nesta task, `check-conteudo.ts` chama `validarQuestoes(QUESTOES, null)`. A Task 3 passa o conjunto real de códigos.

- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: banco de 379 questões gerado e validado"`.

---

### Task 3: Conteúdo — placas, imagens e créditos

**Files:**
- Create: `src/conteudo/placasParser.ts`, `scripts/build-placas.ts`, `scripts/folha-placas.ts`, `src/conteudo/placas.json`, `src/conteudo/creditos.json`, `public/placas/*.svg` (todos gerados pelo script)
- Modify: `src/conteudo/tipos.ts`, `src/conteudo/validar.ts`, `src/conteudo/index.ts`, `scripts/check-conteudo.ts`
- Test: `src/conteudo/placasParser.test.ts`, `src/conteudo/validar.test.ts`

**Interfaces:**
- Consumes: `validarQuestoes` (Task 2).
- Produces:
```ts
export interface Placa { codigo: string; nome: string; significado: string;
  tipo: 'regulamentacao' | 'advertencia'; arquivoCommons: string; dominioPublico: boolean }
export interface Credito { codigo: string; arquivoCommons: string; autor: string; licenca: string;
  urlLicenca: string | null; urlPagina: string }
export function lerTabelaPlacas(markdown: string): Placa[];
export function validarPlacas(placas: Placa[], creditos: Credito[], arquivosSvg: ReadonlySet<string>): string[];
export function urlPlaca(codigo: string): string;   // `${import.meta.env.BASE_URL}placas/${codigo}.svg`
// index.ts
export const PLACAS_POR_CODIGO: ReadonlyMap<string, Placa>; export const CREDITOS: Credito[];
```
- Script npm: `conteudo:placas` executa `tsx scripts/build-placas.ts` e repassa `--forcar`.
- A forma interna do `Banco` (Task 5) e os helpers de teste (`tent`, `provaComAcertos`, `renderizarRota`…) ficam a critério de quem implementa. Cada helper vive no arquivo de teste da sua task.

**Regras de `lerTabelaPlacas`:**
- Lê só as linhas de tabela de `02-sinalizacao.md` cuja primeira célula casa `/^[RA]-\d+[a-z]?$/`.
- As colunas são: código | nome | significado | arquivos | licença.
- Ignora linhas sem nenhum `` `File:...` ``.
- Escolha do arquivo quando há mais de um:
  - `R-19` usa `File:Brasil R-19 (60).svg`;
  - nos demais casos, prefere o arquivo cuja licença diz "Domínio público";
  - se nenhum for de domínio público, usa o primeiro.
- O tipo sai do prefixo do código.
- Resultado esperado: **120** placas (51 R + 69 A).

**`build-placas.ts`:**
- Chama a API do Commons: `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&format=json&titles=...`, em lotes de 50, com o header `User-Agent: transito-em-jogo/1.0 (https://github.com/Ramonrpro/transito-em-jogo)`.
- Baixa cada SVG para `public/placas/{codigo}.svg`. Pula os que já existem, a menos que receba `--forcar`.
- Grava `creditos.json` a partir do `extmetadata`: `Artist` sem HTML, `LicenseShortName`, `LicenseUrl` e `descriptionurl`.
- Tem um mapa `ARQUIVO_FORCADO: Record<string,string>` para corrigir divergências achadas na conferência visual.

- [ ] **Step 1: Escrever os testes que falham**

```ts
const trecho = `
| R-1 | Parada obrigatória | Assinala... | \`File:Brasil R-1.svg\` | CC BY-SA 3.0 — autor: Amateria1121 |
| R-2 | Dê a preferência | Obriga... | \`File:Brasil R-2.svg\`<br>\`File:BR road sign R-2.svg\` | CC BY-SA 3.0 — autor: Amateria1121<br>Domínio público (\`PD-shape (road signs)\`) |
| R-19 | Velocidade máxima permitida | Regulamenta... | \`File:Brasil R-19 (10).svg\`, \`File:Brasil R-19 (60).svg\` | CC BY-SA 4.0 |
| R-41 | Bonde/VLT | (inferido) | — | — |`;
test('lerTabelaPlacas escolhe arquivo e ignora linha sem SVG', () => {
  const p = lerTabelaPlacas(trecho);
  expect(p.map(x => x.codigo)).toEqual(['R-1','R-2','R-19']);
  expect(p[1]).toMatchObject({ arquivoCommons: 'File:BR road sign R-2.svg', dominioPublico: true });
  expect(p[2].arquivoCommons).toBe('File:Brasil R-19 (60).svg');
  expect(p[0]).toMatchObject({ nome: 'Parada obrigatória', tipo: 'regulamentacao', dominioPublico: false });
});
test('arquivo real: 120 placas, 51 R e 69 A, sem códigos repetidos', () => {
  const p = lerTabelaPlacas(fs.readFileSync('pesquisa/02-sinalizacao.md', 'utf8'));
  expect(p).toHaveLength(120);
  expect(p.filter(x => x.tipo === 'regulamentacao')).toHaveLength(51);
  expect(new Set(p.map(x => x.codigo)).size).toBe(120);
});
test('conteúdo gerado é válido de ponta a ponta', () => {
  const svgs = new Set(fs.readdirSync('public/placas').map(f => f.replace('.svg','')));
  expect(validarPlacas(placas, creditos, svgs)).toEqual([]);
  expect(validarQuestoes(QUESTOES, new Set(placas.map(p => p.codigo)))).toEqual([]);
});
```

  `validarPlacas` acusa:
  - placa sem SVG em `public/placas`;
  - placa sem crédito quando `dominioPublico` é falso;
  - crédito sem `autor` ou sem `licenca`.

- [ ] **Step 2: Rodar `npm test -- placas`.** Esperado: FAIL.

- [ ] **Step 3: Implementar** `placasParser.ts`, `validarPlacas`, `urlPlaca` e `build-placas.ts`. Depois atualizar `check-conteudo.ts` para rodar as duas validações e terminar com código 1 se houver qualquer erro.

- [ ] **Step 4: Gerar.** Rodar `npm run conteudo:placas`. Esperado: 120 arquivos em `public/placas/` e `creditos.json` com 120 entradas.

- [ ] **Step 5: Conferência visual**

  Rodar `tsx scripts/folha-placas.ts`. Ele gera `tmp/folha-placas.html`, com uma grade de imagem + código + nome oficial. Fotografar a folha com o Chrome headless: `google-chrome --headless --screenshot=tmp/folha-placas.png --window-size=1200,6000 tmp/folha-placas.html`.

  Abrir o PNG e comparar cada imagem com o nome. Para cada divergência:
  1. corrigir via `ARQUIVO_FORCADO`, escolhendo outro arquivo da mesma linha em `02-sinalizacao.md`;
  2. rodar `npm run conteudo:placas -- --forcar` de novo.

  Resultado verificável: a mensagem do commit lista as divergências corrigidas, ou "nenhuma divergência".

- [ ] **Step 6: Rodar `npm test && npm run conteudo:check`.** Esperado: PASS e "0 erros".

- [ ] **Step 7: Commit.** Rodar `git commit -m "feat: 120 placas com SVG do Commons e créditos"`.

---

### Task 4: Motor do simulado (lógica pura)

**Files:**
- Create: `src/util/aleatorio.ts`, `src/util/tempo.ts`, `src/simulado/tipos.ts`, `src/simulado/regras.ts`, `src/simulado/sorteio.ts`, `src/simulado/tentativa.ts`
- Test: `src/util/aleatorio.test.ts`, `src/simulado/sorteio.test.ts`, `src/simulado/tentativa.test.ts`

**Interfaces:**
- Consumes: `Questao`, `Area`, `QUESTOES` (Task 2).
- Produces:
```ts
// util
export function criarRng(semente: number): () => number;                 // mulberry32
export function embaralhar<T>(itens: readonly T[], rng: () => number): T[];  // Fisher–Yates, não muta
export function formatarMinSeg(ms: number): string;                       // 3_600_000 → "60:00", 65_000 → "01:05"
// regras.ts
export const PROVA = { total: 30, minimoAprovacao: 20, duracaoMs: 3_600_000,
  cotas: { 1: 8, 2: 4, 3: 13, 4: 5 } } as const;
export const TREINO_TAMANHO = 10; export const ERRADAS_MAXIMO = 30; export const ACERTOS_PARA_SAIR = 2;
// tipos.ts
export type Modo = 'prova' | 'treino' | 'assunto' | 'erradas';
export interface ItemTentativa { qid: string; ordem: number[]; resposta: number | null; revisar: boolean }
// ordem[i] = índice ORIGINAL da alternativa exibida na posição i; resposta = índice ORIGINAL
export interface ResultadoArea { acertos: number; total: number }
export interface Tentativa {
  id: string; modo: Modo; area: Area | null;
  iniciadaEm: number; terminaEm: number | null; entregueEm: number | null; autoEntregue: boolean;
  itens: ItemTentativa[]; atual: number;
  acertos: number | null; porArea: Partial<Record<Area, ResultadoArea>> | null; passou: boolean | null;
}
// sorteio.ts
export function sortearProva(qs: Questao[], vistas: ReadonlySet<string>, rng: () => number): string[];
export function sortearTreino(qs: Questao[], vistas: ReadonlySet<string>, rng: () => number,
  area: Area | null, tamanho?: number): string[];
export function sortearErradas(qids: readonly string[], rng: () => number, maximo?: number): string[];
// tentativa.ts
export function criarTentativa(p: { modo: Modo; area?: Area | null; qids: string[]; agora: number;
  rng: () => number; id?: string }): Tentativa;
export function alternativaOriginal(item: ItemTentativa, indiceExibido: number): number;
export function responder(t: Tentativa, indice: number, alternativaOriginal: number): Tentativa;
export function alternarRevisar(t: Tentativa, indice: number): Tentativa;
export function irPara(t: Tentativa, indice: number): Tentativa;
export function entregar(t: Tentativa, porId: ReadonlyMap<string, Questao>, agora: number, auto?: boolean): Tentativa;
export function restanteMs(t: Tentativa, agora: number): number | null;
export function expirou(t: Tentativa, agora: number): boolean;
export function duracaoGastaMs(t: Tentativa): number | null;
export function acertou(item: ItemTentativa, q: Questao | undefined): boolean;
```

**Regras:**
- **`sortearProva`:**
  1. Para cada área, embaralha separadamente as não vistas e as vistas e concatena nessa ordem (não vistas primeiro).
  2. Pega a cota da área.
  3. Junta tudo e embaralha a lista final.
  4. Lança `Error` se alguma área não tiver questões suficientes.
- **`sortearTreino`:** mesmo princípio, com filtro opcional de área e até `tamanho` questões.
- **`criarTentativa`:**
  - cada item recebe `ordem = embaralhar([0,1,2,3])`;
  - `terminaEm = agora + PROVA.duracaoMs` só na prova (nos outros modos é `null`);
  - `atual = 0`;
  - `id` padrão `crypto.randomUUID()`.
- **`responder`:**
  - lança se a tentativa já foi entregue;
  - fora da prova, se o item já tem resposta, devolve `t` sem mudança (o treino trava a resposta);
  - na prova, permite trocar a resposta.
- **`entregar`:**
  - se a tentativa já foi entregue, devolve `t` sem mudança;
  - questão ausente de `porId` conta como errada;
  - `passou` vale `acertos >= 20` na prova e `null` nos outros modos;
  - `entregueEm` é `terminaEm` quando `auto` é verdadeiro e `agora` caso contrário.

- [ ] **Step 1: Escrever os testes que falham**

```ts
test('sortearProva: 30 únicas com cotas 8/4/13/5', () => {
  const ids = sortearProva(QUESTOES, new Set(), criarRng(1));
  expect(new Set(ids).size).toBe(30);
  const porArea = contar(ids.map(id => QUESTOES_POR_ID.get(id)!.area));
  expect(porArea).toEqual({ 1: 8, 2: 4, 3: 13, 4: 5 });
});
test('sortearProva prioriza não vistas', () => {
  const area1 = QUESTOES.filter(q => q.area === 1).map(q => q.id);
  const naoVistas = area1.slice(0, 8);
  const vistas = new Set(QUESTOES.map(q => q.id).filter(id => !naoVistas.includes(id)));
  const ids = sortearProva(QUESTOES, vistas, criarRng(2));
  expect(ids.filter(id => QUESTOES_POR_ID.get(id)!.area === 1).sort()).toEqual([...naoVistas].sort());
});
test('sortearProva lança se faltar questão numa área', () =>
  expect(() => sortearProva(QUESTOES.filter(q => q.area !== 2), new Set(), criarRng(1))).toThrow());
test('sortearTreino por área', () => {
  const ids = sortearTreino(QUESTOES, new Set(), criarRng(3), 2);
  expect(ids).toHaveLength(10);
  expect(ids.every(id => QUESTOES_POR_ID.get(id)!.area === 2)).toBe(true);
});
test('criarTentativa da prova termina em 60 min e embaralha alternativas', () => {
  const t = criarTentativa({ modo: 'prova', qids: ['a','b'], agora: 1000, rng: criarRng(4) });
  expect(t.terminaEm).toBe(1000 + 3_600_000);
  for (const it of t.itens) expect([...it.ordem].sort()).toEqual([0,1,2,3]);
});
test('alternativaOriginal traduz a posição exibida', () =>
  expect(alternativaOriginal({ qid:'x', ordem:[2,0,3,1], resposta:null, revisar:false }, 0)).toBe(2));
test('treino trava a primeira resposta; prova permite trocar', () => {
  const tr = responder(criarTentativa({ modo:'treino', qids:['a'], agora:0, rng:criarRng(1) }), 0, 1);
  expect(responder(tr, 0, 2).itens[0].resposta).toBe(1);
  const pr = responder(criarTentativa({ modo:'prova', qids:['a'], agora:0, rng:criarRng(1) }), 0, 1);
  expect(responder(pr, 0, 2).itens[0].resposta).toBe(2);
});
test('entregar: 20 acertos passa, 19 não; porArea soma 30', () => {
  const t20 = provaComAcertos(20); const t19 = provaComAcertos(19);   // helper do teste
  expect(entregar(t20, QUESTOES_POR_ID, 5000).passou).toBe(true);
  const r19 = entregar(t19, QUESTOES_POR_ID, 5000);
  expect(r19.passou).toBe(false);
  expect(Object.values(r19.porArea!).reduce((s, a) => s + a.total, 0)).toBe(30);
});
test('entrega automática registra exatamente 60:00', () => {
  const t = entregar(provaComAcertos(10), QUESTOES_POR_ID, 9_999_999, true);
  expect(t.autoEntregue).toBe(true);
  expect(duracaoGastaMs(t)).toBe(3_600_000);
});
test('entregar duas vezes não muda nada; responder após entrega lança', () => {
  const e = entregar(provaComAcertos(10), QUESTOES_POR_ID, 5000);
  expect(entregar(e, QUESTOES_POR_ID, 9000)).toBe(e);
  expect(() => responder(e, 0, 1)).toThrow();
});
test('restanteMs nunca é negativo', () => {
  const t = criarTentativa({ modo:'prova', qids:['a'], agora:0, rng:criarRng(1) });
  expect(restanteMs(t, 4_000_000)).toBe(0);
  expect(formatarMinSeg(3_600_000)).toBe('60:00');
});
```

- [ ] **Step 2: Rodar `npm test -- simulado util`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** os módulos acima, com as assinaturas e as regras listadas.
- [ ] **Step 4: Rodar `npm test -- simulado util`.** Esperado: PASS.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: motor do simulado (sorteio, tentativa, entrega)"`.

---

### Task 5: Armazenamento local e cópia de segurança

**Files:**
- Create: `src/dados/db.ts`, `src/dados/repositorio.ts`, `src/dados/backup.ts`
- Test: `src/dados/repositorio.test.ts`, `src/dados/backup.test.ts`

**Interfaces:**
- Consumes: `Tentativa` e `ACERTOS_PARA_SAIR` (Task 4).
- Produces:
```ts
export interface EntradaErrada { qid: string; acertosSeguidos: number; erradaEm: number }
export interface Banco { persistente: boolean; /* get/put/delete/getAll/clear por store + substituirTudo */ }
export function abrirBanco(fabrica?: IDBFactory): Promise<Banco>;    // fallback em memória se abrir falhar
export interface Repositorio {
  persistente: boolean;
  salvarTentativa(t: Tentativa): Promise<void>;
  obterTentativa(id: string): Promise<Tentativa | undefined>;
  listarTentativas(): Promise<Tentativa[]>;              // só entregues, mais recentes primeiro (iniciadaEm desc)
  tentativaEmAndamento(): Promise<Tentativa | undefined>; // entregueEm === null
  descartarTentativa(id: string): Promise<void>;
  registrarResposta(qid: string, acertou: boolean, agora: number): Promise<void>;
  listarErradas(): Promise<EntradaErrada[]>;
  vistas(): Promise<Set<string>>;
  apagarTudo(): Promise<void>;
}
export function criarRepositorio(banco: Banco): Repositorio;
// backup.ts
export interface CopiaDeSeguranca { app: 'transito-em-jogo'; formato: 1; exportadaEm: number;
  tentativas: Tentativa[]; erradas: EntradaErrada[]; vistas: string[] }
export class CopiaInvalidaError extends Error { motivo: 'formato' | 'versao-nova' }
export function exportarCopia(banco: Banco, agora: number): Promise<CopiaDeSeguranca>;
export function nomeArquivoCopia(agora: number): string;   // "transito-em-jogo-copia-2026-10-26.json" (data local)
export function importarCopia(banco: Banco, bruto: unknown): Promise<void>;  // valida tudo ANTES; substitui numa transação
```

**Detalhes:**
- **Stores** do banco `transito-em-jogo` v1:
  - `tentativas` (keyPath `id`);
  - `erradas` (keyPath `qid`);
  - `vistas` (keyPath `qid`).
- **`registrarResposta`:**
  - sempre marca a questão como vista;
  - errou: grava `{acertosSeguidos: 0, erradaEm: agora}`;
  - acertou e a questão está no caderno: soma 1, e ao chegar a `ACERTOS_PARA_SAIR` remove.
- **Escritas serializadas:** passam por uma fila de promessas, para que toques rápidos não se atropelem.
- **Validação em `importarCopia`:**
  - `app` diferente, falta de arrays ou tipos errados → `motivo: 'formato'`;
  - `formato > 1` → `motivo: 'versao-nova'`.

- [ ] **Step 1: Escrever os testes que falham** (com `fake-indexeddb`, um `new IDBFactory()` por teste)

```ts
test('lista só entregues, mais recentes primeiro; em andamento à parte', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await repo.salvarTentativa(tent({ id:'a', iniciadaEm:1, entregueEm:2 }));
  await repo.salvarTentativa(tent({ id:'b', iniciadaEm:3, entregueEm:4 }));
  await repo.salvarTentativa(tent({ id:'c', iniciadaEm:5, entregueEm:null }));
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['b','a']);
  expect((await repo.tentativaEmAndamento())!.id).toBe('c');
});
test('caderno de erros: sai após 2 acertos seguidos e zera ao errar', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await repo.registrarResposta('q1', false, 10);
  await repo.registrarResposta('q1', true, 11);
  expect((await repo.listarErradas())[0].acertosSeguidos).toBe(1);
  await repo.registrarResposta('q1', false, 12);
  expect((await repo.listarErradas())[0].acertosSeguidos).toBe(0);
  await repo.registrarResposta('q1', true, 13); await repo.registrarResposta('q1', true, 14);
  expect(await repo.listarErradas()).toEqual([]);
  expect((await repo.vistas()).has('q1')).toBe(true);
});
test('respostas disparadas juntas não se perdem', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await Promise.all([repo.registrarResposta('q1', false, 1), repo.registrarResposta('q2', false, 1)]);
  expect((await repo.listarErradas()).map(e => e.qid).sort()).toEqual(['q1','q2']);
});
test('exportar → apagar → importar restaura igual', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarTentativa(tent({ id:'a', entregueEm: 2 })); await repo.registrarResposta('q1', false, 1);
  const copia = await exportarCopia(banco, Date.UTC(2026, 9, 26, 12));
  await repo.apagarTudo(); await importarCopia(banco, JSON.parse(JSON.stringify(copia)));
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['a']);
  expect((await repo.listarErradas()).map(e => e.qid)).toEqual(['q1']);
});
test.each([[{}, 'formato'], [{ app:'outro', formato:1 }, 'formato'],
  [{ app:'transito-em-jogo', formato:99, exportadaEm:1, tentativas:[], erradas:[], vistas:[] }, 'versao-nova'],
  ['não é json', 'formato']])('cópia inválida %# não toca nos dados', async (bruto, motivo) => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarTentativa(tent({ id:'a', entregueEm: 2 }));
  await expect(importarCopia(banco, bruto)).rejects.toMatchObject({ motivo });
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['a']);
});
test('sem IndexedDB: cai para memória e avisa', async () => {
  const quebrada = { open: () => { throw new Error('bloqueado'); } } as unknown as IDBFactory;
  const banco = await abrirBanco(quebrada);
  expect(banco.persistente).toBe(false);
  const repo = criarRepositorio(banco);
  await repo.salvarTentativa(tent({ id:'a', entregueEm: 2 }));
  expect(await repo.obterTentativa('a')).toBeDefined();
});
test('nome do arquivo da cópia', () =>
  expect(nomeArquivoCopia(new Date(2026, 9, 26, 15).getTime())).toBe('transito-em-jogo-copia-2026-10-26.json'));
```

- [ ] **Step 2: Rodar `npm test -- dados`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** `db.ts` (com idb e a implementação em memória com a mesma interface), `repositorio.ts` e `backup.ts`.
- [ ] **Step 4: Rodar `npm test -- dados`.** Esperado: PASS.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: armazenamento local, caderno de erros e cópia de segurança"`.

---

### Task 6: Simulado — início, questão, cronômetro e treino

**Files:**
- Create: `src/simulado/fluxo.ts`, `src/app/contexto.tsx`, `src/app/Confirmar.tsx`, `src/simulado/telas/InicioSimulado.tsx`, `src/simulado/telas/TelaQuestao.tsx`, `src/simulado/componentes/Cronometro.tsx`, `src/simulado/componentes/MapaQuestoes.tsx`, `src/simulado/componentes/PorQue.tsx`, `src/simulado/componentes/ImagemPlaca.tsx`
- Modify: `src/App.tsx` (provider + rotas)
- Test: `src/simulado/fluxo.test.ts`, `src/simulado/telas/TelaQuestao.test.tsx`, `src/simulado/telas/InicioSimulado.test.tsx`, `e2e/prova.spec.ts`

**Interfaces:**
- Consumes: Tasks 2–5.
- Produces:
```ts
// fluxo.ts — único lugar que junta motor + repositório
export class TentativaEmAndamentoError extends Error {}
export function iniciar(repo: Repositorio, p: { modo: Modo; area?: Area | null; qids?: string[];
  agora: number; rng: () => number }): Promise<Tentativa>;   // lança TentativaEmAndamentoError se houver uma
export function responderEPersistir(repo: Repositorio, t: Tentativa, indiceExibido: number, agora: number): Promise<Tentativa>;
export function entregarEPersistir(repo: Repositorio, t: Tentativa, agora: number, auto: boolean): Promise<Tentativa>;
export function retomarOuEncerrar(repo: Repositorio, agora: number): Promise<{ emAndamento?: Tentativa; encerrada?: Tentativa }>;
// contexto.tsx
export function ProvedorDados(props: { children: ReactNode; fabrica?: IDBFactory }): JSX.Element;
export function useRepositorio(): Repositorio;
export function pedirPersistencia(): void;   // navigator.storage?.persist?.(), uma vez por sessão
// Confirmar.tsx — diálogo próprio com <dialog>; nunca window.confirm
export function useConfirmar(): (p: { titulo: string; texto?: string; confirmar: string; cancelar?: string }) => Promise<boolean>;
```

**Regras do `fluxo`:**
- **`iniciar` usa o sorteio conforme o modo:**
  - `prova` → `sortearProva`;
  - `treino` → `sortearTreino(area null)`;
  - `assunto` → `sortearTreino(area)`;
  - `erradas` → `sortearErradas` sobre `p.qids`, ou sobre `listarErradas()` quando `p.qids` não vem.
- **`responderEPersistir` (fora da prova):** quando a resposta é nova, chama `registrarResposta` **uma vez**.
- **`entregarEPersistir`:**
  - se a tentativa já foi entregue, devolve a mesma sem gravar nem registrar nada;
  - na prova, registra cada item uma vez, contando sem resposta como errada.
- **`retomarOuEncerrar`:** se a tentativa em andamento for uma prova que já expirou, entrega com `auto = true`.

**Telas:**

`InicioSimulado` (`/simulado`):
- **Topo:** título "Simulado" e o subtítulo "Questões do banco oficial do Detran".
- **Cartões de modo:**
  - "🎓 Prova (igual ao Detran)" / "30 questões · 1 hora · passa com 20 · resultado só no fim"
  - "📖 Treino" / "Vê se acertou na hora, com explicação e artigo da lei"
  - "🎯 Por assunto" / "Só placas, só infrações, só primeiros socorros…": abre a escolha entre as 4 áreas (`NOMES_AREA`).
  - "❌ Refazer erradas (N)" / "Questões do seu caderno de erros": desabilitado quando N = 0.
- **Rodapé:** "Banco: já viu X de Y questões".
- **Com tentativa em andamento:** aparece no topo o cartão "Você tem uma prova em andamento · faltam mm:ss" (fora da prova, "Você tem um treino em andamento"), com os botões "Continuar" e "Descartar".
  - "Descartar" pede confirmação: "Descartar a prova em andamento?" / "Ela não vai para o histórico." / "Descartar".
  - Os outros modos continuam visíveis. Tocar num deles pede essa mesma confirmação antes de começar.
- **Ao montar:** chama `retomarOuEncerrar`. Se ele encerrou uma prova, navega para o resultado dela.
- **Primeiro "começar":** chama `pedirPersistencia()`.

`TelaQuestao` (`/simulado/:id`):
- **Tentativa já entregue:** redireciona para `/resultado`.
- **Topo:**
  - "Questão N de T", que é tocável e abre o `MapaQuestoes`;
  - na prova, `Cronometro` "⏱ mm:ss", em âmbar abaixo de 5 min;
  - barra de progresso.
- **Corpo:**
  - `ImagemPlaca` quando `placa` (`<img src={urlPlaca(codigo)} alt="Imagem da placa">`);
  - o enunciado;
  - as 4 alternativas na ordem salva, com as letras A–D.
- **Rodapé da prova:**
  - os botões "◀", "☆ Revisar depois" (quando marcada, "★ Marcada para revisar") e "▶";
  - na última questão, "▶" vira "Entregar".
- **`MapaQuestoes`:**
  - mostra os números 1..T com estado respondida, marcada ou atual, e o botão "Entregar prova";
  - "Entregar" pede confirmação: "Entregar a prova?" / "Você deixou K questões sem resposta." (o texto só aparece se K > 0) / "Entregar".
- **`Cronometro`:**
  - recalcula a partir de `terminaEm` a cada 1 s e também no `visibilitychange`;
  - ao chegar a 0, chama `entregarEPersistir(auto = true)` e navega para o resultado.
- **Treino, assunto e erradas, depois de responder:**
  - a alternativa certa recebe `data-estado="correta"` (verde) e a marcada errada `data-estado="errada"` (vermelho);
  - aparece o `PorQue`;
  - o botão vira "Próxima", e na última questão "Ver resultado", que entrega.
- **`PorQue`:**
  - "Por quê?" + `explicacao` + "📘 {baseLegal}";
  - se houver `respostaBancoOficial`: "⚠️ Atenção: no banco oficial esta questão aparece com a resposta “{x}”. Pela lei atual, o correto é a alternativa marcada em verde."
- **Aviso de memória:** se `repo.persistente` for falso, mostra no topo do app o aviso "Seu navegador não está salvando dados (modo anônimo?). O histórico desta sessão vai se perder ao fechar."

- [ ] **Step 1: Escrever os testes que falham**

```ts
// fluxo.test.ts
test('prova expirada com o app fechado é entregue sozinha, com tempo 60:00', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  const t = await iniciar(repo, { modo:'prova', agora: 0, rng: criarRng(1) });
  await responderEPersistir(repo, t, 0, 10);
  const r = await retomarOuEncerrar(repo, 3_600_000 + 5_000);
  expect(r.encerrada).toMatchObject({ id: t.id, autoEntregue: true });
  expect(duracaoGastaMs(r.encerrada!)).toBe(3_600_000);
  expect(r.encerrada!.itens[0].resposta).not.toBeNull();
  expect(await repo.tentativaEmAndamento()).toBeUndefined();
});
test('não deixa iniciar com outra em andamento', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await iniciar(repo, { modo:'treino', agora: 0, rng: criarRng(1) });
  await expect(iniciar(repo, { modo:'prova', agora: 1, rng: criarRng(1) })).rejects.toBeInstanceOf(TentativaEmAndamentoError);
});
// helper do teste: posição exibida da alternativa correta
const exibidaCorreta = (t: Tentativa, i: number) =>
  t.itens[i].ordem.indexOf(QUESTOES_POR_ID.get(t.itens[i].qid)!.correta);
test('entregar duas vezes registra o caderno uma vez só', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  const t = await iniciar(repo, { modo:'prova', agora: 0, rng: criarRng(1) });
  const qid = t.itens[0].qid;
  await repo.registrarResposta(qid, false, 0);                    // já estava no caderno (0 acertos)
  const t1 = await responderEPersistir(repo, t, exibidaCorreta(t, 0), 10);
  const e1 = await entregarEPersistir(repo, t1, 100, false);
  await entregarEPersistir(repo, e1, 200, false);
  expect((await repo.listarErradas()).find(e => e.qid === qid)!.acertosSeguidos).toBe(1);   // 2 = contou em dobro
  expect((await repo.obterTentativa(t.id))!.entregueEm).toBe(100);
});
test('treino: tocar duas vezes na mesma questão registra uma vez', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  const t = await iniciar(repo, { modo:'treino', agora: 0, rng: criarRng(1) });
  const qid = t.itens[0].qid;
  await repo.registrarResposta(qid, false, 0);
  const t1 = await responderEPersistir(repo, t, exibidaCorreta(t, 0), 1);
  await responderEPersistir(repo, t1, exibidaCorreta(t, 0), 2);
  expect((await repo.listarErradas()).find(e => e.qid === qid)!.acertosSeguidos).toBe(1);
});
```

```tsx
// TelaQuestao.test.tsx — ProvedorDados com IDBFactory nova; para não travar o fake-indexeddb,
// usar vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] })
test('prova mostra "Questão 1 de 30" e 60:00, e entrega sozinha ao zerar', async () => {
  const t = await prepararProva();                           // helper: inicia via fluxo e renderiza a rota
  expect(screen.getByText('Questão 1 de 30')).toBeInTheDocument();
  expect(screen.getByText(/60:00/)).toBeInTheDocument();
  await act(() => vi.advanceTimersByTimeAsync(3_600_000 + 1000));
  expect(await screen.findByText(/\/30/)).toBeInTheDocument();       // tela de resultado
});
test('treino mostra a correta e o "Por quê?" depois de errar', async () => {
  await prepararTreinoCom('leg-074');
  await userEvent.click(alternativaErrada());
  expect(screen.getByText('Por quê?')).toBeInTheDocument();
  expect(document.querySelector('[data-estado="correta"]')).not.toBeNull();
  expect(screen.getByText(/no banco oficial esta questão aparece com a resposta/)).toBeInTheDocument();
});
test('imagem de placa não entrega a resposta', async () => {
  await prepararTreinoCom('sin-001');
  expect(screen.getByRole('img')).toHaveAttribute('alt', 'Imagem da placa');
});
// InicioSimulado.test.tsx
test('"Refazer erradas (0)" fica desabilitado e "já viu 0 de 379"', async () => {
  renderizarRota('/simulado');
  expect(await screen.findByRole('button', { name: /Refazer erradas \(0\)/ })).toBeDisabled();
  expect(screen.getByText('Banco: já viu 0 de 379 questões')).toBeInTheDocument();
});
test('sem IndexedDB mostra o aviso de memória', async () => {
  renderizarRota('/simulado', { fabrica: fabricaQuebrada });
  expect(await screen.findByText(/não está salvando dados/)).toBeInTheDocument();
});
```

```ts
// e2e/prova.spec.ts
test('prova sobrevive a recarregar e é entregue pelo mapa', async ({ page }) => {
  await page.goto('./#/simulado');
  await page.getByText('Prova (igual ao Detran)').click();
  await page.getByRole('button', { name: /^B/ }).click();
  await page.reload();
  await expect(page.getByText('Questão 1 de 30')).toBeVisible();
  await expect(page.locator('[aria-pressed="true"]')).toHaveCount(1);   // resposta continua marcada
  await page.getByText('Questão 1 de 30').click();
  await page.getByRole('button', { name: 'Entregar prova' }).click();
  await page.getByRole('button', { name: 'Entregar', exact: true }).click();
  await expect(page.getByText(/^\d+\/30$/)).toBeVisible();
});
```

- [ ] **Step 2: Rodar `npm test -- simulado`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** `fluxo.ts`, `contexto.tsx`, `Confirmar.tsx`, as telas e os componentes acima. As alternativas são botões com `aria-pressed` quando marcadas.
- [ ] **Step 4: Rodar `npm test` e `npm run e2e -- prova`.** Esperado: PASS.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: telas do simulado com cronômetro, mapa e treino"`.

---

### Task 7: Resultado e revisão

**Files:**
- Create: `src/simulado/telas/Resultado.tsx`, `src/simulado/telas/Revisao.tsx`
- Test: `src/simulado/telas/Resultado.test.tsx`, `src/simulado/telas/Revisao.test.tsx`

**Interfaces:**
- Consumes: `iniciar` (para "Treinar …" e "Refazer só as erradas"), `duracaoGastaMs`, `acertou`, `NOMES_AREA`, `QUESTOES_POR_ID`, `PorQue`, `ImagemPlaca`.
- Produces: as rotas `/simulado/:id/resultado` e `/simulado/:id/revisao`.

**Resultado:**
- **Nota:** "{acertos}/{total}" em destaque.
- **Na prova:**
  - selo "PASSOU ✔" (verde) ou "NÃO PASSOU" (vermelho);
  - a linha "mínimo 20 · tempo {mm:ss} de 60:00", com " · entregue automaticamente" quando `autoEntregue`.
- **Fora da prova:** a linha "{Treino | Por assunto: {área} | Refazer erradas} · tempo {mm:ss}".
- **"Por assunto":** barras por área com `total > 0` (verde se acertos/total ≥ 2/3, vermelho se menor), mostrando "{a}/{t}".
- **Ponto fraco:** é a área com a menor proporção abaixo de 1; em empate, a menor área. Aparece como "💡 Ponto fraco: {nome}. Que tal um treino só disso?" mais o botão "Treinar {nome}", que inicia `assunto`.
- **Botões:**
  - "Revisar as {total} questões";
  - "Refazer só as {k} erradas", que inicia `erradas` com as erradas ou sem resposta **desta** tentativa e some quando k = 0.

**Revisão:**
- Lista todas as questões em ordem: número, imagem da placa, enunciado e as alternativas **na ordem salva**.
- Cada alternativa leva a marca "Sua resposta" (vermelha se errada) ou "Correta" (verde). Questão não respondida mostra "Sem resposta".
- Cada questão termina com o `PorQue`.
- Se uma questão não existir mais no banco, mostra o cartão "Esta questão foi removida do banco depois da sua prova." e segue para a próxima.

- [ ] **Step 1: Escrever os testes que falham**

```tsx
test('20/30 na prova: PASSOU ✔; 19/30: NÃO PASSOU', async () => {
  await renderizarResultado(provaEntregueCom(20));
  expect(screen.getByText('PASSOU ✔')).toBeInTheDocument();
  expect(screen.getByText(/mínimo 20 · tempo/)).toBeInTheDocument();
  await renderizarResultado(provaEntregueCom(19));
  expect(screen.getByText('NÃO PASSOU')).toBeInTheDocument();
});
test('aponta o ponto fraco', async () => {
  await renderizarResultado(provaComAcertosPorArea({ 1: 8, 2: 4, 3: 5, 4: 5 }));
  expect(screen.getByText('💡 Ponto fraco: Circulação e direção defensiva. Que tal um treino só disso?')).toBeInTheDocument();
});
test('revisão respeita a ordem salva e marca a resposta', async () => {
  const q = QUESTOES_POR_ID.get('sin-001')!;
  await renderizarRevisao(tentativaCom([{ qid: 'sin-001', ordem: [3,2,1,0], resposta: 3 }]));
  const alts = screen.getAllByTestId('alternativa');
  expect(alts[0]).toHaveTextContent(q.alternativas[3]);
  expect(alts[0]).toHaveTextContent('Sua resposta');
});
test('questão removida do banco não quebra a revisão', async () => {
  await renderizarRevisao(tentativaCom([{ qid: 'sin-033', ordem: [0,1,2,3], resposta: 1 },
                                         { qid: 'sin-001', ordem: [0,1,2,3], resposta: 2 }]));
  expect(screen.getByText('Esta questão foi removida do banco depois da sua prova.')).toBeInTheDocument();
  expect(screen.getAllByTestId('alternativa')).toHaveLength(4);
});
```

- [ ] **Step 2: Rodar `npm test -- Resultado Revisao`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** `Resultado.tsx` e `Revisao.tsx`.
- [ ] **Step 4: Rodar `npm test -- Resultado Revisao`.** Esperado: PASS.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: resultado por área e revisão das questões"`.

---

### Task 8: Histórico básico

**Files:**
- Create: `src/historico/TelaHistorico.tsx`
- Modify: `src/util/tempo.ts` (acrescentar `formatarQuando`)
- Test: `src/historico/TelaHistorico.test.tsx`, `src/util/tempo.test.ts`

**Interfaces:**
- Consumes: `listarTentativas`, `duracaoGastaMs`.
- Produces: `formatarQuando(ms: number, agora: number): string`, que devolve "hoje", "ontem" ou "dd/mm" no fuso local.

**Tela:**
- **Topo:** título "Histórico".
- **Duas caixas:** "{n}" / "simulados" (só modo prova) e "{m}" / "aprovados".
- **"Atividades recentes":** uma linha por tentativa entregue, da mais recente para a mais antiga.
  - Formato: "📝 Prova · 25/30 ✔" (✘ quando não passou), "📖 Treino · 8/10", "🎯 {área} · 7/10" ou "❌ Erradas · 5/6".
  - À direita: "{quando}, {min} min".
  - Tocar abre o resultado.
- **Histórico vazio:** "Nenhum simulado ainda." mais o botão "Fazer a primeira prova", que vai para `/simulado`.

- [ ] **Step 1: Escrever os testes que falham**

```tsx
test('conta simulados e aprovados e lista do mais recente', async () => {
  await renderizarHistorico([prova(25, 'ontem'), prova(18, 'hoje'), treino(8, 'hoje')]);
  expect(caixa('simulados')).toHaveTextContent('2');
  expect(caixa('aprovados')).toHaveTextContent('1');
  const linhas = screen.getAllByTestId('atividade');
  expect(linhas[0]).toHaveTextContent('Treino · 8/10');
  expect(linhas[2]).toHaveTextContent('Prova · 25/30 ✔');
});
test('histórico vazio convida a começar', async () => {
  await renderizarHistorico([]);
  expect(screen.getByText('Nenhum simulado ainda.')).toBeInTheDocument();
});
test('formatarQuando', () => {
  const agora = new Date(2026, 9, 26, 15).getTime();
  expect(formatarQuando(new Date(2026, 9, 26, 8).getTime(), agora)).toBe('hoje');
  expect(formatarQuando(new Date(2026, 9, 25, 23).getTime(), agora)).toBe('ontem');
  expect(formatarQuando(new Date(2026, 9, 3).getTime(), agora)).toBe('03/10');
});
```

- [ ] **Step 2: Rodar `npm test -- Historico tempo`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** `TelaHistorico.tsx` e `formatarQuando`.
- [ ] **Step 4: Rodar `npm test -- Historico tempo`.** Esperado: PASS.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: histórico básico dos simulados"`.

---

### Task 9: Ajustes, cópia de segurança e créditos

**Files:**
- Create: `src/ajustes/TelaAjustes.tsx`, `src/ajustes/TelaCreditos.tsx`
- Test: `src/ajustes/TelaAjustes.test.tsx`, `src/ajustes/TelaCreditos.test.tsx`

**Interfaces:**
- Consumes: `exportarCopia`, `importarCopia`, `nomeArquivoCopia`, `CopiaInvalidaError`, `apagarTudo`, `useConfirmar`, `CREDITOS`, `PLACAS_POR_CODIGO`.
- Produces: as rotas `/ajustes` e `/ajustes/creditos`. A constante `CONTEUDO_REVISADO_EM = '25/10/2026'` fica em `src/conteudo/index.ts`.

**Ajustes:**
- **Seção "Seus dados (ficam só neste celular)":**
  - **"💾 Salvar cópia do histórico":** baixa um Blob JSON com `nomeArquivoCopia(agora)`.
  - **"📂 Restaurar de uma cópia":** abre um `<input type="file" accept="application/json,.json">`.
    - Pede confirmação: "Restaurar esta cópia?" / "O histórico atual deste celular será substituído." / "Restaurar".
    - Se der certo: "Cópia restaurada."
    - Erro `formato`: "Este arquivo não é uma cópia válida do Trânsito em Jogo."
    - Erro `versao-nova`: "Esta cópia foi feita numa versão mais nova do app. Atualize o app e tente de novo."
    - Se o arquivo não for JSON válido, também é erro `formato`.
  - **"🗑 Apagar meu histórico":** pede confirmação "Apagar todo o seu histórico deste celular?" / "Isso não pode ser desfeito." / "Apagar".
- **Seção "Sobre":**
  - "Conteúdo revisado em 25/10/2026";
  - "Fontes e créditos das imagens ›", que leva a `/ajustes/creditos`;
  - "Versão {__APP_VERSION__}", com a versão vinda do `package.json` via `define` no Vite.

**Créditos:**
- **"Fontes do conteúdo":**
  - "Código de Trânsito Brasileiro (Lei 9.503/1997, texto consolidado)";
  - "Resolução Contran nº 1.020/2025";
  - "Banco Nacional de Questões v1.0 (Senatran, dez/2025)";
  - "Manual Brasileiro de Sinalização de Trânsito (Resolução Contran nº 973/2022)".
- **"Imagens das placas — Wikimedia Commons":** uma linha por crédito com código + nome, autor, licença (link para `urlLicenca`, quando houver) e o link "ver no Commons" para `urlPagina`.

- [ ] **Step 1: Escrever os testes que falham**

```tsx
test('restaurar arquivo inválido mostra erro e mantém o histórico', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }));
  await userEvent.upload(screen.getByLabelText('📂 Restaurar de uma cópia'),
    new File(['{"app":"outro"}'], 'x.json', { type: 'application/json' }));
  await userEvent.click(await screen.findByRole('button', { name: 'Restaurar' }));
  expect(await screen.findByText('Este arquivo não é uma cópia válida do Trânsito em Jogo.')).toBeInTheDocument();
  expect((await repoDoTeste().listarTentativas()).map(t => t.id)).toEqual(['a']);
});
test('apagar pede confirmação e limpa', async () => {
  await renderizarComTentativa('/ajustes', tent({ id: 'a', entregueEm: 2 }));
  await userEvent.click(screen.getByText('🗑 Apagar meu histórico'));
  await userEvent.click(await screen.findByRole('button', { name: 'Apagar' }));
  expect(await repoDoTeste().listarTentativas()).toEqual([]);
});
test('créditos lista as 120 imagens com autor e licença', () => {
  renderizarRota('/ajustes/creditos');
  const linhas = screen.getAllByTestId('credito');
  expect(linhas).toHaveLength(120);
  expect(linhas[0]).toHaveTextContent(/CC BY-SA|Domínio público|Public domain/i);
});
```

- [ ] **Step 2: Rodar `npm test -- ajustes`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** as duas telas.
- [ ] **Step 4: Rodar `npm test -- ajustes`.** Esperado: PASS.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: ajustes com cópia de segurança e créditos"`.

---

### Task 10: PWA — instalação, uso sem internet e atualização

**Files:**
- Create: `src/app/instalacao.ts`, `src/app/ConviteInstalar.tsx`, `src/app/AvisoAtualizacao.tsx`, `public/icons/icone.svg`, `scripts/gerar-icones.ts`, `public/icons/*.png` (gerados)
- Modify: `vite.config.ts` (VitePWA), `index.html` (`apple-touch-icon`, `apple-mobile-web-app-capable`), `src/App.tsx`
- Test: `src/app/instalacao.test.ts`, `e2e/offline.spec.ts`

**Interfaces:**
- Produces:
```ts
export type Plataforma = 'android-chrome' | 'ios-safari' | 'outra';
export const DIAS_PARA_REMOSTRAR = 3;
export function detectarPlataforma(userAgent: string, maxTouchPoints: number): Plataforma;
export function deveMostrarConvite(p: { instalado: boolean; dispensadoEm: number | null; agora: number;
  temPromptNativo: boolean; plataforma: Plataforma }): boolean;
```

**Regras de `deveMostrarConvite`:**
- `false` se o app já está instalado (`display-mode: standalone` ou `navigator.standalone`);
- `false` se foi dispensado há menos de 3 dias;
- `true` se há prompt nativo (`beforeinstallprompt`) ou se a plataforma é `ios-safari`;
- `false` nos demais casos.

O iPadOS se identifica como Mac: UA com "Macintosh" e `maxTouchPoints > 1` conta como `ios-safari`.

**Configuração:**
- **Manifest:**
  - `name` "Trânsito em Jogo", `short_name` "Trânsito";
  - `description` "Estude para a prova teórica do Detran: simulado, caça-palavras e flashcards.";
  - `lang` "pt-BR", `start_url` e `scope` `/transito-em-jogo/`, `display` "standalone";
  - `background_color` "#FAFAF9", `theme_color` "#111111";
  - ícones 192, 512 e 512 maskable, mais o apple-touch de 180.
- **Ícone:** um quadrado amarelo `#FACC15` com borda preta e o semáforo 🚦 desenhado em SVG. `gerar-icones.ts` usa sharp para gerar os PNG.
- **Workbox:**
  - `registerType: 'prompt'`;
  - `globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}']`, garantindo que as 120 placas entram no precache.

**Componentes:**
- **`ConviteInstalar`:**
  - Aparece 1,5 s depois da carga, como uma folha que sobe de baixo, com o texto "Instale o app" / "Abre direto da tela inicial e funciona sem internet." e os botões "Instalar" (chama o prompt nativo) e "Agora não".
  - No iOS mostra, no lugar do botão, o texto "No iPhone: toque em Compartilhar ⬆︎ e depois em “Adicionar à Tela de Início”." e o botão "Entendi".
  - "Agora não" e "Entendi" gravam `localStorage['tej:conviteDispensadoEm']`, sempre dentro de try/catch.
  - **Nunca aparece com uma prova em andamento na tela** (rota `/simulado/:id`).
- **`AvisoAtualizacao`:** usa `useRegisterSW` e mostra "Nova versão disponível" com o botão "Atualizar". Nunca atualiza sozinho.

- [ ] **Step 1: Escrever os testes que falham**

```ts
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
test('detecta plataformas', () => {
  expect(detectarPlataforma(IPHONE, 5)).toBe('ios-safari');
  expect(detectarPlataforma(IPAD, 5)).toBe('ios-safari');
  expect(detectarPlataforma(IPAD, 0)).toBe('outra');
  expect(detectarPlataforma(ANDROID, 5)).toBe('android-chrome');
});
const DIA = 86_400_000;
test.each([
  [{ instalado: true,  dispensadoEm: null,      temPromptNativo: true,  plataforma: 'android-chrome' }, false],
  [{ instalado: false, dispensadoEm: -2 * DIA,  temPromptNativo: true,  plataforma: 'android-chrome' }, false],
  [{ instalado: false, dispensadoEm: -3 * DIA - 1, temPromptNativo: true, plataforma: 'android-chrome' }, true],
  [{ instalado: false, dispensadoEm: null,      temPromptNativo: false, plataforma: 'ios-safari' }, true],
  [{ instalado: false, dispensadoEm: null,      temPromptNativo: false, plataforma: 'outra' }, false],
] as const)('deveMostrarConvite %#', (p, esperado) =>
  expect(deveMostrarConvite({ ...p, agora: 0 })).toBe(esperado));
```

```ts
// e2e/offline.spec.ts
test('depois da primeira visita funciona sem internet, com as placas', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Simulado' })).toBeVisible();
  const ok = await page.evaluate(async () => !!(await caches.match(new URL('placas/R-1.svg', location.href).href)));
  expect(ok).toBe(true);
});
test('manifest com escopo definitivo', async ({ request }) => {
  const m = await (await request.get('./manifest.webmanifest')).json();
  expect(m).toMatchObject({ scope: '/transito-em-jogo/', start_url: '/transito-em-jogo/', display: 'standalone', lang: 'pt-BR' });
});
```

- [ ] **Step 2: Rodar `npm test -- instalacao`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** `instalacao.ts`, os dois componentes, a configuração do VitePWA e os ícones (`tsx scripts/gerar-icones.ts`).
- [ ] **Step 4: Rodar `npm test && npm run e2e`.** Esperado: tudo PASS, inclusive `offline.spec.ts`.
- [ ] **Step 5: Commit.** Rodar `git commit -m "feat: PWA instalável, offline e aviso de nova versão"`.

---

### Task 11: Publicação no GitHub Pages

**Files:**
- Create: `.github/workflows/publicar.yml`, `README.md` (curto: o que é, endereço, comandos e onde fica a referência)

**Interfaces:**
- Consumes: os scripts npm `test`, `conteudo:check` e `build`.
- Produces: o site no ar em `https://ramonrpro.github.io/transito-em-jogo/`.

**Workflow `publicar.yml`** (push em `main` e `workflow_dispatch`):
1. `actions/checkout`;
2. `actions/setup-node` com Node 22 e cache npm;
3. `npm ci`;
4. `npm test`;
5. `npm run build`, que já roda `conteudo:check` no prebuild;
6. `actions/upload-pages-artifact` com `path: dist`;
7. job `deploy` com `actions/deploy-pages` e as permissões `pages: write` e `id-token: write`.

- [ ] **Step 1: Confirmar com o usuário antes de publicar**

  O repositório `Ramonrpro/transito-em-jogo` será **público** (exigência do GitHub Pages gratuito). Com isso, o código e a pasta `pesquisa/` ficam visíveis para qualquer um. Só seguir com um "sim" explícito.

- [ ] **Step 2: Trocar a conta ativa**

  Rodar `gh auth switch --hostname github.com --user Ramonrpro` e depois `gh auth status`. Esperado: "Active account: true" na linha de `Ramonrpro`.

- [ ] **Step 3: Criar o workflow e o README; commit**

  Rodar `git commit -m "ci: publicação no GitHub Pages"`.

- [ ] **Step 4: Criar o repositório e enviar**

  Rodar `git branch -M main && gh repo create Ramonrpro/transito-em-jogo --public --source . --push`.

  Em seguida, ativar o Pages via Actions: `gh api -X POST repos/Ramonrpro/transito-em-jogo/pages -f build_type=workflow`.

- [ ] **Step 5: Acompanhar a publicação**

  Rodar `gh run watch --repo Ramonrpro/transito-em-jogo`. Esperado: o workflow termina com sucesso.

- [ ] **Step 6: Verificar no ar**

  - `curl -sI https://ramonrpro.github.io/transito-em-jogo/` → `200`;
  - `curl -s https://ramonrpro.github.io/transito-em-jogo/manifest.webmanifest`, cujo `scope` deve ser `/transito-em-jogo/`;
  - os testes do Playwright contra produção: `PLAYWRIGHT_BASE_URL=https://ramonrpro.github.io/transito-em-jogo/ npx playwright test e2e/navegacao.spec.ts e2e/offline.spec.ts`. O `playwright.config.ts` usa `PLAYWRIGHT_BASE_URL` quando definida e, nesse caso, não sobe o `webServer`. Esperado: PASS.

- [ ] **Step 7: Devolver a conta ativa do `gh`**

  Voltar a conta ativa do `gh` para a que estava em uso antes da publicação.

- [ ] **Step 8: Teste no celular com o usuário**

  Passar o link e pedir que ele:
  1. abra no Android (Chrome) e veja o convite;
  2. instale;
  3. faça uma prova até o fim;
  4. ative o modo avião e reabra.

  Repetir no iPhone, se houver um à mão. Registrar o resultado na conversa antes de declarar a etapa concluída.
