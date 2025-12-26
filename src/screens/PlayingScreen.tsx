import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameState } from '../hooks/useGameState';
import GameCard from '../components/cards/GameCard';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type PlayingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Playing'>;

export default function PlayingScreen() {
  const navigation = useNavigation<PlayingScreenNavigationProp>();
  const {
    players,
    currentRound,
    currentRoundData,
    currentPlayerIndex,
    revealedPlayers,
    revealPlayerWord,
    nextPlayer,
  } = useGameState();

  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isImpostor = currentRoundData?.impostors.includes(currentPlayer?.id || '') || false;
  const allRevealed = players.every((p) => revealedPlayers.has(p.id));

  useEffect(() => {
    if (!currentRoundData || !currentPlayer) {
      navigation.replace('Setup');
      return;
    }

    setIsRevealed(revealedPlayers.has(currentPlayer.id));
  }, [currentPlayerIndex, currentRoundData, currentPlayer, revealedPlayers, navigation]);

  const handleReveal = () => {
    if (currentPlayer && !isRevealed) {
      revealPlayerWord(currentPlayer.id);
      setIsRevealed(true);
    }
  };

  const handleNext = () => {
    if (isRevealed) {
      if (allRevealed) {
        navigation.navigate('Voting');
      } else {
        nextPlayer();
        setIsRevealed(false);
      }
    }
  };

  if (!currentRoundData || !currentPlayer) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.roundText}>R{currentRound}</Text>
        <Text style={styles.themeText}>{currentRoundData.theme}</Text>
      </View>

      <View style={styles.content}>
        <GameCard
          variant={isRevealed ? (isImpostor ? 'impostor' : 'innocent') : 'default'}
          size="lg"
        >
          <View style={styles.cardContent}>
            {!isRevealed ? (
              <>
                <Text style={styles.playerName}>{currentPlayer.name}</Text>
                <Text style={styles.instruction}>Toque para revelar</Text>
                <TouchableOpacity onPress={handleReveal}>
                  <Text style={styles.tapHint}>👆 Tocar aqui</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.roleIcon}>{isImpostor ? '🕵️' : '✅'}</Text>
                <Text style={styles.roleTitle}>
                  {isImpostor ? 'Você é o IMPOSTOR!' : 'Você é INOCENTE!'}
                </Text>
                {isImpostor ? (
                  <>
                    <Text style={styles.themeLabel}>Tema:</Text>
                    <Text style={styles.secretWord}>{currentRoundData.theme}</Text>
                    <Text style={styles.instruction}>Descubra a palavra pelas dicas dos outros!</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.themeLabel}>Palavra secreta:</Text>
                    <Text style={styles.secretWord}>{currentRoundData.secretWord}</Text>
                    <Text style={styles.instruction}>Dê dicas sem dizer a palavra!</Text>
                  </>
                )}
                <TouchableOpacity onPress={handleNext}>
                  <Text style={styles.nextHint}>
                    {allRevealed ? 'Continuar para votação →' : 'Próximo jogador →'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </GameCard>
      </View>

      {!allRevealed && (
        <View style={styles.progress}>
          <Text style={styles.progressText}>
            {revealedPlayers.size} / {players.length} revelaram
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.board.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  roundText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
  },
  themeText: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.board.brown + '30',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  playerName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
    marginBottom: spacing.md,
  },
  instruction: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown + '80',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  tapHint: {
    fontSize: typography.fontSize.lg,
    color: colors.innocent.default,
    marginTop: spacing.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
  },
  roleIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  roleTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
    marginBottom: spacing.lg,
  },
  themeLabel: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown + '80',
    marginBottom: spacing.sm,
  },
  secretWord: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  nextHint: {
    fontSize: typography.fontSize.lg,
    color: colors.innocent.default,
    marginTop: spacing.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
  },
  progress: {
    padding: spacing.md,
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.board.brown + '80',
  },
});

