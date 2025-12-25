"use client";

import Image from "next/image";
import { Player } from "@/types/game";
import { Round } from "@/types/game";
import { getDefaultAvatar } from "@/lib/utils/avatars";

interface PeelRevealScreenProps {
  isRevealed: boolean;
  onReveal: () => void;
  currentPlayer: Player;
  isImpostor: boolean;
  currentRoundData: Round;
  allRevealed: boolean;
  onSwipeRight?: () => void;
}

export default function PeelRevealScreen({
  isRevealed,
  onReveal,
  currentPlayer,
  isImpostor,
  currentRoundData,
  allRevealed,
  onSwipeRight,
}: PeelRevealScreenProps) {
  // Se já está revelado, mostrar o conteúdo
  if (isRevealed) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center w-full max-w-md px-4">
          {isImpostor ? (
            <>
              <div
                className="w-40 h-40 mx-auto mb-4 rounded-lg bg-cover bg-center bg-no-repeat drop-shadow-2xl"
                style={{ backgroundImage: 'url(/illustrations/impostor.png)' }}
                role="img"
                aria-label="Impostor"
              />
              
              <h3 className="font-display text-3xl mb-3 text-red-900">
                IMPOSTOR
              </h3>
              
              <p className="font-body text-lg mb-1 text-red-800">
                Tema:
              </p>
              
              <p className="font-display text-2xl font-black mb-3 text-red-900">
                {currentRoundData.theme}
              </p>
              
              <p className="font-body text-xs text-red-800 px-4 mb-6">
                Descubra a palavra através das dicas dos outros!
              </p>
            </>
          ) : (
            <>
              <div
                className="w-40 h-40 mx-auto mb-4 rounded-lg bg-cover bg-center bg-no-repeat drop-shadow-2xl"
                style={{ backgroundImage: 'url(/illustrations/inoscente.png)' }}
                role="img"
                aria-label="Inocente"
              />
              
              <h3 className="font-display text-3xl mb-3 text-green-900">
                INOCENTE
              </h3>
              
              <p className="font-body text-lg mb-2 text-green-800">
                Sua palavra é:
              </p>
              
              <p className="font-display text-5xl font-black mb-3 break-words text-green-900">
                {currentRoundData.secretWord}
              </p>
              
              <p className="font-body text-xs text-green-800 px-4 mb-6">
                Dê dicas sobre esta palavra sem ser muito óbvio!
              </p>
            </>
          )}

          {/* Botão para próximo jogador */}
          {!allRevealed && onSwipeRight && (
            <button
              onClick={onSwipeRight}
              className="w-full px-6 py-4 bg-board-brown text-board-cream rounded-full font-display text-lg shadow-card-lg hover:bg-board-brown/90 transition-colors"
            >
              Próximo Jogador →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Tela de instrução antes de revelar
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center w-full max-w-md px-4">
        {/* Avatar do Jogador */}
        <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-board-brown/20">
          <Image
            src={currentPlayer.avatar || getDefaultAvatar()}
            alt={currentPlayer.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        
        {/* Nome do Jogador */}
        <h2 className="font-display text-4xl mb-6 text-board-dark">
          {currentPlayer.name}
        </h2>

        {/* Botão de Revelar */}
        <button
          onClick={onReveal}
          className="w-full px-8 py-4 bg-board-brown text-board-cream rounded-full font-display text-xl shadow-card-lg hover:bg-board-brown/90 transition-colors"
        >
          Revelar Carta
        </button>
      </div>
    </div>
  );
}
