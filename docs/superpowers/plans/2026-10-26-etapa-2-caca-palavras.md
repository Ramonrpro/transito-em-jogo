# Etapa 2 — Caça-palavras: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** publicar no endereço definitivo o caça-palavras como página inicial. A etapa inclui:
- as 131 palavras do §14 da referência, com dica, significado e placa;
- o jogo com arrastar e tocar, o cartão "Achou!" e a tela de fim com recorde;
- partida salva para continuar depois;
- as partidas no histórico e na cópia de segurança.

**Architecture:**
- **Conteúdo gerado:** a fonte das palavras é `pesquisa/07-palavras.json`. Um script gera `src/conteudo/palavras.json`, validado no build contra o §14 da referência.
- **Lógica pura e testável** em `src/caca-palavras/`: temas e níveis, escolha das palavras, montagem da grade, seleção e partida.
- **Persistência:** as partidas vão para um store novo do IndexedDB (versão 2 do banco), atrás do mesmo repositório da etapa 1. As telas só combinam as duas coisas.

**Tech Stack:** a da etapa 1, sem dependências novas.

**Spec:** `docs/superpowers/specs/2026-10-26-app-transito-design.md`. Esta é a etapa 2 da §8.1. As imagens das placas e a tela de créditos já entraram na etapa 1.

**Pendências da etapa 1:** `docs/superpowers/pendencias-etapa-1.md`. Esta etapa resolve a de `VersionError`, porque é a primeira a subir a versão do banco (Task 4).

**Decisões deste plano** (minhas, para o usuário conferir):
1. **"Estudar estes cartões" fica para a etapa 3.** Os flashcards ainda não existem, e a spec já diz que o botão some quando não há cartão.
2. **Curvas e relevo** recebe LOMBADA, DEPRESSÃO, DECLIVE e ACLIVE, que no §14 estão em Placas. É a separação que a spec pede e o rascunho aprovado mostra.
3. **Vínculo palavra → placa** só onde a referência liga a palavra a uma placa: 23 palavras (tabela na Task 2).
4. **Continuar depois:** a partida em andamento fica salva e pode ser continuada, como a prova do simulado. O tempo só conta com a tela visível.
5. **Sorteio:** as palavras que a pessoa ainda não achou têm prioridade, como as questões não vistas no simulado.
6. **Direção da seleção:** marcar de trás para frente também vale, em qualquer nível. O nível só decide como as palavras são escondidas.
7. **SEMI-REBOQUE** fica na grafia do CTB (Anexo I). O significado avisa que o art. 96 usa "semirreboque".

## Global Constraints

- **Endereço definitivo:**
  - base `/transito-em-jogo/`, repositório `Ramonrpro/transito-em-jogo`;
  - nunca mudar, porque o histórico fica preso à origem.
- **Texto da interface:** todo em pt-BR. Os textos entre aspas deste plano são a redação final.
- **Temas, nesta ordem, com ícone:**

  | id | nome | ícone |
  |---|---|---|
  | `placas` | "Placas" | 🛑 |
  | `curvas` | "Curvas e relevo" | 〰️ |
  | `vias` | "Vias" | 🛣️ |
  | `regras` | "Regras" | ⚖️ |
  | `defensiva` | "Direção defensiva" | 🛡️ |
  | `socorros` | "Primeiros socorros" | 🚑 |
  | `veiculo` | "Veículo" | 🚗 |
  | `misturado` | "Misturado" (todas as palavras) | 🎲 |

- **Níveis:**

  | id | nome | grade | palavras | direções | descrição |
  |---|---|---|---|---|---|
  | `facil` | "Fácil" | 8×8 | 5 | → ↓ | "8×8 · → ↓" |
  | `medio` | "Médio" | 10×10 | 7 | + ↘ ↗ | "10×10 · + diagonal" |
  | `dificil` | "Difícil" | 12×12 | 9 | + ← ↑ ↖ ↙ | "12×12 · + de trás para frente" |

- **Grade:**
  - só letras A–Z, sem acento, cedilha nem hífen (DEPRESSÃO vira DEPRESSAO). As etiquetas mostram a palavra do mesmo jeito.
  - Só entram palavras com até `tamanho` letras.
  - Cada palavra escolhida aparece **exatamente uma vez**, lendo em qualquer uma das 8 direções.
  - Nenhuma palavra escolhida contém outra, nem de trás para frente.
  - Grade nova a cada partida.
- **Conteúdo:**
  - Os JSON em `src/conteudo/` são gerados; nunca editar à mão.
  - A fonte das palavras é `pesquisa/07-palavras.json`.
  - O conjunto de palavras é **exatamente** o do §14 de `pesquisa/00-REFERENCIA-COMPACTA.md`.
  - Todo texto novo (dica, significado, fonte) tem base na referência.
- **Rede e privacidade:**
  - nenhuma requisição de rede em tempo de uso;
  - sem anúncios e sem analytics;
  - nenhum pedido de permissão ao abrir;
  - `pedirPersistencia()` só depois de uma ação da pessoa ("Começar" ou "Jogar de novo").
- **Mobile-first:**
  - funciona a partir de 360 px;
  - alvos de toque ≥ 44 px, ações na parte de baixo, `env(safe-area-inset-bottom)`.
  - **Exceção:** as casas da grade. No 12×12 a 360 px cada uma tem ~27 px. Arrastar com encaixe na direção mais próxima compensa a falta de precisão.
- **Dados da pessoa:**
  - IndexedDB `transito-em-jogo` passa para a **versão 2**, com o store `partidas` (keyPath `id`);
  - atualização nunca apaga dados;
  - a cópia de segurança passa para o **formato 2** e continua lendo o formato 1.
- **Imagens de placa:**
  - só de `public/placas/{codigo}.svg`;
  - no simulado o `alt` continua genérico;
  - no "Achou!" e no fim da partida o `alt` pode dizer a placa, porque a palavra já foi achada.
- **Visual:**
  - cores novas como tokens em `:root`, nunca soltas no CSS;
  - letra escura sobre as cores das palavras achadas, com contraste ≥ 4,5:1;
  - animações desligadas com `prefers-reduced-motion: reduce`.
- **Commits:**
  - pequenos, um por passo "Commit", no ramo `etapa-2-caca-palavras`;
  - mensagem terminando com a linha `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`;
  - autor com o e-mail noreply já configurado no repositório. Nada pessoal nos arquivos: sem nomes, datas de prova ou outras contas.

## Review Focus

1. **O celular fecha o app no meio da partida.** O iPhone faz isso ao trocar para o WhatsApp. Ao reabrir, o início oferece "Continuar", com as palavras achadas e o tempo preservados. O tempo com o app em segundo plano não conta. *(Task 5, Task 6)*
2. **Atualização com histórico da etapa 1.**
   - O banco versão 1 com simulados vira versão 2 sem perder nada.
   - Uma cópia de formato 1 continua sendo restaurada.
   - "Apagar meu histórico" também apaga as partidas.

   *(Task 4)*
3. **Código antigo diante de banco mais novo.** Acontece com uma aba antiga aberta ou um deploy revertido. Aparece "Atualize o app", nunca o modo memória com o histórico vazio. *(Task 4)*
4. **Arrasto impreciso.** O dedo sai da linha, passa da grade, vai de trás para frente, ou treme num toque. Também tocar na primeira e na última letra, ou marcar de novo uma palavra já achada. Em todos os casos, no máximo uma palavra é marcada, nunca em dobro. *(Task 3 `selecao`, Task 5)*
5. **Grade ambígua ou impossível.** Todo tema × nível monta grade em muitas sementes. Cada palavra aparece uma vez só, e nenhuma fica dentro de outra. *(Task 3)*

---

## Estrutura de arquivos

```
pesquisa/07-palavras.json              fonte das 131 palavras (escrita à mão, conferida com a referência)
scripts/build-palavras.ts              pesquisa/07 → src/conteudo/palavras.json
scripts/check-conteudo.ts              + validarPalavras
src/conteudo/
  tipos.ts                             + TemaPalavra, PalavraBruta, Palavra
  palavras.ts                          TEMAS_PALAVRA, normalizarPalavra, lerPalavrasReferencia,
                                       transformarPalavras, validarPalavras
  palavras.json                        gerado
  index.ts                             + PALAVRAS, PALAVRAS_POR_GRADE
src/caca-palavras/
  tipos.ts                             Nivel, TemaPartida, Direcao, Colocacao, Partida
  regras.ts                            TEMAS, NIVEIS, nomeTema
  grade.ts                             escolherPalavras, gerarGrade, ocorrencias
  selecao.ts                           linhaEntre, celulaNoPonto, conferirSelecao
  partida.ts                           palavrasDoTema, criarPartida, registrarAchada,
                                       palavrasJaAchadas, resumoRecorde
  fluxo.ts                             iniciarPartida (repositório + criarPartida)
  useNovaPartida.ts                    hook: guarda de partida em andamento + iniciar + navegar
  componentes/ Grade.tsx Etiquetas.tsx CartaoAchou.tsx
  telas/ InicioCacaPalavras.tsx TelaPartida.tsx FimPartida.tsx
src/dados/db.ts  repositorio.ts  backup.ts      versão 2, partidas, formato 2
src/app/contexto.tsx                   tela "Atualize o app"
src/App.tsx  src/app/BarraNavegacao.tsx        rotas, página inicial e aba
src/historico/TelaHistorico.tsx        partidas nas atividades recentes
src/simulado/componentes/ImagemPlaca.tsx       prop `alt` opcional
e2e/caca-palavras.spec.ts  navegacao.spec.ts  offline.spec.ts
```

