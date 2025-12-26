import { GameState } from "../../types/game";
import { storage } from "../../platform/storage";

const STORAGE_KEY = "impostor-game-state";

/**
 * Salva o estado do jogo no storage (platform adapter)
 */
export async function saveGameState(state: GameState): Promise<void> {
  // Converte Set para Array para serialização
  const serializableState = {
    ...state,
    revealedPlayers: Array.from(state.revealedPlayers),
  };

  try {
    await storage.setItem(STORAGE_KEY, JSON.stringify(serializableState));
  } catch (error) {
    console.error("Erro ao salvar estado do jogo:", error);
  }
}

/**
 * Carrega o estado do jogo do storage (platform adapter)
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    const stored = await storage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Converte Array de volta para Set e garante que todas as propriedades existam
    return {
      players: parsed.players || [],
      currentRound: parsed.currentRound || 0,
      rounds: parsed.rounds || [],
      currentRoundData: parsed.currentRoundData || null,
      currentPlayerIndex: parsed.currentPlayerIndex || 0,
      gamePhase: parsed.gamePhase || "setup",
      selectedTheme: parsed.selectedTheme ?? null, // Usa ?? para garantir null se undefined
      revealedPlayers: new Set(parsed.revealedPlayers || []),
    };
  } catch (error) {
    console.error("Erro ao carregar estado do jogo:", error);
    return null;
  }
}

/**
 * Limpa o estado do jogo do storage (platform adapter)
 */
export async function clearGameState(): Promise<void> {
  try {
    await storage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar estado do jogo:", error);
  }
}

