import { Round, Player } from "@/types/game";
import { Theme } from "@/types/game";

/**
 * Calcula o número de impostores baseado em 30% dos jogadores (mínimo 1)
 */
export function calculateImpostorCount(totalPlayers: number): number {
  const impostorCount = Math.ceil(totalPlayers * 0.3);
  return Math.max(1, impostorCount);
}

/**
 * Seleciona impostores aleatórios de uma lista de jogadores
 */
export function selectImpostors(
  players: Player[],
  impostorCount: number
): string[] {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, impostorCount).map((p) => p.id);
}

/**
 * Seleciona uma palavra aleatória de um tema
 */
export function selectRandomWord(theme: Theme): string {
  const randomIndex = Math.floor(Math.random() * theme.words.length);
  return theme.words[randomIndex];
}

/**
 * Calcula a pontuação de um jogador inocente
 */
export function calculateInnocentScore(
  playerId: string,
  round: Round,
  allPlayers: Player[]
): number {
  const playerVotes = round.votes[playerId] || [];
  const impostorIds = round.impostors;
  
  // Contar quantos impostores foram acertados
  const correctVotes = playerVotes.filter((votedId) =>
    impostorIds.includes(votedId)
  ).length;

  // Verificar se TODOS os outros inocentes votaram nele
  const innocentPlayers = allPlayers.filter(
    (p) => !impostorIds.includes(p.id)
  );
  const otherInnocents = innocentPlayers.filter((p) => p.id !== playerId);
  
  const allVotedOnPlayer = otherInnocents.every((innocent) => {
    const innocentVotes = round.votes[innocent.id] || [];
    return innocentVotes.includes(playerId);
  });

  // Penalidade: todos os outros inocentes votaram nele
  if (allVotedOnPlayer && otherInnocents.length > 0) {
    return -1;
  }

  // Acertou TODOS os impostores
  if (correctVotes === impostorIds.length && impostorIds.length > 0) {
    return 5;
  }

  // Acertou ALGUNS impostores
  if (correctVotes > 0) {
    return 2;
  }

  // Errou todos
  return 0;
}

/**
 * Calcula a pontuação de um jogador impostor
 */
export function calculateImpostorScore(
  playerId: string,
  round: Round,
  allPlayers: Player[]
): number {
  const wordCheck = round.wordCheck[playerId] || false;
  
  // Penalidade: falou a palavra
  if (wordCheck) {
    return -1;
  }

  // Contar quantos votos o impostor recebeu
  const votesReceived = Object.values(round.votes).filter((votes) =>
    votes.includes(playerId)
  ).length;

  // Contar quantos votos cada impostor recebeu
  const impostorVoteCounts = round.impostors.map((impostorId) => ({
    id: impostorId,
    votes: Object.values(round.votes).filter((votes) =>
      votes.includes(impostorId)
    ).length,
  }));

  const maxVotes = Math.max(...impostorVoteCounts.map((iv) => iv.votes), 0);

  // Não foi descoberto (0 votos ou menos votos que outros)
  if (votesReceived === 0 || votesReceived < maxVotes) {
    return 5;
  }

  // Foi descoberto mas não foi o mais votado (empate no máximo)
  if (votesReceived === maxVotes) {
    const playersWithMaxVotes = impostorVoteCounts.filter(
      (iv) => iv.votes === maxVotes
    );
    if (playersWithMaxVotes.length > 1) {
      return 2;
    }
  }

  // Foi o mais votado
  if (votesReceived === maxVotes && votesReceived > 0) {
    return 0;
  }

  return 2; // Default: foi descoberto mas não o mais votado
}

/**
 * Calcula todas as pontuações da rodada
 */
export function calculateRoundScores(
  round: Round,
  players: Player[]
): Record<string, number> {
  const scores: Record<string, number> = {};

  players.forEach((player) => {
    if (round.impostors.includes(player.id)) {
      scores[player.id] = calculateImpostorScore(player.id, round, players);
    } else {
      scores[player.id] = calculateInnocentScore(player.id, round, players);
    }
  });

  return scores;
}

/**
 * Valida se todos os jogadores votaram
 */
export function validateAllVoted(
  round: Round,
  players: Player[]
): boolean {
  const expectedVotesCount = calculateImpostorCount(players.length);
  
  return players.every((player) => {
    const votes = round.votes[player.id] || [];
    return votes.length === expectedVotesCount;
  });
}

/**
 * Valida se um jogador pode votar em outro
 */
export function canVoteFor(
  voterId: string,
  targetId: string,
  currentVotes: string[],
  maxVotes: number
): boolean {
  // Não pode votar em si mesmo
  if (voterId === targetId) {
    return false;
  }

  // Não pode votar duas vezes na mesma pessoa
  if (currentVotes.includes(targetId)) {
    return false;
  }

  // Não pode exceder o número máximo de votos
  if (currentVotes.length >= maxVotes) {
    return false;
  }

  return true;
}
