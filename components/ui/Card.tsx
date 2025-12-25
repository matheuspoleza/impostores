"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "innocent" | "impostor";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}: CardProps) {
  const baseClasses = "rounded-xl p-6 shadow-lg";
  
  const variantClasses = {
    default: "bg-white text-gray-900",
    innocent: "bg-innocent-light text-white",
    impostor: "bg-impostor-light text-white",
  };

  const Component = onClick ? motion.div : "div";
  const motionProps = onClick
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick,
        className: "cursor-pointer",
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Component>
  );
}
