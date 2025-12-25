"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useDrag } from "@use-gesture/react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenHeight, setScreenHeight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const y = useMotionValue(0);
  const ySpring = useSpring(y, { damping: 30, stiffness: 300 });
  const x = useMotionValue(0);

  // Calcular altura da tela
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setScreenHeight(containerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Reset quando mudar de jogador
  useEffect(() => {
    if (!isRevealed) {
      y.set(0);
      x.set(0);
      setIsAnimating(false);
      setHasMoved(false);
    }
  }, [currentPlayer.id, isRevealed, y, x]);

  // Transformações baseadas na posição Y
  const progress = useTransform(y, [0, -screenHeight], [0, 1]);
  const opacity = useTransform(y, [0, -screenHeight * 0.5], [1, 0]);
  const borderRadius = useTransform(progress, [0, 1], [0, 20]);
  
  // Calcular boxShadow baseado na posição Y
  const boxShadow = useTransform(y, (latestY) => {
    const absY = Math.abs(latestY);
    const shadowY = -(absY * 0.1);
    const shadowBlur = absY * 0.2;
    return `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3)`;
  });


  const completeReveal = async () => {
    if (isAnimating || isRevealed) return;
    
    setIsAnimating(true);
    await animate(y, -screenHeight, {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    });
    onReveal();
    setIsAnimating(false);
  };

  const bind = useDrag(
    ({ active, movement: [mx, my], first, last, velocity: [vx, vy] }) => {
      if (isRevealed || isAnimating) return;

      if (first) {
        setHasMoved(false);
      }

      if (active) {
        // Verificar se houve movimento significativo
        if (Math.abs(mx) > 5 || Math.abs(my) > 5) {
          setHasMoved(true);
        }

        // Permitir apenas movimento vertical (priorizar Y sobre X)
        if (Math.abs(my) > Math.abs(mx)) {
          // Movimento vertical - limitar apenas para cima (valores negativos)
          const newY = Math.min(0, my);
          y.set(newY);
        }
      } else if (last) {
        const absY = Math.abs(my);
        const absVy = Math.abs(vy);

        // Se arrastou mais de 20% da tela ou velocidade alta, completar
        if (absY > screenHeight * 0.2 || absVy > 0.3) {
          completeReveal();
        } else {
          // Voltar para posição inicial
          animate(y, 0, {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          });
        }

        setHasMoved(false);
      }
    },
    {
      axis: "y",
      threshold: 5,
      filterTaps: true,
    }
  );

  // Handler para tap
  const handleTap = () => {
    if (!isRevealed && !isAnimating && !hasMoved) {
      completeReveal();
    }
  };

  // Extrair propriedades do bind
  const bindProps = bind();
  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  } = bindProps;

  // Bind para swipe right quando revelado
  const bindSwipeRight = useDrag(
    ({ active, movement: [mx, my], last, velocity: [vx] }) => {
      if (!isRevealed || !onSwipeRight) return;

      if (active) {
        x.set(mx);
      } else if (last) {
        const absX = Math.abs(mx);
        const absVx = Math.abs(vx);

        // Se arrastou para a direita mais de 80px ou velocidade alta, chamar onSwipeRight
        if ((mx > 80 || absVx > 0.5) && mx > 0) {
          onSwipeRight();
        }

        // Reset position
        x.set(0);
      }
    },
    {
      axis: "x",
      threshold: 5,
    }
  );

  // Extrair apenas as propriedades de evento compatíveis
  const swipeRightProps = isRevealed && onSwipeRight ? bindSwipeRight() : {};
  const {
    onPointerDown: onSwipePointerDown,
    onPointerMove: onSwipePointerMove,
    onPointerUp: onSwipePointerUp,
    onPointerCancel: onSwipePointerCancel,
    onTouchStart: onSwipeTouchStart,
    onTouchMove: onSwipeTouchMove,
    onTouchEnd: onSwipeTouchEnd,
    onTouchCancel: onSwipeTouchCancel,
  } = swipeRightProps;

  // Se já está revelado, mostrar apenas o conteúdo
  if (isRevealed) {
    return (
      <motion.div
        className={`w-full ${allRevealed ? 'flex items-start justify-center pt-8' : 'h-full flex items-center justify-center'}`}
        style={{ x }}
        onPointerDown={onSwipePointerDown}
        onPointerMove={onSwipePointerMove}
        onPointerUp={onSwipePointerUp}
        onPointerCancel={onSwipePointerCancel}
        onTouchStart={onSwipeTouchStart}
        onTouchMove={onSwipeTouchMove}
        onTouchEnd={onSwipeTouchEnd}
        onTouchCancel={onSwipeTouchCancel}
      >
        <div className={`text-center w-full max-w-md px-4 ${allRevealed ? '' : ''}`}>
          {isImpostor ? (
            <>
              {/* Ilustração Impostor */}
              <div
                className="w-40 h-40 mx-auto mb-3 rounded-lg bg-cover bg-center bg-no-repeat drop-shadow-2xl"
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
              
              <p className="font-body text-xs text-red-800 px-4">
                Descubra a palavra através das dicas dos outros!
              </p>
            </>
          ) : (
            <>
              {/* Ilustração Inocente */}
              <div
                className="w-40 h-40 mx-auto mb-3 rounded-lg bg-cover bg-center bg-no-repeat drop-shadow-2xl"
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
              
              <p className="font-body text-xs text-green-800 px-4">
                Dê dicas sobre esta palavra sem ser muito óbvio!
              </p>
            </>
          )}

          {/* Botão para próximo jogador */}
          {!allRevealed && onSwipeRight && (
            <div className="mt-4">
              <button
                onClick={onSwipeRight}
                className="px-6 py-3 bg-board-brown text-board-cream rounded-full font-display text-base shadow-card-lg hover:bg-board-brown/90 transition-colors"
              >
                Próximo Jogador →
              </button>
              <p className="font-body text-xs opacity-70 mt-2">
                Ou deslize para a direita
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    >
      {/* Backdrop Layer - Conteúdo da Revelação (sempre renderizado para evitar piscada) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-board-cream to-white">
        <div className="text-center w-full max-w-md px-4">
          {isImpostor ? (
            <>
              <div
                className="w-40 h-40 mx-auto mb-3 rounded-lg bg-cover bg-center bg-no-repeat drop-shadow-2xl"
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
              <p className="font-body text-xs text-red-800 px-4">
                Descubra a palavra através das dicas dos outros!
              </p>
            </>
          ) : (
            <>
              <div
                className="w-40 h-40 mx-auto mb-3 rounded-lg bg-cover bg-center bg-no-repeat drop-shadow-2xl"
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
              <p className="font-body text-xs text-green-800 px-4">
                Dê dicas sobre esta palavra sem ser muito óbvio!
              </p>
            </>
          )}
        </div>
      </div>

      {/* Peel Layer - Tela de Instrução */}
      <motion.div
        style={{
          y: ySpring,
          opacity,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          boxShadow,
        }}
        className="absolute inset-0 bg-gradient-to-br from-board-cream to-white flex items-center justify-center touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        onClick={handleTap}
      >
        <div className="text-center w-full max-w-md px-4">
          {/* Avatar do Jogador */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-board-brown/20"
          >
            <Image
              src={currentPlayer.avatar || getDefaultAvatar()}
              alt={currentPlayer.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          </motion.div>
          
          {/* Nome do Jogador */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl mb-3 text-board-dark"
          >
            {currentPlayer.name}
          </motion.h2>

          {/* Instrução */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-body text-base text-board-brown/70 mb-6"
          >
            Puxe de baixo para cima para revelar
          </motion.p>

          {/* Indicador de Swipe */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-3xl"
          >
            ↑
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

