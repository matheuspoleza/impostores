"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, Info } from "lucide-react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";
import RulesModal from "./RulesModal";
import Toast from "@/components/ui/Toast";
import { themes } from "@/lib/data/themes";

export default function SetupScreen() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, updatePlayerName, setSelectedTheme, startRound, loadSavedState } = useGameState();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedThemeName, setSelectedThemeName] = useState<string>("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      showToastMessage("Adicione pelo menos 3 jogadores");
      return;
    }

    if (!selectedThemeName) {
      showToastMessage("Selecione um tema");
      return;
    }

    const theme = themes.find((t) => t.name === selectedThemeName);
    if (!theme) {
      showToastMessage("Selecione um tema válido");
      return;
    }

    setSelectedTheme(theme.name);
    startRound(theme);
    router.push("/playing");
  };

  if (isLoading) {
    return (
      <div className="h-screen h-dvh w-full flex items-center justify-center fixed inset-0 overflow-hidden">
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
    <div className="h-screen h-dvh w-full overflow-y-auto overflow-x-hidden pb-32">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <h1 className="font-display text-4xl text-board-brown">
              Configuração
            </h1>
          </div>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown" />
          </button>
        </div>

        {/* Players Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display text-2xl text-board-brown">
              Jogadores ({players.length})
            </h2>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="p-2 text-board-brown hover:bg-black/10 rounded-full transition-colors"
              aria-label="Adicionar jogador"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {players.length === 0 ? (
            <p className="text-center py-4 font-body text-sm text-board-brown/60">
              Adicione jogadores para começar
            </p>
          ) : (
            <div className="space-y-1">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 py-2 border-b border-board-brown/10 last:border-b-0"
                >
                  <span className="text-board-brown/50 font-body text-sm w-6 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-body text-base text-board-brown min-w-0"
                    placeholder="Nome do jogador"
                  />
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-1.5 text-impostor-card hover:bg-impostor-card/20 rounded-full transition-colors flex-shrink-0"
                    aria-label="Remover jogador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-board-brown mb-4">
            Tema
          </h2>
          <button
            type="button"
            onClick={() => setShowThemePicker(true)}
            className="w-full px-4 py-4 bg-white rounded-card-lg border-2 border-board-brown font-display text-lg text-board-brown focus:outline-none focus:ring-2 focus:ring-innocent-card flex items-center justify-between"
          >
            <span className={selectedThemeName ? "" : "text-board-brown/50"}>
              {selectedThemeName 
                ? themes.find(t => t.name === selectedThemeName)?.name
                : "Selecione um tema"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B7355"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

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
                className="fixed bottom-0 left-0 right-0 bg-board-cream rounded-t-3xl p-6 z-50 shadow-card-3d"
              >
                <h3 className="font-display text-2xl mb-4 text-board-brown">
                  Adicionar Jogador
                </h3>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddPlayer()}
                  placeholder="Nome do jogador"
                  autoFocus
                  className="w-full px-4 py-4 bg-white rounded-card-lg border-2 border-board-brown font-body text-lg text-board-brown mb-4 focus:outline-none focus:ring-2 focus:ring-innocent-card"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddPlayer(false)}
                    className="flex-1 py-4 bg-gray-200 rounded-card-lg font-display text-lg"
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

        {/* Theme Picker Modal - Estilo iOS Nativo */}
        <AnimatePresence>
          {showThemePicker && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowThemePicker(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-card-3d max-h-[80vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-board-brown/10">
                  <h3 className="font-display text-2xl text-board-brown">Selecione um Tema</h3>
                  <button
                    onClick={() => setShowThemePicker(false)}
                    className="px-4 py-2 text-board-brown font-display text-lg"
                  >
                    Concluir
                  </button>
                </div>
                
                {/* Lista de Temas */}
                <div className="flex-1 overflow-y-auto">
                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => {
                        setSelectedThemeName(theme.name);
                        setShowThemePicker(false);
                      }}
                      className={`w-full px-4 py-4 text-left border-b border-board-brown/10 last:border-b-0 transition-colors ${
                        selectedThemeName === theme.name
                          ? "bg-board-beige"
                          : "bg-white hover:bg-board-beige/50 active:bg-board-beige"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-display text-xl text-board-brown">{theme.name}</p>
                        </div>
                        {selectedThemeName === theme.name && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8B7355"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>

      {/* Start Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
        <div className="max-w-md mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            className="w-full py-6 rounded-card-lg font-display text-2xl bg-innocent-card text-white shadow-card-3d transition-all hover:opacity-90"
          >
            <div className="flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              Iniciar Jogo
            </div>
          </motion.button>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
