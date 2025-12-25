# 🎮 Jogo do Impostor

Um jogo mobile de dedução e estratégia onde inocentes tentam descobrir impostores através de votação!

## 🚀 Como Executar

```bash
# Instalar dependências
bun install

# Executar em modo desenvolvimento
bun dev

# Build para produção
bun run build

# Executar produção
bun start
```

## 📋 Regras do Jogo

### Objetivo
- **Inocentes:** Descobrir TODOS os impostores através de votação
- **Impostores:** Não ser descoberto, fingindo conhecer a palavra secreta

### Como Jogar
1. Adicionar jogadores (mínimo 2)
2. Escolher tema da rodada
3. Sistema sorteia 30% dos jogadores como impostores (mínimo 1)
4. **Inocentes** recebem a palavra completa
5. **Impostores** recebem apenas o tema
6. Cada jogador vê sua palavra/tema individualmente (passar celular)
7. Todos dão dicas sobre sua "palavra"
8. Votação: cada jogador vota em N pessoas (N = número de impostores)
9. Verificação se algum impostor falou a palavra
10. Revelação e pontuação

### Sistema de Pontuação

#### Inocentes
- ⭐ **Perfeito (+5):** Acertou TODOS os impostores
- ✅ **Bom (+2):** Acertou ALGUNS impostores
- ❌ **Neutro (0):** Errou todos
- 💀 **Péssimo (-1):** TODOS os outros inocentes votaram nele

#### Impostores
- ⭐ **Perfeito (+5):** Escapou (não foi descoberto)
- ✅ **Bom (+2):** Foi descoberto mas não foi o mais votado
- ❌ **Neutro (0):** Foi o mais votado
- 💀 **Péssimo (-1):** Falou a palavra secreta durante o jogo

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **Bun** - Runtime e package manager
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado

## 📱 Features

- ✅ Sistema de múltiplas rodadas
- ✅ Pontuação individual
- ✅ Votação múltipla (mais estratégica)
- ✅ Persistência no localStorage
- ✅ 10 temas pré-definidos com 20 palavras cada
- ✅ Design mobile-first
- ✅ Animações suaves
- ✅ Dark mode

## 📂 Estrutura do Projeto

```
app/                    # Next.js App Router
  (game)/              # Rotas do jogo
components/
  game/                # Componentes do jogo
  ui/                  # Componentes reutilizáveis
lib/
  game/                # Lógica do jogo
  data/                # Dados estáticos (temas)
hooks/                 # Hooks customizados
types/                 # Tipos TypeScript
```

## 🎨 Temas Disponíveis

- Animais
- Comida
- Objetos
- Profissões
- Esportes
- Países
- Cores
- Natureza
- Transporte
- Música

Cada tema contém 20 palavras pré-definidas.

