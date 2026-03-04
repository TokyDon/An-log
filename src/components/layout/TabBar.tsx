/**
 * TabBar
 *
 * Custom tab bar with an elevated, centred camera button.
 * Active tabs use primary green; inactive tabs use secondary grey.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  index:      { icon: '⊙', label: 'Discover' },
  anilog:     { icon: '⊛', label: 'Anílog' },
  milestones: { icon: '◈', label: 'Milestones' },
  profile:    { icon: '◉', label: 'Profile' },
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
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
          <Text style={styles.cameraIcon}>🐾</Text>
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
  const label = descriptors[route.key]?.options?.title ?? config?.label ?? route.name;
  const icon = config?.icon ?? '·';

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
    >
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
      {isFocused && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 10,
    height: Platform.OS === 'ios' ? 84 : 68,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: { color: colors.primary },
  tabIconInactive: { color: colors.text.secondary },
  tabLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  tabLabelActive: { color: colors.primary },
  tabLabelInactive: { color: colors.text.secondary },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  cameraGap: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  cameraButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    borderWidth: 2.5,
    borderColor: colors.surface,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  cameraIcon: { fontSize: 24 },
});
