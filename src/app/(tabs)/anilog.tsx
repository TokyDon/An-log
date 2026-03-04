/**
 * My Anílog Tab — Collection Grid
 *
 * Full Anímon collection with type filter chips and 2-column card grid.
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
import { MOCK_ANIMONS, MOCK_USER } from '../../data/mockAnimons';
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
        <Text style={styles.count}>{MOCK_ANIMONS.length} Anímon</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {FILTER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.filterChip,
              activeFilter === opt.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(opt.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === opt.key && styles.filterChipTextActive,
              ]}
            >
              {opt.emoji} {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: SIDE_PAD,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    color: colors.text.primary,
  },
  count: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  filterScroll: {
    maxHeight: 52,
  },
  filterRow: {
    paddingHorizontal: SIDE_PAD,
    gap: 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.inverse,
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
