/**
 * (tabs) Layout
 *
 * Expo Router Tabs layout with custom TabBar.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components/layout/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Party' }} />
      <Tabs.Screen name="anilog" options={{ title: 'Collection' }} />
      <Tabs.Screen name="logbook" options={{ title: 'Stamps', href: null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', href: null }} />
    </Tabs>
  );
}
