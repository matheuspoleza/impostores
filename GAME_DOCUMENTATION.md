# 🎮 Jogo do Impostor - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Regras do Jogo](#regras-do-jogo)
3. [Fluxo do Jogo](#fluxo-do-jogo)
4. [Sistema de Pontuação](#sistema-de-pontuação)
5. [Tecnologias Utilizadas](#tecnologias-utilizadas)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Telas e Funcionalidades](#telas-e-funcionalidades)
8. [Design e UI/UX](#design-e-uiux)
9. [Componentes Principais](#componentes-principais)
10. [Próximos Passos](#próximos-passos)

---

## 🎯 Visão Geral

O **Jogo do Impostor** é um jogo de dedução social para múltiplos jogadores, onde alguns jogadores são **Inocentes** (conhecem a palavra secreta) e outros são **Impostores** (não conhecem a palavra). O objetivo é descobrir os impostores através de votação e estratégia.

### Características Principais

- ✅ Jogo mobile-first com design inspirado em board games
- ✅ Interface visual com cards e animações suaves
- ✅ Sistema de pontuação individual por rodada
- ✅ Múltiplos temas com palavras variadas
- ✅ Votação múltipla (cada jogador vota em N pessoas)
- ✅ Persistência de estado com localStorage
- ✅ Suporte a dark mode

---

## 📖 Regras do Jogo

### Objetivo

- **Inocentes**: Descobrir **TODOS** os impostores através de votação
- **Impostores**: Não ser descoberto, fingindo conhecer a palavra secreta

### Configuração Inicial

1. **Mínimo de jogadores**: 2 jogadores
2. **Seleção de impostores**: Sistema sorteia automaticamente ~30% dos jogadores como impostores (mínimo 1)
3. **Tema**: Escolha um tema da lista disponível (ex: Música, Comida, Animais, etc.)
4. **Palavra secreta**: Sistema seleciona uma palavra aleatória do tema escolhido

### Distribuição de Informação

- **Inocentes**: Recebem a **palavra completa** (ex: "TAMBOR")
- **Impostores**: Recebem apenas o **tema** (ex: "Música")

### Fases do Jogo

#### 1. **Revelação** (PlayingScreen)
- Cada jogador vê sua palavra/tema individualmente
- Passar o celular entre os jogadores
- **Inocentes** veem a palavra secreta
- **Impostores** veem apenas o tema

#### 2. **Discussão** (Fora do app)
- Todos os jogadores dão dicas sobre sua "palavra"
- Impostores devem observar e tentar descobrir a palavra através das dicas
- Inocentes devem dar dicas claras mas não muito óbvias

#### 3. **Votação** (VotingScreen)
- Cada jogador vota em **N pessoas**, onde N = número de impostores
- Votação múltipla permite mais estratégia
- Todos devem votar antes de continuar

#### 4. **Verificação** (WordCheckScreen)
- Revela a palavra secreta
- Verifica se algum impostor **falou a palavra** durante o jogo
- Marca cada impostor como "falou" ou "não falou"

#### 5. **Resultados** (ResultsScreen)
- Revela quem eram os impostores
- Mostra votos recebidos por cada jogador
- Calcula e exibe pontuação da rodada

#### 6. **Ranking** (RankingScreen)
- Exibe ranking final após todas as rodadas
- Mostra pontuação total acumulada
- Celebra o vencedor

---

## 🎲 Fluxo do Jogo

```
┌─────────────┐
│   Setup     │ → Adicionar jogadores + Escolher tema
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Playing    │ → Revelar palavra/tema para cada jogador
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Voting     │ → Cada jogador vota em N pessoas
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ WordCheck   │ → Verificar se impostores falaram a palavra
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Results    │ → Revelar impostores + Pontuação da rodada
└──────┬──────┘
       │
       ├─→ Próxima Rodada (volta para Setup)
       │
       └─→ Finalizar Jogo
              │
              ▼
       ┌─────────────┐
       │  Ranking   │ → Ranking final + Vencedor
       └─────────────┘
```

---

## 💰 Sistema de Pontuação

### Pontuação - Inocentes

| Resultado | Pontos | Condição |
|-----------|--------|----------|
| ⭐ **Perfeito** | **+5** | Acertou **TODOS** os impostores |
| ✅ **Bom** | **+2** | Acertou **ALGUNS** impostores |
| ❌ **Neutro** | **0** | Errou todos os impostores |
| 💀 **Péssimo** | **-1** | **TODOS** os outros inocentes votaram nele |

### Pontuação - Impostores

| Resultado | Pontos | Condição |
|-----------|--------|----------|
| ⭐ **Perfeito** | **+5** | Escapou (não foi descoberto) |
| ✅ **Bom** | **+2** | Foi descoberto mas não foi o mais votado |
| ❌ **Neutro** | **0** | Foi o mais votado (pior impostor) |
| 💀 **Péssimo** | **-1** | Falou a palavra secreta durante o jogo |

### Cálculo de Pontuação

- Pontuação é calculada **por rodada**
- Pontuação total = soma de todas as rodadas
- Ranking final ordena por pontuação total (maior para menor)

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 14+** (App Router) - Framework React
- **React 18+** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações e transições
- **Zustand** - Gerenciamento de estado global
- **@use-gesture/react** - Detecção de gestos (swipe)
- **@react-spring/web** - Animações físicas
- **Lucide React** - Ícones

### Runtime & Build
- **Bun** - Runtime JavaScript e gerenciador de pacotes
- **PostCSS** - Processamento de CSS
- **ESLint** - Linting de código

### Persistência
- **localStorage** - Persistência de estado do jogo

---

## 📁 Estrutura do Projeto

```
impostor/
├── app/
│   ├── (game)/
│   │   ├── layout.tsx          # Layout do jogo
│   │   ├── setup/page.tsx      # Tela de configuração
│   │   ├── playing/page.tsx    # Tela de revelação
│   │   ├── voting/page.tsx     # Tela de votação
│   │   ├── wordcheck/page.tsx  # Tela de verificação
│   │   ├── results/page.tsx     # Tela de resultados
│   │   └── ranking/page.tsx    # Tela de ranking
│   ├── globals.css             # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Página inicial (redirect)
│
├── components/
│   ├── cards/
│   │   ├── GameCard.tsx        # Card base do jogo
│   │   ├── SwipeableCard.tsx   # Card com gestos swipe
│   │   └── CardStack.tsx        # Stack de cards
│   ├── game/
│   │   ├── SetupScreen.tsx     # Tela de setup
│   │   ├── PlayingScreen.tsx    # Tela de revelação
│   │   ├── VotingScreen.tsx     # Tela de votação
│   │   ├── WordCheckScreen.tsx  # Tela de verificação
│   │   ├── ResultsScreen.tsx     # Tela de resultados
│   │   ├── RankingScreen.tsx    # Tela de ranking
│   │   └── RulesModal.tsx       # Modal de regras
│   └── ui/
│       └── Button.tsx           # Componente de botão
│
├── hooks/
│   └── useGameState.ts          # Hook Zustand (estado global)
│
├── lib/
│   ├── data/
│   │   ├── themes.json         # Temas e palavras
│   │   └── themes.ts            # Helper para temas
│   ├── game/
│   │   ├── gameState.ts        # Estado inicial
│   │   ├── gameLogic.ts        # Lógica do jogo
│   │   └── gameStorage.ts      # Persistência (localStorage)
│   └── styles/
│       └── cardStyles.ts        # Estilos de cards
│
├── types/
│   └── game.ts                  # Tipos TypeScript
│
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências
└── README.md                    # README do projeto
```

---

## 🎨 Telas e Funcionalidades

### 1. SetupScreen (Configuração)

**Rota**: `/setup`

**Funcionalidades**:
- ✅ Adicionar/remover jogadores
- ✅ Editar nomes dos jogadores
- ✅ Selecionar tema da rodada
- ✅ Validação (mínimo 2 jogadores)
- ✅ Empty state quando não há jogadores
- ✅ Modal para adicionar jogador

**Componentes**:
- Lista de jogadores com cards
- Lista de temas selecionáveis
- Botão "Iniciar Jogo"

---

### 2. PlayingScreen (Revelação)

**Rota**: `/playing`

**Funcionalidades**:
- ✅ Card swipeable com gestos (swipe up para revelar, swipe right para próximo)
- ✅ Tap para revelar (alternativa ao swipe)
- ✅ Animação de flip 3D ao revelar
- ✅ Diferenciação visual entre Impostor e Inocente
- ✅ Indicador de progresso (dots)
- ✅ Contador de jogadores que revelaram
- ✅ Navegação automática após todos revelarem

**Estados do Card**:
- **Frente**: Nome do jogador + instrução para revelar
- **Verso Impostor**: Ícone 🕵️ + Tema + Instruções
- **Verso Inocente**: Ícone ✅ + Palavra secreta + Instruções

---

### 3. VotingScreen (Votação)

**Rota**: `/voting`

**Funcionalidades**:
- ✅ Votação múltipla (cada jogador vota em N pessoas)
- ✅ Grid de jogadores para votação
- ✅ Contador de votos por jogador (X/N)
- ✅ Validação (todos devem votar)
- ✅ Resumo de votos recebidos
- ✅ Destaque visual para votos selecionados
- ✅ Prevenção de auto-voto

**Lógica**:
- N = número de impostores (calculado automaticamente)
- Cada jogador vota em exatamente N pessoas
- Votação sequencial (um jogador por vez)

---

### 4. WordCheckScreen (Verificação)

**Rota**: `/wordcheck`

**Funcionalidades**:
- ✅ Revelação da palavra secreta
- ✅ Lista de impostores para verificação
- ✅ Toggle Sim/Não para cada impostor
- ✅ Validação (todos os impostores devem ser verificados)
- ✅ Destaque visual para impostores que falaram a palavra

**Ação**:
- Marcar quais impostores falaram a palavra secreta durante o jogo
- Isso afeta a pontuação dos impostores (-1 ponto se falaram)

---

### 5. ResultsScreen (Resultados)

**Rota**: `/results`

**Funcionalidades**:
- ✅ Revelação dos impostores
- ✅ Exibição da palavra secreta
- ✅ Tabela de votos recebidos (ordenada)
- ✅ Tabela de pontuação da rodada
- ✅ Cores diferenciadas (positivo/negativo/neutro)
- ✅ Botões de ação (Próxima Rodada / Finalizar Jogo)

**Informações Exibidas**:
- Quem eram os impostores
- Palavra secreta
- Votos recebidos por cada jogador
- Pontuação da rodada para cada jogador

---

### 6. RankingScreen (Ranking Final)

**Rota**: `/ranking`

**Funcionalidades**:
- ✅ Lista ordenada por pontuação total
- ✅ Destaque visual para top 3 (ouro, prata, bronze)
- ✅ Card de celebração para o vencedor
- ✅ Exibição de total de rodadas
- ✅ Botão "Novo Jogo"

**Visual**:
- Medalhas 🥇🥈🥉 para top 3
- Cores diferenciadas por posição
- Card especial de "Parabéns" para o vencedor

---

### 7. RulesModal (Modal de Regras)

**Funcionalidades**:
- ✅ Acessível de todas as telas
- ✅ Regras completas do jogo
- ✅ Sistema de pontuação explicado
- ✅ Dicas e estratégias
- ✅ Design responsivo

---

## 🎨 Design e UI/UX

### Estilo Visual

**Tema**: Board Game / Card Game
- Design inspirado em jogos de tabuleiro e cartas
- Paleta de cores terrosa (bege, marrom, creme)
- Tipografia: Bebas Neue (títulos), Inter (corpo), Playfair Display (cards)

### Paleta de Cores

```css
/* Cores Principais */
- Inocente: Verde (#10b981, #34d399, #059669)
- Impostor: Vermelho (#ef4444, #f87171, #dc2626)
- Tema: Azul (#2196F3, #4CAF50, #F44336)
- Board: Bege/Marrom (#fdfcfb, #ede6db, #bfae95)

/* Cores de Ranking */
- Ouro: #fbbf24
- Prata: #94a3b8
- Bronze: #f97316
```

### Componentes Visuais

**Cards**:
- Bordas arredondadas (rounded-xl, rounded-2xl)
- Sombras profundas (shadow-card-md, shadow-card-lg, shadow-card-deep)
- Efeitos de hover e tap
- Animações de flip 3D

**Gestos**:
- Swipe up: Revelar palavra
- Swipe right: Próximo jogador
- Tap: Alternativa ao swipe
- Feedback visual durante gestos

**Animações**:
- Framer Motion para transições suaves
- Animações de entrada/saída
- Micro-interações
- Indicadores de progresso animados

### Responsividade

- **Mobile-first**: Design otimizado para celulares
- **Touch-friendly**: Botões e áreas de toque grandes
- **Dark mode**: Suporte completo a tema escuro
- **Orientação**: Funciona em portrait e landscape

---

## 🧩 Componentes Principais

### GameCard

Componente base para todos os cards do jogo.

**Variantes**:
- `default`: Card padrão (fundo branco/bege)
- `innocent`: Card de inocente (fundo verde claro)
- `impostor`: Card de impostor (fundo vermelho claro)
- `player`: Card de jogador (fundo bege)
- `theme`: Card de tema (fundo azul claro)

**Tamanhos**:
- `sm`: Pequeno (120px altura mínima)
- `md`: Médio (200px altura mínima)
- `lg`: Grande (300px altura mínima)
- `xl`: Extra grande (400px altura mínima)

### SwipeableCard

Card com suporte a gestos swipe e tap.

**Gestos**:
- `onSwipeUp`: Swipe para cima
- `onSwipeRight`: Swipe para direita
- `onSwipeLeft`: Swipe para esquerda
- `onSwipeDown`: Swipe para baixo
- `onClick`: Tap simples

**Features**:
- Detecção de movimento vs tap
- Feedback visual durante drag
- Animação de snap-back
- Threshold configurável

### useGameState (Zustand)

Hook global para gerenciamento de estado.

**Estado**:
- Lista de jogadores
- Rodada atual
- Dados da rodada (impostores, palavra, votos, pontuação)
- Histórico de rodadas
- Jogadores que revelaram

**Ações**:
- `addPlayer`, `removePlayer`, `updatePlayerName`
- `startRound`, `nextRound`, `finishRound`, `finishGame`
- `revealPlayerWord`, `nextPlayer`
- `vote`, `removeVote`
- `setWordCheck`
- `newGame`, `loadSavedState`

---

## 📊 Lógica do Jogo

### Cálculo de Impostores

```typescript
calculateImpostorCount(totalPlayers: number): number
```

- Calcula ~30% dos jogadores como impostores
- Mínimo de 1 impostor
- Arredondamento para cima

### Seleção de Impostores

```typescript
selectImpostors(players: Player[], count: number): string[]
```

- Seleção aleatória de IDs de jogadores
- Garante que não há duplicatas

### Seleção de Palavra

```typescript
selectRandomWord(theme: Theme): string
```

- Seleciona palavra aleatória do tema escolhido
- Garante que a palavra existe no tema

### Cálculo de Pontuação

```typescript
calculateRoundScores(round: Round, players: Player[]): Record<string, number>
```

**Para Inocentes**:
- +5: Acertou todos os impostores
- +2: Acertou alguns impostores
- 0: Errou todos
- -1: Todos os outros inocentes votaram nele

**Para Impostores**:
- +5: Não foi descoberto
- +2: Foi descoberto mas não foi o mais votado
- 0: Foi o mais votado
- -1: Falou a palavra secreta

---

## 💾 Persistência

### localStorage

O estado do jogo é salvo automaticamente em `localStorage`:

- **Chave**: `impostor-game-state`
- **Formato**: JSON serializado
- **Conteúdo**: Estado completo do jogo (jogadores, rodadas, etc.)

**Features**:
- Auto-save após cada ação importante
- Auto-load ao iniciar o app
- Suporte a `Set` serialization (revealedPlayers)
- Limpeza ao iniciar novo jogo

---

## 🚀 Próximos Passos

### Ilustrações Necessárias

Veja o arquivo `ILLUSTRATIONS.md` para o mapeamento completo de ilustrações.

**Prioridade Alta**:
1. Card Impostor (~400x400px)
2. Card Inocente (~400x400px)
3. Card Frente Jogador (~300x300px)
4. Medalhas de Ranking (1º, 2º, 3º) (~120x120px cada)
5. Card de Parabéns (~300x300px)

**Prioridade Média**:
6. Empty State Setup (~200x200px)
7. Card de Revelação (~400x300px)
8. Ícones de Temas (~64x64px cada)
9. Fluxo do Jogo (~600x400px)
10. Ícones de Pontuação (~32x32px cada)

### Melhorias Futuras

- [ ] Sistema de temas customizados
- [ ] Modo online/multiplayer
- [ ] Estatísticas e histórico
- [ ] Mais animações e micro-interações
- [ ] Sons e efeitos sonoros
- [ ] Tutorial interativo
- [ ] Modo de prática
- [ ] Exportar resultados

---

## 📝 Notas de Desenvolvimento

### Decisões de Design

1. **Mobile-first**: Priorizamos experiência mobile, já que o jogo é passado de mão em mão
2. **Cards grandes**: Facilita leitura e interação em telas pequenas
3. **Cores contrastantes**: Verde/vermelho para diferenciação clara
4. **Gestos intuitivos**: Swipe up = revelar, swipe right = próximo
5. **Feedback visual**: Animações e cores indicam ações e estados

### Desafios Resolvidos

1. **Serialização de Set**: Convertido para Array no localStorage
2. **Legibilidade de texto**: Fundos claros com texto escuro
3. **Gestos vs Tap**: Lógica para distinguir swipe de tap
4. **Estado persistente**: Auto-save/load com Zustand + localStorage
5. **Cálculo de pontuação**: Lógica complexa implementada corretamente

---

## 📄 Licença

Este projeto é um jogo desenvolvido para uso pessoal/educacional.

---

## 👥 Créditos

Desenvolvido com:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand

Inspirado em jogos de dedução social como:
- Among Us
- Mafia/Werewolf
- Spyfall

---

**Versão**: 1.0.0  
**Última atualização**: 2024

