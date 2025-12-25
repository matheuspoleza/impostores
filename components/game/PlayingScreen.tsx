"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import SwipeableCard from "@/components/cards/SwipeableCard";
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
  const [isFlipping, setIsFlipping] = useState(false);

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
      setIsFlipping(true);
      setTimeout(() => {
        revealPlayerWord(currentPlayer.id);
        setIsRevealed(true);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleSwipeUp = () => {
    if (!isRevealed) {
      handleReveal();
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

  const handleTap = () => {
    if (!isRevealed) {
      handleReveal();
    }
  };

  if (!currentRoundData || !currentPlayer) {
    return null;
  }

  return (
    <div className="h-screen h-dvh w-full bg-gradient-to-br from-board-cream via-board-beige to-board-cream dark:from-board-dark dark:via-board-brown dark:to-board-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
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
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl text-board-brown dark:text-board-cream">
            R{currentRound}
          </span>
          <span className="px-3 py-1 bg-board-brown/20 dark:bg-board-cream/20 rounded-full text-xs font-bold text-board-brown dark:text-board-cream">
            {currentRoundData.theme}
          </span>
        </div>
        <button
          onClick={() => setIsRulesOpen(true)}
          className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
          aria-label="Abrir regras"
        >
          <Info className="w-5 h-5 text-board-brown dark:text-board-cream" />
        </button>
      </div>

      {/* Carta Principal */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto relative z-0">
        <SwipeableCard
          variant={isRevealed ? (isImpostor ? "impostor" : "innocent") : "player"}
          size="xl"
          onSwipeUp={handleSwipeUp}
          onSwipeRight={handleSwipeRight}
          onClick={handleTap}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="front"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.3 }}
                className="text-center w-full"
              >
                {/* Ícone do Jogador */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-8xl mb-6"
                >
                  👤
                </motion.div>
                
                {/* Nome do Jogador */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-5xl mb-4 text-board-dark dark:text-board-cream"
                >
                  {currentPlayer.name}
                </motion.h2>

                {/* Instrução */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-body text-lg text-board-brown/70 dark:text-board-cream/70 mb-8"
                >
                  Deslize para cima ou toque para revelar
                </motion.p>

                {/* Indicador de Swipe */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-4xl"
                >
                  ↑
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.3 }}
                className="text-center w-full"
              >
                {isImpostor ? (
                  <>
                    {/* Ícone Impostor */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-9xl mb-6 drop-shadow-2xl"
                    >
                      🕵️
                    </motion.div>
                    
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="font-display text-4xl mb-6 text-red-900 dark:text-red-100"
                    >
                      IMPOSTOR
                    </motion.h3>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-body text-xl mb-2 text-red-800 dark:text-red-200"
                    >
                      Tema:
                    </motion.p>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-display text-3xl font-black mb-6 text-red-900 dark:text-red-100"
                    >
                      {currentRoundData.theme}
                    </motion.p>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="font-body text-sm text-red-800 dark:text-red-200 px-4"
                    >
                      Descubra a palavra através das dicas dos outros!
                    </motion.p>
                  </>
                ) : (
                  <>
                    {/* Ícone Inocente */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-9xl mb-6 drop-shadow-2xl"
                    >
                      ✅
                    </motion.div>
                    
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="font-display text-4xl mb-6 text-green-900 dark:text-green-100"
                    >
                      INOCENTE
                    </motion.h3>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-body text-xl mb-4 text-green-800 dark:text-green-200"
                    >
                      Sua palavra é:
                    </motion.p>
                    
                    <motion.p
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="font-display text-6xl font-black mb-6 break-words text-green-900 dark:text-green-100"
                    >
                      {currentRoundData.secretWord}
                    </motion.p>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="font-body text-sm text-green-800 dark:text-green-200 px-4"
                    >
                      Dê dicas sobre esta palavra sem ser muito óbvio!
                    </motion.p>
                  </>
                )}

                {/* Instrução para próximo */}
                {!allRevealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                  >
                    <p className="font-body text-sm opacity-70 mb-2">
                      Deslize para a direita para próximo jogador
                    </p>
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-3xl"
                    >
                      →
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SwipeableCard>
      </div>

      {/* Progress Bar */}
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
                  ? "bg-board-brown dark:bg-board-cream"
                  : "bg-board-brown/30 dark:bg-board-cream/30"
              }`}
            />
          ))}
        </div>
        <p className="text-center font-body text-sm text-board-brown/70 dark:text-board-cream/70">
          {revealedPlayers.size} / {players.length} revelaram
        </p>
      </div>

      {/* Botão de ação (fallback) */}
      {isRevealed && allRevealed && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push("/voting")}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 px-8 py-4 bg-board-brown dark:bg-board-cream text-board-cream dark:text-board-brown rounded-full font-display text-xl shadow-card-lg"
        >
          Iniciar Votação
        </motion.button>
      )}

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
