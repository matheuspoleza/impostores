import React, { useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image, Animated } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { getAvailableAvatars } from '../../lib/utils/avatars';

interface AvatarSelectorProps {
  selectedAvatar?: any;
  onSelect: (avatar: any) => void;
  onClose: () => void;
}

export default function AvatarSelector({
  selectedAvatar,
  onSelect,
  onClose,
}: AvatarSelectorProps) {
  const avatars = getAvailableAvatars();

  const handleSelect = (avatar: any) => {
    onSelect(avatar);
    onClose();
  };

  const AvatarItem = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedAvatar === item;
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[styles.avatarItem, isSelected && styles.avatarSelected]}
          onPress={() => handleSelect(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Image source={item} style={styles.avatarImage} resizeMode="cover" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Selecione um Avatar</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.headerButton}>Concluir</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={avatars}
            renderItem={({ item, index }) => <AvatarItem item={item} index={index} />}
            numColumns={4}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius['card-lg'],
    borderTopRightRadius: borderRadius['card-lg'],
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.board.brown + '20',
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  headerButton: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.board.brown,
  },
  grid: {
    padding: spacing.md,
  },
  avatarItem: {
    width: '22%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: borderRadius.card,
    borderWidth: 2,
    borderColor: colors.board.brown + '50',
    overflow: 'hidden',
  },
  avatarSelected: {
    borderColor: colors.innocent.card,
    borderWidth: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