---

### Task 1: Palavras — formato, normalização e validação

**Files:**
- Modify: `src/conteudo/tipos.ts`
- Create: `src/conteudo/palavras.ts`, `scripts/build-palavras.ts`
- Modify: `package.json` (script `conteudo:palavras`)
- Test: `src/conteudo/palavras.test.ts`

**Interfaces:**
- Produces:
```ts
// tipos.ts
export type TemaPalavra = 'placas' | 'curvas' | 'vias' | 'regras' | 'defensiva' | 'socorros' | 'veiculo';
/** Formato de pesquisa/07-palavras.json. */
export interface PalavraBruta {
  palavra: string;        // grafia correta em maiúsculas: "DEPRESSÃO", "PISCA-ALERTA"
  tema: TemaPalavra;
  dica: string;           // mostrada ao tocar na etiqueta
  significado: string;    // mostrado no "Achou!"
  placa: string | null;   // código em PLACAS, ou null
  base: string;           // fonte oficial curta: "CTB, Anexo I", "MBST Vol. II (A-19)"
}
export interface Palavra extends PalavraBruta {
  grade: string;          // normalizada e única: "DEPRESSAO", "PISCAALERTA"
}
// palavras.ts
export const TEMAS_PALAVRA: readonly TemaPalavra[];  // na ordem da tabela de temas
export function normalizarPalavra(palavra: string): string;
export interface PalavraReferencia { palavra: string; grupo: string; dica: string }
export function lerPalavrasReferencia(markdown: string): PalavraReferencia[];
export function transformarPalavras(brutas: PalavraBruta[]): Palavra[];
export function validarPalavras(
  ps: Palavra[],
  codigosPlacas: ReadonlySet<string> | null,
  referencia: readonly string[] | null,   // grafias do §14; null pula a comparação
): string[];
```

**Regras:**
- **`normalizarPalavra`:** NFD, remove as marcas combinantes, remove hífens e espaços e põe em maiúsculas.
- **`lerPalavrasReferencia`:**
  1. Lê só a seção que começa em `## 14.` e termina no próximo `## `.
  2. Cada linha `**Grupo:** PALAVRA: dica; PALAVRA: dica; ….` vira itens, com `grupo` sem os asteriscos e os dois-pontos.
  3. Os itens são separados por `"; "`. Cada um é cortado no **primeiro** `": "`, então `TORNIQUETE: prova: "não"` dá a dica `prova: "não"`.
  4. O ponto final da linha sai.
- **`transformarPalavras`:** acrescenta `grade = normalizarPalavra(palavra)` e mantém a ordem.
- **`validarPalavras`** devolve uma mensagem por problema, sempre começando por `${palavra}: `:
  - `grade "X" precisa ter de 3 a 12 letras A–Z`, quando não casa com `/^[A-Z]{3,12}$/`;
  - `grade diferente da palavra normalizada`;
  - `grade repetida`;
  - `tema desconhecido`;
  - `dica vazia` / `dica com mais de 80 caracteres`;
  - `significado vazio` / `significado com mais de 200 caracteres`;
  - `base vazia`;
  - `placa X inexistente`;
  - `está no §14 da referência e falta em pesquisa/07` (formato `${palavra}: …` para a palavra da referência);
  - `não está no §14 da referência`.
- **`scripts/build-palavras.ts`:**
  - segue o molde de `scripts/build-questoes.ts`;
  - lê `pesquisa/07-palavras.json`, aplica `transformarPalavras` e grava `src/conteudo/palavras.json` com 2 espaços e `\n` no fim;
  - imprime `N palavras gravadas em src/conteudo/palavras.json`;
  - npm script `"conteudo:palavras": "tsx scripts/build-palavras.ts"`.
  - A fonte só passa a existir na Task 2. Nesta task o script não roda.

- [ ] **Step 1: Escrever os testes que falham**

```ts
const ok = (p: Partial<Palavra> = {}): Palavra => ({
  palavra: 'CURVA', grade: 'CURVA', tema: 'curvas', dica: 'Placa A-2: curva suave',
  significado: 'Avisa uma curva suave adiante.', placa: 'A-2a', base: 'MBST Vol. II', ...p,
});
const PL = new Set(['A-2a']);

test('normalizarPalavra tira acento, cedilha e hífen', () => {
  expect(normalizarPalavra('DEPRESSÃO')).toBe('DEPRESSAO');
  expect(normalizarPalavra('PISCA-ALERTA')).toBe('PISCAALERTA');
  expect(normalizarPalavra('CARROÇA')).toBe('CARROCA');
  expect(normalizarPalavra('MICROÔNIBUS')).toBe('MICROONIBUS');
  expect(normalizarPalavra('freio-motor')).toBe('FREIOMOTOR');
});
test('lerPalavrasReferencia lê as 131 palavras do §14 da referência', () => {
  const ref = lerPalavrasReferencia(readFileSync('pesquisa/00-REFERENCIA-COMPACTA.md', 'utf8'));
  expect(ref).toHaveLength(131);
  expect([...new Set(ref.map(r => r.grupo))]).toEqual(
    ['Placas', 'Curvas', 'Vias', 'Regras', 'Direção defensiva', 'Primeiros socorros', 'Veículo']);
  expect(ref.find(r => r.palavra === 'DEPRESSÃO')).toEqual({ palavra: 'DEPRESSÃO', grupo: 'Placas', dica: 'A-19' });
  expect(ref.find(r => r.palavra === 'TORNIQUETE')!.dica).toBe('prova: "não"');
  expect(ref.at(-1)).toEqual({ palavra: 'RECALL', grupo: 'Veículo', dica: 'chamado gratuito' });
});
test('transformarPalavras acrescenta a grade', () =>
  expect(transformarPalavras([{ ...ok(), palavra: 'TÚNEL' }])[0].grade).toBe('TUNEL'));
test('aceita palavra válida', () => expect(validarPalavras([ok()], PL, ['CURVA'])).toEqual([]));
test.each([
  [{ grade: 'CURVA1' }, 'CURVA: grade "CURVA1" precisa ter de 3 a 12 letras A–Z'],
  [{ palavra: 'ABCDEFGHIJKLM', grade: 'ABCDEFGHIJKLM' }, 'de 3 a 12 letras'],
  [{ grade: 'CURVO' }, 'grade diferente da palavra normalizada'],
  [{ tema: 'outro' as never }, 'tema desconhecido'],
  [{ dica: ' ' }, 'dica vazia'],
  [{ dica: 'x'.repeat(81) }, 'dica com mais de 80 caracteres'],
  [{ significado: 'x'.repeat(201) }, 'significado com mais de 200 caracteres'],
  [{ base: '' }, 'base vazia'],
  [{ placa: 'A-99' }, 'placa A-99 inexistente'],
])('rejeita %o', (p, trecho) =>
  expect(validarPalavras([ok(p)], PL, null).join('\n')).toContain(trecho));
test('grade repetida', () =>
  expect(validarPalavras([ok(), ok()], PL, null).join('\n')).toContain('CURVA: grade repetida'));
test('compara com o §14 nos dois sentidos', () => {
  expect(validarPalavras([ok()], PL, ['CURVA', 'SINUOSA']).join('\n'))
    .toContain('SINUOSA: está no §14 da referência e falta em pesquisa/07');
  expect(validarPalavras([ok(), ok({ palavra: 'RETA', grade: 'RETA' })], PL, ['CURVA']).join('\n'))
    .toContain('RETA: não está no §14 da referência');
});
```

- [ ] **Step 2: Rodar `npm test -- palavras`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** os tipos, `palavras.ts`, o script e o npm script.
- [ ] **Step 4: Rodar `npm test -- palavras`.** Esperado: PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat: formato, normalização e validação das palavras"`

---

### Task 2: Palavras — o conteúdo das 131 palavras

**Files:**
- Create: `pesquisa/07-palavras.json`
- Create (gerado): `src/conteudo/palavras.json`
- Modify: `src/conteudo/index.ts`, `scripts/check-conteudo.ts`
- Test: `src/conteudo/palavras.test.ts` (acrescentar)

**Interfaces:**
- Consumes: `PalavraBruta`, `lerPalavrasReferencia`, `transformarPalavras` e `validarPalavras` (Task 1); `PLACAS` e `PLACAS_POR_CODIGO` (etapa 1).
- Produces:
```ts
// index.ts
export const PALAVRAS: Palavra[];                                  // ordem de pesquisa/07
export const PALAVRAS_POR_GRADE: ReadonlyMap<string, Palavra>;
```

**Antes de escrever, ler na referência** (`pesquisa/00-REFERENCIA-COMPACTA.md`):
- §14 (a lista e as dicas);
- §6 (placas e curvas);
- §7 (Anexo I, as definições de vias, veículos e termos);
- §5 (velocidades);
- §2–§3 (habilitação, infrações, penalidades);
- §8 (direção defensiva);
- §9 (primeiros socorros);
- §11 (manutenção);
- §13 (erros do banco oficial).

Para detalhe, os arquivos `pesquisa/01` a `03`. O nome e o significado oficial de cada placa estão em `src/conteudo/placas.json`.

**Tema e placa de cada palavra** (decisão deste plano; a ordem dentro do tema segue o §14):

