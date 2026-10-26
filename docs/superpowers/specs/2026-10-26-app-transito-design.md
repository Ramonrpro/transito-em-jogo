# App de estudo para a prova teórica do Detran: documento de design

**Data:** 26/10/2026 · **Status:** aguardando aprovação do usuário
**Nome provisório do app:** "Trânsito em Jogo" *(minha escolha; trocar à vontade)*

---

## 1. Por que existe

O usuário quer que um pequeno grupo de alunos estude para a **prova teórica do Detran-MG** de um jeito leve: jogando, revisando e treinando com o mesmo tipo de questão que cai na prova. Cada pessoa estuda por conta própria no próprio celular. Ninguém precisa acompanhar ninguém, mas **cada pessoa precisa ter o seu histórico**.

Hoje não existe nada parecido com o que ele pediu. A pesquisa de concorrentes (`pesquisa/06-concorrentes-e-ideias.md`) não achou nenhum caça-palavras de trânsito nas lojas. Os apps de simulado que existem irritam os usuários com anúncios, gabaritos errados, progresso perdido e limites escondidos para empurrar assinatura.

**Como saber que deu certo:** os alunos usam o app no celular, instalado como app, sem internet se precisar. Eles entendem onde estão fracos, treinam com questões do banco oficial com o gabarito correto pela lei atual e chegam à prova sabendo as placas e as regras.

## 2. Objetivos, não-objetivos e anti-objetivos

**Objetivos**
- **PWA instalável e mobile-first.** O convite para instalar aparece já no primeiro acesso (pedido do usuário).
- **Caça-palavras como página inicial.** Usa nomes de placas, tipos de curva, termos e regras que cabem em uma palavra, com ou sem hífen.
- **Simulado no formato da prova real.** Mais os modos de treino, por assunto e de refazer as erradas.
- **Flashcards com repetição espaçada.** Inclui o álbum de placas.
- **Histórico pessoal no aparelho.** Com cópia de segurança em arquivo.
- **Conteúdo sempre conferido com a legislação atual.** A referência está em `pesquisa/00-REFERENCIA-COMPACTA.md`.
- **Espaço para outros quizzes depois.**

**Não-objetivos (fora desta versão)**
- Login, contas, servidor ou banco de dados remoto.
- Painel de professor ou acompanhamento de alunos (decisão do usuário: "cada um estuda por conta própria").
- Ranking, competição entre usuários ou partida diária igual para todos.
- Prova prática de direção. Regras específicas de outros estados além do que é nacional e de MG.
- Publicação em loja de apps (Play Store/App Store).
- Banco completo de 1.500 questões. Fica para a **fase 2**, ver §9.

**Anti-objetivos (se acontecer, falhou mesmo funcionando)**
- **Ensinar algo errado ou desatualizado.** É o pior defeito possível.
- **Perder o progresso de alguém**, seja ao fechar o app, travar o celular ou passar o tempo da prova.
- **Anúncios, pedidos de permissão ao abrir, cadastro ou paywall.**
- **Depender de internet ou de servidor para funcionar** depois de instalado.
- **Mostrar na revisão uma resposta diferente da que a pessoa marcou.** "O app mudou minha resposta" é reclamação comum em mais de 10 apps.

## 3. Restrições

- **Regras da prova** (Res. Contran 1.020/2025, confirmadas pelo Detran-MG): **30 questões, 4 alternativas, aprovação com ≥ 20 acertos, 1 hora**. O usuário achava que eram 24. A pesquisa mostrou que são 20, e ele pediu para seguir a regra oficial.
- **Hospedagem estática gratuita.** Sem custo mensal.
- **Navegadores:** precisa funcionar em **Android/Chrome** e **iPhone/Safari**. No iPhone a instalação é manual, então o app mostra um passo a passo.
- **Idioma:** todo o conteúdo e a interface em **pt-BR**.
- **Conferência do conteúdo:** todo conteúdo (questões, cartões, palavras e dicas) é conferido contra `pesquisa/00-REFERENCIA-COMPACTA.md`. Para detalhes, usar os arquivos 01–03. Nada entra sem base nesses arquivos.
- **Licença das imagens de placas:**
  - Advertência (A-x) no Wikimedia Commons: domínio público.
  - Maior parte da regulamentação (R-x): **CC BY-SA**, o que **exige tela de créditos**. Se alguma for editada, a versão editada também fica CC BY-SA.
  - O mapeamento código → arquivo do Commons está em `pesquisa/02-sinalizacao.md`.
