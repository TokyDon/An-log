/**
 * Anímon Detail Screen — v2 Flutter-style
 *
 * Hero image with type-color bg, tab-based bottom sheet:
 * OVERVIEW · FIELD DATA · NOTES
 * Route: /animon/[id]
 */

import React, { useState } from 'react';
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
import { getTypeDefinition } from '../../constants/typeSystem';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { TypeTagChip } from '../../components/ui/TypeTagChip';
import { useCollectionStore } from '../../store/collectionStore';
import { usePartyStore } from '../../store/partyStore';

const { width: W } = Dimensions.get('window');
const HERO_HEIGHT = 300;
const TAB_BAR_HEIGHT = 44;

type Tab = 'overview' | 'field' | 'notes';

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'field',    label: 'FIELD DATA' },
  { key: 'notes',    label: 'NOTES' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function genderLabel(g: string): string {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

export default function AnimonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const animons = useCollectionStore((s) => s.animons);
  const partySlots = usePartyStore((s) => s.slots);
  const animon =
    animons.find((a) => a.id === id) ??
    partySlots.flatMap((s) => (s ? [s.animon] : [])).find((a) => a.id === id);

  const [activeTab, setActiveTab] = useState<Tab>('overview');

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

  const def = getTypeDefinition(animon.types[0]);
  const typeColor = def.color;
  const typeTextColor = def.textColor;
  const textAlpha = typeTextColor === '#FFFFFF' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.55)';

  return (
    <View style={[styles.container, { backgroundColor: typeColor }]}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <View style={[styles.hero, { height: HERO_HEIGHT }]}>
        {/* Decorative ring — top right */}
        <View style={styles.heroRingOuter} />
        <View style={styles.heroRingInner} />

        {/* Photo */}
        <Image
          source={{ uri: animon.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />

        {/* Bottom gradient */}
        <LinearGradient
          colors={['transparent', typeColor]}
          locations={[0.35, 1]}
          style={styles.heroGradient}
        />

        {/* Species name */}
        <View style={styles.heroNameWrap}>
          <Text style={[styles.heroSpecies, { color: typeTextColor }]} numberOfLines={2}>
            {animon.species}
          </Text>
        </View>
      </View>

      {/* ── Back button ─────────────────────────────────────────────── */}
      <SafeAreaView style={styles.backSafe} edges={['top']} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Bottom sheet ────────────────────────────────────────────── */}
      <View style={[styles.sheet, { marginTop: HERO_HEIGHT - 28 }]}>
        <View style={styles.sheetHandle} />

        {/* Type chips + rarity row */}
        <View style={styles.chipRow}>
          {animon.types.map((t) => (
            <TypeTagChip key={t} type={t} />
          ))}
          <RarityBadge rarity={animon.rarity} />
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.key && { color: colors.accent }]}>
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View style={[styles.tabIndicator, { backgroundColor: colors.accent }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.tabContent}
        >
          {activeTab === 'overview' && <OverviewTab animon={animon} typeColor={typeColor} />}
          {activeTab === 'field' && <FieldDataTab animon={animon} typeColor={typeColor} />}
          {activeTab === 'notes' && <NotesTab animon={animon} />}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function OverviewTab({ animon, typeColor }: { animon: NonNullable<ReturnType<typeof useCollectionStore.getState>['animons'][0]>; typeColor: string }) {
  return (
    <View style={tab.container}>
      {/* Stat grid 2×2 */}
      <View style={tab.grid}>
        <StatCell label="GENDER"    value={genderLabel(animon.gender)} accent={typeColor} />
        <StatCell label="COLOUR"    value={animon.colour}              accent={typeColor} />
        <StatCell label="REGION"    value={animon.region}              accent={typeColor} />
        <StatCell label="CAUGHT"    value={formatDate(animon.capturedAt)} accent={typeColor} />
      </View>
    </View>
  );
}

function FieldDataTab({ animon, typeColor }: { animon: NonNullable<ReturnType<typeof useCollectionStore.getState>['animons'][0]>; typeColor: string }) {
  const conf = Math.round(animon.confidenceScore * 100);
  return (
    <View style={tab.container}>
      {/* Confidence bar */}
      <View style={tab.section}>
        <Text style={tab.sectionTitle}>SCAN CONFIDENCE</Text>
        <View style={tab.barTrack}>
          <View style={[tab.barFill, { width: `${conf}%` as any, backgroundColor: typeColor }]} />
        </View>
        <Text style={[tab.barLabel, { color: typeColor }]}>{conf}%</Text>
      </View>

      {/* Specimen ID */}
      <View style={tab.idStrip}>
        <Text style={tab.idLabel}>SPECIMEN ID</Text>
        <Text style={tab.idValue}>#{animon.id.padStart(4, '0')}</Text>
      </View>

      {/* Age & rarity */}
      <View style={tab.grid}>
        <StatCell label="AGE STAGE"  value={animon.ageStage ?? '—'} accent={typeColor} />
        <StatCell label="RARITY"     value={animon.rarity.toUpperCase()} accent={typeColor} />
      </View>
    </View>
  );
}

function NotesTab({ animon }: { animon: NonNullable<ReturnType<typeof useCollectionStore.getState>['animons'][0]> }) {
  const rows: Array<{ key: string; value: string }> = [
    { key: 'REGION',    value: animon.region },
    { key: 'CAPTURED',  value: formatDate(animon.capturedAt) },
    { key: 'CONFIDENCE', value: `${Math.round(animon.confidenceScore * 100)}%` },
    { key: 'GENDER',    value: genderLabel(animon.gender) },
    { key: 'COLOUR',    value: animon.colour },
  ];
  return (
    <View style={tab.container}>
      <View style={tab.notesCard}>
        <Text style={tab.sectionTitle}>CAPTURE NOTES</Text>
        {rows.map((row, i) => (
          <View key={row.key}>
            {i > 0 && <View style={tab.sep} />}
            <View style={tab.noteRow}>
              <Text style={tab.noteKey}>{row.key}</Text>
              <Text style={tab.noteVal}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function StatCell({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <View style={[tab.statCell, { borderTopColor: accent, borderTopWidth: 2 }]}>
      <Text style={tab.statLabel}>{label}</Text>
      <Text style={tab.statValue}>{value}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Hero
  hero: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    overflow: 'hidden',
  },
  heroRingOuter: {
    position: 'absolute',
    top: -60, right: -60,
    width: 240, height: 240,
    borderRadius: 120,
    borderWidth: 36,
    borderColor: 'rgba(255,255,255,0.08)',
    zIndex: 1,
  },
  heroRingInner: {
    position: 'absolute',
    top: 20, right: 20,
    width: 120, height: 120,
    borderRadius: 60,
    borderWidth: 18,
    borderColor: 'rgba(255,255,255,0.06)',
    zIndex: 1,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '75%',
  },
  heroNameWrap: {
    position: 'absolute',
    bottom: 24, left: 20, right: 20,
  },
  heroSpecies: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },

  // Back button
  backSafe: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
  },
  backBtn: {
    marginTop: 12,
    marginLeft: 16,
    width: 42, height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  backIcon: {
    fontSize: 18,
    color: colors.textInverse,
    fontFamily: typography.fontFamily.bodyBold,
  },

  // Bottom sheet
  sheet: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetHandle: {
    width: 40, height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: 'center',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: 16,
    height: TAB_BAR_HEIGHT,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabItemActive: {},
  tabLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.wide,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8, right: 8,
    height: 2,
    borderRadius: 1,
  },
  tabContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
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

const tab = StyleSheet.create({
  container: { gap: 16 },

  // Stat grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCell: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.wide,
  },
  statValue: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.md,
    color: colors.text1,
    lineHeight: typography.fontSize.md * typography.lineHeight.tight,
  },

  // Section title
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
    marginBottom: 10,
  },

  // Confidence bar
  section: { gap: 0 },
  barTrack: {
    height: 10,
    backgroundColor: colors.surface2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  barLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    marginTop: 6,
    letterSpacing: typography.letterSpacing.label,
  },

  // Specimen ID strip
  idStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  idLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.wide,
  },
  idValue: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.md,
    color: colors.text1,
  },

  // Notes tab
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sep: {
    height: 1,
    backgroundColor: colors.border,
  },
  noteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  noteKey: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.label,
  },
  noteVal: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text1,
  },
});
