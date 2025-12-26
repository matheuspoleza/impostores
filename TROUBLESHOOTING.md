# Troubleshooting

## Erro: 'PlatformConstants' could not be found

Este erro geralmente indica problemas com módulos nativos ou cache corrompido.

### Solução 1: Limpar cache e reinstalar

```bash
# Limpar tudo
rm -rf node_modules .expo bun.lockb

# Reinstalar dependências
bun install

# Limpar cache do Expo/Metro
bunx expo start -c
```

### Solução 2: Rebuild nativo (se usar development build)

```bash
# Se você estiver usando development build ao invés de Expo Go
bunx expo prebuild --clean
```

### Solução 3: Usar Expo Go (mais simples)

Se você não precisa de módulos nativos customizados, use Expo Go:

```bash
# No simulador iOS
bun start --ios

# Isso deve abrir no Expo Go automaticamente
```

### Solução 4: Verificar versões compatíveis

Certifique-se de que todas as dependências são compatíveis com Expo SDK 54:

```bash
bunx expo install --check
```

Isso verifica e corrige automaticamente versões incompatíveis.

