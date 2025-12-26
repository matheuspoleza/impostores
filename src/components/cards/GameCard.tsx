import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

export type CardVariant = 'default' | 'innocent' | 'impostor' | 'player' | 'theme';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface GameCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  flipped?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function GameCard({
  children,
  variant = 'default',
  size = 'md',
  flipped = false,
  style,
  disabled = false,
}: GameCardProps) {
  const sizeStyles = {
    sm: { padding: spacing.md, minHeight: 120, borderRadius: borderRadius.card },
    md: { padding: spacing.lg, minHeight: 200, borderRadius: borderRadius['card-lg'] },
    lg: { padding: spacing.xl, minHeight: 300, borderRadius: borderRadius['card-lg'] },
    xl: { padding: spacing['2xl'], minHeight: 400, borderRadius: borderRadius['card-lg'] },
  };

  const variantStyles: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: colors.white,
      borderWidth: 2,
      borderColor: colors.board.brown,
    },
    innocent: {
      backgroundColor: colors.innocent.card,
      borderWidth: 4,
      borderColor: colors.innocent.dark,
    },
    impostor: {
      backgroundColor: colors.impostor.card,
      borderWidth: 4,
      borderColor: colors.impostor.dark,
    },
    player: {
      backgroundColor: colors.board.beige,
      borderWidth: 2,
      borderColor: colors.board.brown,
    },
    theme: {
      backgroundColor: colors.board.beige, // Creme da paleta
      borderWidth: 4,
      borderColor: colors.ranking.silver, // Turquesa da paleta
    },
  };

  const shadowStyle = {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  };

  return (
    <View
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        shadowStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});

