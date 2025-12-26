// Lista de avatares disponíveis (React Native require)
// Para adicionar novos avatares, importe aqui e adicione ao array

const avatar1 = require('../../../assets/images/avatars/avatar-1.png');
const avatar2 = require('../../../assets/images/avatars/avatar-2.png');
const avatar3 = require('../../../assets/images/avatars/avatar-3.png');
const avatar4 = require('../../../assets/images/avatars/avatar-4.png');

export const availableAvatars = [avatar1, avatar2, avatar3, avatar4];

/**
 * Retorna um avatar padrão caso nenhum seja especificado
 */
export function getDefaultAvatar() {
  return avatar1;
}

/**
 * Retorna todos os avatares disponíveis
 */
export function getAvailableAvatars() {
  return availableAvatars;
}

/**
 * Retorna um avatar por índice
 */
export function getAvatarByIndex(index: number) {
  return availableAvatars[index] || avatar1;
}