| tema | palavras (placa entre parênteses; sem parênteses = `null`) |
|---|---|
| `placas` (16) | PARE (R-1), OCTÓGONO (R-1), PREFERÊNCIA (R-2), ADVERTÊNCIA, INDICAÇÃO, LOSANGO, TARJA, ALFÂNDEGA (R-21), CORRENTE (R-22), ROTATÓRIA (R-33), BUZINA (R-20), SEMÁFORO (A-14), OBRAS (A-24), ESCORREGADIA (A-28), CONFLUÊNCIA (A-13a), BIFURCAÇÃO (A-9) |
| `curvas` (13) | CURVA (A-2a), ACENTUADA (A-1a), SINUOSA (A-3a), TANGENTE (A-5a), CENTRÍFUGA, INÉRCIA, ESQUERDA, DIREITA, TRAÇADO, LOMBADA (A-18), DEPRESSÃO (A-19), DECLIVE (A-20a), ACLIVE (A-20b) |
| `vias` (20) | as 20 do grupo Vias do §14; só CRUZAMENTO tem placa (A-6) |
| `regras` (24) | as 24 do grupo Regras; só ULTRAPASSAR (R-7) e ESTACIONAR (R-6a) têm placa |
| `defensiva` (22) | as 22 do grupo Direção defensiva, sem placa |
| `socorros` (16) | as 16 do grupo Primeiros socorros, sem placa |
| `veiculo` (20) | as 20 do grupo Veículo, sem placa |

**Como escrever cada campo:**
- **`palavra`:** exatamente a grafia do §14, com acento e hífen.
- **`dica`:**
  - é a dica do §14 reescrita como frase curta e legível, com no máximo 80 caracteres;
  - sem abreviações: "p/" vira "para", "ped." vira "pedestre", "gráv." vira "gravíssima", "c/" vira "com";
  - mesmos fatos do §14, nada novo;
  - pode manter o "___" (ex.: `Placa R-2: "Dê a ___"`).
- **`significado`:**
  - 1 ou 2 frases, no máximo 200 caracteres, em linguagem simples para quem estuda para a prova;
  - só fatos que estão na referência;
  - **com placa:** começar pelo que a placa indica, conforme o significado em `placas.json`. Não repetir o código, que o cartão já mostra;
  - **termos do Anexo I:** parafrasear a definição do §7;
  - nunca escrever "acidente". Usar "sinistro", exceto em SINISTRO, para dizer que o termo substituiu "acidente" (Lei 14.599/2023);
  - **quando a prova e o correto atual divergem (§13), dizer as duas coisas.** TORNIQUETE: na prova a resposta é "não"; AHA e Cruz Vermelha (2024) admitem o torniquete em hemorragia grave de braço ou perna, feito por pessoa treinada;
  - fato marcado com ⚠️ na referência não entra como certeza: tirar o detalhe ou dizer que é recomendação;
  - **SEMI-REBOQUE:** mencionar que o art. 96 usa a grafia "semirreboque". MICROÔNIBUS e INTERSEÇÃO seguem a grafia do Anexo I (§7).
- **`base`:**
  - fonte oficial curta, como a referência a nomeia: "CTB, Anexo I", "CTB, art. 61", "CTB, art. 258", "MBST Vol. II (A-19)", "Res. Contran 819/2021", "Lei 14.599/2023", "Banco Nacional de Questões", "Ministério da Saúde", "AHA 2025";
  - nunca "referência §x".

- [ ] **Step 1: Escrever os testes que falham** (acrescentar em `palavras.test.ts`)

```ts
test('conteúdo: 131 palavras válidas e iguais ao §14', () => {
  const ref = lerPalavrasReferencia(readFileSync('pesquisa/00-REFERENCIA-COMPACTA.md', 'utf8'));
  expect(validarPalavras(PALAVRAS, new Set(PLACAS.map(p => p.codigo)), ref.map(r => r.palavra))).toEqual([]);
  expect(PALAVRAS).toHaveLength(131);
});
test('conteúdo: contagem por tema', () => {
  const n = (t: TemaPalavra) => PALAVRAS.filter(p => p.tema === t).length;
  expect(TEMAS_PALAVRA.map(n)).toEqual([16, 13, 20, 24, 22, 16, 20]);
});
test('conteúdo: vínculos de placa da tabela', () => {
  const placa = (w: string) => PALAVRAS_POR_GRADE.get(w)!.placa;
  expect(placa('DEPRESSAO')).toBe('A-19');
  expect(placa('CONFLUENCIA')).toBe('A-13a');
  expect(placa('ESTACIONAR')).toBe('R-6a');
  expect(placa('LOSANGO')).toBeNull();
  expect(PALAVRAS.filter(p => p.placa !== null)).toHaveLength(23);
});
test('conteúdo: nunca fala em "acidente" fora de SINISTRO', () => {
  for (const p of PALAVRAS) if (p.grade !== 'SINISTRO')
    expect(`${p.dica} ${p.significado}`.toLowerCase()).not.toContain('acidente');
});
test('conteúdo: torniquete traz a prova e a diretriz atual', () => {
  const s = PALAVRAS_POR_GRADE.get('TORNIQUETE')!.significado;
  expect(s).toMatch(/prova/i);
  expect(s).toMatch(/hemorragia grave/i);
});
```

- [ ] **Step 2: Rodar `npm test -- palavras`.** Esperado: FAIL, porque não há `palavras.json`.
- [ ] **Step 3: Escrever `pesquisa/07-palavras.json`** com as 131 entradas, conforme a tabela e as regras acima.
- [ ] **Step 4: Gerar e expor**
  - Rodar `npm run conteudo:palavras`. Esperado: `131 palavras gravadas em src/conteudo/palavras.json`.
  - Acrescentar `PALAVRAS` e `PALAVRAS_POR_GRADE` em `index.ts`, no molde de `QUESTOES` e `QUESTOES_POR_ID`.
- [ ] **Step 5: Ligar a validação no build**
  - Em `scripts/check-conteudo.ts`, somar `validarPalavras(PALAVRAS, codigos das PLACAS, grafias de lerPalavrasReferencia(referência))` aos erros.
  - Rodar `npm run conteudo:check`. Esperado: `0 erros`.
- [ ] **Step 6: Rodar `npm test`.** Esperado: PASS (tudo).
- [ ] **Step 7: Folha de conferência para o revisor**
  - Gerar `tmp/palavras-conferencia.md` (fora do git), com uma linha por palavra: palavra · tema · placa · dica · significado · base.
  - O revisor confere cada linha contra a referência.
- [ ] **Step 8: Commit.** `git commit -m "feat: as 131 palavras do caça-palavras, com dica, significado e placa"`

---

### Task 3: Motor do caça-palavras (lógica pura)

**Files:**
- Create: `src/caca-palavras/tipos.ts`, `regras.ts`, `grade.ts`, `selecao.ts`, `partida.ts`
- Test: `src/caca-palavras/grade.test.ts`, `selecao.test.ts`, `partida.test.ts`

**Interfaces:**
- Consumes: `Palavra`, `TemaPalavra`, `PALAVRAS`, `PALAVRAS_POR_GRADE` (Task 2); `criarRng`, `embaralhar` (`src/util/aleatorio.ts`).
- Produces:
```ts
// tipos.ts
export type Nivel = 'facil' | 'medio' | 'dificil';
export type TemaPartida = TemaPalavra | 'misturado';
export type Direcao = readonly [number, number];   // [passo na linha, passo na coluna]
export interface Colocacao {
  palavra: string;       // grade da palavra
  celulas: number[];     // índices linha*tamanho+coluna, na ordem de leitura da palavra
}
export interface Partida {
  id: string; tema: TemaPartida; nivel: Nivel; tamanho: number;
  letras: string;        // tamanho² letras A–Z, linha por linha
  colocacoes: Colocacao[];
  achadas: string[];     // grades, na ordem em que foram achadas
  iniciadaEm: number; terminadaEm: number | null;
  tempoMs: number;       // tempo com a tela visível, acumulado até a última gravação
}
// regras.ts
export const TEMAS: ReadonlyArray<{ id: TemaPartida; nome: string; icone: string }>;
export const NIVEIS: Record<Nivel, { nome: string; tamanho: number; palavras: number;
  direcoes: readonly Direcao[]; descricao: string }>;
export const ORDEM_NIVEIS: readonly Nivel[];   // ['facil', 'medio', 'dificil']
export function nomeTema(t: TemaPartida): string;
// grade.ts
export function escolherPalavras(candidatas: readonly Palavra[], quantidade: number, tamanho: number,
  jaAchadas: ReadonlySet<string>, rng: () => number): Palavra[];
export function gerarGrade(palavras: readonly string[], tamanho: number, direcoes: readonly Direcao[],
  rng: () => number): { letras: string; colocacoes: Colocacao[] } | null;
export function ocorrencias(letras: string, tamanho: number, palavra: string): number[][];
// selecao.ts
export function linhaEntre(inicio: number, fim: number, tamanho: number): number[];
export function celulaNoPonto(ret: { left: number; top: number; width: number; height: number },
  tamanho: number, x: number, y: number): number;
export function conferirSelecao(p: Partida, celulas: readonly number[]): string | null;
// partida.ts
export function palavrasDoTema(tema: TemaPartida, todas?: readonly Palavra[]): Palavra[];  // padrão PALAVRAS
export function criarPartida(p: { tema: TemaPartida; nivel: Nivel; jaAchadas: ReadonlySet<string>;
  agora: number; rng: () => number; id?: string; palavras?: readonly Palavra[] }): Partida;
export function registrarAchada(p: Partida, palavra: string, agora: number, tempoMs: number): Partida;
export function palavrasJaAchadas(partidas: readonly Partida[]): Set<string>;
export function resumoRecorde(p: Partida, todas: readonly Partida[]):
  { melhorMs: number; novoRecorde: boolean; primeira: boolean };
```

