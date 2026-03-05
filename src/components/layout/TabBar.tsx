/**
 * TabBar â€” Field Naturalist Edition v2
 *
 * Physical instrument panel aesthetic:
 * - deviceBezel background (dark)
 * - 2px instrumentBrass top border (not metalBrush)
 * - Amber LED indicator dots (4px) â€” NOT green LEDs
 * - Icons: âŠ™ / âŠž / â—ˆ / â—‰  (âŠž for AnÃ­log = grid/collection)
 * - Camera disc: text aperture character, not emoji
 * - amberGlow active state for icons + labels
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  index:      { icon: 'âŠ™', label: 'DISCOVER' },
  anilog:     { icon: 'âŠž', label: 'ANÃLOG' },
  milestones: { icon: 'â—ˆ', label: 'MILESTONES' },
  profile:    { icon: 'â—‰', label: 'PROFILE' },
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* 2px brass top rule */}
      <View style={styles.brassRule} />

      {/* Rivet details â€” physical panel feel */}
      <View style={styles.rivetLeft} />
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

      {/* Centre camera disc */}
      <View style={styles.cameraGap}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push('/camera')}
          activeOpacity={0.82}
        >
          {/* Aperture text character â€” not emoji */}
          <Text style={styles.cameraAperture}>â—Ž</Text>
          <Text style={styles.cameraLabel}>SCAN</Text>
        </TouchableOpacity>
      </View>

      {/* Right two tabs */}
      {state.routes.slice(2).map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          isFocused={state.index === (index + 2)}
          onPress={() => navigation.navigate(route.name)}
          descriptors={descriptors}
        />
      ))}
    </View>
  );
}

interface TabItemProps {
  route: { key: string; name: string };
  isFocused: boolean;
  onPress: () => void;
  descriptors: BottomTabBarProps['descriptors'];
}

function TabItem({ route, isFocused, onPress }: TabItemProps) {
  const config = TAB_CONFIG[route.name];
  if (!config) return null;

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Amber LED indicator dot */}
      <View
        style={[
          styles.ledDot,
          isFocused ? styles.ledActive : styles.ledInactive,
        ]}
      />
      <Text
        style={[
          styles.tabIcon,
          isFocused ? styles.iconActive : styles.iconInactive,
        ]}
      >
        {config.icon}
      </Text>
      <Text
        style={[
          styles.tabLabel,
          isFocused ? styles.labelActive : styles.labelInactive,
        ]}
      >
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.deviceBezel,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    // Brass rule replaces borderTopWidth here â€” rendered as child View
    position: 'relative',
  },

  // 2px instrumentBrass rule at top of bar
  brassRule: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.instrumentBrass,
  },

  // Rivet details â€” small circles near top corners
  rivetLeft: {
    position: 'absolute',
    top: 6,
    left: 12,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.instrumentBrassLight,
  },
  rivetRight: {
    position: 'absolute',
    top: 6,
    right: 12,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.instrumentBrassLight,
  },

  // Tab item
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 4,
    gap: 3,
  },

  // Amber LED dot
  ledDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  ledActive: {
    backgroundColor: colors.amberGlow,
    opacity: 1,
    shadowColor: colors.amberGlow,
    shadowRadius: 5,
    shadowOpacity: 0.9,
    elevation: 3,
  },
  ledInactive: {
    backgroundColor: colors.inkFaded,
    opacity: 0.35,
  },

  // Icon character
  tabIcon: {
    fontSize: 18,
  },
  iconActive:   { color: colors.amberGlow },
  iconInactive: { color: colors.inkFaded },

  // Label
  tabLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 8,
    letterSpacing: typography.letterSpacing.wide,
  },
  labelActive:   { color: colors.amberGlow },
  labelInactive: { color: colors.inkFaded },

  // Camera disc
  cameraGap: {
    width: 72,
    alignItems: 'center',
    paddingTop: 0,
  },
  cameraButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.forestFloor,
    borderWidth: 2,
    borderColor: colors.instrumentBrass,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,  // raises disc above bar surface
    gap: 1,
  },
  cameraAperture: {
    fontSize: 22,
    color: colors.amberGlow,
  },
  cameraLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 7,
    color: colors.amberFaint,
    letterSpacing: typography.letterSpacing.label,
  },
});


