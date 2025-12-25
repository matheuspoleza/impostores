"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, Info, Users, Palette, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";
import RulesModal from "./RulesModal";
import Toast from "@/components/ui/Toast";
import AvatarSelector from "@/components/ui/AvatarSelector";
import { themes } from "@/lib/data/themes";
import { getDefaultAvatar } from "@/lib/utils/avatars";

export default function SetupScreen() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, updatePlayerName, updatePlayerAvatar, setSelectedTheme, startRound, loadSavedState } = useGameState();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerAvatar, setNewPlayerAvatar] = useState<string>(getDefaultAvatar());
  const [selectedThemeName, setSelectedThemeName] = useState<string>("");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarSelectorForPlayer, setAvatarSelectorForPlayer] = useState<string | null>(null);
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
      addPlayer(newPlayerName || `Jogador ${players.length + 1}`, newPlayerAvatar);
      setNewPlayerName("");
      setNewPlayerAvatar(getDefaultAvatar());
      setShowAddPlayer(false);
    }
  };

  const handleOpenAvatarSelector = (playerId?: string) => {
    setAvatarSelectorForPlayer(playerId || null);
    setShowAvatarSelector(true);
  };

  const handleSelectAvatar = (avatar: string) => {
    if (avatarSelectorForPlayer) {
      // Atualizar avatar de jogador existente
      updatePlayerAvatar(avatarSelectorForPlayer, avatar);
    } else {
      // Definir avatar para novo jogador
      setNewPlayerAvatar(avatar);
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

  const selectedTheme = themes.find((t) => t.name === selectedThemeName);
  const canStartGame = players.length >= 3 && selectedThemeName !== "";
  const maxPlayers = 8;

  // Função para obter ícone do tema
  const getThemeIcon = (themeName: string) => {
    const iconMap: Record<string, string> = {
      "Animais": "🐾",
      "Comida": "🍕",
      "Objetos": "📦",
      "Profissões": "💼",
      "Esportes": "⚽",
      "Países": "🌍",
      "Cores": "🎨",
      "Natureza": "🌳",
      "Transporte": "🚗",
      "Música": "🎵",
    };
    return iconMap[themeName] || "🎯";
  };

  return (
    <div className="h-screen h-dvh w-full overflow-y-auto overflow-x-hidden pb-32">
      <div className="max-w-md mx-auto p-4">
        {/* Progress Indicator */}
        <div className="mb-6 pt-2">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-innocent-card"></div>
              <span className="text-xs font-body text-board-brown font-semibold">Configuração</span>
            </div>
            <div className="w-8 h-0.5 bg-board-brown/20"></div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-board-brown/20"></div>
              <span className="text-xs font-body text-board-brown/50">Revelação</span>
            </div>
            <div className="w-8 h-0.5 bg-board-brown/20"></div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-board-brown/20"></div>
              <span className="text-xs font-body text-board-brown/50">Votação</span>
            </div>
            <div className="w-8 h-0.5 bg-board-brown/20"></div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-board-brown/20"></div>
              <span className="text-xs font-body text-board-brown/50">Resultado</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-contain drop-shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-board-brown/70" strokeWidth={2} />
                <h1 className="font-display text-4xl text-board-brown">
                  Configuração
                </h1>
              </div>
              <p className="font-body text-sm text-board-brown/60 mt-0.5">
                Prepare a rodada antes de começar
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Abrir regras"
          >
            <Info className="w-6 h-6 text-board-brown" strokeWidth={2} />
          </button>
        </div>

        {/* Players Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-display text-2xl text-board-brown">
                Jogadores
              </h2>
              <p className="font-body text-xs text-board-brown/60 mt-0.5">
                {players.length} de {maxPlayers} jogadores
              </p>
            </div>
            {players.length < maxPlayers && (
              <button
                onClick={() => setShowAddPlayer(true)}
                className="p-2 text-board-brown hover:bg-black/10 rounded-full transition-colors"
                aria-label="Adicionar jogador"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
              </button>
            )}
          </div>

          {players.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-card-lg border-2 border-dashed border-board-brown/20 p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-5xl mb-4"
              >
                👥
              </motion.div>
              <p className="font-body text-lg text-board-brown font-semibold mb-2">
                Convide seus amigos para a mesa
              </p>
              <p className="font-body text-sm text-board-brown/60 mb-6">
                Adicione pelo menos 3 jogadores para começar
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddPlayer(true)}
                className="px-6 py-3 bg-innocent-card text-white rounded-card-lg font-display text-base shadow-card-lg transition-all hover:opacity-90"
              >
                Adicionar Jogador
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      layout: { duration: 0.2 }
                    }}
                    className="bg-white rounded-card-lg border border-board-brown/10 shadow-card hover:shadow-card-lg transition-all p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-board-brown/40 font-display text-lg w-6 flex-shrink-0 text-center">
                        {index + 1}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleOpenAvatarSelector(player.id)}
                        className="relative w-12 h-12 rounded-full overflow-hidden border-[3px] border-board-brown/40 flex-shrink-0 hover:border-board-brown/60 transition-all shadow-md hover:shadow-lg"
                        aria-label="Selecionar avatar"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: index * 0.05 }}
                        >
                          <Image
                            src={player.avatar || getDefaultAvatar()}
                            alt={player.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </motion.div>
                      </motion.button>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none font-body text-base text-board-brown font-semibold min-w-0 placeholder:text-board-brown/40 truncate"
                        placeholder="Nome do jogador"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemovePlayer(player.id)}
                        className="p-2 text-board-brown/50 hover:text-impostor-card hover:bg-impostor-card/10 rounded-full transition-colors flex-shrink-0"
                        aria-label="Remover jogador"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <h2 className="font-display text-2xl text-board-brown mb-4">
            Tema
          </h2>
          {selectedTheme ? (
            <motion.button
              type="button"
              onClick={() => setShowThemePicker(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-6 bg-gradient-to-br from-white to-board-beige rounded-card-lg border-2 border-board-brown/30 hover:border-board-brown shadow-card-lg focus:outline-none focus:ring-2 focus:ring-innocent-card flex items-center gap-4 transition-all"
            >
              <div className="text-4xl flex-shrink-0">
                {getThemeIcon(selectedTheme.name)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-display text-xl text-board-brown mb-1">
                  {selectedTheme.name}
                </p>
                <p className="font-body text-sm text-board-brown/60">
                  {selectedTheme.words.length} palavras disponíveis
                </p>
              </div>
              <Palette className="w-5 h-5 text-board-brown/50 flex-shrink-0" strokeWidth={2} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={() => setShowThemePicker(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-8 bg-white rounded-card-lg border-2 border-dashed border-board-brown/30 hover:border-board-brown/50 focus:outline-none focus:ring-2 focus:ring-innocent-card flex flex-col items-center gap-3 transition-all"
            >
              <div className="text-4xl">🎯</div>
              <div className="text-center">
                <p className="font-display text-lg text-board-brown mb-1">
                  Escolha um tema para começar
                </p>
                <p className="font-body text-sm text-board-brown/50">
                  Selecione o tema da rodada
                </p>
              </div>
              <Palette className="w-5 h-5 text-board-brown/40" strokeWidth={2} />
            </motion.button>
          )}
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
                <div className="mb-4">
                  <label className="block font-body text-sm text-board-brown/70 mb-2">
                    Avatar
                  </label>
                  <button
                    onClick={() => handleOpenAvatarSelector()}
                    className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-board-brown/30 hover:border-board-brown/50 transition-colors mx-auto block"
                    aria-label="Selecionar avatar"
                  >
                    <Image
                      src={newPlayerAvatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                </div>
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
                    className="flex-1 py-4 bg-gray-200 rounded-card-lg font-display text-lg transition-colors hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddPlayer}
                    className="flex-1 py-4 bg-innocent-card text-white rounded-card-lg font-display text-lg shadow-card-lg transition-all hover:opacity-90"
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
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-3xl flex-shrink-0">
                          {getThemeIcon(theme.name)}
                        </div>
                        <div className="flex-1">
                          <p className="font-display text-xl text-board-brown mb-1">{theme.name}</p>
                          <p className="font-body text-sm text-board-brown/60">{theme.words.length} palavras</p>
                        </div>
                        {selectedThemeName === theme.name && (
                          <CheckCircle2 className="w-6 h-6 text-innocent-card flex-shrink-0" strokeWidth={2.5} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Avatar Selector Modal */}
        <AnimatePresence>
          {showAvatarSelector && (
            <AvatarSelector
              selectedAvatar={
                avatarSelectorForPlayer
                  ? players.find((p) => p.id === avatarSelectorForPlayer)?.avatar
                  : newPlayerAvatar
              }
              onSelect={handleSelectAvatar}
              onClose={() => {
                setShowAvatarSelector(false);
                setAvatarSelectorForPlayer(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Rules Modal */}
        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </div>

      {/* Start Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-board-cream/80 backdrop-blur-sm border-t border-board-brown/10">
        <div className="max-w-md mx-auto">
          {!canStartGame && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-center"
            >
              <p className="font-body text-sm text-board-brown/70">
                {players.length < 3
                  ? "Adicione pelo menos 3 jogadores"
                  : !selectedThemeName
                  ? "Selecione um tema"
                  : "Tudo pronto? Vamos descobrir o impostor 👀"}
              </p>
            </motion.div>
          )}
          {canStartGame && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-center"
            >
              <p className="font-body text-sm text-board-brown/70">
                Tudo pronto? Vamos descobrir o impostor 👀
              </p>
            </motion.div>
          )}
          <motion.button
            whileTap={canStartGame ? { scale: 0.95 } : {}}
            onClick={handleStartGame}
            disabled={!canStartGame}
            className={`w-full py-6 rounded-card-lg font-display text-2xl shadow-card-3d transition-all flex items-center justify-center gap-3 ${
              canStartGame
                ? "bg-innocent-card text-white hover:opacity-90 cursor-pointer"
                : "bg-board-brown/20 text-board-brown/40 cursor-not-allowed"
            }`}
          >
            {canStartGame ? (
              <>
                <Play className="w-6 h-6" strokeWidth={2.5} />
                Iniciar Jogo
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
                Iniciar Jogo
              </>
            )}
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