**Valores:** `TEMAS` e `NIVEIS` são as tabelas das Global Constraints. As direções de cada nível são:
- `facil`: `[0,1]`, `[1,0]`;
- `medio`: as de `facil` + `[1,1]`, `[-1,1]`;
- `dificil`: as de `medio` + `[0,-1]`, `[-1,0]`, `[-1,-1]`, `[1,-1]`.

**Regras:**
- **`escolherPalavras`:**
  1. Fica só com as que têm `grade.length <= tamanho`.
  2. Embaralha à parte as não achadas e as já achadas e junta nessa ordem (não achadas primeiro).
  3. Percorre a lista e pula a palavra cuja grade contém, ou está contida em, uma grade já escolhida, lida normal ou ao contrário.
  4. Para em `quantidade`. Pode devolver menos, e quem chama decide.
- **`gerarGrade`:**
  1. Coloca as palavras da mais longa para a mais curta.
  2. Para cada uma, lista todos os pares (início, direção) em que ela cabe na grade, com cada casa vazia ou já com a mesma letra. Sorteia um par com `rng`. Se não houver nenhum, devolve `null`.
  3. Preenche as casas vazias com letras sorteadas uniformemente do conjunto de letras das palavras escolhidas, concatenadas, para a frequência parecer de português.
  4. Confere se cada palavra tem `ocorrencias(...)` de tamanho 1. Se não, refaz o passo 3 até 20 vezes e depois devolve `null`.
- **`ocorrencias`:** todos os caminhos, nas 8 direções e em qualquer início, que leem a palavra. Caminhos com o mesmo conjunto de casas contam uma vez só, o que cobre os palíndromos.
- **`linhaEntre`:**
  - Encaixa o arrasto na direção mais próxima das 8: o ângulo `atan2(Δlinha, Δcoluna)` é arredondado para o múltiplo de 45° mais próximo.
  - Anda `max(|Δlinha|, |Δcoluna|)` passos a partir do início e corta na borda da grade.
  - Com `inicio === fim`, devolve `[inicio]`.
- **`celulaNoPonto`:** converte as coordenadas da tela para a casa, prendendo nas bordas quando o dedo sai da grade. Com `width` ou `height` 0 devolve `-1`, o que acontece no jsdom e com a grade ainda sem layout. Nesse caso a grade não começa arrasto.
- **`conferirSelecao`:** devolve a grade da palavra **ainda não achada** cuja colocação é igual a `celulas` ou ao contrário dela. Caso contrário, `null`.
- **`palavrasDoTema`:** `misturado` usa todas as palavras; os outros temas filtram por `tema`.
- **`criarPartida`:**
  - até 50 tentativas de `escolherPalavras` + `gerarGrade` com a configuração do nível;
  - lança `Error('Não foi possível montar a grade')` se nenhuma der certo, ou se `escolherPalavras` devolver menos que `NIVEIS[nivel].palavras`;
  - `achadas = []`, `terminadaEm = null`, `tempoMs = 0`, `iniciadaEm = agora`, `id` padrão `crypto.randomUUID()`.
- **`registrarAchada`:**
  - devolve `p` sem mudança se a partida já terminou, se a palavra não é dela ou se já foi achada;
  - senão, acrescenta a palavra, grava o `tempoMs` recebido e, com a última palavra, faz `terminadaEm = agora`.
- **`resumoRecorde`:**
  - compara com as partidas concluídas do mesmo tema e nível, com outro `id` e `terminadaEm` anterior ao de `p`;
  - `primeira`: não há nenhuma anterior;
  - `novoRecorde`: há anteriores e `p.tempoMs` é menor que o melhor delas;
  - `melhorMs`: o menor entre `p.tempoMs` e as anteriores.

- [ ] **Step 1: Escrever os testes que falham**

```ts
// grade.test.ts
const dirDe = (cel: number[], n: number) =>
  [Math.sign(Math.floor(cel[1] / n) - Math.floor(cel[0] / n)), Math.sign((cel[1] % n) - (cel[0] % n))];
test('todo tema × nível monta grade válida (100 sementes)', () => {
  for (const { id: tema } of TEMAS) for (const nivel of ORDEM_NIVEIS) for (let s = 1; s <= 100; s++) {
    const cfg = NIVEIS[nivel];
    const p = criarPartida({ tema, nivel, jaAchadas: new Set(), agora: 0, rng: criarRng(s) });
    expect(p.letras).toMatch(new RegExp(`^[A-Z]{${cfg.tamanho ** 2}}$`));
    expect(p.colocacoes).toHaveLength(cfg.palavras);
    for (const c of p.colocacoes) {
      expect(c.celulas.map(i => p.letras[i]).join('')).toBe(c.palavra);
      expect(cfg.direcoes.map(d => d.join())).toContain(dirDe(c.celulas, cfg.tamanho).join());
      expect(ocorrencias(p.letras, cfg.tamanho, c.palavra)).toHaveLength(1);
      if (tema !== 'misturado') expect(PALAVRAS_POR_GRADE.get(c.palavra)!.tema).toBe(tema);
    }
  }
});
test('escolherPalavras prioriza as ainda não achadas', () => {
  const cand = palavrasDoTema('placas').filter(p => p.grade.length <= 8);   // 8 palavras
  const ja = new Set(cand.slice(0, 5).map(p => p.grade));
  const escolhidas = escolherPalavras(cand, 5, 8, ja, criarRng(1)).map(p => p.grade);
  expect(escolhidas).toEqual(expect.arrayContaining(cand.slice(5).map(p => p.grade)));
});
test('escolherPalavras nunca põe uma palavra dentro de outra', () => {
  const w = (grade: string) => ({ ...PALAVRAS[0], palavra: grade, grade });
  for (let s = 1; s <= 30; s++) {
    const g = escolherPalavras([w('PISTA'), w('PISTAS'), w('ATSIP'), w('CURVA')], 4, 8, new Set(), criarRng(s))
      .map(p => p.grade);
    expect(g.filter(x => ['PISTA', 'PISTAS', 'ATSIP'].includes(x))).toHaveLength(1);
  }
});
test('ocorrencias acha de trás para frente e conta palíndromo uma vez', () => {
  const letras = 'ARARA' + 'X'.repeat(20);   // 5×5
  expect(ocorrencias(letras, 5, 'ARA')).toHaveLength(2);    // posições 0–2 e 2–4
  expect(ocorrencias('ABCDE' + 'X'.repeat(20), 5, 'EDC')).toEqual([[4, 3, 2]]);
});
test('gerarGrade devolve null quando a palavra não cabe', () =>
  expect(gerarGrade(['ABCDEFGHI'], 8, NIVEIS.facil.direcoes, criarRng(1))).toBeNull());

// selecao.test.ts
test('linhaEntre em linha reta e de trás para frente', () => {
  expect(linhaEntre(0, 4, 8)).toEqual([0, 1, 2, 3, 4]);
  expect(linhaEntre(4, 0, 8)).toEqual([4, 3, 2, 1, 0]);
  expect(linhaEntre(0, 24, 8)).toEqual([0, 8, 16, 24]);
  expect(linhaEntre(0, 27, 8)).toEqual([0, 9, 18, 27]);
  expect(linhaEntre(5, 5, 8)).toEqual([5]);
});
test('linhaEntre encaixa o dedo torto na direção mais próxima e corta na borda', () => {
  expect(linhaEntre(0, 12, 8)).toEqual([0, 1, 2, 3, 4]);         // (1,4): horizontal
  expect(linhaEntre(0, 28, 8)).toEqual([0, 9, 18, 27, 36]);      // (3,4): diagonal
  expect(linhaEntre(6, 23, 8)).toEqual([6, 15]);                 // (0,6)→(2,7): diagonal cortada
});
test('celulaNoPonto converte e prende nas bordas', () => {
  const r = { left: 10, top: 20, width: 80, height: 80 };
  expect(celulaNoPonto(r, 8, 15, 25)).toBe(0);
  expect(celulaNoPonto(r, 8, 89, 99)).toBe(63);
  expect(celulaNoPonto(r, 8, 200, -5)).toBe(7);
  expect(celulaNoPonto({ left: 0, top: 0, width: 0, height: 0 }, 8, 5, 5)).toBe(-1);
});
test('conferirSelecao aceita nos dois sentidos e ignora as já achadas', () => {
  const p = criarPartida({ tema: 'placas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(3) });
  const c = p.colocacoes[0];
  expect(conferirSelecao(p, c.celulas)).toBe(c.palavra);
  expect(conferirSelecao(p, [...c.celulas].reverse())).toBe(c.palavra);
  expect(conferirSelecao(p, c.celulas.slice(1))).toBeNull();
  expect(conferirSelecao(registrarAchada(p, c.palavra, 1, 1), c.celulas)).toBeNull();
});

// partida.test.ts
test('criarPartida começa zerada', () => {
  const p = criarPartida({ tema: 'curvas', nivel: 'medio', jaAchadas: new Set(), agora: 7, rng: criarRng(1), id: 'x' });
  expect(p).toMatchObject({ id: 'x', tema: 'curvas', nivel: 'medio', tamanho: 10, achadas: [],
    iniciadaEm: 7, terminadaEm: null, tempoMs: 0 });
});
test('registrarAchada: idempotente, termina na última e não muda depois', () => {
  let p = criarPartida({ tema: 'placas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(2) });
  const [a, ...resto] = p.colocacoes.map(c => c.palavra);
  p = registrarAchada(p, a, 10, 5);
  expect(registrarAchada(p, a, 20, 9)).toBe(p);
  expect(registrarAchada(p, 'NAOEXISTE', 20, 9)).toBe(p);
  for (const w of resto) p = registrarAchada(p, w, 99, 4000);
  expect(p.terminadaEm).toBe(99);
  expect(p.tempoMs).toBe(4000);
  expect(registrarAchada(p, a, 200, 1)).toBe(p);
});
test('resumoRecorde: primeira, novo recorde e não recorde', () => {
  const fim = (id: string, terminadaEm: number, tempoMs: number, nivel: Nivel = 'facil') =>
    ({ ...criarPartida({ tema: 'vias', nivel, jaAchadas: new Set(), agora: 0, rng: criarRng(1), id }),
       terminadaEm, tempoMs });
  const a = fim('a', 100, 300_000), b = fim('b', 200, 250_000), c = fim('c', 300, 280_000);
  const outra = fim('d', 50, 1_000, 'dificil');
  const todas = [a, b, c, outra];
  expect(resumoRecorde(a, todas)).toEqual({ melhorMs: 300_000, novoRecorde: false, primeira: true });
  expect(resumoRecorde(b, todas)).toEqual({ melhorMs: 250_000, novoRecorde: true, primeira: false });
  expect(resumoRecorde(c, todas)).toEqual({ melhorMs: 250_000, novoRecorde: false, primeira: false });
});
test('palavrasJaAchadas junta as achadas de todas', () => {
  const p = criarPartida({ tema: 'vias', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(1) });
  expect(palavrasJaAchadas([{ ...p, achadas: ['PISTA'] }, { ...p, achadas: ['ILHA', 'PISTA'] }]))
    .toEqual(new Set(['PISTA', 'ILHA']));
});
```

