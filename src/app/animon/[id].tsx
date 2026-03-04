/**
 * Anímon Detail Screen
 *
 * Full-page detail for a captured Anímon.
 * Route: /animon/[id]
 *
 * Layout:
 *   - Hero image (top ~55%)
 *   - Floating back button
 *   - Bottom sheet with species info, stats grid, region footer
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
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { TypeTagChip } from '../../components/ui/TypeTagChip';
import { MOCK_ANIMONS } from '../../data/mockAnimons';

const { width: W, height: H } = Dimensions.get('window');
const HERO_HEIGHT = H * 0.50;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function genderLabel(g: string): string {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

export default function AnimonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const animon = MOCK_ANIMONS.find((a) => a.id === id);

  if (!animon) {
    return (
      <SafeAreaView style={styles.notFound}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.notFoundText}>Anímon not found</Text>
      </SafeAreaView>
    );
  }

  const STAT_GRID = [
    { label: 'Gender',     value: genderLabel(animon.gender) },
    { label: 'Colour',     value: animon.colour },
    { label: 'Confidence', value: `${Math.round(animon.confidenceScore * 100)}%` },
    { label: 'Caught',     value: formatDate(animon.capturedAt) },
  ];

  return (
    <View style={styles.container}>
      {/* ── Hero Image ──────────────────────────────────────────── */}
      <View style={styles.hero}>
        <Image
          source={{ uri: animon.photoUrl }}
          style={styles.heroImage}
          contentFit="cover"
          transition={200}
        />
        {/* Gradient-style overlay at bottom of image */}
        <View style={styles.heroOverlay} />

        {/* Photo credit / location */}
        <View style={styles.heroCredit}>
          <Text style={styles.heroCreditText}>
            📍 {animon.region}
          </Text>
          <Text style={styles.heroCreditText}>
            {formatDate(animon.capturedAt)}
          </Text>
        </View>
      </View>

      {/* ── Floating back button ─────────────────────────────────── */}
      <SafeAreaView style={styles.backSafe} edges={['top']} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Bottom Sheet ─────────────────────────────────────────── */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Drag handle */}
        <View style={styles.sheetHandle} />

        {/* Species & breed */}
        <View style={styles.nameRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.speciesName} numberOfLines={2}>
              {animon.species}
            </Text>
            {animon.breed && (
              <Text style={styles.breedName}>{animon.breed}</Text>
            )}
          </View>
          <RarityBadge rarity={animon.rarity} size="md" />
        </View>

        {/* Type chips */}
        <View style={styles.typesRow}>
          {animon.types.map((t) => (
            <TypeTagChip key={t} type={t} />
          ))}
        </View>

        {/* Rarity large badge + ID */}
        <View style={styles.rarityRow}>
          <RarityBadge rarity={animon.rarity} size="lg" />
          <Text style={styles.animonId}>ID #{animon.id.padStart(4, '0')}</Text>
        </View>

        {/* Stats 2×2 grid */}
        <View style={styles.statsGrid}>
          {STAT_GRID.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Region footer */}
        <View style={styles.regionFooter}>
          <Text style={styles.regionFooterText}>
            📍 Captured in {animon.region}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Hero
  hero: {
    height: HERO_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  heroCredit: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroCreditText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.9)',
  },
  // Back button
  backSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    marginTop: 12,
    marginLeft: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  backIcon: {
    fontSize: 18,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bodyBold,
  },
  // Bottom sheet
  sheet: {
    flex: 1,
    marginTop: HERO_HEIGHT - 28,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    padding: 24,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  nameBlock: { flex: 1 },
  speciesName: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
    lineHeight: typography.fontSize['2xl'] * 1.15,
  },
  breedName: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: 4,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  animonId: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCell: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  // Region footer
  regionFooter: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  regionFooterText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
  // Not found
  notFound: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
});
