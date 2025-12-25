"use client";

import { create } from "zustand";
import { GameState, Player, Round } from "@/types/game";
import {
  calculateImpostorCount,
  selectImpostors,
  selectRandomWord,
  calculateRoundScores,
} from "@/lib/game/gameLogic";
import { saveGameState, loadGameState, clearGameState } from "@/lib/game/gameStorage";
import { Theme } from "@/types/game";

interface GameStore extends GameState {
  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  setSelectedTheme: (theme: string | null) => void;
  startRound: (theme: Theme) => void;
  revealPlayerWord: (playerId: string) => void;
  nextPlayer: () => void;
  vote: (voterId: string, targetId: string) => void;
  removeVote: (voterId: string, targetId: string) => void;
  setWordCheck: (impostorId: string, spokeWord: boolean) => void;
  finishRound: () => void;
  nextRound: () => void;
  finishGame: () => void;
  newGame: () => void;
  loadSavedState: () => void;
}

const initialState: GameState = {
  players: [],
  currentRound: 0,
  rounds: [],
  currentRoundData: null,
  currentPlayerIndex: 0,
  gamePhase: "setup",
  selectedTheme: null,
  revealedPlayers: new Set(),
};

export const useGameState = create<GameStore>((set, get) => ({
  ...initialState,

  addPlayer: (name: string) => {
    set((state) => {
      const newPlayer: Player = {
        id: `player-${Date.now()}-${Math.random()}`,
        name: name.trim() || `Jogador ${state.players.length + 1}`,
        totalScore: 0,
      };
      const newState = {
        ...state,
        players: [...state.players, newPlayer],
      };
      saveGameState(newState);
      return newState;
    });
  },

  removePlayer: (id: string) => {
    set((state) => {
      const newState = {
        ...state,
        players: state.players.filter((p) => p.id !== id),
      };
      saveGameState(newState);
      return newState;
    });
  },

  updatePlayerName: (id: string, name: string) => {
    set((state) => {
      const newState = {
        ...state,
        players: state.players.map((p) =>
          p.id === id ? { ...p, name: name.trim() || p.name } : p
        ),
      };
      saveGameState(newState);
      return newState;
    });
  },

  setSelectedTheme: (theme: string | null) => {
    set((state) => {
      const newState = { ...state, selectedTheme: theme };
      saveGameState(newState);
      return newState;
    });
  },

  startRound: (theme: Theme) => {
    const state = get();
    if (state.players.length < 2) return;

    const impostorCount = calculateImpostorCount(state.players.length);
    const impostors = selectImpostors(state.players, impostorCount);
    const secretWord = selectRandomWord(theme);
    const newRoundNumber = state.currentRound + 1;

    const newRound: Round = {
      roundNumber: newRoundNumber,
      theme: theme.name,
      secretWord,
      impostors,
      votes: {},
      wordCheck: {},
      scores: {},
    };

    set((prevState) => {
      const newState = {
        ...prevState,
        currentRound: newRoundNumber,
        currentRoundData: newRound,
        currentPlayerIndex: 0,
        gamePhase: "playing",
        selectedTheme: theme.name,
        revealedPlayers: new Set(),
      };
      saveGameState(newState);
      return newState;
    });
  },

  revealPlayerWord: (playerId: string) => {
    set((state) => {
      const newRevealed = new Set(state.revealedPlayers);
      newRevealed.add(playerId);
      const newState = {
        ...state,
        revealedPlayers: newRevealed,
      };
      saveGameState(newState);
      return newState;
    });
  },

  nextPlayer: () => {
    set((state) => {
      const newIndex = state.currentPlayerIndex + 1;
      const allRevealed = state.players.every((p) =>
        state.revealedPlayers.has(p.id)
      );

      let newPhase = state.gamePhase;
      if (allRevealed && newIndex >= state.players.length) {
        newPhase = "voting";
      }

      const newState = {
        ...state,
        currentPlayerIndex: newIndex >= state.players.length ? state.currentPlayerIndex : newIndex,
        gamePhase: newPhase,
      };
      saveGameState(newState);
      return newState;
    });
  },

  vote: (voterId: string, targetId: string) => {
    set((state) => {
      if (!state.currentRoundData) return state;

      const currentVotes = state.currentRoundData.votes[voterId] || [];
      const maxVotes = calculateImpostorCount(state.players.length);

      // Validação básica
      if (voterId === targetId) return state;
      if (currentVotes.includes(targetId)) return state;
      if (currentVotes.length >= maxVotes) return state;

      const newVotes = [...currentVotes, targetId];
      const newRoundData = {
        ...state.currentRoundData,
        votes: {
          ...state.currentRoundData.votes,
          [voterId]: newVotes,
        },
      };

      const newState = {
        ...state,
        currentRoundData: newRoundData,
      };
      saveGameState(newState);
      return newState;
    });
  },

  removeVote: (voterId: string, targetId: string) => {
    set((state) => {
      if (!state.currentRoundData) return state;

      const currentVotes = state.currentRoundData.votes[voterId] || [];
      const newVotes = currentVotes.filter((id) => id !== targetId);

      const newRoundData = {
        ...state.currentRoundData,
        votes: {
          ...state.currentRoundData.votes,
          [voterId]: newVotes,
        },
      };

      const newState = {
        ...state,
        currentRoundData: newRoundData,
      };
      saveGameState(newState);
      return newState;
    });
  },

  setWordCheck: (impostorId: string, spokeWord: boolean) => {
    set((state) => {
      if (!state.currentRoundData) return state;

      const newRoundData = {
        ...state.currentRoundData,
        wordCheck: {
          ...state.currentRoundData.wordCheck,
          [impostorId]: spokeWord,
        },
      };

      const newState = {
        ...state,
        currentRoundData: newRoundData,
      };
      saveGameState(newState);
      return newState;
    });
  },

  finishRound: () => {
    const state = get();
    if (!state.currentRoundData) return;

    const scores = calculateRoundScores(state.currentRoundData, state.players);
    
    // Atualizar pontuações totais
    const updatedPlayers = state.players.map((player) => ({
      ...player,
      totalScore: player.totalScore + (scores[player.id] || 0),
    }));

    const completedRound: Round = {
      ...state.currentRoundData,
      scores,
    };

    set((prevState) => {
      const newState = {
        ...prevState,
        players: updatedPlayers,
        rounds: [...prevState.rounds, completedRound],
        currentRoundData: completedRound,
        gamePhase: "results",
      };
      saveGameState(newState);
      return newState;
    });
  },

  nextRound: () => {
    set((state) => {
      const newState = {
        ...state,
        currentRoundData: null,
        currentPlayerIndex: 0,
        gamePhase: "setup",
        selectedTheme: null,
        revealedPlayers: new Set(),
      };
      saveGameState(newState);
      return newState;
    });
  },

  finishGame: () => {
    set((state) => {
      const newState = {
        ...state,
        gamePhase: "ranking",
      };
      saveGameState(newState);
      return newState;
    });
  },

  newGame: () => {
    clearGameState();
    set(initialState);
  },

  loadSavedState: () => {
    const saved = loadGameState();
    if (saved) {
      set(saved);
    }
  },
}));