- [ ] **Step 2: Rodar `npm test -- caca-palavras`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** os módulos, com as assinaturas e as regras listadas.
- [ ] **Step 4: Rodar `npm test -- caca-palavras`.** Esperado: PASS.
  - Se o teste de 100 sementes passar de 10 s, a montagem está ineficiente: corrigir o algoritmo, nunca baixar as sementes.
- [ ] **Step 5: Commit.** `git commit -m "feat: motor do caça-palavras (grade, seleção, partida)"`

---

### Task 4: Dados — partidas no banco, cópia formato 2 e banco desatualizado

**Files:**
- Modify: `src/dados/db.ts`, `src/dados/repositorio.ts`, `src/dados/backup.ts`, `src/app/contexto.tsx`, `src/estilos.css`
- Test: `src/dados/db.test.ts` (criar), `src/dados/repositorio.test.ts`, `src/dados/backup.test.ts`, `src/app/contexto.test.tsx` (criar)

**Interfaces:**
- Consumes: `Partida` (Task 3).
- Produces:
```ts
// db.ts
export const VERSAO_BANCO = 2;
// Registros ganha  partidas: Partida  (keyPath 'id'); Tudo e substituirTudo passam a incluir partidas
export class BancoDesatualizadoError extends Error {}
export async function abrirBanco(fabrica?: IDBFactory,
  opcoes?: { aoDesatualizar?: () => void }): Promise<Banco>;
// repositorio.ts (acrescenta)
salvarPartida(p: Partida): Promise<void>;
obterPartida(id: string): Promise<Partida | undefined>;
/** Só concluídas, mais recentes primeiro (por terminadaEm). */
listarPartidas(): Promise<Partida[]>;
/** A não concluída mais recente (por iniciadaEm), se houver. */
partidaEmAndamento(): Promise<Partida | undefined>;
descartarPartida(id: string): Promise<void>;
// backup.ts
export const FORMATO_ATUAL = 2;
export interface CopiaDeSeguranca { app: 'transito-em-jogo'; formato: 2; exportadaEm: number;
  tentativas: Tentativa[]; erradas: EntradaErrada[]; vistas: string[]; partidas: Partida[] }
```

**Regras:**
- **Abrir o banco:**
  - `onupgradeneeded` continua criando só o que falta; o store `partidas` aparece na versão 2.
  - Se a abertura falhar com `VersionError` (o banco é mais novo que este código), `abrirBanco` lança `BancoDesatualizadoError` e **não** cai para memória. Qualquer outro erro continua caindo para memória.
  - `onversionchange` continua fechando a conexão e chama `opcoes.aoDesatualizar`.
- **`ProvedorDados`:**
  - com `BancoDesatualizadoError`, ou quando `aoDesatualizar` é chamado, mostra no lugar do app:
    - título "Atualize o app";
    - texto "Uma versão mais nova do app já está guardando os seus dados neste celular. Recarregue para continuar.";
    - botão "Recarregar", que faz `location.reload()`.
  - o botão tem pelo menos 44 px.
- **Repositório:**
  - todas as operações novas passam por `banco.serializar`, como as da etapa 1;
  - `apagarTudo` zera também `partidas`.
- **Cópia de segurança:**
  - `exportarCopia` inclui `partidas` com `formato: 2`.
  - `importarCopia` aceita os formatos 1 e 2:
    - formato 1, sem `partidas`, restaura com `partidas: []`, substituindo tudo, como já é a regra;
    - formato 2 exige `partidas` como array de partidas válidas: `id`, `tema`, `nivel` e `letras` strings; `tamanho`, `iniciadaEm` e `tempoMs` números; `terminadaEm` número ou `null`; `colocacoes` e `achadas` arrays;
    - formato maior que 2 dá `versao-nova`;
    - formato 2 com partida inválida dá `formato`.

- [ ] **Step 1: Escrever os testes que falham**

```ts
// db.test.ts
test('banco versão 1 com simulados vira versão 2 sem perder nada', async () => {
  const fabrica = new IDBFactory();
  await new Promise<void>((ok) => {
    const req = fabrica.open('transito-em-jogo', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('tentativas', { keyPath: 'id' }).put({ id: 't1', entregueEm: 5 });
      db.createObjectStore('erradas', { keyPath: 'qid' });
      db.createObjectStore('vistas', { keyPath: 'qid' }).put({ qid: 'q1' });
    };
    req.onsuccess = () => { req.result.close(); ok(); };
  });
  const banco = await abrirBanco(fabrica);
  expect(banco.persistente).toBe(true);
  expect((await banco.getAll('tentativas')).map(t => t.id)).toEqual(['t1']);
  expect(await banco.getAll('vistas')).toEqual([{ qid: 'q1' }]);
  expect(await banco.getAll('partidas')).toEqual([]);
});
test('banco mais novo que o código: BancoDesatualizadoError, não memória', async () => {
  const fabrica = new IDBFactory();
  await new Promise<void>((ok) => { const r = fabrica.open('transito-em-jogo', 3); r.onsuccess = () => { r.result.close(); ok(); }; });
  await expect(abrirBanco(fabrica)).rejects.toBeInstanceOf(BancoDesatualizadoError);
});
test('outra aba sobe a versão: aoDesatualizar é chamado', async () => {
  const fabrica = new IDBFactory(); const aviso = vi.fn();
  await abrirBanco(fabrica, { aoDesatualizar: aviso });
  await new Promise<void>((ok) => { const r = fabrica.open('transito-em-jogo', 3); r.onsuccess = () => { r.result.close(); ok(); }; });
  expect(aviso).toHaveBeenCalledOnce();
});

// contexto.test.tsx
test('banco desatualizado mostra "Atualize o app" com Recarregar', async () => {
  const fabrica = new IDBFactory();
  await new Promise<void>((ok) => { const r = fabrica.open('transito-em-jogo', 3); r.onsuccess = () => { r.result.close(); ok(); }; });
  render(<ProvedorDados fabrica={fabrica}><p>app</p></ProvedorDados>);
  expect(await screen.findByRole('heading', { name: 'Atualize o app' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument();
  expect(screen.queryByText('app')).not.toBeInTheDocument();
});

// repositorio.test.ts (helper: partida(p: Partial<Partida>) com valores mínimos válidos)
test('partidas: lista só concluídas, mais recentes primeiro; em andamento é a mais recente', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  await repo.salvarPartida(partida({ id: 'a', iniciadaEm: 1, terminadaEm: 10 }));
  await repo.salvarPartida(partida({ id: 'b', iniciadaEm: 2, terminadaEm: 20 }));
  await repo.salvarPartida(partida({ id: 'c', iniciadaEm: 3, terminadaEm: null }));
  await repo.salvarPartida(partida({ id: 'd', iniciadaEm: 4, terminadaEm: null }));
  expect((await repo.listarPartidas()).map(p => p.id)).toEqual(['b', 'a']);
  expect((await repo.partidaEmAndamento())?.id).toBe('d');
  await repo.descartarPartida('d');
  expect((await repo.partidaEmAndamento())?.id).toBe('c');
  await repo.apagarTudo();
  expect(await repo.listarPartidas()).toEqual([]);
  expect(await repo.partidaEmAndamento()).toBeUndefined();
});

// backup.test.ts
test('cópia formato 2 leva as partidas e volta igual', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarPartida(partida({ id: 'p1', terminadaEm: 9 }));
  const copia = await exportarCopia(banco, 1);
  expect(copia.formato).toBe(2);
  await repo.apagarTudo(); await importarCopia(banco, JSON.parse(JSON.stringify(copia)));
  expect((await repo.listarPartidas()).map(p => p.id)).toEqual(['p1']);
});
test('cópia formato 1 (etapa 1) ainda restaura e zera as partidas', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarPartida(partida({ id: 'p1', terminadaEm: 9 }));
  await importarCopia(banco, { app: 'transito-em-jogo', formato: 1, exportadaEm: 1,
    tentativas: [tent({ id: 'a', entregueEm: 2 })], erradas: [], vistas: ['q1'] });
  expect((await repo.listarTentativas()).map(t => t.id)).toEqual(['a']);
  expect(await repo.listarPartidas()).toEqual([]);
});
test('formato 2 com partida inválida não toca nos dados', async () => {
  const banco = await abrirBanco(new IDBFactory()); const repo = criarRepositorio(banco);
  await repo.salvarPartida(partida({ id: 'p1', terminadaEm: 9 }));
  await expect(importarCopia(banco, { app: 'transito-em-jogo', formato: 2, exportadaEm: 1,
    tentativas: [], erradas: [], vistas: [], partidas: [{ id: 3 }] })).rejects.toMatchObject({ motivo: 'formato' });
  expect((await repo.listarPartidas()).map(p => p.id)).toEqual(['p1']);
});
```

