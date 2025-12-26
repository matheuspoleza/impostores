import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../styles/colors';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const logoImage = require('../../assets/images/logo.png');

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navegar para Setup após 2 segundos
    const timer = setTimeout(() => {
      navigation.replace('Setup');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.board.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 300,
    height: 300,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

