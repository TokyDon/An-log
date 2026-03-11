/**
 * Logbook Tab — v3 Flutter-style
 *
 * Milestones & achievements with vivid rarity cells, proper locked/unlocked
 * achievement cards, and a prominent progress gauge.
 *
 * Accessibility:
 *   - Locked achievements NOT dimmed with opacity (would fail WCAG 1.4.3)
 *     Instead: grey icon circle, muted text, explicit "Locked" label
 *   - Section headers use ≥ 12px text
 *   - Touch targets n/a (read-only display)
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { useCollection } from '../../features/collection/useCollection';
import { useCollectionStore } from '../../store/collectionStore';
import { useAchievementStore } from '../../store/achievementStore';
import { ACHIEVEMENTS } from '../../constants/achievements';
import type { AnimonRarity } from '../../types/animon';

const { width: W } = Dimensions.get('window');
const TOTAL_SPECIES_TARGET = 100;

// Convert hex to rgba for tinted backgrounds
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const TIER_COLORS: Record<string, string> = {
  Bronze:   '#CD7F32',
  Silver:   '#8E9BAE',
  Gold:     colors.gold,
  Platinum: '#9BB8D4',
  Diamond:  colors.rarity.rare.bg,
};

// ── Section divider ──────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={section.wrap}>
      <View style={section.line} />
      <Text style={section.text}>{label}</Text>
      <View style={section.line} />
    </View>
  );
}

const section = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  text: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
  },
});

// ── Rarity cell ──────────────────────────────────────────────────────────────

function RarityCell({
  rarity,
  label,
  count,
  target,
}: {
  rarity: AnimonRarity;
  label: string;
  count: number;
  target: number;
}) {
  const bg   = colors.rarity[rarity].bg;
  const pct  = Math.min(count / target, 1);

  return (
    <View
      style={[
        rarityCell.card,
        {
          backgroundColor: hexToRgba(bg, 0.12),
          borderColor:      hexToRgba(bg, 0.35),
        },
      ]}
      accessible
      accessibilityLabel={`${label}: ${count} of ${target}`}
    >
      <RarityBadge rarity={rarity} />
      <Text style={rarityCell.count}>{count}</Text>
      <Text style={rarityCell.of}>OF {target}</Text>
      {/* Mini progress bar */}
      <View style={rarityCell.barTrack}>
        <View
          style={[
            rarityCell.barFill,
            { width: `${pct * 100}%` as any, backgroundColor: bg },
          ]}
        />
      </View>
    </View>
  );
}

const rarityCell = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: (W - 52) / 2,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
    marginTop: 6,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },
  of: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.wide,
  },
  barTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
});

// ── Achievement card ─────────────────────────────────────────────────────────

function AchievementCard({
  title,
  description,
  emoji,
  tier,
  unlocked,
}: {
  title: string;
  description: string;
  emoji: string;
  tier: string;
  unlocked: boolean;
}) {
  const accentColor = TIER_COLORS[tier] ?? colors.text3;

  return (
    <View
      style={[
        achieve.card,
        unlocked
          ? { borderColor: hexToRgba(accentColor, 0.40) }
          : achieve.cardLocked,
      ]}
      accessible
      accessibilityLabel={`${title}: ${description}. ${unlocked ? 'Unlocked' : 'Locked'}`}
    >
      {/* Icon circle */}
      <View
        style={[
          achieve.iconCircle,
          {
            backgroundColor: unlocked
              ? hexToRgba(accentColor, 0.15)
              : colors.surface2,
            borderColor: unlocked
              ? hexToRgba(accentColor, 0.40)
              : colors.border,
          },
        ]}
      >
        <Text style={[achieve.emoji, !unlocked && achieve.emojiLocked]}>
          {emoji}
        </Text>
      </View>

      {/* Text */}
      <View style={achieve.textBlock}>
        <View style={achieve.titleRow}>
          <Text style={[achieve.title, !unlocked && achieve.textMuted]}>
            {title}
          </Text>
          {/* Tier badge */}
          <View
            style={[
              achieve.tierBadge,
              { backgroundColor: unlocked ? hexToRgba(accentColor, 0.15) : colors.surface2 },
            ]}
          >
            <Text
              style={[
                achieve.tierLabel,
                { color: unlocked ? accentColor : colors.text3 },
              ]}
            >
              {tier.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={achieve.desc}>{description}</Text>
      </View>

      {/* Status indicator */}
      {unlocked ? (
        <View style={[achieve.statusDot, { backgroundColor: colors.accent }]}>
          <Text style={achieve.statusCheck}>✓</Text>
        </View>
      ) : (
        <View style={[achieve.statusDot, achieve.statusLocked]}>
          <Text style={achieve.statusLockIcon}>○</Text>
        </View>
      )}
    </View>
  );
}

const achieve = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  cardLocked: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 22,
  },
  emojiLocked: {
    opacity: 0.35,
  },
  textBlock: { flex: 1, gap: 3 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text1,
    flexShrink: 1,
  },
  textMuted: {
    color: colors.text3,
  },
  tierBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tierLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  desc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusLocked: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusCheck: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.textInverse,
  },
  statusLockIcon: {
    fontFamily: typography.fontFamily.body,
    fontSize: 14,
    color: colors.text3,
  },
});

