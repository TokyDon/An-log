/**
 * Anímon Detail Screen
 *
 * BioField Scanner MK-II — hero with gradient name overlay,
 * data plate, stats grid, capture notes.
 * Route: /animon/[id]
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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { TypeTagChip } from '../../components/ui/TypeTagChip';
import { useCollectionStore } from '../../store/collectionStore';

const { height: H } = Dimensions.get('window');
const HERO_HEIGHT = 280;

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
  const animons = useCollectionStore((s) => s.animons);
  const animon = animons.find((a) => a.id === id);

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
    { label: 'GENDER',     value: genderLabel(animon.gender) },
    { label: 'COLOUR',     value: animon.colour },
    { label: 'CONFIDENCE', value: `${Math.round(animon.confidenceScore * 100)}%` },
    { label: 'CAUGHT',     value: formatDate(animon.capturedAt) },
  ];

  return (
    <View style={styles.container}>
      {/* ── Hero Image ──────────────────────────────────────────── */}
      <View style={[styles.hero, { height: HERO_HEIGHT }]}>
        <Image
          source={{ uri: animon.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        {/* Gradient fade at bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(26,18,8,0.88)']}
          style={styles.heroGradient}
        />
        {/* Species name on gradient */}
        <View style={styles.heroNameWrap}>
          <Text style={styles.heroSpecies} numberOfLines={2}>
            {animon.species}
          </Text>
          {animon.breed && (
            <Text style={styles.heroBreed}>{animon.breed}</Text>
          )}
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
        style={[styles.sheet, { marginTop: HERO_HEIGHT - 28 }]}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.sheetHandle} />

        {/* Data plate: types + rarity + date */}
        <View style={styles.dataPlate}>
          <View style={styles.typesRow}>
            {animon.types.map((t) => (
              <TypeTagChip key={t} type={t} />
            ))}
            <RarityBadge rarity={animon.rarity} />
          </View>
          <Text style={styles.dataDate}>
            {formatDate(animon.capturedAt)} · {animon.region}
          </Text>
        </View>

        {/* ID strip */}
        <View style={styles.idStrip}>
          <Text style={styles.idLabel}>SPECIMEN ID</Text>
          <Text style={styles.idValue}>#{animon.id.padStart(4, '0')}</Text>
        </View>

        {/* Stats 2×2 grid — dark bezel panels */}
        <View style={styles.statsGrid}>
          {STAT_GRID.map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Capture Notes card */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>CAPTURE NOTES</Text>
          <View style={styles.noteRow}>
            <Text style={styles.noteKey}>REGION</Text>
            <Text style={styles.noteVal}>{animon.region}</Text>
          </View>
          <View style={styles.noteSep} />
          <View style={styles.noteRow}>
            <Text style={styles.noteKey}>CONFIDENCE</Text>
            <Text style={styles.noteVal}>
              {Math.round(animon.confidenceScore * 100)}%
            </Text>
          </View>
          <View style={styles.noteSep} />
          <View style={styles.noteRow}>
            <Text style={styles.noteKey}>CAPTURED</Text>
            <Text style={styles.noteVal}>{formatDate(animon.capturedAt)}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Hero
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  heroNameWrap: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroSpecies: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: typography.fontSize['3xl'],
    fontStyle: 'italic',
    color: colors.textInverse,
    lineHeight: 36,
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroBreed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: 'rgba(245,240,232,0.80)',
    marginTop: 3,
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
    backgroundColor: 'rgba(26,18,8,0.70)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  backIcon: {
    fontSize: 18,
    color: colors.textInverse,
    fontFamily: typography.fontFamily.bodyBold,
  },

  // Bottom sheet
  sheet: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    padding: 20,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },

  // Data plate
  dataPlate: {
    marginBottom: 14,
    gap: 8,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  dataDate: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.text3,
    letterSpacing: 0.8,
  },

  // ID strip
  idStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  idLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.text1,
    letterSpacing: 1.5,
  },
  idValue: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 16,
    color: colors.text3,
    letterSpacing: 1,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCell: {
    flex: 1,
    minWidth: '44%',
    height: 80,
    backgroundColor: colors.bezel,
    borderRadius: 12,
    padding: 14,
    gap: 6,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  statLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.text3,
    letterSpacing: 1.5,
  },
  statValue: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 17,
    color: colors.accent,
  },

  // Capture notes
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.text3,
    letterSpacing: 2,
    marginBottom: 12,
  },
  noteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  noteSep: {
    height: 1,
    backgroundColor: colors.border,
  },
  noteKey: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.text3,
    letterSpacing: 1,
  },
  noteVal: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.text1,
  },

  // Not found
  notFound: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text2,
  },
});