- **Placas nesta versão: 120, não 130** *(minha escolha)*. As 10 mais novas ficam de fora: R-41 a R-44, A-49a/b e A-50a/b.
  - **R-41 a R-44** aparecem só no índice do manual de 2022, sem ficha nem desenho, e com duas numerações que se contradizem. O significado delas foi deduzido só pelo nome.
  - **A-49 e A-50** vêm só da CET-SP, que é um órgão municipal.
  - Ensinar com base nisso arriscaria o pior anti-objetivo. A própria pesquisa recomenda deixá-las fora.
  - A questão `sin-033`, que depende da R-44, sai do banco.
  - Voltam na fase 2 se surgir fonte oficial.

## 4. Conteúdo (o que existe e de onde vem)

| Conteúdo | Fonte | Situação |
|---|---|---|
| Questões | `pesquisa/04-questoes-legislacao-sinalizacao.json` (215) + `pesquisa/05-questoes-demais-modulos.json` (168) = **383** | Prontas, 4 alternativas, com explicação, base legal, fonte e código da placa quando houver. ~3 duplicadas entre os dois arquivos (mesmo enunciado: ultrapassagem, chuva/farol alto, PNATRANS), a remover. Enunciados genéricos de placa ("O que a placa acima indica?") repetidos são normais. |
| Palavras do caça-palavras | `00-REFERENCIA-COMPACTA.md` §14: **131 palavras** em 7 grupos, com dica | Prontas. Faltam o vínculo palavra → código da placa (para o cartão "Achou!") e a separação "Curvas e relevo". |
| Placas (cartões + álbum) | `02-sinalizacao.md`: **120 placas** (R-1 a R-40 = 51; A-1a a A-48 = 69) com nome oficial e significado | Prontas. As dicas "não confunda com…" saem da própria referência. Ex.: A-3 pista sinuosa (≥ 3 curvas) × A-5 curva em "S" (2 curvas). As 10 mais novas ficam fora (ver §3). |
| Termos da lei | `00-REFERENCIA-COMPACTA.md` §7: **125 termos** do Anexo I | Prontos (definição de uma linha). |
| Números da prova | A escrever: **~60 cartões** (pontos, multas, velocidades, prazos, idades, distâncias) | Cada cartão cita o artigo ou a resolução. |
| Primeiros socorros | A escrever: **~30 cartões** de situação → o que fazer | Seguir a referência, inclusive as correções do material oficial desatualizado. |
| Imagens das placas | Wikimedia Commons (120 SVG, uma para cada placa desta versão) | Baixar uma vez e guardar no projeto. Nunca buscar na hora de usar. Gerar os créditos a partir dos metadados do Commons. A pesquisa casou arquivo e código só pelo nome, então **conferir visualmente** cada imagem contra o nome oficial antes de usar. |

**Erros do banco oficial.** O próprio banco nacional tem itens errados, listados em `00-REFERENCIA-COMPACTA.md` §13. Por exemplo, "2 metros" em vez de 2 segundos, ou criança de menos de 10 anos na moto. *Minha escolha:* o app ensina o que a **lei atual** diz. Quando a questão veio de um item do banco oficial que tinha erro, a explicação traz um aviso: "Atenção: no banco oficial esta questão aparece com outra resposta; pela lei atual, o correto é…".

**Áreas da prova.** O peso de cada assunto não é publicado. O sorteio do simulado segue a proporção do banco oficial, ver §5.2. Mapeamento das questões para as 4 áreas *(minha escolha)*:

| Área (BNQ) | Temas/subtemas nossos | No simulado de 30 |
|---|---|---|
| 1 · Sinalização | `sinalizacao` | 8 |
| 2 · Infrações | `legislacao` com subtema `infracoes`, `penalidades`, `crimes` | 4 |
| 3 · Circulação, conduta e direção defensiva | demais `legislacao` (circulação, habilitação, transporte de crianças, etc.) + `direcao_defensiva` | 13 |
| 4 · Meio ambiente, socorros e manutenção | `primeiros_socorros`, `meio_ambiente`, `mecanica` | 5 |

**Data de revisão do conteúdo:** 25/10/2026. Ela aparece em Ajustes → Sobre.

## 5. Como o app funciona

Navegação: **barra inferior** com Caça-palavras (página inicial) · Simulado · Flashcards · Histórico. **Ajustes** fica num ícone no canto do topo. Os botões de ação ficam na parte de baixo da tela, ao alcance do polegar. Os rascunhos aprovados estão em `.superpowers/brainstorm/15327-1793007766/content/` (`caca-palavras-fluxo.html`, `simulado-fluxo.html`, `flashcards-fluxo.html`, `apoio-historico-ajustes.html`).

