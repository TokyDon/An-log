/**
 * My Anílog Tab — Collection Grid
 *
 * BioField Scanner MK-II skeuomorphic grid with inset/raised filter chips.
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
const SIDE_PAD = 20;
const CARD_WIDTH = (SCREEN_WIDTH - SIDE_PAD * 2 - COLUMN_GAP) / 2;

type FilterOption = 'all' | AnimonType;

const FILTER_OPTIONS: Array<{ key: FilterOption; label: string; emoji: string }> = [
  { key: 'all', label: 'All', emoji: '✦' },
  ...ANIMON_TYPES.map((t) => ({
    key: t as FilterOption,
    label: TYPE_DEFINITIONS[t].label,
    emoji: TYPE_DEFINITIONS[t].emoji,
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
    activeFilter === 'all' ? '' : TYPE_DEFINITIONS[activeFilter as AnimonType]?.label ?? '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>My Anílog</Text>
        <View style={styles.specimenBadge}>
          <Text style={styles.specimenText}>{MOCK_ANIMONS.length} SPECIMENS LOGGED</Text>
        </View>
      </View>

      {/* Filter chips — raised (inactive) / inset (active) */}
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
                isActive ? styles.filterChipActive : styles.filterChipInactive,
              ]}
              onPress={() => setActiveFilter(opt.key)}
            >
              {isActive && opt.key !== 'all' && (
                <Text style={styles.filterEmoji}>{opt.emoji}</Text>
              )}
              <Text
                style={[
                  styles.filterChipText,
                  isActive && { color: typeColor ?? colors.scannerGreenLight },
                  !isActive && styles.filterChipTextInactive,
                ]}
              >
                {isActive && opt.key === 'all' ? `${opt.emoji} ${opt.label}` : opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Grid */}
      {filteredAnimons.length === 0 ? (
        <EmptyState
          emoji="🌿"
          title={`No ${activeFilterLabel} Anímon yet`}
          description="Get out there and catch some! 🌿"
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
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  header: {
    paddingHorizontal: SIDE_PAD,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: colors.screenBg,
  },
  heading: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.textPrimary,
  },
  specimenBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: colors.deviceBezel,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specimenText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 12,
    color: colors.amberReadout,
  },
  filterScroll: {
    maxHeight: 52,
    backgroundColor: colors.screenBg,
  },
  filterRow: {
    paddingHorizontal: SIDE_PAD,
    gap: 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 4,
  },
  filterChipInactive: {
    backgroundColor: colors.surfacePanel,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    // Raised shadow (inactive)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  filterChipActive: {
    // Inset / pressed-in effect
    backgroundColor: colors.surfaceInset,
    borderWidth: 1,
    borderTopColor: '#B8AD96',
    borderBottomColor: '#E8E2D0',
    borderLeftColor: '#B8AD96',
    borderRightColor: '#E8E2D0',
    elevation: 0,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
  },
  filterChipTextInactive: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyMedium,
  },
  filterEmoji: {
    fontSize: 14,
  },
  grid: {
    paddingHorizontal: SIDE_PAD,
    paddingTop: 4,
    paddingBottom: 24,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
});
