"use client";

import { motion } from "framer-motion";
import { Player } from "@/types/game";

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  variant?: "default" | "selected" | "disabled";
  showScore?: boolean;
}

export default function PlayerCard({
  player,
  onClick,
  variant = "default",
  showScore = false,
}: PlayerCardProps) {
  const baseClasses = "rounded-lg p-4 border-2 transition-all";
  
  const variantClasses = {
    default: "bg-white border-gray-300",
    selected: "bg-blue-100 border-blue-500",
    disabled: "bg-gray-100 border-gray-400 opacity-50",
  };

  const Component = onClick && variant !== "disabled" ? motion.div : "div";
  const motionProps =
    onClick && variant !== "disabled"
      ? {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick,
          className: "cursor-pointer",
        }
      : {};

  return (
    <Component
      {...motionProps}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">{player.name}</span>
        {showScore && (
          <span className="text-sm font-bold text-blue-600">
            {player.totalScore} pts
          </span>
        )}
      </div>
    </Component>
  );
}
