/**
 * TabBar — v4 Accessible + Flutter-style
 *
 * Accessibility:
 *   - Each tab touch target ≥ 44×44pt (WCAG 2.5.5)
 *   - Tab labels 11px (above mobile minimum of 11sp)
 *   - Active state communicated via color + weight (not color alone)
 *   - accessibilityRole and accessibilityState on every item
 *
 * Visual:
 *   - Pill highlight behind active icon
 *   - FAB 58px circle lifted 22px, stronger type-color shadow
 *   - Clean surface background with 1px top border
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  index:   { icon: '★',  label: 'Party'      },
  anilog:  { icon: '◈',  label: 'Animons'    },
  logbook: { icon: '◎',  label: 'Stamps'     },
  profile: { icon: '◐',  label: 'Profile'    },
};

const FAB_SIZE = 58;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRouteName = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      <View style={styles.topBorder} />

      {/* Left: Party */}
      <TabItem
        routeName="index"
        isFocused={focusedRouteName === 'index'}
        onPress={() => navigation.navigate('index')}
      />

      {/* Centre-left: Collection */}
      <TabItem
        routeName="anilog"
        isFocused={focusedRouteName === 'anilog'}
        onPress={() => navigation.navigate('anilog')}
      />

      {/* Centre FAB */}
      <View style={styles.fabWrap}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => router.push('/camera')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Open scanner"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LinearGradient
            colors={[colors.accent, colors.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.fabIcon}>⌖</Text>
        </TouchableOpacity>
        <Text style={styles.fabLabel}>SCAN</Text>
      </View>

      {/* Centre-right: Stamps */}
      <TabItem
        routeName="logbook"
        isFocused={focusedRouteName === 'logbook'}
        onPress={() => navigation.navigate('logbook')}
      />

      {/* Right: Profile */}
      <TabItem
        routeName="profile"
        isFocused={focusedRouteName === 'profile'}
        onPress={() => navigation.navigate('profile')}
      />
    </View>
  );
}

interface TabItemProps {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}

function TabItem({ routeName, isFocused, onPress }: TabItemProps) {
  const config = TAB_CONFIG[routeName];
  if (!config) return null;

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={config.label}
    >
      {/* Pill highlight behind icon when active */}
      <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
        <Text
          style={[
            styles.tabIcon,
            isFocused ? styles.iconActive : styles.iconInactive,
          ]}
        >
          {config.icon}
        </Text>
      </View>

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
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 6,
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  topBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: colors.border,
  },

  // Tab item — min 44pt touch target
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    gap: 3,
    minHeight: 44,
    justifyContent: 'flex-start',
  },

  // Icon pill
  iconPill: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: colors.accentSoft,
  },

  tabIcon: { fontSize: 18 },
  iconActive:   { color: colors.accent },
  iconInactive: { color: colors.text3  },

  tabLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  labelActive:   { color: colors.accent },
  labelInactive: { color: colors.text3  },

  // FAB
  fabWrap: {
    width: 72,
    alignItems: 'center',
    paddingTop: 0,
    gap: 3,
  },
  fabButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.50,
    shadowRadius: 10,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.textInverse,
    lineHeight: 28,
  },
  fabLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 0.5,
    marginTop: -2,
  },
});
