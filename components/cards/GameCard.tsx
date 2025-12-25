"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export type CardVariant = "default" | "innocent" | "impostor" | "player" | "theme";
export type CardSize = "sm" | "md" | "lg" | "xl";

interface GameCardProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  flipped?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  motionProps?: HTMLMotionProps<"div">;
}

export default function GameCard({
  children,
  variant = "default",
  size = "md",
  flipped = false,
  className = "",
  onClick,
  disabled = false,
  motionProps,
}: GameCardProps) {
  const baseClasses = "relative overflow-hidden card-texture card-paper";
  
  const sizeClasses = {
    sm: "p-4 rounded-card min-h-[120px]",
    md: "p-6 rounded-card-lg min-h-[200px]",
    lg: "p-8 rounded-card-lg min-h-[300px]",
    xl: "p-10 rounded-card-lg min-h-[400px]",
  };

  const variantClasses = {
    default: "bg-white text-board-dark border-2 border-board-brown",
    innocent: "bg-gradient-to-br from-green-50 to-green-100 text-green-900 border-4 border-innocent-card shadow-[0_0_0_4px_rgba(16,185,129,0.2)]",
    impostor: "bg-gradient-to-br from-red-50 to-red-100 text-red-900 border-4 border-impostor-card shadow-[0_0_0_4px_rgba(239,68,68,0.2)]",
    player: "bg-gradient-to-br from-board-cream to-white text-board-dark border-2 border-board-brown",
    theme: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border-4 border-blue-600",
  };

  const shadowClasses = {
    sm: "shadow-card",
    md: "shadow-card-lg",
    lg: "shadow-card-xl",
    xl: "shadow-card-3d",
  };

  const Component = motion.div;
  const defaultMotionProps = {
    whileHover: disabled ? {} : { scale: 1.02, y: -4 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
    ...motionProps,
  };

  return (
    <Component
      {...defaultMotionProps}
      onClick={disabled ? undefined : onClick}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${shadowClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative h-full w-full">
        {children}
      </div>
    </Component>
  );
}

