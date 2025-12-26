# Jogo do Impostor - React Native

Versão React Native (Expo) do Jogo do Impostor, preparada para iOS, Android e Web.

## Setup

1. **Instalar dependências:**
```bash
bun install
```

2. **Copiar assets (se necessário):**
```bash
# Os assets já devem estar em assets/images/
# Se não estiverem, copie de onde você os tiver
```

3. **Iniciar o projeto:**
```bash
# iOS
bun start --ios

# Android
bun start --android

# Web (futuro)
bun start --web
```

## Sobre Expo CLI

**Você NÃO precisa instalar Expo globalmente!**

Use `bunx expo` (ou `npx expo`) que funciona sem instalação global. Os scripts já estão configurados para usar `bunx expo`.

## Estrutura do Projeto

```
src/
├── screens/          # Telas do app
├── components/       # Componentes reutilizáveis
├── navigation/       # Configuração de navegação
├── platform/         # Platform adapters (iOS/Android/Web)
├── hooks/            # Hooks personalizados
├── lib/              # Lógica de negócio
├── types/            # TypeScript types
└── styles/           # Sistema de estilos
```

## Plataformas

- **iOS**: ✅ Implementado
- **Android**: 🔄 Estrutura preparada
- **Web**: 🔄 Estrutura preparada

## Scripts

- `bun start` - Inicia o Expo dev server
- `bun start --ios` - Inicia no iOS
- `bun start --android` - Inicia no Android
- `bun start --web` - Inicia no Web

## Documentação Adicional

- `SETUP.md` - Guia de setup detalhado
- `MIGRATION-STATUS.md` - Status da migração
- `GAME_DOCUMENTATION.md` - Documentação do jogo
