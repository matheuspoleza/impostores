import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Ou um componente de loading
  }

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