- [ ] **Step 2: Rodar `npm test -- dados contexto`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** as mudanças em `db.ts`, `repositorio.ts`, `backup.ts` e `contexto.tsx`, mais o CSS da tela "Atualize o app". O banco em memória também ganha `partidas`.
- [ ] **Step 4: Rodar `npm test`.** Esperado: PASS (tudo, inclusive os testes antigos de backup e ajustes).
- [ ] **Step 5: Commit.** `git commit -m "feat: partidas no banco (versão 2), cópia formato 2 e aviso de banco desatualizado"`

---

### Task 5: Tela da partida — grade, etiquetas, "Achou!" e cronômetro

**Files:**
- Create: `src/caca-palavras/componentes/Grade.tsx`, `Etiquetas.tsx`, `CartaoAchou.tsx`, `src/caca-palavras/telas/TelaPartida.tsx`
- Modify: `src/App.tsx` (rota `/caca-palavras/:id`), `src/simulado/componentes/ImagemPlaca.tsx` (prop `alt?: string`, padrão `"Imagem da placa"`), `src/estilos.css`
- Test: `src/caca-palavras/telas/TelaPartida.test.tsx`

**Interfaces:**
- Consumes: Task 3 inteira; `useRepositorio` e os métodos de partida (Task 4); `PALAVRAS_POR_GRADE` e `PLACAS_POR_CODIGO`; `formatarMinSeg`; `Topo`.
- Produces:
```tsx
// Grade.tsx
export default function Grade(props: {
  tamanho: number; letras: string;
  marcadas: ReadonlyMap<number, number>;  // casa → índice da cor da palavra achada
  desabilitada: boolean;
  onInicioSelecao(): void;                // início de um arrasto ou primeiro toque
  onSelecao(celulas: number[]): void;     // fim de um arrasto ou segundo toque
}): JSX.Element
// Etiquetas.tsx
export default function Etiquetas(props: { palavras: string[]; achadas: ReadonlySet<string>;
  onDica(grade: string): void }): JSX.Element
// CartaoAchou.tsx
export default function CartaoAchou(props: { grade: string; ultima: boolean; onFechar(): void }): JSX.Element
// rota
'/caca-palavras/:id' → TelaPartida
```

**Comportamento:**
- **Carregar:**
  - `repo.obterPartida(id)`;
  - partida inexistente: "Partida não encontrada." com o link "Voltar ao caça-palavras" (`/caca-palavras`);
  - partida concluída: `<Navigate to="/caca-palavras/:id/fim" replace />`.
- **Topo e status:**
  - `Topo` com o nome do tema;
  - abaixo, a linha de status `⏱ {mm:ss}` e `{n} de {total}`;
  - o cronômetro atualiza a cada segundo e não tem `aria-live`.
- **Grade:**
  - um `<button>` por casa, com `data-celula={i}`, `aria-label="Linha {l}, coluna {c}: {letra}"` (contados a partir de 1) e a letra visível;
  - fonte monoespaçada e negrito;
  - casas quadradas (`aspect-ratio: 1`) ocupando toda a largura;
  - `touch-action: none`, `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none`.
- **Tocar:**
  - o `onClick` da casa, que também serve para o teclado, faz o modo de dois toques;
  - o primeiro toque marca a âncora e chama `onInicioSelecao`;
  - o segundo, em outra casa, chama `onSelecao(linhaEntre(âncora, casa))`;
  - tocar de novo na âncora cancela.
- **Arrastar:**
  - eventos de ponteiro no contêiner da grade, com a casa calculada por `celulaNoPonto(getBoundingClientRect(), …)`, e não pelo alvo do evento. No toque o alvo fica preso à casa inicial;
  - quando o dedo chega a outra casa, vira arrasto: chama `onInicioSelecao`, desenha `linhaEntre(início, atual)` e, ao soltar, chama `onSelecao`;
  - `pointercancel` limpa;
  - **um arrasto nunca dispara também a lógica de toque.** O clique que o navegador pode mandar depois é ignorado.
- **Cores:**
  - casas de palavra achada usam o token `--cor-achada-{k}`, com `k = índice em achadas % 6` e 6 tokens;
  - seleção em andamento e âncora usam `--cor-amarelo`;
  - seleção errada simplesmente limpa. Um feedback visual curto fica a critério de quem constrói.
- **Etiquetas:**
  - um botão por palavra, em ordem alfabética da grade, com o texto da grade;
  - achada: riscada, com a cor da palavra e `aria-label="{GRADE}, achada"`;
  - tocar mostra a dica na linha `<p aria-live="polite">`:
    - antes de qualquer toque: "Toque numa etiqueta para ver a dica.";
    - depois: `{GRADE}: {dica}`;
    - só `{GRADE}` se a palavra saiu do conteúdo.
- **Achou!:**
  - `onSelecao` → `conferirSelecao` → se achou, `registrarAchada(p, grade, Date.now(), tempo ativo)` → `repo.salvarPartida` → mostra o `CartaoAchou`;
  - o cartão fica fixo acima da barra inferior (`bottom: calc(var(--altura-barra) + env(safe-area-inset-bottom) + 8px)`), com `aria-live="polite"`;
  - conteúdo:
    - título "Achou!";
    - a palavra na grafia correta;
    - se houver placa: `ImagemPlaca` com `alt="Placa {codigo}: {nome}"` e a linha `Placa {codigo} · {nome}`;
    - o significado;
    - `Fonte: {base}`;
    - o botão "Continuar", ou "Ver resultado" na última palavra, que navega para `/caca-palavras/:id/fim`;
  - começar outra seleção também fecha o cartão;
  - com a partida concluída, a grade fica `desabilitada`.
- **Tempo ativo:**
  - `tempoMs` da partida mais o tempo desde a retomada (`Date.now()` ao montar e ao voltar a ficar visível);
  - com `visibilitychange` para `hidden`, `pagehide` ou ao desmontar, se a partida não terminou, acumula e grava `tempoMs`;
  - todas as gravações partem do estado mais recente, guardado num ref.

- [ ] **Step 1: Escrever os testes que falham**

Molde de `src/historico/TelaHistorico.test.tsx`.