### 5.1 Caça-palavras (aprovado: opção C)
1. **Escolher:**
   - **Tema:** Placas · Curvas e relevo · Vias · Regras · Direção defensiva · Primeiros socorros · Veículo · Misturado.
   - **Nível** *(minha escolha)*:
     - **Fácil:** grade 8×8, palavras na horizontal e na vertical, 5 palavras.
     - **Médio:** grade 10×10, com diagonais, 7 palavras.
     - **Difícil:** grade 12×12, também de trás para frente, 9 palavras.
   - Só entram palavras que cabem na grade.
2. **Jogar:**
   - **Grade grande** com as palavras em etiquetas embaixo.
   - **Dica:** tocar numa etiqueta mostra a dica.
   - **Como marcar:** arrastar o dedo em linha reta sobre as letras. Tocar na primeira e depois na última letra também funciona.
   - **Ao achar:** a palavra fica marcada com uma cor e aparece um **cartão "Achou!"** com a placa, quando houver, e o significado.
   - **Grafia na grade:** sem acento, cedilha nem hífen (DEPRESSÃO vira DEPRESSAO). As etiquetas mostram a palavra do mesmo jeito.
   - **No topo:** cronômetro só por curiosidade (ninguém perde por tempo) e a contagem "x de y".
   - **Grade nova a cada partida.** As letras de preenchimento são aleatórias.
3. **Fim da partida:**
   - Mostra o tempo, o melhor tempo do tema e nível e a lista "O que você aprendeu", com as placas.
   - Botões **Jogar de novo** e **Estudar estes cartões**.
   - *Minha escolha para o segundo botão:* ele abre uma sessão de flashcards só com os cartões que correspondem às palavras achadas, em qualquer baralho (Placas, Termos da lei, Primeiros socorros, Números). Se nenhuma palavra tiver cartão, o botão não aparece. Não há baralho próprio de palavras.
   - A partida fica salva no histórico.

### 5.2 Simulado
**Modos:**
- **Prova (igual ao Detran):** 30 questões, 60 min, passa com 20, resultado só no fim.
- **Treino:** mostra na hora se acertou, com explicação e base legal.
- **Por assunto:** escolhe a área ou o tema.
- **Refazer erradas:** usa o caderno de erros.

**Prova:**
- **Sorteio:** 8/4/13/5 por área (§4), sem repetir questão. Prioriza questões que a pessoa ainda não viu.
- **Navegação:** barra de progresso, voltar/avançar, "revisar depois" e mapa das 30 questões.
- **Cronômetro com hora fixa de término.** Trancar a tela, sair do app ou reiniciar o celular não zera o tempo. Ao chegar a zero, a prova é **entregue automaticamente**.
- **Salva a cada resposta.** Ao reabrir, oferece continuar a prova em andamento.

**Alternativas embaralhadas uma vez por tentativa.** A ordem fica salva junto com a resposta, e a revisão mostra exatamente o que a pessoa viu e marcou.

**Treino:** a resposta certa aparece em verde e a marcada errada em vermelho. Vem o quadro "Por quê?" com a explicação e a base legal, mais o botão **Reportar erro**. Questões erradas vão para o caderno de erros.

**Resultado:** nota, PASSOU/NÃO PASSOU (texto neutro, sem gênero), tempo gasto, desempenho por área com o ponto fraco em destaque e a sugestão de treinar aquela área, e os botões **Revisar as 30** e **Refazer só as erradas**.

**Caderno de erros** *(minha escolha)*: a questão sai do caderno depois de **2 acertos seguidos** em qualquer modo.

**Cobertura:** "já viu X de Y questões".

### 5.3 Flashcards
- **Baralhos:** Placas (imagem → código, nome oficial, significado, "não confunda com…") · Números da prova · Termos da lei · Primeiros socorros · Meus erros (questões erradas viram cartão: enunciado na frente, resposta certa e explicação no verso).
- **Painel inicial:** "Hoje: N cartões para revisar", juntando todos os baralhos. Cada baralho tem uma barra de domínio.
- **Uso:** toca para virar e responde **Errei / Quase / Sabia**.
- **Repetição espaçada simplificada** *(minha escolha)*:
  - **Errei:** o cartão volta na mesma sessão e a contagem recomeça.
  - **Quase:** volta amanhã.
  - **Sabia:** o intervalo aumenta, por exemplo 1 → 3 → 7 → 14 → 30 dias.
  - O cartão conta como **dominado** quando o intervalo chega a ≥ 7 dias.
- **Álbum de placas:** grade com as 120 placas, cinza no começo. Cada placa **fica colorida quando o cartão dela é dominado**. Tem filtro Todas / Regulamentação / Advertência, e tocar numa placa abre o cartão.

