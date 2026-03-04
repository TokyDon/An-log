/**
 * Home Tab — Discover
 *
 * Landing screen: greeting, stats bar, recent catches, nearby activity feed.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { AnimonCard } from '../../components/ui/AnimonCard';
import { MOCK_ANIMONS, MOCK_RECENT, NEARBY_ACTIVITY, MOCK_USER } from '../../data/mockAnimons';
import type { Animon } from '../../types/animon';
import type { AnimonRarity } from '../../types/animon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COMPACT_CARD_WIDTH = SCREEN_WIDTH * 0.6;

const STAT_CHIPS = [
  { label: `${MOCK_USER.totalCaught} caught`, icon: '🎯' },
  { label: `${MOCK_USER.uniqueSpecies} species`, icon: '🦎' },
  { label: `${MOCK_USER.regionsExplored} regions`, icon: '🌍' },
];

function rarityDotColor(rarity: AnimonRarity): string {
  return colors.rarity[rarity];
}

export default function HomeScreen() {
  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.heading}>Discover</Text>
          <Text style={styles.greeting}>Good morning, Trainer 👋</Text>
        </View>

        {/* ── Stats bar ─────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {STAT_CHIPS.map((chip) => (
            <View key={chip.label} style={styles.statChip}>
              <Text style={styles.statIcon}>{chip.icon}</Text>
              <Text style={styles.statLabel}>{chip.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Recently Caught ───────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Caught</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/anilog')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentRow}
          decelerationRate="fast"
          snapToInterval={COMPACT_CARD_WIDTH + 12}
          snapToAlignment="start"
        >
          {MOCK_RECENT.map((animon) => (
            <View key={animon.id} style={{ width: COMPACT_CARD_WIDTH }}>
              <AnimonCard
                animon={animon}
                compact
                onPress={handleCardPress}
              />
            </View>
          ))}
        </ScrollView>

        {/* ── Nearby Activity ───────────────────────────────────── */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Activity</Text>
          </View>
          <View style={styles.activityList}>
            {NEARBY_ACTIVITY.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View
                  style={[
                    styles.rarityDot,
                    { backgroundColor: rarityDotColor(item.rarity) },
                  ]}
                />
                <View style={styles.activityText}>
                  <Text style={styles.activityMessage}>{item.message}</Text>
                  <Text style={styles.activityMeta}>
                    {item.region} · {item.ago}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
    lineHeight: typography.fontSize['3xl'] * 1.15,
  },
  greeting: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: 4,
  },
  // Stats
  statsRow: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 20,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: { fontSize: 15 },
  statLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  // Sections
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  seeAll: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  recentRow: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
  },
  // Activity
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rarityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  activityText: {
    flex: 1,
    gap: 3,
  },
  activityMessage: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  activityMeta: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
  },
});