```ts
async function abrirPartida() {
  const fabrica = new IDBFactory();
  const repo = criarRepositorio(await abrirBanco(fabrica));
  const p = criarPartida({ tema: 'curvas', nivel: 'facil', jaAchadas: new Set(), agora: 0, rng: criarRng(5), id: 'x' });
  await repo.salvarPartida(p);
  renderizarRota('/caca-palavras/x', { fabrica });
  return { p, repo };
}
// lança enquanto a casa não existe, para o waitFor tentar de novo
const casa = (i: number) => {
  const el = document.querySelector(`[data-celula="${i}"]`);
  if (!el) throw new Error(`casa ${i} ainda não existe`);
  return el as HTMLElement;
};
test('mostra tema, contagem e as 64 casas do fácil', async () => {
  await abrirPartida();
  expect(await screen.findByRole('heading', { name: 'Curvas e relevo' })).toBeInTheDocument();
  expect(screen.getByText('0 de 5')).toBeInTheDocument();
  expect(document.querySelectorAll('[data-celula]')).toHaveLength(64);
});
test('tocar na primeira e na última letra acha a palavra, mostra o cartão e grava', async () => {
  const { p, repo } = await abrirPartida();
  const c = p.colocacoes[0];
  await userEvent.click(await waitFor(() => casa(c.celulas[0])));
  await userEvent.click(casa(c.celulas.at(-1)!));
  expect(await screen.findByRole('heading', { name: 'Achou!' })).toBeInTheDocument();
  expect(screen.getByText(PALAVRAS_POR_GRADE.get(c.palavra)!.significado)).toBeInTheDocument();
  expect(screen.getByText('1 de 5')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: `${c.palavra}, achada` })).toBeInTheDocument();
  await waitFor(async () => expect((await repo.obterPartida('x'))!.achadas).toEqual([c.palavra]));
});
test('tocar duas vezes na mesma casa cancela', async () => {
  const { p } = await abrirPartida();
  const c = p.colocacoes[0];
  await userEvent.click(await waitFor(() => casa(c.celulas[0])));
  await userEvent.click(casa(c.celulas[0]));
  await userEvent.click(casa(c.celulas.at(-1)!));       // vira nova âncora, não seleção
  expect(screen.queryByRole('heading', { name: 'Achou!' })).not.toBeInTheDocument();
});
test('etiqueta mostra a dica', async () => {
  const { p } = await abrirPartida();
  const w = p.colocacoes[0].palavra;
  await userEvent.click(await screen.findByRole('button', { name: w }));
  expect(screen.getByText(`${w}: ${PALAVRAS_POR_GRADE.get(w)!.dica}`)).toBeInTheDocument();
});
test('palavra com placa mostra a imagem com o nome no alt', async () => {
  const { p } = await abrirPartida();
  // no fácil de Curvas cabem 10 palavras, 6 com placa: as 5 sorteadas sempre incluem uma
  const c = p.colocacoes.find(c => PALAVRAS_POR_GRADE.get(c.palavra)!.placa)!;
  const placa = PLACAS_POR_CODIGO.get(PALAVRAS_POR_GRADE.get(c.palavra)!.placa!)!;
  await userEvent.click(await waitFor(() => casa(c.celulas[0])));
  await userEvent.click(casa(c.celulas.at(-1)!));
  expect(await screen.findByAltText(`Placa ${placa.codigo}: ${placa.nome}`)).toBeInTheDocument();
});
test('a última palavra conclui a partida e o botão vira "Ver resultado"', async () => {
  const { p, repo } = await abrirPartida();
  for (const c of p.colocacoes) {
    await userEvent.click(await waitFor(() => casa(c.celulas[0])));
    await userEvent.click(casa(c.celulas.at(-1)!));
    if (c !== p.colocacoes.at(-1)) await userEvent.click(await screen.findByRole('button', { name: 'Continuar' }));
  }
  expect(await screen.findByRole('button', { name: 'Ver resultado' })).toBeInTheDocument();
  await waitFor(async () => expect((await repo.obterPartida('x'))!.terminadaEm).not.toBeNull());
});
test('o tempo só conta com a tela visível', async () => {
  const agora = vi.spyOn(Date, 'now').mockReturnValue(1_000);
  const { p, repo } = await abrirPartida();
  await waitFor(() => casa(0));
  agora.mockReturnValue(6_000);
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  await waitFor(async () => expect((await repo.obterPartida('x'))!.tempoMs).toBe(5_000));
  agora.mockReturnValue(60_000);
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
  agora.mockReturnValue(61_000);
  const c = p.colocacoes[0];
  await userEvent.click(casa(c.celulas[0]));
  await userEvent.click(casa(c.celulas.at(-1)!));
  await waitFor(async () => expect((await repo.obterPartida('x'))!.tempoMs).toBe(6_000));
  agora.mockRestore();
  Reflect.deleteProperty(document, 'visibilityState');
});
test('partida inexistente', async () => {
  renderizarRota('/caca-palavras/nada', { fabrica: new IDBFactory() });
  expect(await screen.findByText('Partida não encontrada.')).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar `npm test -- TelaPartida`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** os componentes, a tela, a rota, a prop `alt` e o CSS. Os tokens `--cor-achada-1` a `--cor-achada-6` ficam em `:root`.
- [ ] **Step 4: Rodar `npm test`.** Esperado: PASS (tudo).
- [ ] **Step 5: Conferir no navegador**
  - Rodar `npm run dev` e abrir uma partida no DevTools em 360×640, modo toque.
  - Arrastar e tocar devem marcar a palavra, e a página não pode rolar durante o arrasto.
  - O cartão "Achou!" não pode cobrir a grade inteira.
- [ ] **Step 6: Commit.** `git commit -m "feat: tela da partida do caça-palavras (arrastar, tocar, Achou!)"`

---

### Task 6: Início, fim, página inicial e histórico

**Files:**
- Create: `src/caca-palavras/fluxo.ts`, `src/caca-palavras/useNovaPartida.ts`, `src/caca-palavras/telas/InicioCacaPalavras.tsx`, `src/caca-palavras/telas/FimPartida.tsx`
- Modify: `src/App.tsx`, `src/app/BarraNavegacao.tsx`, `src/historico/TelaHistorico.tsx`, `vite.config.ts` (descrição do manifest), `src/estilos.css`
- Test: `src/caca-palavras/fluxo.test.ts`, `src/caca-palavras/telas/InicioCacaPalavras.test.tsx`, `src/caca-palavras/telas/FimPartida.test.tsx`, `src/App.test.tsx`, `src/historico/TelaHistorico.test.tsx`

**Interfaces:**
- Consumes: Tasks 3–5.
- Produces:
```ts
// fluxo.ts
export async function iniciarPartida(repo: Repositorio, p: { tema: TemaPartida; nivel: Nivel;
  agora: number; rng: () => number }): Promise<Partida>;
