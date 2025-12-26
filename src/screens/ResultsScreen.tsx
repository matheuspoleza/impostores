import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameState } from '../hooks/useGameState';
import GameCard from '../components/cards/GameCard';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { players, currentRound, currentRoundData, rounds, nextRound, finishGame } = useGameState();

  useEffect(() => {
    if (!currentRoundData) {
      navigation.replace('Setup');
    }
  }, [currentRoundData, navigation]);

  if (!currentRoundData) {
    return null;
  }

  const impostors = players.filter((p) => currentRoundData.impostors.includes(p.id));

  const getVoteCount = (playerId: string) => {
    return Object.values(currentRoundData.votes).filter((votes) =>
      votes.includes(playerId)
    ).length;
  };

  const voteResults = players
    .map((p) => ({ player: p, votes: getVoteCount(p.id) }))
    .sort((a, b) => b.votes - a.votes);

  const handleNextRound = () => {
    nextRound();
    navigation.navigate('Setup');
  };

  const handleFinishGame = () => {
    finishGame();
    navigation.navigate('Ranking');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Resultados - Rodada {currentRound}</Text>

        <GameCard variant="default" size="md" style={styles.wordCard}>
          <Text style={styles.wordLabel}>Palavra Secreta:</Text>
          <Text style={styles.wordText}>{currentRoundData.secretWord}</Text>
        </GameCard>

        <View style={styles.impostorsSection}>
          <Text style={styles.sectionTitle}>Impostores:</Text>
          {impostors.map((impostor) => (
            <Text key={impostor.id} style={styles.impostorName}>
              🕵️ {impostor.name}
            </Text>
          ))}
        </View>

        <View style={styles.votesSection}>
          <Text style={styles.sectionTitle}>Votos Recebidos:</Text>
          {voteResults.map(({ player, votes }) => (
            <View key={player.id} style={styles.voteItem}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.voteCount}>{votes} voto(s)</Text>
            </View>
          ))}
        </View>

        <View style={styles.scoresSection}>
          <Text style={styles.sectionTitle}>Pontuação da Rodada:</Text>
          {players.map((player) => {
            const score = currentRoundData.scores[player.id] || 0;
            return (
              <View key={player.id} style={styles.scoreItem}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={[styles.scoreValue, score >= 0 ? styles.scorePositive : styles.scoreNegative]}>
                  {score > 0 ? '+' : ''}{score}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleNextRound} activeOpacity={0.8}>
            <Text style={styles.actionButtonText}>Próxima Rodada</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={handleFinishGame}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              Finalizar Jogo
            </Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
    marginBottom: spacing.xl,
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
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
  },
  impostorsSection: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.board.brown,
    marginBottom: spacing.md,
  },
  impostorName: {
    fontSize: typography.fontSize.base,
    color: colors.impostor.default,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
  },
  votesSection: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
  },
  voteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.board.brown + '20',
  },
  playerName: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown,
  },
  voteCount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  scoresSection: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.board.brown + '20',
  },
  scoreValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  scorePositive: {
    color: colors.innocent.default,
  },
  scoreNegative: {
    color: colors.impostor.default,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    padding: spacing.lg,
    backgroundColor: colors.innocent.card,
    borderRadius: borderRadius['card-lg'],
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: colors.board.brown + '30',
  },
  actionButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.white,
  },
  actionButtonTextSecondary: {
    color: colors.board.brown,
  },
});

