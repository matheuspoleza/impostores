// Tipografia - equivalente ao Tailwind config

export const typography = {
  fontFamily: {
    display: 'BebasNeue_400Regular', // Será carregada via expo-font
    body: 'Inter_400Regular',
    card: 'PlayfairDisplay_400Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

