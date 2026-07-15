import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import VetsScreen from '../screens/VetsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportScreen from '../screens/ReportScreen';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import AddAnimalScreen from '../screens/AddAnimalScreen';
import ComplaintScreen from '../screens/ComplaintScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
      {focused && (
        <View style={{
          width: 4, height: 4, borderRadius: 2,
          backgroundColor: colors.primary, marginTop: 2,
        }} />
      )}
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: typography.weight.medium,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Harita',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Vets"
        component={VetsScreen}
        options={{
          tabBarLabel: 'Veteriner',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profilim',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Complaint"
        component={ComplaintScreen}
        options={{
          tabBarLabel: 'Şikayet Et',
          tabBarActiveTintColor: '#B71C1C',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>🚨</Text>
              {focused && (
                <View style={{
                  width: 4, height: 4, borderRadius: 2,
                  backgroundColor: '#B71C1C', marginTop: 2,
                }} />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function SplashScreen() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ fontSize: 64, marginBottom: 12 }}>🐾</Text>
      <Text style={{
        color: colors.white,
        fontSize: 36,
        fontWeight: typography.weight.bold,
        letterSpacing: 1,
        marginBottom: 24,
      }}>
        Pati
      </Text>
      <ActivityIndicator size="large" color={colors.white} />
    </View>
  );
}

export default function AppNavigator() {
  const { user, isRestoring } = useAuth();

  // Kayıtlı oturum SecureStore'dan yüklenirken login ekranı flaşını önle
  if (isRestoring) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={HomeTabs} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
      <Stack.Screen name="AddAnimal" component={AddAnimalScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
