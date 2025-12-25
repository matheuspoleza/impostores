"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Trophy } from "lucide-react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";
import GameCard from "@/components/cards/GameCard";
import RulesModal from "./RulesModal";
import { getDefaultAvatar } from "@/lib/utils/avatars";

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
    if (index === 0) return "from-yellow-50 to-yellow-100";
    if (index === 1) return "from-gray-50 to-gray-100";
    if (index === 2) return "from-orange-50 to-orange-100";
    return "from-board-beige to-white";
  };

  const getRankTextColor = (index: number) => {
    if (index === 0) return "text-yellow-900";
    if (index === 1) return "text-gray-900";
    if (index === 2) return "text-orange-900";
    return "text-board-brown";
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
    <div className="h-screen h-dvh w-full p-4 overflow-y-auto overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-4xl text-board-brown mb-2">
              🏆 Ranking Final
            </h1>
            <p className="font-body text-sm text-board-brown/70">
              {totalRounds} rodada(s)
            </p>
          </div>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown" />
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
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-board-brown/30 flex-shrink-0">
                      <Image
                        src={player.avatar || getDefaultAvatar()}
                        alt={player.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
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
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
                <h2 className="font-display text-3xl mb-2 text-green-900">Parabéns!</h2>
                <p className="font-display text-2xl mb-1 text-green-900">
                  {sortedPlayers[0].name}
                </p>
                <p className="font-body text-lg text-green-800">
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
          className="w-full py-6 bg-board-brown text-board-cream rounded-card-lg font-display text-2xl shadow-card-3d"
        >
          Novo Jogo
        </motion.button>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    </div>
  );
}
