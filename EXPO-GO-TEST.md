# Testando no Expo Go

Estamos tentando rodar no Expo Go enquanto CocoaPods instala.

**Importante:** O Reanimated 4.x pode não funcionar completamente no Expo Go porque o Expo Go é pré-compilado. Se der erro de Worklets, será necessário usar development build.

## Se funcionar no Expo Go:
- Perfeito! Continue desenvolvendo assim
- Mas para produção, ainda recomendo development build

## Se não funcionar (erro Worklets):
- Precisamos fazer development build (que está sendo preparado com CocoaPods)
- Depois de instalar CocoaPods, rode:
  ```bash
  cd ios && pod install
  bunx expo run:ios
  ```

## Comandos úteis:
- Pressione `i` no terminal do Expo para abrir no simulador iOS
- Pressione `r` para reload
- Pressione `m` para abrir menu de desenvolvedor

