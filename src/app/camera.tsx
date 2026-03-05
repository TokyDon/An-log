/**
 * Camera Screen — Full-Screen Modal
 *
 * BioField Scanner MK-II — amber reticle, scan-line animation,
 * dark device chrome, result bottom sheet.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RarityBadge } from '../components/ui/RarityBadge';
import { TypeTagChip } from '../components/ui/TypeTagChip';
import { MOCK_ANIMONS } from '../data/mockAnimons';

const { width: W, height: H } = Dimensions.get('window');
const RETICLE_SIZE = 240;
const CORNER = 24;
const CORNER_T = 3;

const MOCK_RESULT = MOCK_ANIMONS[9]; // Red Fox — rare

type CaptureState = 'idle' | 'scanning' | 'result';

export default function CameraScreen() {
  const [captureState, setCaptureState] = useState<CaptureState>('idle');

  // Scan line Y offset (within reticle)
  const scanY = useSharedValue(0);
  // Blink text
  const blinkOpacity = useSharedValue(1);
  // Pulse ring
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  // Result card
  const resultY = useSharedValue(H);

  useEffect(() => {
    // Scan line loop
    scanY.value = withRepeat(
      withSequence(
        withTiming(RETICLE_SIZE - 4, { duration: 1600, easing: Easing.linear }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
    // Blink
    blinkOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ),
      -1,
      false,
    );
    // Pulse ring
    pulseScale.value = withRepeat(
      withTiming(1.25, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.0, { duration: 1800 }),
        withTiming(0.4, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, []);

  const scanLine = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));
  const blinkStyle = useAnimatedStyle(() => ({ opacity: blinkOpacity.value }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: resultY.value }],
  }));

  function handleCapture() {
    if (captureState !== 'idle') return;
    setCaptureState('scanning');
    setTimeout(() => {
      setCaptureState('result');
      resultY.value = withSpring(0, { damping: 22, stiffness: 100 });
    }, 1800);
  }

  function handleRetry() {
    resultY.value = withTiming(H, { duration: 300 });
    setTimeout(() => setCaptureState('idle'), 320);
  }

  function handleAdd() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Viewfinder ──────────────────────────────────────────── */}
      <View style={styles.viewfinder}>
        <Image
          source={{ uri: MOCK_RESULT.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          blurRadius={captureState === 'scanning' ? 3 : 0}
        />
        <View style={styles.overlay} />

        {/* Reticle */}
        <View style={styles.reticleWrap}>
          {/* Pulse ring */}
          <Animated.View style={[styles.pulseRing, pulseStyle]} />

          {/* Amber corner brackets */}
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Animated scan line */}
            <View style={styles.scanLineClip}>
              <Animated.View style={[styles.scanLine, scanLine]} />
            </View>
          </View>

          {/* Status text */}
          <Animated.View style={[styles.statusWrap, blinkStyle]}>
            <Text style={styles.statusText}>
              {captureState === 'scanning' ? 'IDENTIFYING...' : 'SCANNING...'}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topLabel}>SCANNER MK-II</Text>
        <View style={styles.modeToggle}>
          <Text style={styles.modeActive}>PHOTO</Text>
          <Text style={styles.modeInactive}>VIDEO</Text>
        </View>
      </View>

      {/* ── Shutter panel ──────────────────────────────────────── */}
      {captureState !== 'result' && (
        <View style={styles.shutterPanel}>
          {/* Gallery thumb placeholder */}
          <View style={styles.galleryThumb} />

          {/* Shutter button */}
          <TouchableOpacity
            onPress={handleCapture}
            disabled={captureState === 'scanning'}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                captureState === 'scanning'
                  ? ['#3A3530', '#2C2416', '#3A3530']
                  : ['#D4AF37', '#FFD700', '#B8860B', '#FFD700', '#D4AF37']
              }
              style={styles.shutterOuter}
            >
              <View style={styles.shutterInner} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Flash toggle */}
          <TouchableOpacity style={styles.flashToggle}>
            <Text style={styles.flashIcon}>⚡</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Result card ─────────────────────────────────────────── */}
      <Animated.View style={[styles.resultCard, resultStyle]}>
        <View style={styles.resultHandle} />

        <Text style={styles.captureConfirm}>CAPTURE CONFIRMED ✓</Text>

        <View style={styles.resultImageRow}>
          <Image
            source={{ uri: MOCK_RESULT.photoUrl }}
            style={styles.resultThumb}
            contentFit="cover"
          />
          <View style={styles.resultInfo}>
            <Text style={styles.resultSpecies}>{MOCK_RESULT.species}</Text>
            {MOCK_RESULT.breed && (
              <Text style={styles.resultBreed}>{MOCK_RESULT.breed}</Text>
            )}
            <Text style={styles.resultConfidence}>
              {Math.round(MOCK_RESULT.confidenceScore * 100)}% MATCH
            </Text>
          </View>
        </View>

        <View style={styles.resultTags}>
          {MOCK_RESULT.types.map((t) => (
            <TypeTagChip key={t} type={t} size="sm" />
          ))}
        </View>

        <View style={styles.resultRarity}>
          <RarityBadge rarity={MOCK_RESULT.rarity} size="lg" />
          <Text style={styles.resultRegion}>📍 {MOCK_RESULT.region}</Text>
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryBtnText}>RETRY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>ADD TO ANÍLOG</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A05',
  },
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },

  // Reticle
  reticleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingTop: 60,
  },
  pulseRing: {
    position: 'absolute',
    width: RETICLE_SIZE + 28,
    height: RETICLE_SIZE + 28,
    borderRadius: (RETICLE_SIZE + 28) / 2,
    borderWidth: 2,
    borderColor: colors.amberGlow,
  },
  reticle: {
    width: RETICLE_SIZE,
    height: RETICLE_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.amberGlow,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_T,
    borderLeftWidth: CORNER_T,
    borderTopLeftRadius: 3,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_T,
    borderRightWidth: CORNER_T,
    borderTopRightRadius: 3,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_T,
    borderLeftWidth: CORNER_T,
    borderBottomLeftRadius: 3,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_T,
    borderRightWidth: CORNER_T,
    borderBottomRightRadius: 3,
  },
  scanLineClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.amberGlow,
    opacity: 0.75,
    shadowColor: colors.amberGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.80,
    shadowRadius: 6,
  },
  statusWrap: { alignItems: 'center' },
  statusText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.inkAmber,
    letterSpacing: 2,
  },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.deviceBezel,
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.instrumentBrass,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.inkInverse,
    fontSize: 15,
    fontFamily: typography.fontFamily.bodyBold,
  },
  topLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.inkAmber,
    textAlign: 'center',
    letterSpacing: 2,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  modeActive: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 11,
    color: colors.inkAmber,
    letterSpacing: 1,
  },
  modeInactive: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: colors.inkFaded,
    letterSpacing: 1,
  },

  // Shutter panel
  shutterPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.deviceBezel,
    borderTopWidth: 1,
    borderTopColor: colors.instrumentBrass,
    paddingVertical: 24,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 44,
  },
  galleryThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.instrumentBrass,
    borderWidth: 1,
    borderColor: colors.instrumentBrassLight,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.amberGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 10,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(244,225,176,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  flashToggle: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.instrumentBrass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.instrumentBrassLight,
  },
  flashIcon: { fontSize: 20 },

  // Result card
  resultCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardStock,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 14,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 24,
  },
  resultHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.inkRule,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  captureConfirm: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.mossLight,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  resultImageRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  resultThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inkRule,
  },
  resultInfo: { flex: 1, gap: 4 },
  resultSpecies: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.inkBlack,
    lineHeight: typography.fontSize['2xl'] * 1.12,
  },
  resultBreed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.inkBrown,
  },
  resultConfidence: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.inkAmber,
    letterSpacing: 1,
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resultRarity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultRegion: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.inkBrown,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  retryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.inkRule,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.inkBrown,
    letterSpacing: 1,
  },
  addBtn: {
    flex: 2,
    backgroundColor: colors.forestFloor,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.amberGlow,
    shadowColor: colors.amberGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 7,
  },
  addBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.inkInverse,
    letterSpacing: 1,
  },
});
