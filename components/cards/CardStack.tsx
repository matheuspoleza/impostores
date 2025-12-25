"use client";

import { motion, AnimatePresence } from "framer-motion";
import GameCard, { CardVariant, CardSize } from "./GameCard";
import { ReactNode } from "react";

interface CardStackProps {
  cards: Array<{
    id: string;
    content: ReactNode;
    variant?: CardVariant;
  }>;
  size?: CardSize;
  maxVisible?: number;
  className?: string;
  onCardClick?: (cardId: string) => void;
}

export default function CardStack({
  cards,
  size = "md",
  maxVisible = 3,
  className = "",
  onCardClick,
}: CardStackProps) {
  const visibleCards = cards.slice(0, maxVisible);
  const remainingCount = Math.max(0, cards.length - maxVisible);

  return (
    <div className={`relative ${className}`} style={{ height: "400px" }}>
      {visibleCards.map((card, index) => {
        const offset = index * 8;
        const zIndex = visibleCards.length - index;
        const scale = 1 - index * 0.05;
        const yOffset = index * 4;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: yOffset,
              scale,
              x: offset,
            }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex,
            }}
            className="w-full"
          >
            <GameCard
              variant={card.variant}
              size={size}
              onClick={onCardClick ? () => onCardClick(card.id) : undefined}
              className="w-full"
            >
              {card.content}
            </GameCard>
          </motion.div>
        );
      })}

      {/* Indicador de cartas restantes */}
      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 z-50"
        >
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">
            +{remainingCount}
          </div>
        </motion.div>
      )}
    </div>
  );
}

