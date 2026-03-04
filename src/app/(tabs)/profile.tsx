/**
 * Profile Tab
 *
 * User avatar, stats cards, rarity breakdown, recent activity, upgrade banner.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { AnimonCard } from '../../components/ui/AnimonCard';
import { MOCK_ANIMONS, MOCK_USER } from '../../data/mockAnimons';
import type { Animon } from '../../types/animon';

const RARITY_BREAKDOWN = [
  { label: 'Common',   color: colors.rarity.common,   count: 6,  max: 12 },
  { label: 'Uncommon', color: colors.rarity.uncommon, count: 3,  max: 12 },
  { label: 'Rare',     color: colors.rarity.rare,     count: 2,  max: 12 },
  { label: 'Glossy',   color: colors.rarity.glossy,   count: 1,  max: 12 },
];

const STAT_CARDS = [
  { label: 'Total\nCaught',   value: String(MOCK_USER.totalCaught) },
  { label: 'Unique\nSpecies', value: String(MOCK_USER.uniqueSpecies) },
  { label: 'Regions\nExplored', value: String(MOCK_USER.regionsExplored) },
];

export default function ProfileScreen() {
  const recentThree = MOCK_ANIMONS.slice(0, 3);

  function handleCardPress(animon: Animon) {
    router.push(`/animon/${animon.id}`);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{MOCK_USER.initials}</Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.username}>{MOCK_USER.username}</Text>
            <Text style={styles.memberSince}>Member since {MOCK_USER.memberSince}</Text>
          </View>
        </View>

        {/* ── Stats cards ──────────────────────────────────────── */}
        <View style={styles.statsRow}>
          {STAT_CARDS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Rarity Breakdown ─────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rarity Breakdown</Text>
          <View style={styles.rarityList}>
            {RARITY_BREAKDOWN.map((r) => (
              <View key={r.label} style={styles.rarityRow}>
                <Text style={[styles.rarityLabel, { color: r.color }]}>{r.label}</Text>
                <View style={styles.rarityTrack}>
                  <View
                    style={[
                      styles.rarityFill,
                      {
                        width: `${(r.count / r.max) * 100}%` as any,
                        backgroundColor: r.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.rarityCount}>{r.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recent Activity ──────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Catches</Text>
          <View style={styles.recentCards}>
            {recentThree.map((animon) => (
              <AnimonCard
                key={animon.id}
                animon={animon}
                compact
                onPress={handleCardPress}
              />
            ))}
          </View>
        </View>

        {/* ── Upgrade banner ───────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.upgradeBanner}>
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>Anílog+ ✨</Text>
              <Text style={styles.upgradeSub}>
                Unlock unlimited captures + Glossy Radar
              </Text>
            </View>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>Upgrade</Text>
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
    backgroundColor: colors.background,
  },
  scrollContent: { paddingBottom: 16 },
  // Profile header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text.inverse,
  },
  profileMeta: { gap: 4 },
  username: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
  },
  memberSince: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.primary,
    lineHeight: typography.fontSize['2xl'] * 1.1,
  },
  statLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: typography.fontSize.xs * 1.5,
  },
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: 14,
  },
  // Rarity breakdown
  rarityList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rarityLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    width: 72,
  },
  rarityTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rarityFill: {
    height: '100%',
    borderRadius: 4,
  },
  rarityCount: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    width: 20,
    textAlign: 'right',
  },
  // Recent cards
  recentCards: { gap: 10 },
  // Upgrade banner
  upgradeBanner: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upgradeText: { flex: 1, gap: 3 },
  upgradeTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
  },
  upgradeSub: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    opacity: 0.75,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  upgradeBtn: {
    backgroundColor: colors.text.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  upgradeBtnText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.text.inverse,
  },
});
