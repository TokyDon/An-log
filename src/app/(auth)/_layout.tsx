/**
 * Auth Stack Layout
 *
 * Stack navigator for the auth screens.
 * No header chrome — screens manage their own back buttons.
 */

import { Stack } from 'expo-router';
import { colors } from '../../constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
