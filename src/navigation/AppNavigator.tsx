import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SetupScreen from '../screens/SetupScreen';
import PlayingScreen from '../screens/PlayingScreen';
import VotingScreen from '../screens/VotingScreen';
import WordCheckScreen from '../screens/WordCheckScreen';
import ResultsScreen from '../screens/ResultsScreen';
import RankingScreen from '../screens/RankingScreen';

export type RootStackParamList = {
  Splash: undefined;
  Setup: undefined;
  Playing: undefined;
  Voting: undefined;
  WordCheck: undefined;
  Results: undefined;
  Ranking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Playing" component={PlayingScreen} />
      <Stack.Screen name="Voting" component={VotingScreen} />
      <Stack.Screen name="WordCheck" component={WordCheckScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
    </Stack.Navigator>
  );
}

