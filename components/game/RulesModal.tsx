"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 z-50 bg-gradient-to-br from-board-cream via-board-beige to-board-cream rounded-card-lg shadow-card-3d overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-board-brown/20">
              <h2 className="font-display text-3xl text-board-brown">Manual de Regras</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/10 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-board-brown" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Objetivo */}
              <section>
                <h3 className="font-display text-2xl text-board-brown mb-3">🎯 Objetivo do Jogo</h3>
                <div className="space-y-2 font-body text-base text-board-brown">
                  <p><strong className="text-innocent-card">Inocentes:</strong> Descobrir TODOS os impostores através de votação</p>
                  <p><strong className="text-impostor-card">Impostores:</strong> Não ser descoberto, fingindo conhecer a palavra secreta</p>
                </div>
              </section>

              {/* Como Jogar */}
              <section>
                <h3 className="font-display text-2xl text-board-brown mb-3">🎲 Como Jogar</h3>
                <ol className="list-decimal list-inside space-y-2 font-body text-base text-board-brown">
                  <li>Adicionar jogadores (mínimo 2)</li>
                  <li>Escolher tema da rodada (ou aleatório)</li>
                  <li>Sistema sorteia automaticamente 30% dos jogadores como impostores (mínimo 1)</li>
                  <li><strong className="text-innocent-card">Inocentes</strong> recebem a palavra completa</li>
                  <li><strong className="text-impostor-card">Impostores</strong> recebem apenas o tema</li>
                  <li>Cada jogador vê sua palavra/tema individualmente (passar celular)</li>
                  <li>Todos dão dicas sobre sua &quot;palavra&quot;</li>
                  <li>Votação: cada jogador vota em N pessoas (N = número de impostores)</li>
                  <li>Verificação se algum impostor falou a palavra</li>
                  <li>Revelação e pontuação</li>
                </ol>
              </section>

              {/* Pontuação Inocentes */}
              <section>
                <h3 className="font-display text-2xl text-board-brown mb-3">💰 Pontuação - Inocentes</h3>
                <div className="bg-innocent-card/10 rounded-card-lg p-4 space-y-2 border-2 border-innocent-card/30">
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">⭐</span>
                    <span><strong className="text-innocent-card">Perfeito (+5):</strong> Acertou TODOS os impostores</span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">✅</span>
                    <span><strong className="text-innocent-card">Bom (+2):</strong> Acertou ALGUNS impostores</span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">❌</span>
                    <span><strong className="text-board-brown/70">Neutro (0):</strong> Errou todos</span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">💀</span>
                    <span><strong className="text-impostor-card">Péssimo (-1):</strong> TODOS os outros inocentes votaram nele</span>
                  </div>
                </div>
              </section>

              {/* Pontuação Impostores */}
              <section>
                <h3 className="font-display text-2xl text-board-brown mb-3">💰 Pontuação - Impostores</h3>
                <div className="bg-impostor-card/10 rounded-card-lg p-4 space-y-2 border-2 border-impostor-card/30">
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">⭐</span>
                    <span><strong className="text-impostor-card">Perfeito (+5):</strong> Escapou (não foi descoberto)</span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">✅</span>
                    <span><strong className="text-impostor-card">Bom (+2):</strong> Foi descoberto mas não foi o mais votado</span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">❌</span>
                    <span><strong className="text-board-brown/70">Neutro (0):</strong> Foi o mais votado (pior impostor)</span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-base text-board-brown">
                    <span className="text-2xl">💀</span>
                    <span><strong className="text-impostor-card">Péssimo (-1):</strong> Falou a palavra secreta durante o jogo</span>
                  </div>
                </div>
              </section>

              {/* Dicas */}
              <section>
                <h3 className="font-display text-2xl text-board-brown mb-3">⭐ Dicas</h3>
                <ul className="list-disc list-inside space-y-2 font-body text-base text-board-brown">
                  <li>Dê dicas claras mas não muito óbvias</li>
                  <li>Preste atenção nas dicas dos outros</li>
                  <li>Impostores devem observar bem antes de dar dicas</li>
                  <li>Votação múltipla permite mais estratégia</li>
                  <li>Colabore com outros inocentes (mas cuidado com traidores!)</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
