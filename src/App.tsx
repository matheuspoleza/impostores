import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import AppNavigator from './navigation/AppNavigator';

// Carregar fontes customizadas
async function loadFonts() {
  await Font.loadAsync({
    // As fontes serão carregadas depois, por enquanto usar sistema padrão
  });
}

export default function App() {
  useEffect(() => {
    loadFonts().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
