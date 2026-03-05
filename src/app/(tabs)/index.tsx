/**
 * Discover Tab — Field Naturalist Edition v2
 *
 * Field Log landing screen:
 * - forestFloor dark header with ANÍLOG wordmark (Space Mono amberGlow)
 * - Stat chips: symbol + value (bold) + label (muted mono) — three separate elements
 * - Section rules: mono label + extending inkRule line
 * - Activity panel: parchment bg, 2px left-border accent, Playfair italic message
 * - Recent specimens: horizontal compact-card carousel
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
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
  { symbol: '⊙', value: String(MOCK_USER.totalCaught),    label: 'CAUGHT' },
  { symbol: '⬡', value: String(MOCK_USER.uniqueSpecies),  label: 'SPECIES' },
  { symbol: '▲', value: String(MOCK_USER.regionsExplored), label: 'REGIONS' },
];

function SectionRule({ label }: { label: string }) {
  return (
    <View style={styles.sectionRule}>
      <Text style={styles.sectionRuleLabel}>{label}</Text>
      <View style={styles.sectionRuleLine} />
    </View>
  );
}

export default function DiscoverScreen() {
  const handleCardPress = (animon: Animon) => {
    router.push(`/animon/${animon.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Dark header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>ANÍLOG</Text>
          <Text style={styles.screenTitle}>Field Log</Text>
        </View>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stat chips ── */}
        <View style={styles.statRow}>
          {STAT_CHIPS.map((chip) => (
            <View key={chip.label} style={styles.statChip}>
              <Text style={styles.statSymbol}>{chip.symbol}</Text>
              <Text style={styles.statValue}>{chip.value}</Text>
              <Text style={styles.statLabel}>{chip.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Activity panel ── */}
        <SectionRule label="NEARBY ACTIVITY" />
        <View style={styles.activityPanel}>
          {NEARBY_ACTIVITY.map((item) => (
            <View
              key={item.id}
              style={[
                styles.activityItem,
                { borderLeftColor: colors.rarity[item.rarity as AnimonRarity] ?? colors.inkRule },
              ]}
            >
              <Text style={styles.activityMessage}>{item.message}</Text>
              <View style={styles.activityMeta}>
                <Text style={styles.activityRegion}>{item.region}</Text>
                <Text style={styles.activityAgo}>{item.ago}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Recent specimens horizontal scroll ── */}
        <SectionRule label="RECENT SPECIMENS" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentScroll}
        >
          {MOCK_RECENT.map((animon) => (
            <View key={animon.id} style={{ width: COMPACT_CARD_WIDTH, marginRight: 12 }}>
              <AnimonCard
                animon={animon}
                compact
                onPress={handleCardPress}
              />
            </View>
          ))}
        </ScrollView>

        {/* ── Full grid ── */}
        <SectionRule label="ALL SPECIMENS" />
        <View style={styles.grid}>
          {MOCK_ANIMONS.map((animon) => (
            <View key={animon.id} style={styles.gridItem}>
              <AnimonCard animon={animon} onPress={handleCardPress} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GRID_SPACING = 12;
const GRID_COLS = 2;
const GRID_ITEM_WIDTH =
  (SCREEN_WIDTH - GRID_SPACING * 3) / GRID_COLS;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deviceBody,
  },

  // Dark forestFloor header
  header: {
    backgroundColor: colors.forestFloor,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
  headerDate: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.amberResin,
    textAlign: 'right',
  },

  scroll: { flex: 1, backgroundColor: colors.specimenCream },
  scrollContent: { paddingBottom: 32 },

  // Stat chips
  statRow: {
    flexDirection: 'row',
    backgroundColor: colors.parchment,
    borderBottomWidth: 1,
    borderBottomColor: colors.inkRule,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 0,
    justifyContent: 'space-around',
  },
  statChip: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statSymbol: {
    fontSize: typography.fontSize.lg,
    color: colors.inkBrown,
  },
  statValue: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    color: colors.inkBlack,
    lineHeight: typography.fontSize.md * typography.lineHeight.label,
  },
  statLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 9,
    color: colors.inkFaded,
    letterSpacing: typography.letterSpacing.label,
  },

  // Section rule: mono label + extending line
  sectionRule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 8,
  },
  sectionRuleLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.inkFaded,
    letterSpacing: typography.letterSpacing.widest,
  },
  sectionRuleLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inkRule,
  },

  // Activity panel
  activityPanel: {
    marginHorizontal: 16,
    backgroundColor: colors.parchment,
    borderWidth: 1,
    borderColor: colors.inkRule,
    borderRadius: 3,
    overflow: 'hidden',
  },
  activityItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.inkRule,
    borderLeftWidth: 2,
    // borderLeftColor set inline per item (rarity colour)
    gap: 4,
  },
  activityMessage: {
    fontFamily: typography.fontFamily.heading,
    fontStyle: 'italic',
    fontSize: typography.fontSize.base,
    color: colors.inkBlack,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityRegion: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
  },
  activityAgo: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkFaded,
  },

  // Recent carousel
  recentScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },

  // Full grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_SPACING,
    gap: GRID_SPACING,
  },
  gridItem: {
    width: GRID_ITEM_WIDTH,
  },
});

