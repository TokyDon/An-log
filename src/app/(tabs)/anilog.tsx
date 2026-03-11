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
import { useCollection } from '../../features/collection/useCollection';
import { useCollectionStore } from '../../store/collectionStore';
import { ANIMON_TYPES, getTypeDefinition } from '../../constants/typeSystem';
import type { Animon } from '../../types/animon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 10;
const SIDE_PAD = 12;
const CARD_WIDTH = (SCREEN_WIDTH - SIDE_PAD * 2 - COLUMN_GAP) / 2;

type FilterOption = 'all' | string;

const FILTER_OPTIONS: Array<{ key: FilterOption; label: string }> = [
  { key: 'all', label: 'ALL' },
  ...ANIMON_TYPES.map((t) => ({
    key: t as FilterOption,
    label: getTypeDefinition(t).label.toUpperCase(),
  })),
];

export default function AnilogScreen() {
  const { data: supabaseAnimons = [] } = useCollection();
  const localAnimons = useCollectionStore((s) => s.animons);

  // Merge: local (seeded starters + captures) + server-synced, deduped by id
  const animons = useMemo(() => {
    const localIds = new Set(localAnimons.map((a) => a.id));
    return [...localAnimons, ...supabaseAnimons.filter((a) => !localIds.has(a.id))];
  }, [localAnimons, supabaseAnimons]);

  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filteredAnimons = useMemo(() => {
    const base =
      activeFilter === 'all'
        ? animons
        : animons.filter((a) => (a.types as string[]).includes(activeFilter));
    return [...base].sort(
      (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
    );
  }, [activeFilter, animons]);

  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  const activeFilterLabel =
    activeFilter === 'all'
      ? ''
      : getTypeDefinition(activeFilter).label;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* â”€â”€ Dark header â”€â”€ */}
      <View style={styles.header}>
        <View>
          <Text style={styles.wordmark}>ANÍLOG</Text>
          <Text style={styles.screenTitle}>Everything you've found.</Text>
        </View>
        <View style={styles.specimenBadge}>
          <Text style={styles.specimenBadgeText}>{animons.length} LOGGED</Text>
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
          const typeDef = opt.key !== 'all' ? getTypeDefinition(opt.key) : undefined;
          const typeColor = typeDef?.color;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.filterChip,
                isActive
                  ? [styles.filterChipActive, typeColor ? { backgroundColor: typeColor, borderColor: typeColor } : {}]
                  : styles.filterChipInactive,
              ]}
              onPress={() => setActiveFilter(opt.key)}
            >
              {/* Colored dot on inactive type chips */}
              {!isActive && typeColor && (
                <View style={[styles.filterDot, { backgroundColor: typeColor }]} />
              )}
              <Text
                style={[
                  styles.filterChipText,
                  isActive
                    ? { color: typeColor ? typeDef!.textColor : colors.textInverse }
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
          title={animons.length === 0 ? 'Your collection is empty' : `No ${activeFilterLabel} specimens`}
          description={
            animons.length === 0
              ? 'Start scanning to discover Anímons!'
              : 'Head outside and scan the next animal you find'
          }
          ctaLabel={animons.length === 0 ? 'START SCANNING' : 'OPEN SCANNER'}
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
            <View style={[{ width: CARD_WIDTH }, styles.cardWrapper]}>
              <AnimonCard animon={item} onPress={handleCardPress} showPhoto />
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
    backgroundColor: colors.bg,
  },

  // Dark forestFloor header â€” mirrors Discover screen
  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: SIDE_PAD,
    paddingTop: 16,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wordmark: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  screenTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text1,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  specimenBadge: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  specimenBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
  },

  // Filter bar
  filterScroll: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 60,
  },
  filterRow: {
    paddingHorizontal: SIDE_PAD,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterChip: {
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 2,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.label,
  },
  filterChipTextInactive: {
    color: colors.text2,
  },

  // Grid
  grid: {
    backgroundColor: colors.bg,
    paddingHorizontal: SIDE_PAD,
    paddingTop: 14,
    paddingBottom: 24,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
  cardWrapper: {
    overflow: 'hidden',
  },
});
