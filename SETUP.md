# Setup - Jogo do Impostor React Native

## Pré-requisitos

- [Bun](https://bun.sh/) instalado
- Node.js (para Expo, mesmo usando Bun)
- Xcode (para iOS) ou Android Studio (para Android)

## Instalação

1. **Instalar dependências:**
```bash
bun install
```

2. **Copiar assets (se ainda não foi feito):**
```bash
# Copiar avatares
cp -r public/avatars/*.png assets/images/avatars/

# Copiar ilustrações
cp -r public/illustrations/*.png assets/images/illustrations/

# Copiar logo
cp public/logo.png assets/images/
```

## Executar o Projeto

### iOS (Recomendado para começar)
```bash
bun start --ios
# ou
bunx expo start --ios
```

### Android
```bash
bun start --android
# ou
bunx expo start --android
```

### Web (futuro)
```bash
bun start --web
# ou
bunx expo start --web
```

## Sobre Expo CLI

**Você NÃO precisa instalar Expo globalmente!**

O projeto usa `bunx expo` nos scripts, que funciona sem instalação global. O `bunx` (ou `npx` se preferir) baixa e executa o Expo temporariamente quando necessário.

Se você quiser instalar globalmente mesmo assim (não recomendado):
```bash
bun add -g expo-cli
# Mas não é necessário!
```

## Estrutura do Package.json

O projeto atual usa `package-rn.json` para não conflitar com o `package.json` do Next.js. 

**Para usar o projeto React Native:**
- Renomeie `package-rn.json` para `package.json` (faça backup do original primeiro)
- Ou crie um workspace separado para o projeto React Native

## Troubleshooting

### Erro: "expo command not found"
Use `bunx expo` ao invés de `expo`:
```bash
bunx expo start
```

### Erro ao copiar imagens
Certifique-se de que as pastas `assets/images/avatars/` e `assets/images/illustrations/` existem:
```bash
mkdir -p assets/images/avatars assets/images/illustrations
```

