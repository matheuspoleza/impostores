import { GameState } from "@/types/game";

const STORAGE_KEY = "impostor-game-state";

/**
 * Salva o estado do jogo no localStorage
 */
export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;

  // Converte Set para Array para serialização
  const serializableState = {
    ...state,
    revealedPlayers: Array.from(state.revealedPlayers),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState));
  } catch (error) {
    console.error("Erro ao salvar estado do jogo:", error);
  }
}

/**
 * Carrega o estado do jogo do localStorage
 */
export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Converte Array de volta para Set
    return {
      ...parsed,
      revealedPlayers: new Set(parsed.revealedPlayers || []),
    };
  } catch (error) {
    console.error("Erro ao carregar estado do jogo:", error);
    return null;
  }
}

/**
 * Limpa o estado do jogo do localStorage
 */
export function clearGameState(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar estado do jogo:", error);
  }
}
