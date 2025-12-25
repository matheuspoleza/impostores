"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import PeelRevealScreen from "./PeelRevealScreen";
import RulesModal from "./RulesModal";

export default function PlayingScreen() {
  const router = useRouter();
  const {
    players,
    currentRound,
    currentRoundData,
    currentPlayerIndex,
    revealedPlayers,
    revealPlayerWord,
    nextPlayer,
  } = useGameState();
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isImpostor = currentRoundData?.impostors.includes(currentPlayer?.id || "") || false;
  const allRevealed = players.every((p) => revealedPlayers.has(p.id));

  useEffect(() => {
    if (!currentRoundData || !currentPlayer) {
      router.push("/setup");
      return;
    }

    setIsRevealed(revealedPlayers.has(currentPlayer.id));
  }, [currentPlayerIndex, currentRoundData, currentPlayer, revealedPlayers, router]);

  const handleReveal = () => {
    if (currentPlayer && !isRevealed) {
      revealPlayerWord(currentPlayer.id);
      setIsRevealed(true);
    }
  };

  const handleSwipeRight = () => {
    if (isRevealed) {
      if (allRevealed) {
        router.push("/voting");
      } else {
        nextPlayer();
        setIsRevealed(false);
      }
    }
  };

  if (!currentRoundData || !currentPlayer) {
    return null;
  }

  return (
    <div className={`h-screen h-dvh w-full ${isRevealed && allRevealed ? 'overflow-y-auto' : 'overflow-hidden'} flex flex-col relative`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 50px,
            rgba(139, 115, 85, 0.1) 50px,
            rgba(139, 115, 85, 0.1) 100px
          )`
        }} />
      </div>

      {/* Header Minimizado */}
      <div className={`${isRevealed && allRevealed ? 'relative' : 'absolute'} top-4 left-4 right-4 flex justify-between items-center z-10 p-4`}>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl text-board-brown">
            R{currentRound}
          </span>
          <span className="px-3 py-1 bg-board-brown/20 rounded-full text-xs font-bold text-board-brown">
            {currentRoundData.theme}
          </span>
        </div>
        <button
          onClick={() => setIsRulesOpen(true)}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Abrir regras"
        >
          <Info className="w-5 h-5 text-board-brown" />
        </button>
      </div>

      {/* Tela Principal de Revelação */}
      <div className={`${isRevealed && allRevealed ? 'flex-1 py-4' : 'flex-1 flex items-center justify-center'} w-full relative z-0`}>
        <PeelRevealScreen
          isRevealed={isRevealed}
          onReveal={handleReveal}
          currentPlayer={currentPlayer}
          isImpostor={isImpostor}
          currentRoundData={currentRoundData}
          allRevealed={allRevealed}
          onSwipeRight={handleSwipeRight}
        />
      </div>

      {/* Progress Bar */}
      {!allRevealed && (
        <div className="absolute bottom-8 left-4 right-4 z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            {players.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-2 h-2 rounded-full ${
                  index <= currentPlayerIndex
                    ? "bg-board-brown"
                    : "bg-board-brown/30"
                }`}
              />
            ))}
          </div>
          <p className="text-center font-body text-sm text-board-brown/70">
            {revealedPlayers.size} / {players.length} revelaram
          </p>
        </div>
      )}

      {/* Botão de ação (fallback) */}
      {isRevealed && allRevealed && (
        <div className="w-full flex justify-center items-center z-10 py-8 pb-12">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => router.push("/voting")}
            className="px-8 py-4 bg-board-brown text-board-cream rounded-full font-display text-xl shadow-card-lg"
          >
            Iniciar Votação
          </motion.button>
        </div>
      )}

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
