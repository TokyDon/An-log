/**
 * Profile Tab — Naturalist Field Journal v3
 *
 * Real data: useCollection() for animon stats, authStore + AsyncStorage for user.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { AnimonCard } from '../../components/ui/AnimonCard';
import { useCollection } from '../../features/collection/useCollection';
import { useCollectionStore } from '../../store/collectionStore';
import { useAuthStore } from '../../store/authStore';
import type { Animon, AnimonRarity } from '../../types/animon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ALL_RARITIES: AnimonRarity[] = ['common', 'uncommon', 'rare', 'glossy'];

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

export default function ProfileScreen() {
  const { data: supabaseAnimons = [], isLoading } = useCollection();
  const localAnimons = useCollectionStore((s) => s.animons);
  // Merge local (starters) + server, deduped by id
  const animons = React.useMemo(() => {
    const localIds = new Set(localAnimons.map((a) => a.id));
    return [...localAnimons, ...supabaseAnimons.filter((a) => !localIds.has(a.id))];
  }, [localAnimons, supabaseAnimons]);
  const user = useAuthStore((s) => s.user);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('username').then(setStoredUsername);
  }, []);

  const username =
    storedUsername ??
    user?.username ??
    user?.displayName ??
    'Trainer';
  const initials = username.slice(0, 2).toUpperCase();
  const memberSince = user?.createdAt ? formatMemberSince(user.createdAt) : null;

  // Derived stats
  const totalCaught = animons.length;
  const uniqueSpecies = new Set(animons.map((a) => a.species)).size;
  const uniqueRegions = new Set(animons.map((a) => a.region).filter(Boolean)).size;

  const STAT_PANELS = [
    { label: 'CAUGHT',  value: String(totalCaught)   },
    { label: 'SPECIES', value: String(uniqueSpecies)  },
    { label: 'REGIONS', value: String(uniqueRegions)  },
  ];

  // Sort by capturedAt desc, take 3
  const recentThree: Animon[] = [...animons]
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())
    .slice(0, 3);

  // Rarity bar — all rarities shown in legend, only non-zero in bar
  const allRaritySegments = ALL_RARITIES.map((r) => ({
    rarity: r,
    count: animons.filter((a) => a.rarity === r).length,
  }));
  const rarityBarSegments = allRaritySegments.filter((s) => s.count > 0);
  const totalForBar = rarityBarSegments.reduce((sum, s) => sum + s.count, 0);

  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero zone ─────────────────────────────────────────── */}
        <View style={styles.heroZone}>
          <View
            style={[
              styles.heroOverlay,
              { backgroundColor: colors.overlayDark },
            ]}
          />
          {/* Avatar */}
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.username}>{username}</Text>
          {memberSince && (
            <Text style={styles.memberSince}>
              TRAINER SINCE {memberSince.toUpperCase()}
            </Text>
          )}
        </View>

        {/* ── Stat strip ─────────────────────────────────────────── */}
        {isLoading ? (
          <View style={styles.loadingStrip}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <View style={styles.statStrip}>
            {STAT_PANELS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statPanel}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}

        {/* ── Rarity breakdown bar ───────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RARITY BREAKDOWN</Text>
        </View>
        <View style={styles.rarityBarWrap}>
          {totalForBar > 0 ? (
            <View style={styles.rarityBar}>
              {rarityBarSegments.map((seg) => (
                <View
                  key={seg.rarity}
                  style={[
                    styles.raritySegment,
                    {
                      flex: seg.count / totalForBar,
                      backgroundColor: colors.rarity[seg.rarity].bg,
                    },
                  ]}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.rarityBar, { backgroundColor: colors.border }]} />
          )}
          <View style={styles.rarityLegend}>
            {allRaritySegments.map((seg) => (
              <View key={seg.rarity} style={styles.rarityLegendItem}>
                <View
                  style={[
                    styles.rarityDot,
                    { backgroundColor: colors.rarity[seg.rarity].bg },
                  ]}
                />
                <Text style={styles.rarityLegendText}>
                  {seg.rarity.toUpperCase()} {seg.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recent Catches ─────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT CATCHES</Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : recentThree.length === 0 ? (
          <View style={styles.emptyRecent}>
            <Text style={styles.emptyRecentText}>
              No Anímons yet — start scanning!
            </Text>
            <TouchableOpacity
              style={styles.emptyRecentBtn}
              onPress={() => router.push('/camera')}
            >
              <Text style={styles.emptyRecentBtnText}>START SCANNING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentThree.map((animon) => (
              <AnimonCard
                key={animon.id}
                animon={animon}
                compact
                showPhoto
                onPress={handleCardPress}
              />
            ))}
          </View>
        )}

        {/* ── Anílog+ banner ─────────────────────────────────────── */}
        <View style={styles.bannerWrap}>
          <View style={styles.upgradeBanner}>
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>Anílog+ ✨</Text>
              <Text style={styles.upgradeSub}>
                Unlock unlimited captures + Glossy Radar
              </Text>
            </View>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>UPGRADE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: { paddingBottom: 16 },

  // Hero zone
  heroZone: {
    height: 210,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    marginBottom: 0,
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: colors.borderStrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.bezel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.xl,
    color: colors.accent,
  },
  username: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.textInverse,
  },
  memberSince: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.87)',
    marginTop: 4,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Loading placeholder for stat strip
  loadingStrip: {
    height: 72,
    marginHorizontal: 16,
    marginTop: -1,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Stat strip
  statStrip: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    marginHorizontal: 16,
    marginTop: -1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  statPanel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  statValue: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
    lineHeight: typography.fontSize['2xl'] * 1.1,
  },
  statLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    marginTop: 4,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Section labels
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },

  // Rarity bar
  rarityBarWrap: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  rarityBar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
    gap: 2,
  },
  raritySegment: {
    height: 16,
    borderRadius: 4,
  },
  rarityLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  rarityLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityLegendText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
  },

  // Loading / empty for recent
  loadingRow: {
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyRecent: {
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  emptyRecentText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text2,
  },
  emptyRecentBtn: {
    backgroundColor: colors.accent,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyRecentBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    letterSpacing: 1.2,
  },

  // Recent catches
  recentList: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },

  // Upgrade banner
  bannerWrap: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  upgradeBanner: {
    backgroundColor: colors.accentSoft,
    borderRadius: 4,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeText: { flex: 1, gap: 3 },
  upgradeTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.lg,
    color: colors.accentDeep,
  },
  upgradeSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  upgradeBtn: {
    backgroundColor: colors.accentDeep,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  upgradeBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    letterSpacing: 1,
  },
});
