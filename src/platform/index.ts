import { Platform } from 'react-native';

// Platform detection helpers (preparado para futuro)
// Nota: Essas são funções para evitar problemas de inicialização se necessário no futuro
export function isIOS() {
  return Platform.OS === 'ios';
}

export function isAndroid() {
  return Platform.OS === 'android';
}

export function isWeb() {
  return Platform.OS === 'web';
}

