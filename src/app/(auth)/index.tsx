/**
 * Auth Gate Screen — /(auth)/index.tsx
 *
 * First screen for unauthenticated users.
 * Dark hero + ActionSheet panel pattern.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export default function AuthGateScreen() {
  const insets = useSafeAreaInsets();

  // ActionSheet slide-up animation on mount
  const actionSheetAnim = useRef(new Animated.Value(60)).current;
  const actionSheetOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(actionSheetAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(actionSheetOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Prevent Android back from leaving the auth gate
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => handler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <View style={styles.hero}>
        {/* Logo mark */}
        <View style={styles.logoMark}>
          <Text style={styles.logoGlyph}>Ā</Text>
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark}>ANÍLOG</Text>

        {/* Hero headline */}
        <Text style={styles.heroHeadline}>
          {'The wild is full of\nthings worth catching.'}
        </Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          {'Spot real animals. Catch them.\nBuild your party.'}
        </Text>
      </View>

      {/* ── ActionSheet ──────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.actionSheet,
          {
            paddingBottom: Math.max(24, insets.bottom + 16),
            transform: [{ translateY: actionSheetAnim }],
            opacity: actionSheetOpacity,
          },
        ]}
      >
        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Create account</Text>
        </TouchableOpacity>

        {/* Secondary CTA */}
        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.ghostBtnText}>Sign in</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          By continuing you agree to our{' '}
          <Text style={styles.legalLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text>
          .
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.navDark,
  },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    flex: 1,
    backgroundColor: colors.navDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoGlyph: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: 36,
    color: colors.textInverse,
  },
  wordmark: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.accent,
    marginBottom: 16,
  },
  heroHeadline: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['3xl'],
    color: colors.textInverse,
    textAlign: 'center',
    lineHeight: typography.fontSize['3xl'] * 1.05,
    letterSpacing: typography.letterSpacing.squeezed,
  },
  tagline: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
    marginTop: 12,
  },

  // ── ActionSheet ────────────────────────────────────────────────────────────
  actionSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accentDeep,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    letterSpacing: typography.letterSpacing.label,
    color: colors.textInverse,
  },
  ghostBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ghostBtnText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    letterSpacing: typography.letterSpacing.label,
    color: colors.accent,
  },
  legalText: {
    marginTop: 12,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: typography.fontSize.xs * 1.4,
  },
  legalLink: {
    color: colors.accent,
  },
});
