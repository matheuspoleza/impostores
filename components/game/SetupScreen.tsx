"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Info, Play } from "lucide-react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";
import GameCard from "@/components/cards/GameCard";
import CardStack from "@/components/cards/CardStack";
import RulesModal from "./RulesModal";
import { themes } from "@/lib/data/themes";

export default function SetupScreen() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, updatePlayerName, setSelectedTheme, startRound, loadSavedState } = useGameState();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedThemeName, setSelectedThemeName] = useState<string>("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedState();
    // Loading de 3 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [loadSavedState]);

  const handleAddPlayer = () => {
    if (newPlayerName.trim() || players.length === 0) {
      addPlayer(newPlayerName || `Jogador ${players.length + 1}`);
      setNewPlayerName("");
      setShowAddPlayer(false);
    }
  };

  const handleRemovePlayer = (id: string) => {
    removePlayer(id);
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      alert("Adicione pelo menos 2 jogadores!");
      return;
    }

    const theme = themes.find((t) => t.name === selectedThemeName) || themes[0];
    if (!theme) {
      alert("Selecione um tema!");
      return;
    }

    setSelectedTheme(theme.name);
    startRound(theme);
    router.push("/playing");
  };

  const canStart = players.length >= 2 && selectedThemeName !== "";

  const themeCards = themes.map((theme) => ({
    id: theme.name,
    content: (
      <div className="text-center">
        <h3 className="font-display text-3xl mb-2">{theme.name}</h3>
        <p className="font-body text-sm opacity-70">{theme.words.length} palavras</p>
      </div>
    ),
    variant: selectedThemeName === theme.name ? "theme" : "default" as const,
  }));

  if (isLoading) {
    return (
      <div className="h-screen h-dvh w-full bg-gradient-to-br from-board-cream via-board-beige to-board-cream dark:from-board-dark dark:via-board-brown dark:to-board-dark flex items-center justify-center fixed inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full max-w-md px-8 aspect-square"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={800}
              height={800}
              className="w-full h-full object-contain rounded-3xl shadow-lg"
              priority
              style={{ aspectRatio: '1 / 1' }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen h-dvh w-full bg-gradient-to-br from-board-cream via-board-beige to-board-cream dark:from-board-dark dark:via-board-brown dark:to-board-dark p-4 overflow-y-auto overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <h1 className="font-display text-4xl text-board-brown dark:text-board-cream">
              🎮 Configuração
            </h1>
          </div>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown dark:text-board-cream" />
          </button>
        </div>

        {/* Players Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl text-board-brown dark:text-board-cream">
              Jogadores ({players.length})
            </h2>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="p-3 bg-board-brown dark:bg-board-cream text-board-cream dark:text-board-brown rounded-full shadow-card-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {players.length === 0 ? (
            <GameCard variant="player" size="sm" className="!p-4">
              <div className="flex items-center justify-center h-full">
                <p className="font-display text-lg text-board-brown/60 dark:text-board-cream/60">
                  Adicione jogadores para começar
                </p>
              </div>
            </GameCard>
          ) : (
            <div className="space-y-3">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <GameCard
                    variant="player"
                    size="sm"
                    className="!p-4"
                  >
                    <div className="flex items-center gap-3 w-full h-full">
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none font-display text-xl text-board-brown dark:text-board-cream min-w-0"
                        placeholder="Nome do jogador"
                      />
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="p-2 text-impostor-card hover:bg-impostor-card/20 rounded-full transition-colors flex-shrink-0"
                        aria-label="Remover jogador"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </GameCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-board-brown dark:text-board-cream mb-4">
            Tema
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto px-1 -mx-1">
            {themes.map((theme) => (
              <motion.div
                key={theme.name}
                whileTap={{ scale: 0.98 }}
                className="px-1"
              >
                <GameCard
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedThemeName(theme.name)}
                  className={`cursor-pointer ${
                    selectedThemeName === theme.name 
                      ? "bg-blue-50 dark:bg-blue-900/30 border-4 border-blue-600 shadow-lg" 
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className={`font-display text-2xl mb-1 ${
                      selectedThemeName === theme.name 
                        ? "text-blue-700 dark:text-blue-300 font-black" 
                        : "text-board-brown dark:text-board-cream"
                    }`}>
                      {theme.name}
                    </h3>
                    <p className={`font-body text-xs ${
                      selectedThemeName === theme.name 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-board-brown/70 dark:text-board-cream/70"
                    }`}>
                      {theme.words.length} palavras
                    </p>
                  </div>
                </GameCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame}
          disabled={!canStart}
          className={`
            w-full py-6 rounded-card-lg font-display text-2xl
            ${canStart
              ? "bg-innocent-card text-white shadow-card-3d"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }
            transition-all
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <Play className="w-6 h-6" />
            Iniciar Jogo
          </div>
        </motion.button>

        {players.length < 2 && (
          <p className="text-center mt-4 font-body text-sm text-impostor-card">
            Adicione pelo menos 2 jogadores
          </p>
        )}

        {/* Add Player Modal */}
        <AnimatePresence>
          {showAddPlayer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddPlayer(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="fixed bottom-0 left-0 right-0 bg-board-cream dark:bg-board-dark rounded-t-3xl p-6 z-50 shadow-card-3d"
              >
                <h3 className="font-display text-2xl mb-4 text-board-brown dark:text-board-cream">
                  Adicionar Jogador
                </h3>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddPlayer()}
                  placeholder="Nome do jogador"
                  autoFocus
                  className="w-full px-4 py-4 bg-white dark:bg-board-brown rounded-card-lg border-2 border-board-brown dark:border-board-cream font-body text-lg text-board-brown dark:text-board-cream mb-4 focus:outline-none focus:ring-2 focus:ring-innocent-card"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddPlayer(false)}
                    className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 rounded-card-lg font-display text-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddPlayer}
                    className="flex-1 py-4 bg-innocent-card text-white rounded-card-lg font-display text-lg shadow-card-lg"
                  >
                    Adicionar
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>
    </div>
  );
}