// useNovaPartida.ts
export function useNovaPartida(): (tema: TemaPartida, nivel: Nivel) => Promise<void>;
// rotas
'/'                         → <Navigate to="/caca-palavras" replace />
'/caca-palavras'            → InicioCacaPalavras
'/caca-palavras/:id/fim'    → FimPartida
// BarraNavegacao.ABAS, nesta ordem:
{ rota: '/caca-palavras', rotulo: 'Caça-palavras', icone: '🔤' }, Simulado, Histórico
```

**Comportamento:**
- **`iniciarPartida`:**
  - `jaAchadas = palavrasJaAchadas(await repo.listarPartidas())`;
  - `criarPartida`, depois `repo.salvarPartida`, e devolve a partida.
- **`useNovaPartida`:**
  1. Uma trava em ref ignora o toque duplo.
  2. Se houver partida em andamento, pede confirmação (`useConfirmar`): título "Descartar a partida em andamento?", texto "Ela não vai para o histórico.", botão "Descartar". Recusou: para aqui. Aceitou: `descartarPartida`.
  3. `pedirPersistencia()`, `iniciarPartida(…, agora: Date.now(), rng: criarRng(Date.now() >>> 0))` e `navegar('/caca-palavras/{id}')`.
- **Início:**
  - `Topo` "Caça-palavras" e o subtítulo "Ache as palavras de trânsito escondidas na grade.";
  - se houver partida em andamento, o cartão (no molde do `CartaoAndamento` do simulado) com:
    - "Você tem uma partida em andamento";
    - `{tema} · {nível} · {n} de {total} palavras`;
    - "Continuar" (navega para a partida) e "Descartar" (mesma confirmação acima);
  - seção "Escolha um tema": 8 botões em 2 colunas com ícone e nome, `aria-pressed` no escolhido, padrão "Placas";
  - seção "Nível": 3 botões com nome e descrição, `aria-pressed`, padrão "Fácil";
  - botão principal "Começar" no fim da tela, que chama `useNovaPartida`.
- **Fim:**
  - partida inexistente: "Partida não encontrada." com o link "Voltar ao caça-palavras";
  - partida não concluída: `<Navigate to="/caca-palavras/:id" replace />`;
  - `Topo` "Caça-palavras", título "🏁 Achou todas!" e a linha `{tema} · {nível} · {mm:ss}`;
  - recorde (`resumoRecorde` com `repo.listarPartidas()`):
    - primeira: "Primeira partida neste tema e nível.";
    - novo recorde: "🏆 Novo recorde neste tema e nível!";
    - senão: `Seu melhor tempo neste tema e nível: {mm:ss}`;
  - seção "O que você aprendeu":
    - uma linha por palavra, na ordem em que foi achada;
    - miniatura da placa (alt `Placa {codigo}: {nome}`), quando houver;
    - a palavra na grafia correta, o código da placa e a dica;
    - palavra que saiu do conteúdo: só a grade;
  - botões "Jogar de novo" (principal, mesmo tema e nível, via `useNovaPartida`) e "Escolher outro tema" (navega para `/caca-palavras`).
- **Histórico:**
  - "Atividades recentes" junta simulados entregues e partidas concluídas, do mais recente ao mais antigo. A data do simulado é `entregueEm`; a da partida, `terminadaEm`;
  - linha da partida: `🔤 Caça-palavras · {tema} · {nível}` e `{quando}, {mm:ss}`, com link para `/caca-palavras/:id/fim` e `data-testid="atividade"`;
  - o vazio passa a dizer "Nenhuma atividade ainda." e mantém o botão "Fazer a primeira prova";
  - as caixas do topo não mudam.
- **Manifest:** `description` passa a ser "Estude para a prova teórica do Detran com caça-palavras de trânsito e simulados do banco oficial de questões."

- [ ] **Step 1: Escrever os testes que falham**

```ts
// App.test.tsx (substitui o primeiro teste)
test('abre no caça-palavras com a barra Caça-palavras, Simulado e Histórico', async () => {
  window.location.hash = '#/';
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Caça-palavras' })).toBeInTheDocument();
  const abas = within(screen.getByRole('navigation')).getAllByRole('link').map(a => a.textContent);
  expect(abas).toEqual(['🔤Caça-palavras', '📝Simulado', '📊Histórico']);
});
// fluxo.test.ts
test('iniciarPartida grava e prioriza palavras ainda não achadas', async () => {
  const repo = criarRepositorio(await abrirBanco(new IDBFactory()));
  const p1 = await iniciarPartida(repo, { tema: 'placas', nivel: 'facil', agora: 1, rng: criarRng(1) });
  await repo.salvarPartida({ ...p1, achadas: p1.colocacoes.map(c => c.palavra), terminadaEm: 2 });
  const p2 = await iniciarPartida(repo, { tema: 'placas', nivel: 'facil', agora: 3, rng: criarRng(2) });
  expect(await repo.obterPartida(p2.id)).toEqual(p2);
  const novas = p2.colocacoes.filter(c => !p1.colocacoes.some(d => d.palavra === c.palavra));
  expect(novas).toHaveLength(3);                     // placas fácil: 8 palavras cabem, 5 já vistas
});
// InicioCacaPalavras.test.tsx
test('escolher tema e nível e começar cria a partida e abre a grade', async () => {
  const { repo } = await renderizarInicio();
  await userEvent.click(await screen.findByRole('button', { name: /Curvas e relevo/ }));
  await userEvent.click(screen.getByRole('button', { name: /Médio/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Começar' }));
  expect(await screen.findByRole('heading', { name: 'Curvas e relevo' })).toBeInTheDocument();
  expect(document.querySelectorAll('[data-celula]')).toHaveLength(100);
  expect(await repo.partidaEmAndamento()).toMatchObject({ tema: 'curvas', nivel: 'medio' });
});
test('partida em andamento: Continuar abre; Começar pede para descartar', async () => {
  const { repo } = await renderizarInicio({ emAndamento: true });   // curvas · fácil · 0 de 5
  expect(await screen.findByText('Curvas e relevo · Fácil · 0 de 5 palavras')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Começar' }));
  expect(await screen.findByText('Descartar a partida em andamento?')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect((await repo.partidaEmAndamento())?.id).toBe('x');
});
// FimPartida.test.tsx
test('fim mostra tempo, recorde e o que aprendeu', async () => {
  await renderizarFim({ tempoMs: 277_000, anteriores: [250_000] });  // curvas · médio
  expect(await screen.findByRole('heading', { name: '🏁 Achou todas!' })).toBeInTheDocument();
  expect(screen.getByText('Curvas e relevo · Médio · 04:37')).toBeInTheDocument();
  expect(screen.getByText('Seu melhor tempo neste tema e nível: 04:10')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'O que você aprendeu' })).toBeInTheDocument();
});
test('novo recorde e primeira partida', async () => { /* "🏆 Novo recorde neste tema e nível!" / "Primeira partida neste tema e nível." */ });
test('palavra que saiu do conteúdo não quebra o fim', async () => {
  await renderizarFim({ colocacoesExtras: [{ palavra: 'XYZW', celulas: [0, 1, 2, 3] }] });
  expect(await screen.findByText('XYZW')).toBeInTheDocument();
});
test('Jogar de novo cria outra partida do mesmo tema e nível', async () => { /* … */ });
// TelaHistorico.test.tsx (acrescentar; trocar "Nenhum simulado ainda." por "Nenhuma atividade ainda.")
test('partidas entram nas atividades por data e abrem o fim', async () => {
  // um simulado de ontem + uma partida de hoje (vias · fácil · 03:05)
  const linhas = await screen.findAllByTestId('atividade');
  expect(linhas[0]).toHaveTextContent('🔤 Caça-palavras · Vias · Fácil');
  expect(linhas[0]).toHaveTextContent('hoje, 03:05');
  await userEvent.click(linhas[0]);
  expect(await screen.findByRole('heading', { name: '🏁 Achou todas!' })).toBeInTheDocument();
});
```

Helpers, no molde de `abrirPartida` da Task 5:
- `renderizarInicio({ emAndamento? })` grava, se pedido, a partida `x` não concluída de curvas · fácil e abre `/caca-palavras`.
- `renderizarFim({ tempoMs?, anteriores?, colocacoesExtras? })`:
  - grava a partida `x` concluída de curvas · médio, com todas as palavras achadas;
  - grava, para cada tempo em `anteriores`, outra partida concluída do mesmo tema e nível, terminada antes;
  - abre `/caca-palavras/x/fim`.

Os testes marcados com `/* … */` seguem o molde do teste anterior, com as frases indicadas.

- [ ] **Step 2: Rodar `npm test -- caca-palavras App Historico`.** Esperado: FAIL.
- [ ] **Step 3: Implementar** o fluxo, o hook, as telas, as rotas, a aba, o histórico, o manifest e o CSS.
- [ ] **Step 4: Rodar `npm test` e `npm run build`.** Esperado: PASS e build sem erro.
- [ ] **Step 5: Commit.** `git commit -m "feat: caça-palavras como página inicial, fim da partida e partidas no histórico"`

---

### Task 7: Ponta a ponta e documentação

**Files:**
- Create: `e2e/caca-palavras.spec.ts`
- Modify: `e2e/navegacao.spec.ts`, `e2e/offline.spec.ts`, `README.md`, `CLAUDE.md`, `docs/superpowers/specs/2026-10-26-app-transito-design.md` (só a linha de status), `docs/superpowers/pendencias-etapa-1.md`

**Interfaces:**
- Consumes: o app inteiro.

- [ ] **Step 1: Escrever os testes de ponta a ponta**
  - **`caca-palavras.spec.ts`, teste "partida fácil inteira: arrastar, tocar e arrastar com o dedo":**
    1. `./#/caca-palavras` → "Placas", "Fácil" e "Começar".
    2. Ler a partida em andamento direto do IndexedDB com `page.evaluate`: abrir `transito-em-jogo`, `getAll` em `partidas` e pegar a de `terminadaEm === null`.
    3. Achar as 5 palavras, nesta ordem:
       - 1ª e 2ª com `page.mouse` (down no centro da primeira casa, move com `steps: 8` até a última, up);
       - 3ª com toque real via CDP: `Input.dispatchTouchEvent` com `touchStart`, alguns `touchMove` e `touchEnd`;
       - 4ª com `locator.tap()` na primeira e na última casa;
       - 5ª com `page.mouse`.

       A ordem põe um toque logo depois de cada tipo de arrasto. Se algum arrasto deixar uma âncora sobrando, o toque seguinte falha.
    4. Depois de cada uma, "Continuar"; na última, "Ver resultado".
    5. Esperar "🏁 Achou todas!" e "Primeira partida neste tema e nível.".
    6. Abrir Histórico e ver "🔤 Caça-palavras · Placas · Fácil".
  - **Teste "recarregar no meio mantém o que foi achado":**
    1. Achar 1 palavra e recarregar.
    2. Em `./#/caca-palavras`, ver `Placas · Fácil · 1 de 5 palavras`.
    3. "Continuar" e ver `1 de 5`.
  - **`navegacao.spec.ts` e `offline.spec.ts`:** a abertura em `./` passa a esperar o título "Caça-palavras".
- [ ] **Step 2: Rodar `npm run e2e`.** Esperado: PASS (todos).
- [ ] **Step 3: Documentação**
  - **README:** "Tem caça-palavras, simulado, histórico e ajustes", mais o comando `npm run conteudo:palavras`.
  - **CLAUDE.md:**
    - primeira linha com "(caça-palavras, simulado, histórico, ajustes)";
    - "etapa atual: `2026-10-26-etapa-2-caca-palavras.md`".
  - **Spec:** "**Status:** aprovado".
  - **Pendências:**
    - riscar o item de `VersionError` com "resolvido na etapa 2";
    - acrescentar uma seção "Deixado pela etapa 2" com o que a revisão final classificar como "pode esperar".
- [ ] **Step 4: Rodar `npm test && npm run build`.** Esperado: PASS.
- [ ] **Step 5: Commit.** `git commit -m "test: ponta a ponta do caça-palavras; docs da etapa 2"`

---

### Task 8: Publicação

**Files:** nenhum novo.

**Interfaces:**
- Consumes: o ramo `etapa-2-caca-palavras` revisado e verde.
- Produces: o caça-palavras no ar em `https://ramonrpro.github.io/transito-em-jogo/`.

- [ ] **Step 1: Confirmar com o usuário**

  Juntar o ramo na `main` e enviar publica para todo mundo que usa o app. O envio inclui o commit local `0382a6f` (pendências). Só seguir com um "sim" explícito.

- [ ] **Step 2: Juntar o ramo na `main`**

  Rodar `git checkout main && git merge --ff-only etapa-2-caca-palavras`, depois `npm test` e `npm run build`. Esperado: PASS.

- [ ] **Step 3: Trocar a conta ativa**

  Rodar `gh auth switch --hostname github.com --user Ramonrpro`. Conferir com `gh auth status`.

- [ ] **Step 4: Enviar e acompanhar**

  Rodar `git push origin main`, depois `gh run watch --repo Ramonrpro/transito-em-jogo`. Esperado: o workflow termina com sucesso.

- [ ] **Step 5: Verificar no ar**

  - `curl -sI https://ramonrpro.github.io/transito-em-jogo/` → `200`.
  - `PLAYWRIGHT_BASE_URL=https://ramonrpro.github.io/transito-em-jogo/ npx playwright test e2e/navegacao.spec.ts e2e/offline.spec.ts e2e/caca-palavras.spec.ts`. Esperado: PASS.

- [ ] **Step 6: Devolver a conta ativa do `gh`**

  Voltar para a conta que estava ativa antes da publicação e conferir com `gh auth status`.

- [ ] **Step 7: Teste no celular com o usuário**

  Pedir à pessoa que, no Android e no iPhone se houver um à mão:
  1. abra o app já instalado e aceite "nova versão disponível";
  2. veja o caça-palavras na abertura e confira que o histórico de simulados continua lá;
  3. jogue uma partida arrastando o dedo;
  4. no meio de outra partida, troque para outro app, volte e continue.

  Registrar o resultado na conversa antes de declarar a etapa concluída.
