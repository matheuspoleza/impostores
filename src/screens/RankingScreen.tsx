import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameState } from '../hooks/useGameState';
import GameCard from '../components/cards/GameCard';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type RankingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Ranking'>;

export default function RankingScreen() {
  const navigation = useNavigation<RankingScreenNavigationProp>();
  const { players, rounds, newGame } = useGameState();

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}º`;
  };

  const handleNewGame = async () => {
    await newGame();
    navigation.replace('Setup');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ranking Final</Text>

        {winner && (
          <GameCard variant="innocent" size="md" style={styles.winnerCard}>
            <Text style={styles.winnerLabel}>🏆 Vencedor 🏆</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>{winner.totalScore} pontos</Text>
          </GameCard>
        )}

        <View style={styles.rankingList}>
          {sortedPlayers.map((player, index) => (
            <View
              key={player.id}
              style={[styles.rankingItem, index === 0 && styles.rankingItemFirst]}
            >
              <Text style={styles.medal}>{getMedal(index)}</Text>
              <Image source={player.avatar} style={styles.rankingAvatar} />
              <View style={styles.rankingInfo}>
                <Text style={styles.rankingName}>{player.name}</Text>
                <Text style={styles.rankingScore}>{player.totalScore} pontos</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.roundsText}>Total de rodadas: {rounds.length}</Text>

        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame} activeOpacity={0.8}>
          <Text style={styles.newGameButtonText}>Novo Jogo</Text>
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
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  winnerCard: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    padding: spacing.lg,
  },
  winnerLabel: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.sm,
  },
  winnerName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.sm,
  },
  winnerScore: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.innocent.default,
  },
  rankingList: {
    marginBottom: spacing.xl,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    marginBottom: spacing.sm,
  },
  rankingItemFirst: {
    backgroundColor: colors.ranking.gold + '30',
  },
  medal: {
    fontSize: typography.fontSize['2xl'],
    marginRight: spacing.md,
    width: 40,
    textAlign: 'center',
  },
  rankingAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.xs,
  },
  rankingScore: {
    fontSize: typography.fontSize.sm,
    color: colors.board.brown + '80',
  },
  roundsText: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown + '80',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  newGameButton: {
    padding: spacing.lg,
    backgroundColor: colors.innocent.card,
    borderRadius: borderRadius['card-lg'],
    alignItems: 'center',
  },
  newGameButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

