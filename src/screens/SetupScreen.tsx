import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import Toast from '../components/ui/Toast';
import AvatarSelector from '../components/ui/AvatarSelector';
import { themes } from '../lib/data/themes';
import { getDefaultAvatar } from '../lib/utils/avatars';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type SetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

const logoImage = require('../../assets/images/logo.png');

export default function SetupScreen() {
  const navigation = useNavigation<SetupScreenNavigationProp>();
  const {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerAvatar,
    startRound,
    loadSavedState,
  } = useGameState();

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState(getDefaultAvatar());
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarSelectorForPlayer, setAvatarSelectorForPlayer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadSavedState();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [loadSavedState]);

  const handleAddPlayer = () => {
    if (newPlayerName.trim() || players.length === 0) {
      addPlayer(newPlayerName || `Jogador ${players.length + 1}`, newPlayerAvatar);
      setNewPlayerName('');
      setNewPlayerAvatar(getDefaultAvatar());
      setShowAddPlayer(false);
    }
  };

  const handleOpenAvatarSelector = (playerId?: string) => {
    setAvatarSelectorForPlayer(playerId || null);
    setShowAvatarSelector(true);
  };

  const handleSelectAvatar = (avatar: any) => {
    if (avatarSelectorForPlayer) {
      updatePlayerAvatar(avatarSelectorForPlayer, avatar);
    } else {
      setNewPlayerAvatar(avatar);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      showToastMessage('Adicione pelo menos 3 jogadores');
      return;
    }

    // Usar sempre o primeiro tema (Animais)
    const theme = themes[0];
    if (!theme) {
      showToastMessage('Erro ao carregar tema');
      return;
    }

    startRound(theme);
    navigation.navigate('Playing');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Image source={logoImage} style={styles.loadingLogo} resizeMode="contain" />
      </SafeAreaView>
    );
  }

  const canStartGame = players.length >= 3;
  const maxPlayers = 8;
  const defaultTheme = themes[0]; // Sempre usar o primeiro tema

  const getThemeIcon = (themeName: string) => {
    const iconMap: Record<string, string> = {
      Animais: '🐾',
      Comida: '🍕',
      Objetos: '📦',
      Profissões: '💼',
      Esportes: '⚽',
      Países: '🌍',
      Cores: '🎨',
      Natureza: '🌳',
      Transporte: '🚗',
      Música: '🎵',
    };
    return iconMap[themeName] || '🎯';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Configuração</Text>
          </View>

          {/* Players Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Jogadores</Text>
              <Text style={styles.sectionSubtitle}>
                {players.length} de {maxPlayers} jogadores
              </Text>
            </View>

            {players.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowAddPlayer(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyButtonText}>Adicione jogadores</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.playersList}>
                {players.map((player, index) => (
                  <View key={player.id} style={styles.playerCard}>
                    <Text style={styles.playerNumber}>{index + 1}</Text>
                    <TouchableOpacity
                      onPress={() => handleOpenAvatarSelector(player.id)}
                      style={styles.playerAvatar}
                    >
                      <Image source={player.avatar} style={styles.avatarImage} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.playerName}
                      value={player.name}
                      onChangeText={(text) => updatePlayerName(player.id, text)}
                      placeholder="Nome do jogador"
                    />
                    <TouchableOpacity
                      onPress={() => removePlayer(player.id)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.impostor.default} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {players.length < maxPlayers && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddPlayer(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={24} color={colors.board.brown} />
                <Text style={styles.addButtonText}>Adicionar Jogador</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Theme Selection - Fixo (primeiro tema) */}
          {defaultTheme && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tema</Text>
              <View style={styles.themeButton}>
                <Text style={styles.themeIcon}>{getThemeIcon(defaultTheme.name)}</Text>
                <View style={styles.themeInfo}>
                  <Text style={styles.themeName}>{defaultTheme.name}</Text>
                  <Text style={styles.themeWords}>
                    {defaultTheme.words.length} palavras disponíveis
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Start Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.startButton, !canStartGame && styles.startButtonDisabled]}
            onPress={handleStartGame}
            disabled={!canStartGame}
            activeOpacity={0.8}
          >
            <Ionicons
              name="play"
              size={24}
              color={canStartGame ? colors.white : colors.board.brown + '80'}
            />
            <Text
              style={[
                styles.startButtonText,
                !canStartGame && styles.startButtonTextDisabled,
              ]}
            >
              Iniciar Jogo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Player Modal */}
        <Modal visible={showAddPlayer} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Jogador</Text>
              <TouchableOpacity
                style={styles.modalAvatarButton}
                onPress={() => handleOpenAvatarSelector()}
              >
                <Image source={newPlayerAvatar} style={styles.modalAvatar} />
              </TouchableOpacity>
              <TextInput
                style={styles.modalInput}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="Nome do jogador"
                onSubmitEditing={handleAddPlayer}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowAddPlayer(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleAddPlayer}
                >
                  <Text style={[styles.modalButtonText, { color: colors.white }]}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        {/* Avatar Selector */}
        {showAvatarSelector && (
          <AvatarSelector
            selectedAvatar={
              avatarSelectorForPlayer
                ? players.find((p) => p.id === avatarSelectorForPlayer)?.avatar
                : newPlayerAvatar
            }
            onSelect={handleSelectAvatar}
            onClose={() => {
              setShowAvatarSelector(false);
              setAvatarSelectorForPlayer(null);
            }}
          />
        )}

        <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.board.cream,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.board.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 300,
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.board.brown + '80',
  },
  emptyButton: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.board.brown + '50',
    alignItems: 'center',
  },
  emptyButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.board.brown,
    fontWeight: typography.fontWeight.bold,
  },
  playersList: {
    gap: spacing.sm,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius['card-lg'],
    marginBottom: spacing.sm,
  },
  playerNumber: {
    fontSize: typography.fontSize.lg,
    color: colors.board.brown + '60',
    marginRight: spacing.md,
    width: 24,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: spacing.md,
    borderWidth: 3,
    borderColor: colors.board.brown + '60',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  playerName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.board.brown,
  },
  removeButton: {
    padding: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.card,
    marginTop: spacing.sm,
  },
  addButtonText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.board.brown,
    fontWeight: typography.fontWeight.bold,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius['card-lg'],
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.board.brown + '50',
  },
  themeIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.xs,
  },
  themeWords: {
    fontSize: typography.fontSize.sm,
    color: colors.board.brown + '80',
  },
  themePlaceholder: {
    fontSize: typography.fontSize.lg,
    color: colors.board.brown + '60',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.board.cream,
    borderTopWidth: 1,
    borderTopColor: colors.board.brown + '20',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.innocent.card,
    borderRadius: borderRadius['card-lg'],
  },
  startButtonDisabled: {
    backgroundColor: colors.board.brown + '30',
  },
  startButtonText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  startButtonTextDisabled: {
    color: colors.board.brown + '80',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius['card-lg'],
    borderTopRightRadius: borderRadius['card-lg'],
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  modalCloseButton: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  modalAvatarButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.board.brown + '50',
    overflow: 'hidden',
  },
  modalAvatar: {
    width: '100%',
    height: '100%',
  },
  modalInput: {
    borderWidth: 2,
    borderColor: colors.board.brown,
    borderRadius: borderRadius['card-lg'],
    padding: spacing.md,
    fontSize: typography.fontSize.lg,
    color: colors.board.brown,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius['card-lg'],
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.board.brown + '20',
  },
  modalButtonConfirm: {
    backgroundColor: colors.innocent.card,
  },
  modalButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  themeModalContent: {
    maxHeight: '80%',
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.board.brown + '20',
  },
  themeItemSelected: {
    backgroundColor: colors.board.beige,
  },
  themeItemIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  themeItemInfo: {
    flex: 1,
  },
  themeItemName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
    marginBottom: spacing.xs,
  },
  themeItemWords: {
    fontSize: typography.fontSize.sm,
    color: colors.board.brown + '80',
  },
});

