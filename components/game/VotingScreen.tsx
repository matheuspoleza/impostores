"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Check } from "lucide-react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";
import { calculateImpostorCount, validateAllVoted } from "@/lib/game/gameLogic";
import GameCard from "@/components/cards/GameCard";
import RulesModal from "./RulesModal";
import { getDefaultAvatar } from "@/lib/utils/avatars";

export default function VotingScreen() {
  const router = useRouter();
  const {
    players,
    currentRoundData,
    vote,
    removeVote,
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

  const maxVotes = calculateImpostorCount(players.length);
  const allVoted = validateAllVoted(currentRoundData, players);

  const handleVote = (voterId: string, targetId: string) => {
    const currentVotes = currentRoundData.votes[voterId] || [];
    
    if (currentVotes.includes(targetId)) {
      removeVote(voterId, targetId);
    } else {
      if (currentVotes.length < maxVotes) {
        vote(voterId, targetId);
      }
    }
  };

  const handleContinue = () => {
    if (allVoted) {
      router.push("/wordcheck");
    }
  };

  const getVoteCount = (playerId: string) => {
    return Object.values(currentRoundData.votes).filter((votes) =>
      votes.includes(playerId)
    ).length;
  };

  return (
    <div className="h-screen h-dvh w-full p-4 overflow-y-auto overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-display text-4xl text-board-brown mb-2">
              🗳️ Votação
            </h1>
            <p className="font-body text-sm text-board-brown/70">
              Vote em <strong>{maxVotes}</strong> pessoa(s)
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

        {/* Voting Grid */}
        <div className="space-y-4 mb-6">
          {players.map((player) => {
            const playerVotes = currentRoundData.votes[player.id] || [];
            const voteCount = playerVotes.length;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GameCard variant="player" size="md" className="mb-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-board-brown/30 flex-shrink-0">
                            <Image
                              src={player.avatar || getDefaultAvatar()}
                              alt={player.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <h3 className="font-display text-2xl text-board-brown">
                            {player.name}
                          </h3>
                        </div>
                        <span className="font-display text-xl text-innocent-card">
                          {voteCount}/{maxVotes}
                        </span>
                      </div>
                    </div>

                  <div className="grid grid-cols-2 gap-2">
                    {players.map((targetPlayer) => {
                      const isSelected = playerVotes.includes(targetPlayer.id);
                      const isSelf = player.id === targetPlayer.id;

                      return (
                        <motion.button
                          key={targetPlayer.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => !isSelf && handleVote(player.id, targetPlayer.id)}
                          disabled={isSelf || (!isSelected && voteCount >= maxVotes)}
                          className={`
                            py-4 px-3 rounded-card-lg font-display text-lg transition-all
                            min-h-[60px] flex items-center gap-2
                            ${
                              isSelected
                                ? "bg-innocent-card text-white shadow-card-lg"
                                : "bg-white text-board-brown border-2 border-board-brown/30"
                            }
                            ${isSelf ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            ${!isSelected && voteCount >= maxVotes ? "opacity-30 cursor-not-allowed" : ""}
                          `}
                        >
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-board-brown/20 flex-shrink-0">
                            <Image
                              src={targetPlayer.avatar || getDefaultAvatar()}
                              alt={targetPlayer.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                          <span className="truncate">{targetPlayer.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  </div>
                </GameCard>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!allVoted}
          className={`
            w-full py-6 rounded-card-lg font-display text-2xl mb-4
            ${allVoted
              ? "bg-innocent-card text-white shadow-card-3d"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
            transition-all
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <Check className="w-6 h-6" />
            Continuar
          </div>
        </motion.button>

        {!allVoted && (
          <p className="text-center font-body text-sm text-impostor-card">
            Todos devem votar antes de continuar
          </p>
        )}

        {/* Vote Summary */}
        <GameCard variant="default" size="sm" className="mt-4">
          <h3 className="font-display text-xl mb-3 text-board-brown">
            Votos Recebidos
          </h3>
          <div className="space-y-2">
            {players
              .map((p) => ({ player: p, votes: getVoteCount(p.id) }))
              .sort((a, b) => b.votes - a.votes)
              .map(({ player, votes }) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-2 bg-board-beige/50 rounded-card"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-board-brown/20 flex-shrink-0">
                      <Image
                        src={player.avatar || getDefaultAvatar()}
                        alt={player.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <span className="font-body text-board-brown">{player.name}</span>
                  </div>
                  <span className="font-display text-lg text-innocent-card">{votes}</span>
                </div>
              ))}
          </div>
        </GameCard>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    </div>
  );
}
