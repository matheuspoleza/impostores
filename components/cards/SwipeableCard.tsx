"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import GameCard, { CardVariant, CardSize } from "./GameCard";
import { ReactNode } from "react";

interface SwipeableCardProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  threshold?: number;
  className?: string;
}

export default function SwipeableCard({
  children,
  variant = "default",
  size = "md",
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onClick,
  disabled = false,
  threshold = 80,
  className = "",
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-15, 15]);
  const opacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);

  const springConfig = { damping: 30, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [dx, dy], velocity: [vx, vy], first, last }) => {
      if (disabled) return;

      if (first) {
        setHasMoved(false);
      }

      setIsDragging(active);

      if (active) {
        // Verificar se houve movimento significativo
        if (Math.abs(mx) > 5 || Math.abs(my) > 5) {
          setHasMoved(true);
        }

        x.set(mx);
        y.set(my);

        // Determinar direção do swipe
        if (Math.abs(dx) > Math.abs(dy)) {
          setSwipeDirection(dx > 0 ? "right" : "left");
        } else if (Math.abs(dy) > 0) {
          setSwipeDirection(dy > 0 ? "down" : "up");
        }
      } else if (last) {
        // Verificar se o swipe foi suficiente
        const absX = Math.abs(mx);
        const absY = Math.abs(my);
        const absVx = Math.abs(vx);
        const absVy = Math.abs(vy);

        // Detectar swipe horizontal
        if (absX > threshold || absVx > 0.5) {
          if (mx > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (mx < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } 
        // Detectar swipe vertical
        else if (absY > threshold || absVy > 0.5) {
          if (my < 0 && onSwipeUp) {
            onSwipeUp();
          } else if (my > 0 && onSwipeDown) {
            onSwipeDown();
          }
        }
        // Se não houve movimento significativo, tratar como tap
        else if (!hasMoved && onClick && absX < 10 && absY < 10) {
          onClick();
        }

        // Reset position
        x.set(0);
        y.set(0);
        setSwipeDirection(null);
        setHasMoved(false);
      }
    },
    {
      axis: undefined, // Permitir movimento em todas as direções
      threshold: 5,
      filterTaps: false, // Permitir taps
    }
  );

  // Handler para tap simples (fallback)
  const handleClick = (e: React.MouseEvent) => {
    // Só executar onClick se não houve drag
    if (!disabled && onClick && !isDragging && !hasMoved) {
      onClick();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        x: xSpring,
        y: ySpring,
        rotate,
        opacity: isDragging ? opacity : 1,
      }}
      className={`relative swipeable ${className}`}
      {...bind()}
      onClick={handleClick}
    >
      <GameCard
        variant={variant}
        size={size}
        disabled={disabled}
        className={`
          ${isDragging ? "z-50" : ""}
          ${swipeDirection === "right" ? "bg-green-100" : ""}
          ${swipeDirection === "left" ? "bg-red-100" : ""}
          ${swipeDirection === "up" ? "bg-blue-100" : ""}
        `}
        onClick={undefined}
      >
        {children}
      </GameCard>
      
      {/* Indicadores de direção durante swipe */}
      {isDragging && (
        <>
          {swipeDirection === "right" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none"
            >
              <span className="text-6xl">→</span>
            </motion.div>
          )}
          {swipeDirection === "left" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 flex items-center justify-start pl-8 pointer-events-none"
            >
              <span className="text-6xl">←</span>
            </motion.div>
          )}
          {swipeDirection === "up" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none"
            >
              <span className="text-6xl">↑</span>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

