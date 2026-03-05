/**
 * TabBar
 *
 * Skeuomorphic device control panel — BioField Scanner MK-II bottom edge.
 * Dark bezel, brushed-metal top border, LED status dots, raised camera disc.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  index:      { icon: '⊙', label: 'DISCOVER' },
  anilog:     { icon: '⊛', label: 'ANÍLOG' },
  milestones: { icon: '◈', label: 'MILESTONES' },
  profile:    { icon: '◉', label: 'PROFILE' },
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Rivet detail — top-left */}
      <View style={styles.rivetLeft} />
      {/* Rivet detail — top-right */}
      <View style={styles.rivetRight} />

      {/* Left two tabs */}
      {state.routes.slice(0, 2).map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          isFocused={state.index === index}
          onPress={() => navigation.navigate(route.name)}
          descriptors={descriptors}
        />
      ))}

      {/* Centre elevated camera button */}
      <View style={styles.cameraGap}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push('/camera')}
          activeOpacity={0.82}
        >
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Right two tabs */}
      {state.routes.slice(2, 4).map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          isFocused={state.index === index + 2}
          onPress={() => navigation.navigate(route.name)}
          descriptors={descriptors}
        />
      ))}
    </View>
  );
}

function TabItem({
  route,
  isFocused,
  onPress,
  descriptors,
}: {
  route: { key: string; name: string };
  isFocused: boolean;
  onPress: () => void;
  descriptors: BottomTabBarProps['descriptors'];
}) {
  const config = TAB_CONFIG[route.name];
  const label = config?.label ?? route.name.toUpperCase();
  const icon = config?.icon ?? '·';

  return (
    <TouchableOpacity
      style={[styles.tab, isFocused && styles.tabActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
    >
      {/* LED dot */}
      <View style={[styles.led, isFocused && styles.ledActive]} />
      <Text
        style={[
          styles.tabIcon,
          isFocused ? styles.tabIconActive : styles.tabIconInactive,
        ]}
      >
        {icon}
      </Text>
      <Text
        style={[
          styles.tabLabel,
          isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.deviceBezel,
    borderTopWidth: 2,
    borderTopColor: colors.metalBrush,
    paddingTop: 10,
    minHeight: 72,
    position: 'relative',
  },
  // Rivet decorations
  rivetLeft: {
    position: 'absolute',
    top: 7,
    left: 10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.metalBrushLight,
  },
  rivetRight: {
    position: 'absolute',
    top: 7,
    right: 10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.metalBrushLight,
  },
  // Tab items
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    gap: 3,
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: colors.scannerGreenGlow,
    marginTop: -2,
  },
  // LED dot
  led: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.deviceBody,
    marginBottom: 2,
  },
  ledActive: {
    backgroundColor: colors.scannerGreenGlow,
    shadowColor: colors.scannerGreenGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 6,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: { color: colors.scannerGreenGlow },
  tabIconInactive: { color: colors.metalBrushLight },
  tabLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  tabLabelActive: { color: colors.scannerGreenGlow },
  tabLabelInactive: { color: colors.metalBrushLight },
  // Camera disc
  cameraGap: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  cameraButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.scannerGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    borderWidth: 2,
    borderColor: colors.scannerGreenGlow,
    shadowColor: colors.scannerGreenGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.60,
    shadowRadius: 8,
    elevation: 12,
  },
  cameraIcon: { fontSize: 24 },
});