### 5.4 Histórico
- **Números do topo:** simulados feitos, quantos passou e dias seguidos de estudo, sem cobrança (qualquer atividade conta).
- **Gráfico das notas** com a linha dos 20.
- **Desempenho por área** somando todos os simulados.
- **Atividades recentes:** simulados, partidas e revisões. **Histórico ilimitado.**
- Cada simulado pode ser reaberto para revisão.

### 5.5 Primeiro acesso e instalação
- **Na primeira abertura**, depois que a página carrega, sobe da parte de baixo o convite **"Instale o app"**, com Instalar e Agora não.
- **No Android** o botão usa o convite nativo do navegador.
- **No iPhone** aparece o passo a passo: Compartilhar → "Adicionar à Tela de Início".
- **"Agora não"** esconde o convite por alguns dias *(minha escolha: 3 dias)*.
- **Instalado ou não**, o app funciona igual. Depois do primeiro carregamento, **todo o conteúdo, inclusive as imagens, fica disponível sem internet**.

### 5.6 Ajustes
- **Leitura:** tamanho da letra (3 níveis), tema Claro / Escuro / Automático e data da prova, que mostra a contagem de dias no Histórico e no topo.
- **Seus dados:**
  - **Salvar cópia do histórico** em arquivo.
  - **Restaurar de uma cópia.** *Minha escolha:* substitui o histórico atual, depois de confirmar.
  - **Apagar meu histórico**, com confirmação.
- **Sobre:** data de revisão do conteúdo, fontes e créditos das imagens, e **Reportar um erro**.

### 5.7 Reportar erro (sem servidor)
*Minha escolha:* o botão abre a **opção de compartilhar do celular** com uma mensagem pronta, contendo o id da questão ou cartão, o texto e o que a pessoa achou errado. Assim a pessoa manda para o usuário pelo WhatsApp ou como preferir. Nenhum endereço fica embutido no app.

## 6. Dados guardados no aparelho

**Onde ficam:**
- Tudo fica **no navegador do aparelho**: IndexedDB para o histórico e localStorage só para preferências.
- O app pede **armazenamento persistente** ao navegador, quando disponível, para o sistema não apagar os dados.

**O que é guardado:**
- **Tentativas de simulado:** modo, início, hora de término, questões sorteadas, ordem das alternativas, resposta, "revisar depois", data de entrega, nota e acertos por área.
- **Caderno de erros:** questões erradas e quantos acertos seguidos cada uma já teve desde o último erro.
- **Questões vistas.**
- **Estado de cada cartão:** caixa/intervalo, próxima revisão e última revisão.
- **Partidas de caça-palavras:** tema, nível, tempo, palavras e data, mais os recordes por tema e nível.
- **Preferências:** letra, tema, data da prova e quando a pessoa dispensou o convite de instalação.

**Cópia de segurança e versões:**
- O arquivo da cópia é um JSON com **número de versão do formato**.
- Mudanças futuras no formato precisam migrar os dados antigos sem perder nada.

## 7. Como é construído *(minhas escolhas, o usuário delegou)*

- **Site estático:** **Vite + TypeScript + React**. Rotas por hash (`#/simulado`), para funcionar em qualquer hospedagem estática.
- **PWA com `vite-plugin-pwa`:** manifest, ícones, service worker que deixa em cache todo o app, as questões, os cartões e as 130 imagens de placa, e atualização avisando "nova versão disponível".
- **Conteúdo em arquivos JSON versionados no projeto**, gerados a partir de `pesquisa/` por scripts.
- **Validação automática do conteúdo** na construção do site:
  - toda questão tem 4 alternativas e índice correto válido
  - todo código de placa citado existe e tem imagem
  - palavras com até 12 letras e só A–Z depois de normalizar
  - sem ids repetidos
  - créditos presentes para toda imagem CC BY-SA
- **Testes:**
  - **Testes de unidade** para a lógica: geração da grade, validação da seleção, sorteio da prova, cronômetro, repetição espaçada, caderno de erros e exportação/importação.
  - **Testes de ponta a ponta** em tela de celular para os fluxos principais: jogar uma partida, fazer a prova até o fim, revisar cartões e restaurar uma cópia.
