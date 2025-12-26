# Fix para erro PlatformConstants no Expo Go

O erro `'PlatformConstants' could not be found` geralmente indica que:

1. **Expo Go está desatualizado** - O Expo Go no seu dispositivo/simulador precisa ser da mesma versão do SDK
2. **Problema com módulos nativos** - Algumas dependências podem não funcionar no Expo Go

## Soluções

### Opção 1: Atualizar Expo Go no simulador

No simulador iOS:
1. Delete o app Expo Go
2. Rode: `bunx expo start --ios`
3. Isso deve reinstalar o Expo Go correto para SDK 54

### Opção 2: Usar Development Build (Recomendado para produção)

O Expo Go tem limitações. Para produção, você precisará de um development build:

```bash
# Instalar EAS CLI
bunx eas-cli install -g

# Criar development build
bunx expo prebuild
bunx expo run:ios
```

### Opção 3: Verificar se todas as dependências são compatíveis com Expo Go

Algumas dependências NÃO funcionam no Expo Go:
- `react-native-reanimated` - ✅ Funciona (mas precisa do plugin no babel)
- `react-native-gesture-handler` - ✅ Funciona
- `@react-native-async-storage/async-storage` - ✅ Funciona

Todas as nossas dependências devem funcionar no Expo Go.

### Opção 4: Reset completo

```bash
# 1. Limpar tudo
rm -rf node_modules .expo bun.lockb

# 2. Reinstalar
bun install

# 3. Limpar cache do Metro
bunx expo start -c

# 4. No simulador, delete o Expo Go e deixe reinstalar
```

### Verificar versão do Expo Go

No terminal do Expo, você pode ver qual SDK está rodando. Certifique-se de que é SDK 54.

