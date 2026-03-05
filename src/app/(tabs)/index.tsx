/**
 * Home Tab — Discover
 *
 * BioField Scanner MK-II — skeuomorphic landing screen.
 * Dark device chrome SafeAreaView, parchment scrollable content.
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
const COMPACT_CARD_WIDTH = SCREEN_WIDTH * 0.60;

const STAT_CHIPS = [
  { label: `${MOCK_USER.totalCaught} CAUGHT`, icon: '🎯' },
  { label: `${MOCK_USER.uniqueSpecies} SPECIES`, icon: '🦎' },
  { label: `${MOCK_USER.regionsExplored} REGIONS`, icon: '🌍' },
];

export default function HomeScreen() {
  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  return (
    <SafeAreaView style={styles.deviceFrame} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bezel illusion strip */}
        <View style={styles.bezelStrip} />

        {/* ── Header ────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>ANÍLOG</Text>
          <Text style={styles.heading}>Discover</Text>
          <Text style={styles.greeting}>Good morning, Trainer</Text>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENTLY CAUGHT</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/anilog')}>
            <Text style={styles.seeAll}>SEE ALL →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionRule} />

        {/* Carousel — parent must declare height: 140 to prevent stretch */}
        <View style={{ height: 140 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentRow}
            decelerationRate="fast"
            snapToInterval={COMPACT_CARD_WIDTH + 12}
            snapToAlignment="start"
          >
            {MOCK_RECENT.map((animon) => (
              <View key={animon.id} style={{ width: COMPACT_CARD_WIDTH, height: 140 }}>
                <AnimonCard
                  animon={animon}
                  compact
                  onPress={handleCardPress}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Nearby Activity ───────────────────────────────────── */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>NEARBY ACTIVITY</Text>
        </View>
        <View style={styles.sectionRule} />

        <View style={styles.activityPanel}>
          {NEARBY_ACTIVITY.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <View style={styles.activitySeparator} />}
              <View style={styles.activityItem}>
                <View
                  style={[
                    styles.rarityDot,
                    { backgroundColor: colors.rarity[item.rarity as AnimonRarity] },
                    { shadowColor: colors.rarity[item.rarity as AnimonRarity] },
                  ]}
                />
                <View style={styles.activityText}>
                  <Text style={styles.activityMessage}>{item.message}</Text>
                  <Text style={styles.activityMeta}>
                    {item.region} · {item.ago}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  deviceFrame: {
    flex: 1,
    backgroundColor: colors.deviceBody,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  bezelStrip: {
    height: 8,
    backgroundColor: colors.deviceBezel,
  },
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.screenBg,
  },
  wordmark: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heading: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.fontSize['3xl'],
    color: colors.textPrimary,
    lineHeight: typography.fontSize['3xl'] * 1.15,
  },
  greeting: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
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
    backgroundColor: colors.deviceBezel,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.metalBrush,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.40,
    shadowRadius: 4,
    elevation: 4,
  },
  statIcon: { fontSize: 16 },
  statLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.amberReadout,
  },
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  seeAll: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 12,
    color: colors.scannerGreenLight,
  },
  sectionRule: {
    height: 1,
    backgroundColor: colors.surfaceInset,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  recentRow: {
    paddingLeft: 20,
    gap: 12,
    paddingRight: 20,
  },
  // Activity panel
  activityPanel: {
    backgroundColor: colors.surfacePanel,
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    shadowColor: '#1A0F00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  activitySeparator: {
    height: 1,
    backgroundColor: colors.surfaceInset,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.70,
    shadowRadius: 4,
  },
  activityText: {
    flex: 1,
    gap: 2,
  },
  activityMessage: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  activityMeta: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
