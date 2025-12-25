"use client";

import { motion } from "framer-motion";

interface VoteButtonProps {
  playerName: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoteButton({
  playerName,
  isSelected,
  onClick,
  disabled = false,
}: VoteButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled || isSelected ? {} : { scale: 1.05 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        min-h-[44px]
        ${
          isSelected
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {playerName}
    </motion.button>
  );
}
