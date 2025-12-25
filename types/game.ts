export interface Player {
  id: string;
  name: string;
  totalScore: number;
}

export interface Theme {
  name: string;
  words: string[];
}

export interface Round {
  roundNumber: number;
  theme: string;
  secretWord: string;
  impostors: string[]; // IDs dos impostores
  votes: Record<string, string[]>; // playerId -> array de votados
  wordCheck: Record<string, boolean>; // impostorId -> falou a palavra (true/false)
  scores: Record<string, number>; // playerId -> pontuação da rodada
}

export interface GameState {
  players: Player[];
  currentRound: number;
  rounds: Round[];
  currentRoundData: Round | null;
  currentPlayerIndex: number; // Para controlar qual jogador está vendo sua palavra
  gamePhase: "setup" | "playing" | "voting" | "wordcheck" | "results" | "ranking";
  selectedTheme: string | null;
  revealedPlayers: Set<string>; // IDs dos jogadores que já viram sua palavra
}
