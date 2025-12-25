"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import GameCard from "@/components/cards/GameCard";
import RulesModal from "./RulesModal";

export default function WordCheckScreen() {
  const router = useRouter();
  const {
    players,
    currentRoundData,
    setWordCheck,
    finishRound,
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

  const allChecked = impostors.every((impostor) =>
    currentRoundData.wordCheck.hasOwnProperty(impostor.id)
  );

  const handleToggle = (impostorId: string, currentValue: boolean) => {
    setWordCheck(impostorId, !currentValue);
  };

  const handleContinue = () => {
    if (allChecked) {
      finishRound();
      router.push("/results");
    }
  };

  return (
    <div className="h-screen h-dvh w-full bg-gradient-to-br from-board-cream via-board-beige to-board-cream dark:from-board-dark dark:via-board-brown dark:to-board-dark p-4 overflow-y-auto overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-4xl text-board-brown dark:text-board-cream">
            ⚠️ Verificação
          </h1>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown dark:text-board-cream" />
          </button>
        </div>

        {/* Secret Word */}
        <GameCard variant="theme" size="md" className="mb-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="font-body text-sm mb-2 text-blue-800 dark:text-blue-200">Palavra Secreta</p>
            <p className="font-display text-5xl font-black text-blue-900 dark:text-blue-100">{currentRoundData.secretWord}</p>
          </div>
        </GameCard>

        {/* Question */}
        <GameCard variant="default" size="sm" className="mb-6">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="font-display text-2xl mb-2 text-board-brown dark:text-board-cream">
              Algum impostor falou a palavra?
            </h2>
            <p className="font-body text-sm text-board-brown/70 dark:text-board-cream/70">
              Toque nos impostores que disseram a palavra
            </p>
          </div>
        </GameCard>

        {/* Impostors List */}
        <div className="space-y-3 mb-6">
          {impostors.map((impostor) => {
            const spokeWord = currentRoundData.wordCheck[impostor.id] || false;

            return (
              <motion.div
                key={impostor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.98 }}
              >
                <GameCard
                  variant={spokeWord ? "impostor" : "default"}
                  size="sm"
                  onClick={() => handleToggle(impostor.id, spokeWord)}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-display text-xl">{impostor.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-body text-sm">
                        {spokeWord ? "Sim" : "Não"}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          spokeWord
                            ? "bg-impostor-card border-impostor-dark"
                            : "bg-white dark:bg-board-brown border-board-brown dark:border-board-cream"
                        }`}
                      >
                        {spokeWord && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 bg-white rounded-full"
                          />
                        )}
                      </div>
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
          disabled={!allChecked}
          className={`
            w-full py-6 rounded-card-lg font-display text-2xl
            ${allChecked
              ? "bg-innocent-card text-white shadow-card-3d"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }
            transition-all
          `}
        >
          Ver Resultado
        </motion.button>

        {!allChecked && (
          <p className="text-center mt-4 font-body text-sm text-impostor-card">
            Verifique todos os impostores
          </p>
        )}

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    </div>
  );
}
