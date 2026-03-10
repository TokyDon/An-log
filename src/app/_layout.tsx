/**
 * Anilog Root Layout
 *
 * Sets up fonts, React Query provider, and root navigation.
 * v3: Plus Jakarta Sans replaces Playfair Display + DM Sans.
 */

import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../services/supabase/client';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync();

    // Single source of truth for all auth-driven routing.
    // INITIAL_SESSION fires on app load (session present or null).
    // SIGNED_IN fires after login/register.
    // SIGNED_OUT fires after signOut.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (!session) {
          router.replace('/(auth)');
        } else {
          if (!onboardingComplete) {
            router.replace('/onboarding');
          } else {
            router.replace('/(tabs)');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        router.replace('/(auth)');
      }
    });

    return () => subscription.unsubscribe();
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#FAFAF5' }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="animon/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}