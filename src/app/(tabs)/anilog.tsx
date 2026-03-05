/**
 * My AnÃ­log Tab â€” Field Naturalist Edition v2
 *
 * Specimen collection grid:
 * - forestFloor dark header (matches all other screens)
 * - Type filter bar: specimen-drawer inset field-guide color bands
 * - 2-col grid of full AnimonCards on specimenCream ground
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { AnimonCard } from '../../components/ui/AnimonCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { MOCK_ANIMONS } from '../../data/mockAnimons';
import { ANIMON_TYPES, TYPE_DEFINITIONS } from '../../constants/typeSystem';
import type { Animon } from '../../types/animon';
import type { AnimonType } from '../../types/animon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const SIDE_PAD = 16;
const CARD_WIDTH = (SCREEN_WIDTH - SIDE_PAD * 2 - COLUMN_GAP) / 2;

type FilterOption = 'all' | AnimonType;

const FILTER_OPTIONS: Array<{ key: FilterOption; label: string }> = [
  { key: 'all', label: 'ALL' },
  ...ANIMON_TYPES.map((t) => ({
    key: t as FilterOption,
    label: TYPE_DEFINITIONS[t].label.toUpperCase(),
  })),
];

export default function AnilogScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filteredAnimons = useMemo(() => {
    if (activeFilter === 'all') return MOCK_ANIMONS;
    return MOCK_ANIMONS.filter((a) => a.types.includes(activeFilter as AnimonType));
  }, [activeFilter]);

  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  const activeFilterLabel =
    activeFilter === 'all'
      ? ''
      : TYPE_DEFINITIONS[activeFilter as AnimonType]?.label ?? '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* â”€â”€ Dark header â”€â”€ */}
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>ANÃLOG</Text>
          <Text style={styles.screenTitle}>My AnÃ­log</Text>
        </View>
        <View style={styles.specimenBadge}>
          <Text style={styles.specimenBadgeText}>{MOCK_ANIMONS.length} LOGGED</Text>
        </View>
      </View>

      {/* â”€â”€ Filter bar â”€â”€ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.key;
          const typeColor =
            opt.key !== 'all' ? TYPE_DEFINITIONS[opt.key as AnimonType]?.color : undefined;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.filterChip,
                isActive
                  ? [styles.filterChipActive, typeColor ? { borderColor: typeColor } : {}]
                  : styles.filterChipInactive,
              ]}
              onPress={() => setActiveFilter(opt.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive
                    ? { color: typeColor ?? colors.inkBlack }
                    : styles.filterChipTextInactive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* â”€â”€ Grid â”€â”€ */}
      {filteredAnimons.length === 0 ? (
        <EmptyState
          title={`No ${activeFilterLabel} specimens`}
          description="Head outside and scan the next animal you find"
          ctaLabel="OPEN SCANNER"
          onCta={() => router.push('/camera')}
        />
      ) : (
        <FlatList
          data={filteredAnimons}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }}>
              <AnimonCard animon={item} onPress={handleCardPress} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deviceBody,
  },

  // Dark forestFloor header â€” mirrors Discover screen
  header: {
    backgroundColor: colors.forestFloor,
    paddingHorizontal: SIDE_PAD,
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

  // Filter bar
  filterScroll: {
    backgroundColor: colors.specimenCream,
    borderBottomWidth: 1,
    borderBottomColor: colors.inkRule,
    maxHeight: 52,
  },
  filterRow: {
    paddingHorizontal: SIDE_PAD,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  filterChipInactive: {
    backgroundColor: colors.parchment,
    borderColor: colors.inkRule,
  },
  filterChipActive: {
    backgroundColor: colors.insetPanel,
    borderColor: colors.inkBlack,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    letterSpacing: typography.letterSpacing.label,
  },
  filterChipTextInactive: {
    color: colors.inkBrown,
  },

  // Grid
  grid: {
    backgroundColor: colors.specimenCream,
    paddingHorizontal: SIDE_PAD,
    paddingTop: 12,
    paddingBottom: 24,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
});
