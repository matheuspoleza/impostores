"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, ArrowRight, Trophy } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import GameCard from "@/components/cards/GameCard";
import RulesModal from "./RulesModal";

export default function ResultsScreen() {
  const router = useRouter();
  const {
    players,
    currentRound,
    currentRoundData,
    rounds,
    nextRound,
    finishGame,
  } = useGameState();
  
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    if (!currentRoundData) {
      router.push("/setup");
      return;
    }
  }, [currentRoundData, router]);

  if (!currentRoundData) {
    return null;
  }

  const impostors = players.filter((p) =>
    currentRoundData.impostors.includes(p.id)
  );

  const getVoteCount = (playerId: string) => {
    return Object.values(currentRoundData.votes).filter((votes) =>
      votes.includes(playerId)
    ).length;
  };

  const voteResults = players
    .map((p) => ({ player: p, votes: getVoteCount(p.id) }))
    .sort((a, b) => b.votes - a.votes);

  const handleNextRound = () => {
    nextRound();
    router.push("/setup");
  };

  const handleFinishGame = () => {
    finishGame();
    router.push("/ranking");
  };

  return (
    <div className="h-screen h-dvh w-full p-4 overflow-y-auto overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-4xl text-board-brown">
            🎭 Revelação!
          </h1>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown" />
          </button>
        </div>

        {/* Revelation Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6"
        >
          <GameCard variant="theme" size="lg">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="font-display text-3xl mb-6 text-blue-900">Os Impostores Eram:</h2>
              <div className="space-y-3 mb-6">
                {impostors.map((impostor) => (
                  <motion.div
                    key={impostor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-2xl text-blue-900"
                  >
                    🕵️ {impostor.name}
                  </motion.div>
                ))}
              </div>
              <div className="border-t-2 border-blue-300 pt-6 mt-6">
                <p className="font-body text-sm mb-2 text-blue-800">Palavra Secreta:</p>
                <p className="font-display text-4xl font-black text-blue-900">{currentRoundData.secretWord}</p>
              </div>
            </div>
          </GameCard>
        </motion.div>

        {/* Votes Table */}
        <GameCard variant="default" size="md" className="mb-6">
          <h3 className="font-display text-2xl mb-4 text-board-brown">
            Votos Recebidos
          </h3>
          <div className="space-y-2">
            {voteResults.map(({ player, votes }, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-3 bg-board-beige/50 rounded-card"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-board-brown/50 w-6">
                    {index + 1}º
                  </span>
                  <span className="font-display text-lg text-board-brown">
                    {player.name}
                  </span>
                  {currentRoundData.impostors.includes(player.id) && (
                    <span className="px-2 py-1 bg-impostor-card/20 text-impostor-card rounded-full text-xs font-display">
                      🕵️
                    </span>
                  )}
                </div>
                <span className="font-display text-xl text-innocent-card">{votes}</span>
              </motion.div>
            ))}
          </div>
        </GameCard>

        {/* Scores */}
        <GameCard variant="default" size="sm" className="mb-6">
          <h3 className="font-display text-xl mb-3 text-board-brown">
            Pontuação da Rodada
          </h3>
          <div className="space-y-2">
            {players.map((player) => {
              const score = currentRoundData.scores[player.id] || 0;
              const isImpostor = currentRoundData.impostors.includes(player.id);

              return (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-2 bg-board-beige/50 rounded-card"
                >
                  <span className={`font-body ${isImpostor ? "text-impostor-card" : "text-board-brown"}`}>
                    {player.name} {isImpostor && "🕵️"}
                  </span>
                  <span
                    className={`font-display text-lg ${
                      score > 0
                        ? "text-innocent-card"
                        : score < 0
                        ? "text-impostor-card"
                        : "text-board-brown/50"
                    }`}
                  >
                    {score > 0 ? "+" : ""}
                    {score} pts
                  </span>
                </div>
              );
            })}
          </div>
        </GameCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNextRound}
            className="w-full py-6 bg-innocent-card text-white rounded-card-lg font-display text-2xl shadow-card-3d flex items-center justify-center gap-3"
          >
            Próxima Rodada
            <ArrowRight className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFinishGame}
            className="w-full py-6 bg-board-brown text-board-cream rounded-card-lg font-display text-2xl shadow-card-lg flex items-center justify-center gap-3"
          >
            <Trophy className="w-6 h-6" />
            Finalizar Jogo
          </motion.button>
        </div>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    </div>
  );
}
