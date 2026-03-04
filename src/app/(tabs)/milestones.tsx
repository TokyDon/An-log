/**
 * Milestones Tab
 *
 * Progress overview, rarity collection grid, and achievements list.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { MOCK_ANIMONS } from '../../data/mockAnimons';

const TOTAL_SPECIES_TARGET = 100;
const UNIQUE_SPECIES = new Set(MOCK_ANIMONS.map((a) => a.species)).size;

const RARITY_DATA = [
  { rarity: 'common',   emoji: '⚪', label: 'Common',   count: 6,  target: 20, color: colors.rarity.common },
  { rarity: 'uncommon', emoji: '🟢', label: 'Uncommon', count: 3,  target: 10, color: colors.rarity.uncommon },
  { rarity: 'rare',     emoji: '🔵', label: 'Rare',     count: 2,  target: 5,  color: colors.rarity.rare },
  { rarity: 'glossy',   emoji: '✨', label: 'Glossy',   count: 1,  target: 1,  color: colors.rarity.glossy },
] as const;

const ACHIEVEMENTS = [
  {
    id: 'first_catch',
    title: 'First Catch',
    description: 'Caught your first Anímon',
    emoji: '🎯',
    unlocked: true,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Caught Anímon in 3 different regions',
    emoji: '🗺️',
    unlocked: true,
  },
  {
    id: 'rare_finder',
    title: 'Rare Finder',
    description: 'Caught a rare Anímon',
    emoji: '🔮',
    unlocked: true,
  },
  {
    id: 'glossy_hunter',
    title: 'Glossy Hunter',
    description: 'Catch a glossy Anímon',
    emoji: '✨',
    unlocked: false,
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Catch 100 unique species',
    emoji: '💯',
    unlocked: false,
  },
  {
    id: 'global_trainer',
    title: 'Global Trainer',
    description: 'Catch Anímon on 5 continents',
    emoji: '🌎',
    unlocked: false,
  },
];

export default function MilestonesScreen() {
  const progressPct = Math.min(UNIQUE_SPECIES / TOTAL_SPECIES_TARGET, 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Milestones</Text>
        </View>

        {/* Progress overview card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Anímon Collector</Text>
          <Text style={styles.progressSub}>
            {UNIQUE_SPECIES} / {TOTAL_SPECIES_TARGET} unique species
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPct * 100}%` as any },
              ]}
            />
          </View>
          <Text style={styles.progressPct}>
            {Math.round(progressPct * 100)}% complete
          </Text>
        </View>

        {/* Rarity Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rarity Collection</Text>
          <View style={styles.rarityGrid}>
            {RARITY_DATA.map((r) => (
              <View
                key={r.rarity}
                style={[
                  styles.rarityCard,
                  r.count >= r.target && { borderColor: r.color, borderWidth: 2 },
                ]}
              >
                <Text style={styles.rarityEmoji}>{r.emoji}</Text>
                <Text style={[styles.rarityLabel, { color: r.color }]}>{r.label}</Text>
                <Text style={styles.rarityCount}>
                  <Text style={styles.rarityCountBold}>{r.count}</Text>
                  /{r.target}
                </Text>
                <View style={styles.rarityTrack}>
                  <View
                    style={[
                      styles.rarityFill,
                      {
                        width: `${Math.min(r.count / r.target, 1) * 100}%` as any,
                        backgroundColor: r.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementList}>
            {ACHIEVEMENTS.map((a) => (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  a.unlocked
                    ? styles.achievementUnlocked
                    : styles.achievementLocked,
                ]}
              >
                <View
                  style={[
                    styles.achievementIcon,
                    a.unlocked
                      ? styles.achievementIconUnlocked
                      : styles.achievementIconLocked,
                  ]}
                >
                  <Text style={styles.achievementEmoji}>
                    {a.unlocked ? a.emoji : '🔒'}
                  </Text>
                </View>
                <View style={styles.achievementText}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !a.unlocked && styles.achievementTitleLocked,
                    ]}
                  >
                    {a.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{a.description}</Text>
                </View>
                {a.unlocked && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
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
  scrollContent: { paddingBottom: 16 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
  },
  // Progress card
  progressCard: {
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  progressTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text.inverse,
    marginBottom: 2,
  },
  progressSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 14,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressPct: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
    textAlign: 'right',
  },
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: 14,
  },
  // Rarity grid
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rarityCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  rarityEmoji: { fontSize: 24 },
  rarityLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
  },
  rarityCount: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  rarityCountBold: {
    fontFamily: typography.fontFamily.bodyBold,
    color: colors.text.primary,
  },
  rarityTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  rarityFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Achievements
  achievementList: { gap: 10 },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 1.5,
  },
  achievementUnlocked: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.primary,
  },
  achievementLocked: {
    backgroundColor: colors.surface,
    borderColor: '#E5E7EB',
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIconUnlocked: {
    backgroundColor: '#D1FAE5',
  },
  achievementIconLocked: {
    backgroundColor: '#F3F4F6',
  },
  achievementEmoji: { fontSize: 22 },
  achievementText: { flex: 1, gap: 2 },
  achievementTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  achievementTitleLocked: {
    color: colors.text.secondary,
  },
  achievementDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontFamily: typography.fontFamily.bodyBold,
  },
});
