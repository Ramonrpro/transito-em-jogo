# 06: Concorrentes e ideias

Levantamento de sites e apps de estudo para a prova teórica do Detran. O objetivo é saber o que copiar e o que evitar.

> **Data da pesquisa:** 25/10/2026
> **Escopo:** UX, funcionalidades, monetização e opinião dos usuários. Conteúdo, legislação e banco de questões ficam com os outros documentos da pasta `pesquisa/`.
> **Público do nosso app:** grupo pequeno de alunos, principalmente de Minas Gerais. É um PWA instalável, mobile-first, sem login, com progresso salvo no aparelho.

---

## Como a pesquisa foi feita

- **Google Play:** usei a biblioteca `google-play-scraper` (pt-BR, Brasil) para buscar "simulado detran", "simulado cnh", "prova teórica detran", "placas de trânsito quiz", "legislação de trânsito", "caça palavras trânsito" e "flashcards placas". Coletei os metadados de **30 apps**: nota, nº de avaliações, instalações, anúncios e compras no app. Também baixei **cerca de 3.900 avaliações únicas** de 22 apps de simulado e placas. Para cada app peguei até 60 avaliações de cada filtro: mais relevantes, mais recentes, 1★, 2★, 3★ e 5★.
  - **Atenção:** a amostra tem **mais avaliações negativas de propósito**, para achar as dores. Os percentuais abaixo servem como indicação, não como estatística da loja.
- **App Store:** usei o RSS público da loja (50 avaliações mais recentes) e o endpoint de *lookup* para 5 apps de iOS, além da página da CNH do Brasil na App Store.
- **Sites oficiais e de terceiros:** gov.br/Ministério dos Transportes, Detran-SP, Detran-PR, a lista de simulados do Portal do Trânsito, Doutor Multas, Simulados.Online e matérias de imprensa sobre o curso gratuito da CNH do Brasil.
- **Padrões de outros apps de estudo:** blog e engenharia do Duolingo, FAQ do Anki, Central de Ajuda do Quizlet, os dois maiores caça-palavras da Play Store e um app de cruzamentos (Křižovatky).

## Resumo em 6 pontos

1. **O mercado está lotado e bem avaliado, mas é sustentado por anúncios agressivos.** Os simulados mais baixados têm de 1 a 5 milhões de instalações e nota entre 4,6 e 4,9. Mesmo assim, **cerca de 37% das avaliações de 1 a 3★ da amostra reclamam de anúncios**, muitas vezes de jogos de aposta ("tigrinho"). Muitos anúncios aparecem *no meio da questão* e alguns derrubam o simulado.
2. **O que faz o usuário dar 5★:** "caíram questões iguais na prova", explicação de por que errou, refazer as que errou, desempenho por matéria, pausar e continuar, funcionar offline e poucos anúncios.
3. **O que faz dar 1★:** anúncios, gabarito errado ou desatualizado, "o app trocou minha resposta" (em pelo menos 10 apps), perda de progresso, repetição de questões, paywall disfarçado e assinatura semanal impossível de cancelar.
4. **Os oficiais têm credibilidade, mas são frágeis:**
   - A **CNH do Brasil** tem um curso gratuito com simulados do banco nacional, mas exige gov.br, e os usuários reclamam de módulos travados e etapas que não sincronizam.
   - O **Simulado Detran-SP** já ficou semanas fora do ar.
   - Os simulados web oficiais de SP e PR **exigem login**.
   - **Não encontramos simulado oficial do Detran-MG.** MG não aparece na lista do Portal do Trânsito.
5. **Há uma lacuna clara: não existe caça-palavras de trânsito nas lojas.** O único que achamos é um minijogo dentro do "Trânsito Legal", do Detran-CE, que exige cadastro. Os caça-palavras genéricos têm mais de 100 milhões de instalações, o que mostra que o formato agrada a um público amplo.
6. **Nosso diferencial natural:** zero anúncio, zero login, offline, lúdico, focado em MG e com conteúdo confiável e revisável.

---

## 1. Tabela comparativa dos produtos pesquisados

Os números foram coletados em 25/10/2026. "Instal." é a faixa de instalações no Google Play e "★" é a nota média com o nº de avaliações.

### 1.1 Oficiais (governo)

