"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Trophy } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import GameCard from "@/components/cards/GameCard";
import RulesModal from "./RulesModal";

export default function RankingScreen() {
  const router = useRouter();
  const { players, rounds, newGame } = useGameState();
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    if (players.length === 0) {
      router.push("/setup");
      return;
    }
  }, [players.length, router]);

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const totalRounds = rounds.length;

  const getRankColor = (index: number) => {
    if (index === 0) return "from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800";
    if (index === 1) return "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700";
    if (index === 2) return "from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800";
    return "from-board-beige to-white dark:from-board-brown dark:to-board-dark";
  };

  const getRankTextColor = (index: number) => {
    if (index === 0) return "text-yellow-900 dark:text-yellow-100";
    if (index === 1) return "text-gray-900 dark:text-gray-100";
    if (index === 2) return "text-orange-900 dark:text-orange-100";
    return "text-board-brown dark:text-board-cream";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}º`;
  };

  const handleNewGame = () => {
    newGame();
    router.push("/setup");
  };

  return (
    <div className="h-screen h-dvh w-full bg-gradient-to-br from-board-cream via-board-beige to-board-cream dark:from-board-dark dark:via-board-brown dark:to-board-dark p-4 overflow-y-auto overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-4xl text-board-brown dark:text-board-cream mb-2">
              🏆 Ranking Final
            </h1>
            <p className="font-body text-sm text-board-brown/70 dark:text-board-cream/70">
              {totalRounds} rodada(s)
            </p>
          </div>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown dark:text-board-cream" />
          </button>
        </div>

        {/* Ranking List */}
        <div className="space-y-4 mb-6">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard
                variant="default"
                size="md"
                className={`bg-gradient-to-br ${getRankColor(index)} ${getRankTextColor(index)}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-4xl w-12 text-center">
                      {getRankIcon(index)}
                    </span>
                    <div>
                      <p className="font-display text-2xl">{player.name}</p>
                      <p className={`font-body text-sm ${
                        index < 3 ? "opacity-70" : "opacity-80"
                      }`}>
                        {totalRounds} rodada(s)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl">{player.totalScore}</p>
                    <p className={`font-body text-xs ${
                      index < 3 ? "opacity-70" : "opacity-80"
                    }`}>
                      pts
                    </p>
                  </div>
                </div>
              </GameCard>
            </motion.div>
          ))}
        </div>

        {/* Winner Announcement */}
        {sortedPlayers.length > 0 && sortedPlayers[0].totalScore > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <GameCard variant="innocent" size="md">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600 dark:text-yellow-400" />
                <h2 className="font-display text-3xl mb-2 text-green-900 dark:text-green-100">Parabéns!</h2>
                <p className="font-display text-2xl mb-1 text-green-900 dark:text-green-100">
                  {sortedPlayers[0].name}
                </p>
                <p className="font-body text-lg text-green-800 dark:text-green-200">
                  venceu com <strong>{sortedPlayers[0].totalScore}</strong> pontos!
                </p>
              </div>
            </GameCard>
          </motion.div>
        )}

        {/* New Game Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNewGame}
          className="w-full py-6 bg-board-brown dark:bg-board-cream text-board-cream dark:text-board-brown rounded-card-lg font-display text-2xl shadow-card-3d"
        >
          Novo Jogo
        </motion.button>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    </div>
  );
}
