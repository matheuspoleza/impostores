import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function Button({
  children,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const variantStyles = {
    primary: { backgroundColor: colors.innocent.default },
    secondary: { backgroundColor: colors.board.brown },
    danger: { backgroundColor: colors.impostor.default },
    success: { backgroundColor: colors.innocent.default },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36 },
    md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 44 },
    lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, minHeight: 52 },
  };

  const textSizeStyles = {
    sm: { fontSize: typography.fontSize.sm },
    md: { fontSize: typography.fontSize.base },
    lg: { fontSize: typography.fontSize.lg },
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.base,
          variantStyles[variant],
          sizeStyles[size],
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, textSizeStyles[size], { color: colors.white }]}>
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.display,
  },
});
