/**
 * Milestones Tab — Naturalist Field Journal v2
 *
 * Dark forestFloor header, parchment gauge panel, cardStock rarity cells,
 * parchment achievement cards with tier accent stripes.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { MOCK_ANIMONS } from '../../data/mockAnimons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_SPECIES_TARGET = 100;
const UNIQUE_SPECIES = new Set(MOCK_ANIMONS.map((a) => a.species)).size;

const RARITY_DATA = [
  { rarity: 'common'   as const, label: 'Common',   count: 6,  target: 20 },
  { rarity: 'uncommon' as const, label: 'Uncommon', count: 3,  target: 10 },
  { rarity: 'rare'     as const, label: 'Rare',     count: 2,  target: 5  },
  { rarity: 'glossy'   as const, label: 'Glossy',   count: 1,  target: 1  },
];

const ACHIEVEMENTS = [
  { id: 'first_catch',    title: 'First Catch',      description: 'Caught your first Anímon',              emoji: '🎯', tier: 'Bronze' as const, unlocked: true  },
  { id: 'explorer',       title: 'Explorer',         description: 'Caught Anímon in 3 different regions',  emoji: '🗺️', tier: 'Silver' as const, unlocked: true  },
  { id: 'rare_finder',    title: 'Rare Finder',      description: 'Caught a rare Anímon',                  emoji: '🔮', tier: 'Gold'   as const, unlocked: true  },
  { id: 'glossy_hunter',  title: 'Glossy Hunter',    description: 'Catch a glossy Anímon',                 emoji: '✨', tier: 'Gold'   as const, unlocked: false },
  { id: 'century_club',   title: 'Century Club',     description: 'Catch 100 unique species',              emoji: '💯', tier: 'Gold'   as const, unlocked: false },
  { id: 'global_trainer', title: 'Global Trainer',   description: 'Catch Anímon on 5 continents',          emoji: '🌎', tier: 'Gold'   as const, unlocked: false },
];

const TIER_COLORS = { Bronze: colors.inkFaded, Silver: colors.lichenGray, Gold: colors.amberResin };

function SectionRule({ label }: { label: string }) {
  return (
    <View style={sectionRuleStyles.wrap}>
      <View style={sectionRuleStyles.line} />
      <Text style={sectionRuleStyles.label}>{label}</Text>
      <View style={sectionRuleStyles.line} />
    </View>
  );
}

const sectionRuleStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.inkRule },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
});

export default function MilestonesScreen() {
  const progressPct = Math.min(UNIQUE_SPECIES / TOTAL_SPECIES_TARGET, 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Dark header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>ANÍLOG</Text>
            <Text style={styles.screenTitle}>Milestones</Text>
          </View>
          <View style={styles.specimenBadge}>
            <Text style={styles.specimenBadgeText}>
              {UNIQUE_SPECIES}/{TOTAL_SPECIES_TARGET} SPECIES
            </Text>
          </View>
        </View>

        {/* ── Species progress gauge ── */}
        <View style={styles.gaugePanel}>
          <View style={styles.gaugeLabelRow}>
            <Text style={styles.gaugeLabel}>ANÍMON COLLECTOR</Text>
            <Text style={styles.gaugeFraction}>{UNIQUE_SPECIES} / {TOTAL_SPECIES_TARGET}</Text>
          </View>
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${progressPct * 100}%` as any }]} />
          </View>
          <Text style={styles.gaugePct}>{Math.round(progressPct * 100)}% COMPLETE</Text>
        </View>

        {/* ── Rarity breakdown grid ── */}
        <SectionRule label="RARITY COLLECTION" />
        <View style={styles.rarityGrid}>
          {RARITY_DATA.map((r) => (
            <View key={r.rarity} style={styles.rarityCell}>
              <RarityBadge rarity={r.rarity} size="lg" />
              <Text style={[styles.rarityCount, { color: colors.rarity[r.rarity] }]}>
                {r.count}
              </Text>
              <Text style={styles.rarityLabel}>SPECIMENS</Text>
            </View>
          ))}
        </View>

        {/* ── Achievement cards ── */}
        <View style={{ marginTop: 8 }}>
          <SectionRule label="ACHIEVEMENTS" />
        </View>
        <View style={styles.achievementList}>
          {ACHIEVEMENTS.map((a) => {
            const accentColor = TIER_COLORS[a.tier];
            return (
              <View
                key={a.id}
                style={[
                  styles.achievementCard,
                  !a.unlocked && styles.achievementLocked,
                ]}
              >
                {/* Left accent stripe */}
                <View
                  style={[
                    styles.achievementStripe,
                    { backgroundColor: a.unlocked ? accentColor : '#6B6B6B' },
                  ]}
                />
                {/* Content */}
                <Text style={styles.achievementSymbol}>{a.unlocked ? '◆' : '◇'}</Text>
                <View style={styles.achievementText}>
                  <Text style={[styles.achievementTitle, !a.unlocked && styles.dimText]}>
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
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deviceBody,
  },
  scrollContent: { paddingBottom: 16 },

  // Dark forestFloor header
  header: {
    backgroundColor: colors.forestFloor,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  wordmark: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.amberGlow,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontFamily: typography.fontFamily.heading,
    fontStyle: 'italic',
    fontSize: typography.fontSize['3xl'],
    color: colors.inkInverse,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.heading,
  },
  specimenBadge: {
    borderWidth: 1,
    borderColor: colors.instrumentBrass,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  specimenBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkAmber,
    letterSpacing: typography.letterSpacing.label,
  },

  // Progress gauge — parchment panel
  gaugePanel: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.parchment,
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.inkRule,
  },
  gaugeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gaugeLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.inkBrown,
    letterSpacing: typography.letterSpacing.label,
    textTransform: 'uppercase',
  },
  gaugeFraction: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.inkBrown,
  },
  gaugeTrack: {
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.insetPanel,
    borderWidth: 1,
    borderColor: colors.inkRule,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.forestMid,
  },
  gaugePct: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
    marginTop: 8,
    textAlign: 'right',
    letterSpacing: 1,
  },

  // Rarity grid — cardStock cells
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  rarityCell: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: colors.cardStock,
    borderRadius: 3,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inkRule,
  },
  rarityCount: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['4xl'],
    marginTop: 8,
  },
  rarityLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.inkFaded,
    marginTop: 4,
    letterSpacing: 1,
  },

  // Achievement cards — parchment
  achievementList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.parchment,
    borderRadius: 3,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingLeft: 22,
    paddingRight: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.inkRule,
    position: 'relative',
  },
  achievementLocked: { opacity: 0.45 },
  achievementStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
  },
  achievementSymbol: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 28,
    color: colors.inkBrown,
  },
  achievementText: { flex: 1, gap: 2 },
  achievementTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.inkBlack,
  },
  dimText: { color: colors.inkFaded },
  achievementDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.inkBrown,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.forestFloor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.inkInverse,
    fontSize: 12,
    fontFamily: typography.fontFamily.bodyBold,
  },
});