// ── Screen ───────────────────────────────────────────────────────────────────

export default function MilestonesScreen() {
  const localAnimons = useCollectionStore((s) => s.animons);
  const { data: supabaseAnimons = [] } = useCollection();
  const animons = React.useMemo(() => {
    const localIds = new Set(localAnimons.map((a) => a.id));
    return [...localAnimons, ...supabaseAnimons.filter((a) => !localIds.has(a.id))];
  }, [localAnimons, supabaseAnimons]);
  const isUnlocked = useAchievementStore((s) => s.isUnlocked);

  const uniqueSpecies = new Set(animons.map((a) => a.species)).size;
  const progressPct   = Math.min(uniqueSpecies / TOTAL_SPECIES_TARGET, 1);

  const rarityRows: Array<{ rarity: AnimonRarity; label: string; target: number }> = [
    { rarity: 'common',     label: 'Common',     target: 20 },
    { rarity: 'uncommon',   label: 'Uncommon',   target: 10 },
    { rarity: 'rare',       label: 'Rare',       target: 5  },
    { rarity: 'super_rare', label: 'Super Rare', target: 1  },
  ];

  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: isUnlocked(a.id),
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>ANÍLOG</Text>
            <Text style={styles.screenTitle}>Milestones.</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{uniqueSpecies}/{TOTAL_SPECIES_TARGET}</Text>
          </View>
        </View>

        {/* ── Species progress ────────────────────────────────────────── */}
        <View style={styles.gaugeCard}>
          <View style={styles.gaugeLabelRow}>
            <View>
              <Text style={styles.gaugeTitle}>ANÍMON COLLECTOR</Text>
              <Text style={styles.gaugeSubtitle}>Discover all known species</Text>
            </View>
            <Text style={styles.gaugeFraction}>
              <Text style={styles.gaugeFractionBig}>{uniqueSpecies}</Text>
              <Text style={styles.gaugeFractionDim}>/{TOTAL_SPECIES_TARGET}</Text>
            </Text>
          </View>
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${progressPct * 100}%` as any }]} />
          </View>
          <Text style={styles.gaugePct}>{Math.round(progressPct * 100)}% complete</Text>
        </View>

        {/* ── Rarity breakdown ─────────────────────────────────────────── */}
        <SectionLabel label="RARITY COLLECTION" />
        <View style={styles.rarityGrid}>
          {rarityRows.map((r) => (
            <RarityCell
              key={r.rarity}
              rarity={r.rarity}
              label={r.label}
              count={animons.filter((a) => a.rarity === r.rarity).length}
              target={r.target}
            />
          ))}
        </View>

        {/* ── Achievements ─────────────────────────────────────────────── */}
        <SectionLabel label="ACHIEVEMENTS" />
        <View style={styles.achieveList}>
          {achievements.map((a) => (
            <AchievementCard
              key={a.id}
              title={a.title}
              description={a.description}
              emoji={a.emoji}
              tier={a.tier}
              unlocked={a.unlocked}
            />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Screen styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: 16 },

  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  wordmark: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.text3,
    marginBottom: 4,
  },
  screenTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text1,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  badge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: hexToRgba(colors.accent, 0.25),
  },
  badgeText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    letterSpacing: typography.letterSpacing.label,
  },

  // Gauge card
  gaugeCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text1,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  gaugeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  gaugeTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: 3,
  },
  gaugeSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
  },
  gaugeFraction: {
    alignItems: 'flex-end',
  },
  gaugeFractionBig: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
  },
  gaugeFractionDim: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text3,
  },
  gaugeTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gaugeFill: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  gaugePct: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    marginTop: 8,
    textAlign: 'right',
  },

  // Rarity grid
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  // Achievement list
  achieveList: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
});