- **Visual:**
  - **Cores:** preto + amarelo de placa (#FACC15), verde para acerto, vermelho para erro.
  - **Leitura:** modo escuro, contraste adequado e tamanho de letra ajustável.
  - **Toque:** áreas de toque de pelo menos 44px, respeitando "reduzir movimento".
- **Hospedagem:** **GitHub Pages na conta pessoal `Ramonrpro`** (decisão do usuário), publicado automaticamente pelo GitHub Actions a cada atualização.
  - **Endereço:** repositório `transito-em-jogo` *(minha escolha)*, o que dá o endereço **`https://ramonrpro.github.io/transito-em-jogo/`**.
  - **Esse endereço é definitivo** a partir do primeiro uso real. O histórico de cada pessoa fica preso a ele. Mudar o nome do repositório, ir para domínio próprio ou trocar de hospedagem faria todo mundo abrir o app vazio.
  - O caminho base do build, o escopo do service worker e o manifest usam `/transito-em-jogo/`.
  - Antes de criar o repositório e publicar, a conta ativa do `gh` precisa ser a `Ramonrpro` (`gh auth switch`).

## 8. O que fica a critério de quem constrói
- Estrutura de pastas, componentes, nomes, gerenciamento de estado e a biblioteca de IndexedDB.
- Detalhes visuais finos (espaçamentos, animações, ícones) dentro do estilo dos rascunhos.
- Algoritmo de geração da grade, desde que respeite as direções do nível, só use palavras que cabem e não monte uma das palavras por acaso em outro lugar.
- Texto exato dos cartões de Números da prova e Primeiros socorros, desde que tudo tenha base na referência e cite artigo ou fonte.
- Detalhe interno de cada etapa da §8.1. A ordem das etapas está definida lá.

### 8.1 Entrega em etapas (prazo)
A primeira prova de quem vai usar o app deve acontecer **em cerca de um mês**. Por isso a entrega é em etapas. **Cada etapa é publicada no endereço definitivo** e já pode ser usada:
1. **Simulado primeiro:**
   - Casca do app: PWA, instalação, uso sem internet e armazenamento.
   - Conteúdo das questões, com a validação automática.
   - **Simulado completo:** os 4 modos, resultado, caderno de erros e revisão.
   - Histórico básico dos simulados.
   - Ajustes com a cópia de segurança.
   - Publicação.
2. **Caça-palavras:** com o cartão "Achou!", as 120 imagens de placa e os créditos. Ao entrar, ele passa a ser a página inicial.
3. **Flashcards + álbum de placas:** inclui escrever e conferir os cartões de Números da prova e Primeiros socorros.
4. **Histórico completo:** gráfico, áreas, sequência de dias e contagem para a prova. Mais o acabamento: tema escuro, tamanho de letra e reportar erro.

Enquanto o caça-palavras não existe, o app abre no Simulado.

## 9. Fase 2 (registrada, fora desta versão)
- **Importar o banco nacional completo (1.500 questões)** do PDF da Senatran, conferindo cada uma contra a referência como foi feito com as 383.
- **Novos quizzes:** "qual é a placa?" rápido, verdadeiro ou falso, e ligar cada placa à sua questão.
- **Partida diária** e outras ideias da pesquisa de concorrentes (`pesquisa/06`).
- **As 10 placas mais novas** (R-41 a R-44, A-49a/b, A-50a/b), se surgir ficha oficial.

## 10. Decisões tomadas

**Pelo usuário:** os 4 itens abaixo.
- PWA instalável, com convite no primeiro acesso.
- Mobile-first.
- Caça-palavras como página inicial, com grade + lista de palavras com dicas (opção C, cartão ao achar).
- Sem acompanhamento de alunos, mas com histórico.
- Hospedagem no GitHub pessoal `Ramonrpro`.
- Primeira prova prevista para cerca de um mês.

Aprovou também os fluxos do simulado, dos flashcards e das telas de apoio, e a nota de 20/30 conforme a regra oficial.

**Minhas, para o usuário conferir:**
- Nome provisório do app.
- Stack (Vite + TS + React) e hospedagem no GitHub Pages.
- Tamanhos e níveis da grade.
- Mapeamento das áreas e o sorteio 8/4/13/5.
- Regra de saída do caderno de erros (2 acertos seguidos).
- Intervalos da repetição espaçada e o critério de "dominado".
- Ensinar a lei atual com aviso quando o banco oficial diverge.
- Reportar erro pela opção de compartilhar do celular.
- Restaurar a cópia substituindo o histórico.
- Convite de instalação reaparecendo após 3 dias.
- Créditos das imagens CC BY-SA numa tela própria.
- 120 placas nesta versão, deixando as 10 sem fonte oficial para a fase 2.
- Botão "Estudar estes cartões" ligado aos baralhos existentes, sem baralho de palavras.
- Nome do repositório `transito-em-jogo`, que define o endereço definitivo.
- Entrega em 4 etapas com o Simulado primeiro (§8.1), por causa do prazo.
