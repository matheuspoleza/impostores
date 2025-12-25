/**
 * Utilitários de estilo para cartas do jogo
 */

export const cardVariants = {
  default: "bg-white dark:bg-board-dark text-board-dark dark:text-white",
  innocent: "bg-gradient-to-br from-innocent-card to-innocent-light text-white",
  impostor: "bg-gradient-to-br from-impostor-card to-impostor-light text-white",
  player: "bg-gradient-to-br from-board-cream to-white dark:from-board-dark dark:to-board-brown",
  theme: "bg-gradient-to-br from-blue-400 to-purple-500 text-white",
} as const;

export const cardSizes = {
  sm: "p-4 min-h-[120px]",
  md: "p-6 min-h-[200px]",
  lg: "p-8 min-h-[300px]",
  xl: "p-10 min-h-[400px]",
} as const;

export const cardShadows = {
  sm: "shadow-card",
  md: "shadow-card-lg",
  lg: "shadow-card-xl",
  xl: "shadow-card-3d",
} as const;

export const cardBorderRadius = {
  sm: "rounded-card",
  md: "rounded-card-lg",
  lg: "rounded-card-lg",
  xl: "rounded-card-lg",
} as const;

/**
 * Gera classes CSS para uma carta
 */
export function getCardClasses(
  variant: keyof typeof cardVariants = "default",
  size: keyof typeof cardSizes = "md"
): string {
  return `${cardVariants[variant]} ${cardSizes[size]} ${cardShadows[size]} ${cardBorderRadius[size]}`;
}