| Produto | Escala | O que oferece / destaques de UX | Monetização / atritos | Elogios (+) e reclamações (−) |
|---|---|---|---|---|
| **CNH do Brasil**, app federal (Serpro/Min. Transportes). [Play](https://play.google.com/store/apps/details?id=br.gov.serpro.cnhe) · [iOS](https://apps.apple.com/br/app/cnh-do-brasil/id1275057217) | 100M+ instal. · ★4,9 (8,3 mi). iOS ★4,9 (4 mi) | Na "Jornada da 1ª Habilitação" tem um **curso teórico gratuito** com 4 módulos (Sinalização; Escolhas e consequências; Segurança; Cuidado). Cada módulo tem 4 aulas, e a **4ª aula é um teste** ([Exame](https://exame.com/brasil/cnh-sem-autoescola-saiba-como-acessar-o-curso-teorico-gratuito/)). Oferece textos, vídeos, podcasts, **simulados baseados no banco nacional de questões** e certificado com QR Code ([Webmotors](https://www.webmotors.com.br/wm1/noticias/cnh-do-brasil-nova-habilitacao-digital)). O certificado é enviado automaticamente ao Detran. | Grátis, sem anúncios. **Exige conta gov.br** e abertura do requerimento de 1ª habilitação. Alguns fluxos pedem biometria facial. | + "O curso tornou possível tirar a habilitação", fácil de acessar. − Módulo que "não finaliza" e bloqueia o próximo. Etapas e certificado que não sincronizam com o Detran (há relato de Sete Lagoas-MG). Mesma infração aparece como "gravíssima" numa página e "grave" em outra. Placas com desenho espelhado e erros de ortografia. "Texto infantilizado", "aulas em áudio sobre sinais visuais". |
| **Simulado Detran-SP** (Prodesp). [Play](https://play.google.com/store/apps/details?id=br.gov.sp.detran.simulado) · [iOS](https://apps.apple.com/br/app/id684203767) | 5M+ · ★4,9 (60 mil). iOS ★4,1 (2,7 mil) | 30 questões aleatórias em 40 min, com mínimo de 21 (segundo a descrição na loja). Estudo por assunto, **leis e apostila dentro do app**, "Questões que errei", favoritar provas, **funciona offline**. | Grátis, sem anúncios. O simulado **web** do Detran-SP ([link](https://www.detran.sp.gov.br/simulado)) redireciona para login. | + "Simples, mas completo", "as questões aparecem lá na prova", offline. − **Fora do ar por semanas** (Android em mai/2025; no iOS as questões aparecem como "null"). Guarda só o último simulado. Perde tudo ao reinstalar. **Cronômetro reinicia ao bloquear a tela e a ordem das alternativas muda**, o que gera o "app trocou minha resposta". Questões desatualizadas após mudanças na lei. "Letras muito pequenas". |
| **Detran/PR 1ª Habilitação** (Celepar). [Play](https://play.google.com/store/apps/details?id=br.gov.pr.celepar.detran.primeirahabilitacao) | 1M+ · ★4,4 (2,4 mil) | Acompanhamento do processo (aulas, exames, taxas) e simulado. | Grátis. Login com CPF e nº do processo. O [simulado web do PR](http://www.simulado.detran.pr.gov.br/detran-prova/simularProva.do?action=iniciarProcesso) pede usuário e senha e recomenda "Firefox 2.0, tela 1024x768". | − "Alert null", sessão expira. Simulado repetitivo: "decorei e não caiu nenhuma na prova". |
| **Simulados web de outros Detrans** (RJ, RS, ES, PE, SE, BA, AC, AL, MA, RO, RR). [Lista no Portal do Trânsito](https://www.portaldotransito.com.br/simulados/) | – | Formato de prova (30 questões). | Vários pedem login. O domínio `simulado.detran.rj.gov.br` não respondeu no teste de 25/10/2026. | **MG e DF não constam da lista.** |
| **Trânsito Legal** (Detran-CE). [Matéria](https://garagem360.com.br/?p=155792) | – | Jogo grátis (Android/iOS, 2022) com **quebra-cabeça, caça-palavras** e perguntas sobre sinalização. Foco em motociclistas, com escolha de personagem. | **Exige cadastro.** | Único caça-palavras de trânsito encontrado. |

### 1.2 Simulados comerciais e independentes

| Produto | Escala | O que oferece / destaques de UX | Monetização / atritos | Elogios (+) e reclamações (−) |
|---|---|---|---|---|
| **Simulado Prova CNH** (DSmartApps). [Play](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH) · [iOS](https://apps.apple.com/br/app/id1402345294) | 1M+ · ★4,7 (41 mil). iOS ★4,8 (31 mil) | Simulado de 30 ou 40 questões. **"Simulados Especiais"** montados só com as questões que você errou, separados por tópico. Revisão que destaca as questões importantes. **"Questões Selecionadas"**: só as que mudaram ou vão mudar. Gráficos comparando matérias. **Ajuste de tamanho da fonte**. | Anúncios sem opção paga para removê-los ("mesmo se quiser pagar, não tem como"). Anúncio de "tigrinho" que não fecha. | + "Repete mais as que você errou", "quase todas as questões do exame eu já tinha visto". − Gabarito errado (velocidade em via arterial). **Falta botão "reportar erro"**. Botões de confirmar no topo da tela. Perdeu o progresso numa atualização. |
| **Simulado CNH: Prova 2026** (costaw). [Play](https://play.google.com/store/apps/details?id=br.com.costaw.simuladocnh) | 1M+ · ★4,7 (38 mil) | Mais de 700 questões, matérias separadas, placas, **modo escuro**, histórico de simulados. | Anúncios mais compra para removê-los (R$ 3,99 a 24,99). Usuário contou **"8 anúncios para 30 questões"**. Anúncios da Shopee tiram você do app e o **simulado reinicia**. | + "Fiz a prova de MG, 27/30, questões idênticas". Remover anúncios "foi o dinheiro mais bem gasto". Dica dos usuários: "desligue a internet para fugir dos anúncios". − Anúncios com áudio no meio da prova. Erros gramaticais. Questões repetidas no mesmo simulado. |
| **Simule** e **Aprova+** (Rall Softwares). [Simule](https://play.google.com/store/apps/details?id=com.rallsoftwares.simuladodetran) · [Aprova+](https://play.google.com/store/apps/details?id=com.rallaplicativos.simuladodetran) | 1M+ ★4,8 (43 mil) · 500k+ ★4,8 (17,6 mil) | **Explicação de cada questão**, pausar e continuar depois, revisão das erradas, questões por tema, estatísticas. | Anúncio a cada 3 a 5 questões, muitos de apostas. Premium de R$ 3,90 a 29,90. **Na versão grátis as questões se repetem.** | + "Quando erra aparece a explicação", "28/30 estudando só pelo app". − "Fechei o anúncio e perdi o simulado". Tela cinza que não finaliza. Termos desatualizados ("apreensão"). Relato de MG: "caiu só 1 questão das dezenas que fiz". |
| **Simulado CNH** (Leandro Palmieri). [Play](https://play.google.com/store/apps/details?id=nz.co.codeone.simuladocnh) | 1M+ · ★4,7 (13,7 mil) | 30 questões com aprovação em 21. **As erradas voltam no próximo teste.** Compartilhar o resultado. Versão web em simuladocnh.com. | Anúncios. | + "Fazia várias vezes até acertar todas". − Desatualizado (silvos, extintor). Não dá para voltar e revisar. Sair do app zera o simulado. |
| **Simulado CNH** (LinaTec). [Play](https://play.google.com/store/apps/details?id=sistema.simd.br) | 1M+ · ★4,7 (56 mil) | Offline, escolha do estado, cronômetro, gráficos de evolução, estudo por matéria. | Anúncio a cada 4 questões. Compras de R$ 0,99 a 99,99. | − **Histórico limitado a 21 simulados**, sem poder apagar. Tela de correção ruim ("erro aparece pequeno, embaixo"). Resultados sumiram numa atualização. |
| **Simulado Detran Brasil 2026** (Forward). [Play](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree) | 500k+ · ★4,7 (22,7 mil) | **Simulado personalizado** (quantidade, tempo e temas), **flashcards**, pede a **data da prova**, explicações (Premium), histórico com "refazer". | Anúncios mais Premium (até R$ 131,88). | + "Personalizar o simulado com as que errei", "flashcards para memorizar", "27 de 30 questões eu já tinha feito". − Gabarito errado e inconsistente entre simulados. Banco pequeno que se repete. Letras pequenas na versão nova. |
| **Simulado Habilitação – MG** (Massainfo). [Play](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.simulado.mg.mg) | 100k+ · ★4,9 (2,9 mil) | App **específico de MG**: refazer as erradas, simulados por matéria, **índice de acerto por matéria ao fim do simulado**, seção de placas. | Anúncios "não irritantes", remoção barata (R$ 0,99 a 2,99). | + "Passei na prova de legislação, praticamente tudo caiu", "não tem propaganda irritante igual outros". − "O app muda as questões que marcamos". Faltam placas turísticas ("caiu na minha prova"). Vocabulário difícil ("imputável"). |
| **Simulado CNH do Brasil 2026** (Dirigir Agora). [Play](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil) | 100k+ · ★4,9 (663) | Questões "com base nas novas diretrizes nacionais", **modo Duelo multiplayer**, ranking e prêmios. Explicação do erro. | **Sem anúncios** (compra de R$ 9,90). **Pede CEP e obriga ativar notificações.** | + "Sem anúncio, totalmente grátis", "funciona offline", explicação. − "Pra que pedir notificação e CEP? Desinstalei". Alternativas erradas "muito óbvias". |
| **Simulado CNH: Provas Detran** (MiraSoftware). [Play](https://play.google.com/store/apps/details?id=br.com.simuladocnh) | 100k+ · ★4,4 | **"Zero cadastro"**, simulado completo de 30 questões, **Teste Rápido de 7 questões** ("no ônibus, na fila"), histórico dos últimos 20, **pausar e continuar**, **lembrete de estudos**, jogo das placas. | Anúncios. | − **"Muda a resposta que marquei"** (várias avaliações). "Só joga uma prova, não ensina". |
| **Autoescola Online** (LegTransito, canal de YouTube grande). [Play](https://play.google.com/store/apps/details?id=jocampos.com.br.auto_escola_online) | 100k+ · ★4,1 | Simulado **pequeno, médio ou grande, conforme o tempo disponível**, jogo de placas, videoaulas. | Plus de R$ 39,99 a 49,99. | − Não carrega, depende de internet e do YouTube. Queriam **feedback a cada questão** e **retomar o simulado** após sair. Faltava o tempo de prova. |
| **Simulado Detran CNH Prova 2026** (HQ App). [Play](https://play.google.com/store/apps/details?id=com.robin.detran) | 100k+ · **★2,2** | Contraexemplo. | **Assinatura semanal** (R$ 55,99 a 224,99). Anúncios de 30 s a cada 2 questões. | − "Não tem opção de cancelar, perde 59 reais por semana". Não mostra a nota no fim. |
| **Simulado Detran: Prova CNH** (iOS, Luis Reis). [iOS](https://apps.apple.com/br/app/id1673142463) | iOS ★4,8 (3,9 mil) | Simulado com tempo, explicações, estudo por tema, histórico. | Anúncios que **abrem o navegador sozinhos**. Assinatura. | − "Cobrado toda semana, sem opção de cancelar". Trava e esquenta o celular. Anúncio sem X que obriga a reiniciar o simulado. |
| **Simulados Detran – CNH 2026** (iOS, King). [iOS](https://apps.apple.com/br/app/simulados-detran-cnh-2025/id1551622221) | iOS ★4,7 (881) | Formato oficial, explicações, estatísticas. | **Versão grátis com só 10 questões, sempre as mesmas.** | − "Quase tudo pago", "não mostra a resposta correta quando erra". |
| **Simulado DETRAN** (iOS, P. V. Oliveira). [iOS](https://apps.apple.com/br/app/id6474215352) | iOS ★4,8 (10,7 mil) | **Cronograma personalizado**, modo claro e escuro, **modo offline**, placas por categoria. | Freemium. | (poucas avaliações textuais) |
| **Simulado Detran: Prova Teórica** (Orbyon). [Play](https://play.google.com/store/apps/details?id=com.simuladododetran) | 5k+ · ★4,6 | "Professor IA" para dúvidas e plano de estudos. | Compras de até R$ 269,99. | − Gabarito de placa errado (R-23). |
| **Simulado Detran MG CNH 2026** (Wombat). [Play](https://play.google.com/store/apps/details?id=com.wombatunity.detranmg) · [web](https://simulados.online) | 10k+ · ★4,2 | Timer, rankings, desafios e "batalhas de questões". O site tem 30 questões sorteadas de mais de 2 mil, página por estado e é **"sem cadastro"**. Recomenda tirar **mais de 80% de forma consistente** antes da prova. | Anúncios mais compras. | − Precisa esperar o tempo acabar para ver a nota. Anúncio fecha o simulado. Gabarito errado ("desça a serra desengrenado"). |
| **Doutor Multas** (site). [Simulados](https://doutormultas.com.br/codigo-de-transito/simulados-detran/) | – | Simulados por estado (inclui MG) e por matéria. | **Captura de leads**: "fale com especialista", WhatsApp flutuante. | (site de conteúdo/SEO) |

### 1.3 Placas e jogos de trânsito

| Produto | Escala | O que oferece / destaques de UX | Monetização / atritos | Elogios (+) e reclamações (−) |
|---|---|---|---|---|
| **Quiz CNH – Placas de Trânsito** (Infinity Dev). [Play](https://play.google.com/store/apps/details?id=com.id.plates) | 500k+ · ★4,8 (7 mil) | Todas as placas com descrição, mais de 400 questões, **"não repete questões já respondidas corretamente"**, revisão dos simulados, lista de infrações e multas. | Anúncios que cobrem o botão de resposta. | + "Poucas propagandas, prova com o mesmo tempo do Detran". Pedido: "simulado de infrações". − Respostas erradas em algumas placas. |
| **Placas de Trânsito Quiz** (Massainfo). [Play](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.sinalizacao) | 100k+ · ★4,8 | Dois níveis de dificuldade. Cada placa tem código, imagem HD, nome e significado. **Álbum de figurinhas** e **modo de responder falando**. | Anúncios mais compras baratas. | + **"O álbum de figurinhas me ajudava a memorizar porque eu queria completar o álbum"**. "Aprendo falando em voz alta, a opção de falar as placas ajuda demais". − Faltam placas educativas e turísticas. Desatualizado frente à Res. 973. |
| **Jogo das Placas de Trânsito** (MiraSoftware). [Play](https://play.google.com/store/apps/details?id=br.com.jogo.placas.transito.detran) | 100k+ · ★4,6 | "Sem cadastro", **3 níveis**, **Modo Estudo** com imagem, significado e código oficial, **"sem pressão de tempo"**, 100% offline. | Anúncios. | − Anúncio tampando o botão de confirmar. **No fim não mostra quais placas errou.** Pedido: **escolher os tipos de placa e excluir as fáceis**. |
| **Qual é a placa? Simulado CNH** (Apps Bergman). [Play](https://play.google.com/store/apps/details?id=com.appsbergman.qualeaplaca2) | 100k+ · ★4,8 | Mais de 160 placas com código e mais de 800 questões por categoria. | Anúncios mais compra de R$ 22,99. | + Agente de trânsito: "o melhor da categoria". − "Não mostra se as respostas estão certas", "visual muito escuro". |
| **Placas de trânsito Brasil** (Shoyo). [Play](https://play.google.com/store/apps/details?id=com.shoyo.znakovi) | 1M+ · ★4,6 | Quiz genérico de 85 países, com ranking e conquistas. | Anúncios mais compras. | Genérico, conteúdo pouco localizado. |
| **Křižovatky / Intersections – Driving school**. [Play](https://play.google.com/store/apps/details?id=eu.greenfiregames.krizovatky) | 10k+ | Mais de **160 cenários de cruzamento**: o jogador escolhe a **ordem de passagem** dos veículos. | Anúncios. | Referência para um quiz futuro de **preferência**. |

### 1.4 Referências de padrão (fora do nicho)

| Produto | O que vale observar | Fonte |
|---|---|---|
| **Duolingo** (sequência/streak) | **Uma lição por dia já mantém a sequência**: separar a meta diária da sequência deu +3,3% de retenção no 14º dia. O **"congelamento"** permite até 2 equipados e aumentou os aprendizes ativos diários em 0,38%. Quem chega a 7 dias tem **3,6× mais chance de concluir o curso**. A animação de marco aumentou em 1,7% a chance de o novato seguir ativo após 7 dias. | [blog: streak e hábito](https://blog.duolingo.com/how-duolingo-streak-builds-habit) · [blog: melhorando o streak](https://blog.duolingo.com/improving-the-streak) · [engenharia](https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals) |
| **Anki** (repetição espaçada) | Quatro botões (De novo / Difícil / Bom / Fácil), algoritmo SM-2 ou FSRS. O FAQ admite o problema do card que fica "preso" em intervalos curtos ("low interval hell"). | [FAQ Anki](https://faqs.ankiweb.net/what-spaced-repetition-algorithm) |
| **Sistema Leitner** | Caixas de 1 a 5: acertou, sobe uma caixa; errou, volta para a 1. É simples de explicar e de implementar offline. | [Wikipedia](https://en.wikipedia.org/wiki/Leitner_system) |
| **Quizlet Match** | Jogo cronometrado de ligar termo e definição, **6 pares por rodada**, e **cada erro soma +1 s**. | [Ajuda Quizlet](https://help.quizlet.com/hc/en-us/articles/360031183611) |
| **Caça Palavras Brasileiro** (Bluetile/Word Search Journey). [Play](https://play.google.com/store/apps/details?id=com.playvalve.wsjourney) | 100M+ · ★4,8 (785 mil). **4 níveis** (Fácil, Médio, Difícil, Pro), temas, offline, paisagens de fundo. − Anúncio sem botão de fechar, **palavra encontrada que não é aceita**, palavras repetidas, palavras de trás para frente ("mal sei ler normal"), erros de ortografia. | Play Store |
| **Caça palavras Brasileiro** (Blackout Lab). [Play](https://play.google.com/store/apps/details?id=com.blackout.word) | 100M+ · ★4,8 (1 mi). Trilha de níveis ("Quest"), 23 temas, modo infinito, offline. + **Letras grandes** "até para quem tem problema de visão", música relaxante. − "**Termina a partida e não acontece nada**, poderia ter troféu e pontuação". **Sair no meio perde o progresso.** Palavras fora da categoria. Anúncios longos. | Play Store |

---

## 2. Ideias para trazer (priorizadas)

**Legenda:** **P0** = entra no MVP · **P1** = logo depois · **P2** = quando der.
Todas cabem num PWA estático, sem login e offline.

### P0: essenciais

1. **Sem anúncios, sem cadastro e sem pedir permissão ao abrir.**
   - *Por que:* é a reclamação nº 1 do nicho (cerca de 37% das avaliações de 1 a 3★ da amostra). Nos concorrentes, a recompensa por isso é explícita: "não tem anúncio, totalmente grátis" ([Dirigir Agora](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil)) e "zero cadastro, abra e use" ([MiraSoftware](https://play.google.com/store/apps/details?id=br.com.simuladocnh)). O mesmo Dirigir Agora leva 1★ por **pedir CEP e notificação**.
   - *PWA:* nada de pedir notificação ao abrir. Se um dia houver lembrete, pedir só quando o usuário ativar.

2. **Feedback com explicação curta e base legal em cada questão** no modo Estudo. Mostrar artigo do CTB, resolução ou código da placa, e uma linha dizendo por que as outras alternativas estão erradas.
   - *Por que:* é o elogio mais citado nos apps de 4,8★ ("quando erra aparece a explicação", em [Aprova+](https://play.google.com/store/apps/details?id=com.rallaplicativos.simuladodetran) e [Simule](https://play.google.com/store/apps/details?id=com.rallsoftwares.simuladodetran)). Usuários do [DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH) pedem "por que determinada alternativa está certa e as demais erradas". O [King (iOS)](https://apps.apple.com/br/app/simulados-detran-cnh-2025/id1551622221) apanha por "não mostrar a resposta correta".
   - *PWA:* cada questão tem os campos `explicacao` e `fonte` no JSON (fornecidos pelo agente do banco de questões).

3. **Revisão fiel: "o app nunca troca a minha resposta".**
   - Embaralhar as alternativas **uma vez por tentativa** e **gravar a ordem e o id da alternativa escolhida**.
   - Na revisão, mostrar exatamente o que foi marcado, lado a lado com a correta.
   - Usar alvos de toque grandes (pelo menos 44 px) e destacar com clareza a alternativa selecionada.
   - *Por que:* "o app mudou minha resposta" aparece em **pelo menos 10 apps**: [Detran-SP](https://play.google.com/store/apps/details?id=br.gov.sp.detran.simulado), [Simule](https://play.google.com/store/apps/details?id=com.rallsoftwares.simuladodetran), [Massainfo MG](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.simulado.mg.mg), [MiraSoftware](https://play.google.com/store/apps/details?id=br.com.simuladocnh), [LinaTec](https://play.google.com/store/apps/details?id=sistema.simd.br), [Autoescola Online](https://play.google.com/store/apps/details?id=jocampos.com.br.auto_escola_online), [Forward](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree), [King iOS](https://apps.apple.com/br/app/simulados-detran-cnh-2025/id1551622221) e outros. Uma avaliação do Detran-SP explica a causa: depois de desbloquear a tela, **a ordem das alternativas foi refeita** e a seleção continuou na mesma posição. Isso destrói a confiança no app.

4. **Salvar sempre e usar cronômetro "à prova de tela bloqueada".**
   - Gravar no IndexedDB a cada resposta, guardando o horário final absoluto (`fimEm = início + duração`), e não um contador que para.
   - Ao reabrir, perguntar: "Continuar seu simulado (faltam 23 min)?".
   - Se disponível, usar a *Screen Wake Lock API* durante o simulado.
   - *Por que:* as queixas de "saí do app e voltou do zero" e "fechei um anúncio e perdi o simulado" aparecem em [LinaTec](https://play.google.com/store/apps/details?id=sistema.simd.br), [Simulado CNH](https://play.google.com/store/apps/details?id=nz.co.codeone.simuladocnh), [Rall](https://play.google.com/store/apps/details?id=com.rallsoftwares.simuladodetran) e [Autoescola Online](https://play.google.com/store/apps/details?id=jocampos.com.br.auto_escola_online). O cronômetro do Detran-SP reinicia ao bloquear a tela. "Pausou? Salva e continua depois" é argumento de venda do [MiraSoftware](https://play.google.com/store/apps/details?id=br.com.simuladocnh).

5. **Caderno de erros.** Toda questão errada entra numa lista, com o botão "Refazer só as que errei" (filtrável por tema). As erradas voltam com mais frequência nos treinos.
   - *Por que:* é o recurso mais elogiado no [DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH) ("repete mais as que você errou", com 798 curtidas). Também existe no [Simulado CNH](https://play.google.com/store/apps/details?id=nz.co.codeone.simuladocnh) ("as que você errou serão apresentadas novamente"), no [Massainfo MG](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.simulado.mg.mg) e no Detran-SP.

6. **Desempenho por tema ao fim de cada simulado e histórico sem limite** (local).
   - *Por que:* "após terminar um simulado ele mostra os índices de acerto de cada disciplina, app genial" ([Massainfo MG](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.simulado.mg.mg)). Os concorrentes apanham por limitar o histórico: só 21 no [LinaTec](https://play.google.com/store/apps/details?id=sistema.simd.br), só o último no Detran-SP.

7. **Nunca repetir questão no mesmo simulado e girar o banco.**
   - Priorizar questões nunca vistas e as erradas. Questões acertadas várias vezes descansam.
   - Mostrar um **medidor de cobertura**, por exemplo "Você já viu 312 de 480 questões".
   - *Por que:* repetição é a 3ª reclamação mais comum. Exemplos: [Forward](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree) ("umas 10 por matéria que se repetem"), [Rall](https://play.google.com/store/apps/details?id=com.rallsoftwares.simuladodetran) grátis e [King](https://apps.apple.com/br/app/simulados-detran-cnh-2025/id1551622221) ("sempre as 10 mesmas"). O [Quiz CNH – Placas](https://play.google.com/store/apps/details?id=com.id.plates) vende "não repete questões já respondidas corretamente". Os aprovados contam que estudaram até "decorar o banco" ([Detran-SP](https://play.google.com/store/apps/details?id=br.gov.sp.detran.simulado), [DSmartApps iOS](https://apps.apple.com/br/app/id1402345294)). A cobertura total dá segurança.

8. **Offline de verdade e progresso que não some.**
   - Usar *service worker* com todo o conteúdo e as imagens no cache, e progresso em IndexedDB.
   - Chamar `navigator.storage.persist()` no primeiro salvamento importante ([web.dev](https://web.dev/articles/persistent-storage)).
   - Oferecer **"Exportar/Importar progresso"** (arquivo `.json` ou código para copiar e colar), já que não há login.
   - No iPhone, incentivar "Adicionar à Tela de Início": o Safari pode apagar dados de sites não usados por 7 dias, e os web apps na tela inicial têm contador próprio ([WebKit](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), [Search Engine Land](https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519)).
   - *Por que:* "funciona sem internet" é elogio no [Detran-SP](https://play.google.com/store/apps/details?id=br.gov.sp.detran.simulado), no [Jogo das Placas](https://play.google.com/store/apps/details?id=br.com.jogo.placas.transito.detran) e no [Dirigir Agora](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil). "Perdi tudo ao reinstalar" é queixa no Detran-SP e no [DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH). Os apps oficiais quebram quando o servidor cai ("null" no iOS): **embutir o conteúdo no app elimina esse risco**.

9. **Botão "Reportar erro nesta questão"**, com link `mailto:` ou WhatsApp já preenchido com o id da questão e a versão do conteúdo. Mostrar também a **data da última revisão do conteúdo** (por exemplo, "Conteúdo revisado em out/2026").
   - *Por que:* gabarito errado ou desatualizado é queixa constante (via arterial, silvos, extintor, "apreensão", "acidente" × "sinistro"). Os usuários pedem explicitamente "opção de reportar o erro" ([DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH)). Até o conteúdo oficial tem inconsistências ([CNH do Brasil](https://play.google.com/store/apps/details?id=br.gov.serpro.cnhe)). Com um grupo pequeno de alunos, esse retorno vale ouro.

10. **Acessibilidade básica e "polegar-friendly".**
    - Tamanho de fonte ajustável (A−/A+), modo escuro automático e manual, alto contraste.
    - Botões de ação (Confirmar, Próxima) **na parte de baixo da tela**.
    - Imagens de placa grandes, com zoom.
    - *Por que:* "altere o tamanho das letras" é recurso do [DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH). O modo escuro é recurso do [costaw](https://play.google.com/store/apps/details?id=br.com.costaw.simuladocnh) e do [Simulado DETRAN iOS](https://apps.apple.com/br/app/id6474215352). Há queixas de "letras muito pequenas" ([Detran-SP iOS](https://apps.apple.com/br/app/id684203767), [Forward](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree)), de "ter que levar o dedo à parte superior da tela para confirmar" ([DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH)) e de "visual muito escuro" ([Qual é a placa?](https://play.google.com/store/apps/details?id=com.appsbergman.qualeaplaca2)).

### P1: logo depois do MVP

11. **Sessões curtas para encaixar no dia:** "Treino rápido" de 10 questões e simulado em tamanho P, M ou G.
    - *Onde:* Teste Rápido de 7 questões "pra estudar no ônibus, na fila" ([MiraSoftware](https://play.google.com/store/apps/details?id=br.com.simuladocnh)), simulado "pequeno, médio ou grande, de acordo com o tempo" ([Autoescola Online](https://play.google.com/store/apps/details?id=jocampos.com.br.auto_escola_online)), lições curtas do Duolingo.

12. **Sequência diária gentil.** Qualquer atividade conta: 1 caça-palavras, 10 flashcards ou 1 treino rápido.
    - Incluir **1 ou 2 "congelamentos"** automáticos por semana e uma comemoração nos marcos (3, 7, 14 e 30 dias).
    - Não mandar notificação de culpa.
    - *Onde:* Duolingo. Fazer uma lição já basta (+3,3% de retenção no 14º dia), o congelamento ajuda e o marco de 7 dias pesa muito ([blog](https://blog.duolingo.com/improving-the-streak), [blog](https://blog.duolingo.com/how-duolingo-streak-builds-habit)).

13. **Contagem regressiva para a prova e meta diária sugerida.** O aluno informa a data, e o app sugere "faltam 12 dias: 1 simulado e 20 cartões por dia".
    - *Onde:* o [Forward](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree) pede a data da prova. O [Simulado DETRAN iOS](https://apps.apple.com/br/app/id6474215352) tem cronograma personalizado.

14. **Indicador "Pronto para a prova?"**, por exemplo: últimos 3 simulados ≥ 80%, cobertura do banco ≥ 90% e caderno de erros quase zerado.
    - *Onde:* o [Simulados.Online](https://simulados.online) recomenda tirar mais de 80% de forma consistente antes do exame. Os aprovados descrevem exatamente esse ritual.

15. **Álbum de figurinhas das placas.** Cada placa dominada (por exemplo, acertada 3 vezes em dias diferentes) "cola" no álbum, organizado por categoria.
    - *Onde:* [Massainfo Placas](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.sinalizacao): "o álbum de figurinhas me ajudava a memorizar pq eu queria completar o álbum".

16. **Selo "Regra nova" ou "Atenção: mudou".** Marcar as questões e os cartões afetados pela reforma de 2025/2026 e por mudanças de terminologia, com um filtro só para elas.
    - *Onde:* "Questões Selecionadas" do [DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH), mais as queixas recorrentes de termos antigos.

17. **Comemorar o fim de cada atividade:** tela de resultado com tempo, acertos, sequência e um "troféu" discreto.
    - *Onde:* reclamação no [Blackout Lab](https://play.google.com/store/apps/details?id=com.blackout.word): "termina a partida e não acontece nada".

### P2: quando der

18. **Ouvir a questão ou a placa** (Web Speech API, voz pt-BR do aparelho) e, opcionalmente, responder falando no quiz de placas. Áudio entra **como complemento**, nunca no lugar da imagem.
    - *Onde:* "aprendo falando em voz alta" ([Massainfo Placas](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.sinalizacao)). Na [CNH do Brasil](https://play.google.com/store/apps/details?id=br.gov.serpro.cnhe) reclamam de "aulas em áudio sobre sinais visuais".

19. **Desafio entre amigos sem servidor.** Gerar um link com uma *seed* (`?desafio=8F3K`) que produz o mesmo conjunto de questões ou o mesmo caça-palavras para todos, e compartilhar o resultado via Web Share API.
    - *Onde:* compartilhar resultado ([Simulado CNH](https://play.google.com/store/apps/details?id=nz.co.codeone.simuladocnh)), duelos multiplayer elogiados no [Dirigir Agora](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil). Aqui sem conta, sem CEP e sem servidor.

20. **"Questão do dia" ou "Caça-palavras do dia"** igual para todos os alunos, para comentar no grupo da turma.

---

## 3. Armadilhas para evitar

Estão em ordem de dano à reputação, segundo as avaliações.

1. **Anúncio no meio da questão ou do jogo.** Inclui anúncios de apostas, anúncio sem "X", anúncio que joga para a Play Store ou para o navegador e **mata o simulado**, e anúncio que cobre o botão de confirmar.
   - *Exemplos:* [costaw](https://play.google.com/store/apps/details?id=br.com.costaw.simuladocnh), [Rall](https://play.google.com/store/apps/details?id=com.rallaplicativos.simuladodetran), [DSmartApps](https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH), [Jogo das Placas](https://play.google.com/store/apps/details?id=br.com.jogo.placas.transito.detran), [Bluetile](https://play.google.com/store/apps/details?id=com.playvalve.wsjourney).
   - Um usuário resumiu assim: "é tipo um médico na cirurgia ser interrompido por um cara vendendo paçoca".

2. **Gabarito errado, desatualizado ou contraditório**, inclusive a mesma pergunta com respostas diferentes em simulados diferentes. "Um erro é suficiente para reprovar" ([Forward](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree)).
   - Evitar com: fonte legal por questão, revisão por uma segunda pessoa, ids estáveis (sem duplicatas), data de revisão visível e o botão de reportar.

3. **"O app trocou minha resposta"** e outras falhas de confiança na correção: alternativa reembaralhada, toque que registra a opção vizinha, final que não mostra a nota ([HQ App](https://play.google.com/store/apps/details?id=com.robin.detran), [SEVEN](https://play.google.com/store/apps/details?id=com.golden.simuladodetran)) e gabarito que mostra só "errou", sem a correta.

4. **Perder o progresso** ao sair do app, bloquear a tela, atualizar ou reinstalar. Limitar o histórico (21 simulados, ou só o último) também entra aqui.

5. **Paywall disfarçado e padrões obscuros.** Exemplos:
   - grátis com só 10 questões que se repetem ([King](https://apps.apple.com/br/app/simulados-detran-cnh-2025/id1551622221));
   - assinatura **semanal** sem opção de cancelar no app ([HQ App](https://play.google.com/store/apps/details?id=com.robin.detran), [Luis Reis iOS](https://apps.apple.com/br/app/id1673142463));
   - "paguei e continua aparecendo anúncio" ([SEVEN](https://play.google.com/store/apps/details?id=com.golden.simuladodetran), [Bluetile](https://play.google.com/store/apps/details?id=com.playvalve.wsjourney));
   - moedas e "prêmios falsos" em caça-palavras.

6. **Pedir dados ou permissões sem necessidade:** CEP, notificação obrigatória, login gov.br ou usuário e senha só para treinar ([Dirigir Agora](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil), simulados web [SP](https://www.detran.sp.gov.br/simulado) e [PR](http://www.simulado.detran.pr.gov.br/detran-prova/simularProva.do?action=iniciarProcesso)).

7. **Depender do servidor para mostrar questões.** Os apps oficiais ficaram semanas mostrando "null" ou "erro ao recuperar dados", às vésperas da prova dos usuários ([Detran-SP](https://apps.apple.com/br/app/id684203767), [Detran-PR](https://play.google.com/store/apps/details?id=br.gov.pr.celepar.detran.primeirahabilitacao)).

8. **Banco pequeno e distratores óbvios.** "As respostas erradas são muito óbvias, a resposta está na sua cara" ([Dirigir Agora](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil)). "A prova do Detran não é assim, são sempre pegadinhas" ([Forward](https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree)).

9. **Prometer demais.** Não prometer "questões idênticas à prova", nem usar marca ou visual que pareça oficial do Detran. Todos os concorrentes sérios trazem o aviso "app independente, não oficial" e citam as fontes. A [CNH do Brasil](https://www.gov.br/transportes/pt-br/assuntos/noticias/2026/03/cnh-do-brasil-saiba-como-solicitar-a-primeira-habilitacao-pelo-aplicativo-oficial-e-evite-canais-nao-autorizados) alerta contra canais não autorizados.

10. **Texto ruim:** infantilizado, com vocabulário arcaico ("imputável") sem explicação, erros de ortografia ou letras pequenas.

11. **Armadilhas específicas de caça-palavras** ([Bluetile](https://play.google.com/store/apps/details?id=com.playvalve.wsjourney), [Blackout Lab](https://play.google.com/store/apps/details?id=com.blackout.word)):
    - palavra encontrada que não é aceita;
    - palavras de trás para frente no nível fácil;
    - as mesmas palavras em todas as partidas;
    - erros de grafia e palavras fora do tema;
    - perder a grade ao sair;
    - nenhum retorno ao terminar.

---

## 4. Ideias específicas por seção

### 4.1 Caça-palavras (home)

Não há concorrente direto, então é o nosso cartão de visita. A ideia é que seja **divertido e ensine de verdade**.

- **Temas que espelham as matérias da prova:** Placas, Infrações e penalidades, Direção defensiva, Primeiros socorros, Mecânica básica, Meio ambiente e cidadania, e "Palavras do CTB" (sinistro, retenção, remoção, preferencial, acostamento...).
- **Cada palavra encontrada abre um mini-cartão** com uma definição de uma linha. Exemplo: *"SINISTRO: termo atual para o que antes se chamava 'acidente de trânsito'"*. O cartão tem os botões "Salvar nos flashcards" e "Treinar questões disso". Assim o jogo vira porta de entrada para as outras seções.
- **Níveis de dificuldade que controlam direções e tamanho**, para responder à queixa sobre palavras invertidas:

  | Nível | Grade | Direções |
  |---|---|---|
  | Fácil | 8×8, letras grandes | → e ↓ |
  | Médio | 10×10 | + diagonais |
  | Difícil | 12×12 | + invertidas |

- **Seleção robusta:** arrastar ou tocar na primeira e na última letra. Encaixar a seleção numa das 8 direções e aceitar as palavras nos dois sentidos. Dar retorno imediato com cor, vibração curta (`navigator.vibrate`, quando houver) e risco na lista. Nunca deixar "achei e não aceitou".
- **Sem repetição:** sortear do banco de palavras do tema sem repetir até esgotar e gerar a grade por *seed*.
- **"Caça-palavras do dia":** mesma *seed* para todos os alunos. Conta para a sequência e pode ser comparado no grupo da turma.
- **Dicas limitadas e honestas:** revelar a 1ª letra ou piscar a região, 3 por partida, **sem moedas nem anúncios**.
- **Variante "Caça-placas":** em vez da lista de palavras, mostrar **imagens de placas**, e o aluno procura o nome de cada uma na grade. É a ponte natural com os flashcards.
- **Sem pressão de tempo por padrão**, com cronômetro opcional para quem quer recorde. Inspiração: o "sem pressão de tempo" do [Jogo das Placas](https://play.google.com/store/apps/details?id=br.com.jogo.placas.transito.detran).
- **Salvar a grade no meio da partida e comemorar no fim:** tempo, palavras e "+1 na sequência".
- **A home também é painel:** abaixo da grade, cartões com "Continuar simulado (faltam 23 min)", "12 cartões para revisar hoje", a sequência e a contagem regressiva para a prova.

### 4.2 Simulado (30 questões / 1 hora)

- **Modo Prova (dia do exame):**
  - Ler duração, nº de questões, distribuição por tema e **nota de corte de um arquivo de configuração**, com os valores definidos pela pesquisa de legislação, para mudar sem mexer no código.
  - Sem feedback durante a prova.
  - Grade com os números das questões, "marcar para revisar", voltar e avançar livremente.
  - Avisos aos 10 e aos 5 minutos finais, confirmação antes de entregar e entrega automática quando o tempo acaba.
- **Modo Treino:** sem tempo, com feedback e explicação a cada questão, por tema ou misturado. Nos concorrentes os dois modos são separados e os usuários pedem ambos: "mostrar se acertou após cada questão" ([Autoescola Online](https://play.google.com/store/apps/details?id=jocampos.com.br.auto_escola_online)).
- **Treino rápido de 10 questões** para os dias corridos.
- **Tela de resultado:**
  - nota em relação à nota de corte;
  - barras de acerto por tema;
  - lista das erradas mostrando **a sua resposta e a correta**, com explicação e fonte legal;
  - botões "Refazer só as erradas", "Mandar erradas para os flashcards" e "Reportar erro".
- **Integridade:** alternativas embaralhadas e **congeladas** por tentativa, sem repetir questão na mesma prova, autosave a cada resposta, cronômetro por horário absoluto e Wake Lock quando disponível.
- **Questões com imagem** (placas, cenas): imagem grande e nítida, com toque para ampliar, e texto alternativo descritivo.
- **Histórico local sem limite** com gráfico das últimas notas e o indicador "Pronto para a prova?".
- **Medidor de cobertura do banco**, além de um filtro "só regra nova".

### 4.3 Flashcards

- **Baralhos:**
  - Placas por categoria: regulamentação, advertência, indicação, educativas, serviços auxiliares, atrativos turísticos e obras. Os concorrentes apanham por **faltar educativas e turísticas** ([Massainfo Placas](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.sinalizacao), [Massainfo MG](https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.simulado.mg.mg)).
  - Infrações (natureza e pontos), termos do CTB, primeiros socorros e "minhas erradas", que vem dos simulados.
- **Duas direções:** imagem → nome e significado, e nome → escolher a placa entre 4.
- **Repetição espaçada simples (Leitner, 5 caixas)** com 3 botões claros: **Errei / Quase / Acertei**. É menos que os 4 do Anki e mais fácil para iniciantes. Cada caixa tem um intervalo, por exemplo 0, 1, 3, 7 e 14 dias. Mostrar "X cartões para hoje" e limitar a fila diária, para não criar o "low interval hell" ([Anki FAQ](https://faqs.ankiweb.net/what-spaced-repetition-algorithm)).
- **Verso do cartão:**
  - nome e código (ex.: R-1);
  - significado em linguagem simples;
  - **dica de forma e cor** (por exemplo, "círculo com borda vermelha = regulamentação; losango amarelo = advertência");
  - um exemplo de como cai na prova.
- **Gestos e botões:** deslizar para virar ou classificar, sempre com botões equivalentes para acessibilidade.
- **Escolher o que estudar:** filtrar por categoria e **esconder as placas que já domino**, como pedem os usuários do [Jogo das Placas](https://play.google.com/store/apps/details?id=br.com.jogo.placas.transito.detran).
- **Álbum de figurinhas** ligado ao domínio dos cartões (ver P1-15) e **ouvir o nome** (TTS) opcional.

### 4.4 Novos formatos de quiz para depois

| Formato | Como funciona | Inspiração |
|---|---|---|
| **Ligue os pares** | 6 pares placa ↔ significado, cronometrado, +1 s por erro | [Quizlet Match](https://help.quizlet.com/hc/en-us/articles/360031183611) |
| **Verdadeiro ou falso relâmpago** | 20 afirmações em 60 s, com explicação no fim | [Quiz Prova de Trânsito](https://play.google.com/store/apps/details?id=br.com.as2.quiztransito) (V/F sobre circulação, sinalização, socorros) |
| **Quem passa primeiro?** | Cena de cruzamento ilustrada: tocar nos veículos na ordem de preferência | [Křižovatky](https://play.google.com/store/apps/details?id=eu.greenfiregames.krizovatky) |
| **Classifique a infração** | Arrastar cada conduta para leve, média, grave ou gravíssima, depois ver pontos e penalidade | Pedido de "simulado de infrações" no [Quiz CNH – Placas](https://play.google.com/store/apps/details?id=com.id.plates); confusão "grave × gravíssima" na CNH do Brasil |
| **Forma e cor** | Só a silhueta e a cor da placa: adivinhar a categoria | Dica clássica de autoescola |
| **Ordene os passos** | Primeiros socorros e procedimentos (sinalizar, chamar socorro...) em ordem | Matéria da prova |
| **O que está errado nesta cena?** | Tocar nas irregularidades de uma ilustração de rua | Jogos educativos de trânsito ([Trânsito Legal](https://garagem360.com.br/?p=155792), [Trânsito para Crianças](https://play.google.com/store/apps/details?id=com.appsbergman.trafficforkids)) |
| **Cruzadinha do CTB** | Palavras cruzadas com termos e definições | Irmã do caça-palavras |
| **Passa-o-celular** | Duelo presencial entre 2 alunos no mesmo aparelho, em turnos | Duelos do [Dirigir Agora](https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil), sem conta nem servidor |
| **Desafio por link** | Mesmo conjunto de questões via *seed* na URL, com comparação de notas no grupo | Sem servidor |

---

## Fontes

**Oficiais e imprensa sobre o curso gratuito da CNH**
- Exame: estrutura de módulos e aulas: https://exame.com/brasil/cnh-sem-autoescola-saiba-como-acessar-o-curso-teorico-gratuito/
- Webmotors: módulos com simulados do banco nacional, certificado com QR Code: https://www.webmotors.com.br/wm1/noticias/cnh-do-brasil-nova-habilitacao-digital
- Min. Transportes: economia com cursos gratuitos: https://www.gov.br/transportes/pt-br/assuntos/noticias/2026/05/cursos-teoricos-gratuitos-para-cnh-garantem-economia-de-r-1-8-bilhao-aos-brasileiros
- Min. Transportes: evite canais não autorizados: https://www.gov.br/transportes/pt-br/assuntos/noticias/2026/03/cnh-do-brasil-saiba-como-solicitar-a-primeira-habilitacao-pelo-aplicativo-oficial-e-evite-canais-nao-autorizados
- CNH do Brasil: https://play.google.com/store/apps/details?id=br.gov.serpro.cnhe · https://apps.apple.com/br/app/cnh-do-brasil/id1275057217
- Simulado Detran-SP: https://play.google.com/store/apps/details?id=br.gov.sp.detran.simulado · https://apps.apple.com/br/app/id684203767 · simulado web (redireciona para login): https://www.detran.sp.gov.br/simulado
- Detran-PR: https://play.google.com/store/apps/details?id=br.gov.pr.celepar.detran.primeirahabilitacao · simulado web: http://www.simulado.detran.pr.gov.br/detran-prova/simularProva.do?action=iniciarProcesso
- Lista de simulados dos Detrans (Portal do Trânsito): https://www.portaldotransito.com.br/simulados/
- Trânsito Legal (Detran-CE): https://garagem360.com.br/?p=155792

**Apps e sites comerciais** (links também na tabela)
- https://play.google.com/store/apps/details?id=com.DSmartApps.SimuladosProvasCNH · https://apps.apple.com/br/app/id1402345294
- https://play.google.com/store/apps/details?id=br.com.costaw.simuladocnh
- https://play.google.com/store/apps/details?id=com.rallsoftwares.simuladodetran · https://play.google.com/store/apps/details?id=com.rallaplicativos.simuladodetran
- https://play.google.com/store/apps/details?id=nz.co.codeone.simuladocnh
- https://play.google.com/store/apps/details?id=sistema.simd.br
- https://play.google.com/store/apps/details?id=com.simuladodetranbrasilfree
- https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.simulado.mg.mg
- https://play.google.com/store/apps/details?id=br.com.simulado.cnh.brasil
- https://play.google.com/store/apps/details?id=br.com.simuladocnh
- https://play.google.com/store/apps/details?id=jocampos.com.br.auto_escola_online
- https://play.google.com/store/apps/details?id=com.robin.detran
- https://play.google.com/store/apps/details?id=com.golden.simuladodetran
- https://play.google.com/store/apps/details?id=com.simuladododetran
- https://play.google.com/store/apps/details?id=com.wombatunity.detranmg · https://simulados.online
- https://apps.apple.com/br/app/id1673142463 · https://apps.apple.com/br/app/simulados-detran-cnh-2025/id1551622221 · https://apps.apple.com/br/app/id6474215352
- https://doutormultas.com.br/codigo-de-transito/simulados-detran/

**Placas e jogos**
- https://play.google.com/store/apps/details?id=com.id.plates
- https://play.google.com/store/apps/details?id=com.massainfo.android.icnh.sinalizacao
- https://play.google.com/store/apps/details?id=br.com.jogo.placas.transito.detran
- https://play.google.com/store/apps/details?id=com.appsbergman.qualeaplaca2
- https://play.google.com/store/apps/details?id=com.shoyo.znakovi
- https://play.google.com/store/apps/details?id=eu.greenfiregames.krizovatky
- https://play.google.com/store/apps/details?id=com.playvalve.wsjourney
- https://play.google.com/store/apps/details?id=com.blackout.word

**Padrões de estudo e PWA**
- Duolingo: https://blog.duolingo.com/how-duolingo-streak-builds-habit · https://blog.duolingo.com/improving-the-streak · https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals
- Anki: https://faqs.ankiweb.net/what-spaced-repetition-algorithm
- Sistema Leitner: https://en.wikipedia.org/wiki/Leitner_system
- Quizlet Match: https://help.quizlet.com/hc/en-us/articles/360031183611
- Armazenamento persistente (web.dev): https://web.dev/articles/persistent-storage
- Limite de 7 dias do Safari / exceção da tela inicial: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ · https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519
