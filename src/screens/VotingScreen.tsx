import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameState } from '../hooks/useGameState';
import { validateAllVoted } from '../lib/game/gameLogic';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type VotingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Voting'>;

export default function VotingScreen() {
  const navigation = useNavigation<VotingScreenNavigationProp>();
  const { players, currentRoundData, vote, removeVote } = useGameState();

  const [currentVoterIndex, setCurrentVoterIndex] = React.useState(0);
  const currentVoter = players[currentVoterIndex];

  useEffect(() => {
    if (!currentRoundData) {
      navigation.replace('Setup');
    }
  }, [currentRoundData, navigation]);

  if (!currentRoundData || !currentVoter) {
    return null;
  }

  // Filtrar jogadores que não são o votante atual
  const votablePlayers = players.filter((p) => p.id !== currentVoter.id);

  const currentVotes = currentRoundData.votes[currentVoter.id] || [];
  const allVoted = validateAllVoted(currentRoundData, players);

  const handleVote = (targetId: string) => {
    if (currentVotes.includes(targetId)) {
      removeVote(currentVoter.id, targetId);
    } else {
      vote(currentVoter.id, targetId);
    }
  };

  const handleNextVoter = () => {
    if (currentVoterIndex < players.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    }
  };

  const handlePreviousVoter = () => {
    if (currentVoterIndex > 0) {
      setCurrentVoterIndex(currentVoterIndex - 1);
    }
  };

  const getVoteCount = (playerId: string) => {
    return Object.values(currentRoundData.votes).filter((votes) =>
      votes.includes(playerId)
    ).length;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Votação</Text>
        <Text style={styles.subtitle}>
          {currentVoter.name} - Selecione quem você suspeita
        </Text>
        <Text style={styles.voterInfo}>
          Jogador {currentVoterIndex + 1} de {players.length}
        </Text>

        <FlatList
          data={votablePlayers}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item: player }) => {
            const voteCount = getVoteCount(player.id);
            const isSelected = currentVotes.includes(player.id);

            return (
              <TouchableOpacity
                style={[styles.playerCard, isSelected && styles.playerCardSelected]}
                onPress={() => handleVote(player.id)}
                activeOpacity={0.8}
              >
                <Image source={player.avatar} style={styles.avatar} />
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.voteCount}>{voteCount} voto(s)</Text>
              </TouchableOpacity>
            );
          }}
          scrollEnabled={false}
        />

        {/* Navigation between voters */}
        <View style={styles.voterNavigation}>
          {currentVoterIndex > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePreviousVoter}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>← Anterior</Text>
            </TouchableOpacity>
          )}
          {currentVoterIndex < players.length - 1 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextVoter}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>Próximo →</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !allVoted && styles.continueButtonDisabled]}
          onPress={() => {
            if (allVoted) {
              navigation.navigate('WordCheck');
            }
          }}
          disabled={!allVoted}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {allVoted ? 'Continuar' : 'Aguardando todos votarem...'}
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
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.board.brown + '80',
    marginBottom: spacing.xl,
  },
  playerCard: {
    flex: 1,
    margin: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.board.brown + '30',
  },
  playerCardSelected: {
    borderColor: colors.innocent.card,
    borderWidth: 3,
    backgroundColor: colors.innocent.light + '30',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.sm,
  },
  playerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.xs,
  },
  voteCount: {
    fontSize: typography.fontSize.sm,
    color: colors.board.brown + '80',
  },
  voterInfo: {
    fontSize: typography.fontSize.sm,
    color: colors.board.brown + '60',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  voterNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.board.brown + '30',
  },
  navButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
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

