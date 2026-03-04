/**
 * Camera Screen — Full-Screen Modal
 *
 * Simulated viewfinder with animated scanning reticle.
 * Capture flow: Press button → 1500ms scanning state → slide-up result card.
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
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RarityBadge } from '../components/ui/RarityBadge';
import { TypeTagChip } from '../components/ui/TypeTagChip';
import { MOCK_ANIMONS } from '../data/mockAnimons';

const { width: W, height: H } = Dimensions.get('window');
const RETICLE_SIZE = W * 0.72;

// The mock result the camera will "identify"
const MOCK_RESULT = MOCK_ANIMONS[9]; // Red Fox — rare

type CaptureState = 'idle' | 'scanning' | 'result';

export default function CameraScreen() {
  const [captureState, setCaptureState] = useState<CaptureState>('idle');

  // Scanning reticle pulse
  const reticleOpacity = useSharedValue(0.5);
  // Result card slide up
  const resultY = useSharedValue(H);

  useEffect(() => {
    reticleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.35, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, []);

  const reticleStyle = useAnimatedStyle(() => ({
    opacity: reticleOpacity.value,
  }));

  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: resultY.value }],
  }));

  function handleCapture() {
    if (captureState !== 'idle') return;
    setCaptureState('scanning');
    // After 1500ms reveal result card
    setTimeout(() => {
      setCaptureState('result');
      resultY.value = withSpring(0, { damping: 22, stiffness: 100 });
    }, 1500);
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

      {/* ── Simulated viewfinder ─────────────────────────────────── */}
      <View style={styles.viewfinder}>
        {/* Background image to simulate "what the camera sees" */}
        <Image
          source={{ uri: MOCK_RESULT.photoUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          blurRadius={captureState === 'scanning' ? 2 : 0}
        />
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Reticle — animated corner brackets */}
        <View style={styles.reticleContainer}>
          <Animated.View style={[styles.reticle, reticleStyle]}>
            {/* Top-left corner */}
            <View style={[styles.corner, styles.cornerTL]} />
            {/* Top-right corner */}
            <View style={[styles.corner, styles.cornerTR]} />
            {/* Bottom-left corner */}
            <View style={[styles.corner, styles.cornerBL]} />
            {/* Bottom-right corner */}
            <View style={[styles.corner, styles.cornerBR]} />
          </Animated.View>

          {captureState === 'scanning' && (
            <Text style={styles.scanningText}>Scanning... 🔍</Text>
          )}
        </View>
      </View>

      {/* ── Top controls ─────────────────────────────────────────── */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Catch Anímon</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Capture button ──────────────────────────────────────── */}
      {captureState !== 'result' && (
        <View style={styles.captureArea}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              captureState === 'scanning' && styles.captureButtonScanning,
            ]}
            onPress={handleCapture}
            disabled={captureState === 'scanning'}
            activeOpacity={0.8}
          >
            <Text style={styles.captureIcon}>
              {captureState === 'scanning' ? '⌛' : '🐾'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.captureHint}>
            {captureState === 'scanning' ? 'Identifying...' : 'Tap to capture'}
          </Text>
        </View>
      )}

      {/* ── Result card (slides up) ──────────────────────────────── */}
      <Animated.View style={[styles.resultCard, resultStyle]}>
        <View style={styles.resultHandle} />

        <View style={styles.resultImageRow}>
          <Image
            source={{ uri: MOCK_RESULT.photoUrl }}
            style={styles.resultThumb}
            contentFit="cover"
          />
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle}>
              {MOCK_RESULT.species} identified! 🦊
            </Text>
            {MOCK_RESULT.breed && (
              <Text style={styles.resultBreed}>{MOCK_RESULT.breed}</Text>
            )}
            <Text style={styles.resultConfidence}>
              {Math.round(MOCK_RESULT.confidenceScore * 100)}% confident
            </Text>
          </View>
        </View>

        {/* Type chips */}
        <View style={styles.resultTags}>
          {MOCK_RESULT.types.map((t) => (
            <TypeTagChip key={t} type={t} size="sm" />
          ))}
        </View>

        {/* Rarity */}
        <View style={styles.resultRarity}>
          <RarityBadge rarity={MOCK_RESULT.rarity} size="lg" />
          <Text style={styles.resultRegion}>📍 {MOCK_RESULT.region}</Text>
        </View>

        {/* Actions */}
        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Add to Anílog ✓</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const CORNER = 22;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  // Reticle
  reticleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  scanningText: {
    marginTop: RETICLE_SIZE / 2 + 20,
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.base,
  },
  // Top controls
  topControls: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: typography.fontFamily.bodyBold,
  },
  topTitle: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.lg,
  },
  // Capture button
  captureArea: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  captureButtonScanning: {
    backgroundColor: '#4A4A4A',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  captureIcon: { fontSize: 32 },
  captureHint: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
  },
  // Result card
  resultCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 20,
  },
  resultHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
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
  },
  resultInfo: {
    flex: 1,
    gap: 4,
  },
  resultTitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize['2xl'],
    color: colors.text.primary,
    lineHeight: typography.fontSize['2xl'] * 1.1,
  },
  resultBreed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  resultConfidence: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
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
    color: colors.text.secondary,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  retryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  addBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: colors.text.inverse,
  },
});
