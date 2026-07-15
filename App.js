import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { AnimalProvider } from './src/context/AnimalContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { colors } from './src/theme';

export default function App() {
  return (
    <AuthProvider>
      <AnimalProvider>
        <FavoritesProvider>
          <NotificationProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
              <AppNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </FavoritesProvider>
      </AnimalProvider>
    </AuthProvider>
  );
}
