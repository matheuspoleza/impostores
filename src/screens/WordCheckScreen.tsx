import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameState } from '../hooks/useGameState';
import GameCard from '../components/cards/GameCard';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type WordCheckScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WordCheck'>;

export default function WordCheckScreen() {
  const navigation = useNavigation<WordCheckScreenNavigationProp>();
  const { players, currentRoundData, setWordCheck, finishRound } = useGameState();

  useEffect(() => {
    if (!currentRoundData) {
      navigation.replace('Setup');
    }
  }, [currentRoundData, navigation]);

  if (!currentRoundData) {
    return null;
  }

  const impostors = players.filter((p) => currentRoundData.impostors.includes(p.id));

  const allChecked = impostors.every((impostor) =>
    currentRoundData.wordCheck.hasOwnProperty(impostor.id)
  );

  const handleToggle = (impostorId: string, currentValue: boolean) => {
    setWordCheck(impostorId, !currentValue);
  };

  const handleContinue = () => {
    if (allChecked) {
      finishRound();
      navigation.navigate('Results');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <GameCard variant="default" size="md" style={styles.wordCard}>
          <Text style={styles.wordLabel}>Palavra Secreta:</Text>
          <Text style={styles.wordText}>{currentRoundData.secretWord}</Text>
        </GameCard>

        <Text style={styles.title}>Os impostores falaram a palavra?</Text>
        <Text style={styles.subtitle}>Marque quais impostores falaram a palavra secreta</Text>

        {impostors.map((impostor) => {
          const spokeWord = currentRoundData.wordCheck[impostor.id] || false;
          return (
            <View key={impostor.id} style={styles.impostorItem}>
              <Text style={styles.impostorName}>{impostor.name}</Text>
              <Switch
                value={spokeWord}
                onValueChange={() => handleToggle(impostor.id, spokeWord)}
                trackColor={{ false: colors.board.brown + '30', true: colors.impostor.default }}
                thumbColor={colors.white}
              />
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.continueButton, !allChecked && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!allChecked}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {allChecked ? 'Ver Resultados' : 'Marque todos os impostores'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.board.cream,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  wordCard: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    padding: spacing.lg,
  },
  wordLabel: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown + '80',
    marginBottom: spacing.sm,
  },
  wordText: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown + '80',
    marginBottom: spacing.xl,
  },
  impostorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
  },
  impostorName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  continueButton: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.innocent.card,
    borderRadius: borderRadius['card-lg'],
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.board.brown + '30',
  },
  continueButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

