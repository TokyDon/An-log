/**
 * Camera Screen â€” Full-Screen Modal
 *
 * BioField Scanner MK-II â€” Phase 1 automatic scan loop.
 * Fires every 3 seconds, lock-on animation on detection, inline toasts.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RarityBadge } from '../components/ui/RarityBadge';
import { TypeTagChip } from '../components/ui/TypeTagChip';
import { AchievementUnlockToast } from '../components/ui/AchievementUnlockToast';
import { useCapture } from '../features/capture/useCapture';
import { getScanCount } from '../services/supabase/scans';
import { useAuthStore } from '../store/authStore';

const { height: H } = Dimensions.get('window');
const RETICLE_SIZE = 240;
const CORNER = 24;
const CORNER_T = 3;
const FREE_SCAN_LIMIT = 20;

type CaptureState = 'idle' | 'loop_active' | 'analysing' | 'lock_on' | 'result';

// â”€â”€â”€ Inline Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ToastProps {
  message: string;
  visible: boolean;
}

function InlineToast({ message, visible }: ToastProps) {
  const slideY = useSharedValue(64);

  useEffect(() => {
    slideY.value = withTiming(visible ? 0 : 64, { duration: 250 });
  }, [visible, slideY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  return (
    <Animated.View style={[styles.inlineToast, style]}>
      <Text style={styles.inlineToastText}>{message}</Text>
    </Animated.View>
  );
}

export default function CameraScreen() {
  const user = useAuthStore((s) => s.user);
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [flashOn, setFlashOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [scansUsed, setScansUsed] = useState(0);

  const cameraRef = useRef<CameraView>(null);
  /** Mirrors captureState synchronously for use inside async interval callbacks. */
  const captureStateRef = useRef<CaptureState>('idle');
  /** species â†’ timestamp of last successful capture this session. */
  const recentCapturesRef = useRef<Map<string, number>>(new Map());
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    captured,
    capturedPhotoUri,
    error,
    scanLimitReached,
    pendingAchievement,
    capture,
    reset,
    clearPendingAchievement,
  } = useCapture();

  // â”€â”€ Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const scanY = useSharedValue(0);
  const blinkOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  const resultY = useSharedValue(H);
  /** 0 = default reticle, 1 = fully locked-on. */
  const lockOnProgress = useSharedValue(0);

  // Keep ref mirroring state for async callbacks
  useEffect(() => {
    captureStateRef.current = captureState;
  }, [captureState]);

  // â”€â”€ Boot animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    scanY.value = withRepeat(
      withSequence(
        withTiming(RETICLE_SIZE - 4, { duration: 1600, easing: Easing.linear }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
    blinkOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ),
      -1,
      false,
    );
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // â”€â”€ Fetch initial scan count â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!user) return;
    getScanCount(user.id).then(setScansUsed).catch(() => {});
  }, [user]);

  // â”€â”€ Toast helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const showToast = useCallback((msg: string, duration: number) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), duration);
  }, []);

  // â”€â”€ Auto scan loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (captureState !== 'loop_active') return;

    const tick = async () => {
      if (captureStateRef.current !== 'loop_active') return;
      if (!cameraRef.current) return;

      captureStateRef.current = 'analysing';
      setCaptureState('analysing');

      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        if (captureStateRef.current !== 'analysing') return;

        if (!photo?.base64) {
          captureStateRef.current = 'loop_active';
          setCaptureState('loop_active');
          return;
        }

        await capture(photo.base64, photo.uri);
        // State transitions handled by useEffect watching `captured` / `error`
      } catch {
        if (captureStateRef.current === 'analysing') {
          captureStateRef.current = 'loop_active';
          setCaptureState('loop_active');
        }
      }
    };

    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [captureState, capture]);

  // â”€â”€ Handle successful capture â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!captured) return;

    const now = Date.now();
    const lastTime = recentCapturesRef.current.get(captured.species);

    if (lastTime !== undefined && now - lastTime < 5 * 60 * 1000) {
      showToast("You already have one nearby! Try something different.", 3000);
      reset();
      captureStateRef.current = 'loop_active';
      setCaptureState('loop_active');
      return;
    }

    recentCapturesRef.current.set(captured.species, now);

    captureStateRef.current = 'lock_on';
    setCaptureState('lock_on');
    lockOnProgress.value = withTiming(1, { duration: 1500 });

    const t = setTimeout(() => {
      captureStateRef.current = 'result';
      setCaptureState('result');
      resultY.value = withSpring(0, { damping: 22, stiffness: 100 });
      if (user) getScanCount(user.id).then(setScansUsed).catch(() => {});
    }, 1500);

    return () => clearTimeout(t);
  }, [captured]); // eslint-disable-line react-hooks/exhaustive-deps

  // â”€â”€ Handle capture error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!error) return;
    if (captureStateRef.current !== 'analysing') return;

    const lower = error.toLowerCase();
    if (lower.includes('screen')) {
      showToast("Point at a real animal!", 2000);
    } else if (!lower.includes('no animal')) {
      showToast(error, 3000);
    }
    // "no animal" â†’ silent, loop continues

    reset();
    captureStateRef.current = 'loop_active';
    setCaptureState('loop_active');
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  // â”€â”€ Animated styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const scanLine = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));
  const blinkStyle = useAnimatedStyle(() => ({ opacity: blinkOpacity.value }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: resultY.value }],
  }));

  // Lock-on: corners converge toward centre
  const cornerTLStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(lockOnProgress.value, [0, 1], [0, 8]) },
      { translateY: interpolate(lockOnProgress.value, [0, 1], [0, 8]) },
    ],
    opacity: interpolate(lockOnProgress.value, [0, 1], [0.85, 1]),
  }));
  const cornerTRStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(lockOnProgress.value, [0, 1], [0, -8]) },
      { translateY: interpolate(lockOnProgress.value, [0, 1], [0, 8]) },
    ],
    opacity: interpolate(lockOnProgress.value, [0, 1], [0.85, 1]),
  }));
  const cornerBLStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(lockOnProgress.value, [0, 1], [0, 8]) },
      { translateY: interpolate(lockOnProgress.value, [0, 1], [0, -8]) },
    ],
    opacity: interpolate(lockOnProgress.value, [0, 1], [0.85, 1]),
  }));
  const cornerBRStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(lockOnProgress.value, [0, 1], [0, -8]) },
      { translateY: interpolate(lockOnProgress.value, [0, 1], [0, -8]) },
    ],
    opacity: interpolate(lockOnProgress.value, [0, 1], [0.85, 1]),
  }));
  const lockOnGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockOnProgress.value, [0, 0.5, 1], [0, 0.35, 0.15]),
  }));

  const remaining = Math.max(0, FREE_SCAN_LIMIT - scansUsed);

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function handleStartScanning() {
    captureStateRef.current = 'loop_active';
    setCaptureState('loop_active');
  }

  function handleStopScanning() {
    captureStateRef.current = 'idle';
    setCaptureState('idle');
  }

  function handleScanAgain() {
    resultY.value = withTiming(H, { duration: 300 });
    lockOnProgress.value = withTiming(0, { duration: 150 });
    setTimeout(() => {
      reset();
      captureStateRef.current = 'loop_active';
      setCaptureState('loop_active');
    }, 320);
  }

  function handleClose() {
    resultY.value = withTiming(H, { duration: 300 });
    lockOnProgress.value = withTiming(0, { duration: 150 });
    setTimeout(() => {
      reset();
      captureStateRef.current = 'idle';
      setCaptureState('idle');
    }, 320);
  }

  // â”€â”€ Permission gates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', gap: 16 }]}>
        <Text style={{ color: colors.textInverse, fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.base }}>
          Camera access is required to scan wildlife.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={{ padding: 12 }}>
          <Text style={{ color: colors.accent, fontFamily: typography.fontFamily.bodyBold, fontSize: typography.fontSize.base }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusLabel =
    captureState === 'analysing'   ? 'IDENTIFYING...' :
    captureState === 'lock_on'     ? 'LOCK-ON â—†' :
    captureState === 'loop_active' ? 'SCANNING...' :
    'READY';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* â”€â”€ Viewfinder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={styles.viewfinder}>
        {captureState === 'result' && captured ? (
          <Image
            source={{ uri: capturedPhotoUri ?? captured.photoUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            flash={flashOn ? 'on' : 'off'}
          />
        )}
        <View style={styles.overlay} />

        {/* Reticle */}
        <View style={styles.reticleWrap}>
          {/* Pulse ring */}
          <Animated.View style={[styles.pulseRing, pulseStyle]} />

          {/* Lock-on success glow */}
          <Animated.View style={[styles.lockOnGlow, lockOnGlowStyle]} />

          {/* Corner brackets â€” animated convergence on lock-on */}
          <View style={styles.reticle}>
            <Animated.View style={[styles.corner, styles.cornerTL, cornerTLStyle]} />
            <Animated.View style={[styles.corner, styles.cornerTR, cornerTRStyle]} />
            <Animated.View style={[styles.corner, styles.cornerBL, cornerBLStyle]} />
            <Animated.View style={[styles.corner, styles.cornerBR, cornerBRStyle]} />

            {/* Animated scan line */}
            <View style={styles.scanLineClip}>
              <Animated.View style={[styles.scanLine, scanLine]} />
            </View>
          </View>

          {/* Status text */}
          <Animated.View style={[styles.statusWrap, blinkStyle]}>
            <Text style={[
              styles.statusText,
              captureState === 'lock_on' && { color: colors.success },
            ]}>
              {statusLabel}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* â”€â”€ Top bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>âœ•</Text>
        </TouchableOpacity>
        <Text style={styles.topLabel}>SCANNER MK-II</Text>
        {/* AC-01.9 â€” scan counter badge */}
        {!scanLimitReached && (
          <View style={styles.scanBadge}>
            <Text style={styles.scanBadgeText}>âš¡ {remaining}</Text>
          </View>
        )}
      </View>

      {/* â”€â”€ Control panel (replaces shutter) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {captureState !== 'result' && (
        <View style={styles.controlPanel}>
          <TouchableOpacity
            style={styles.flashToggle}
            onPress={() => setFlashOn((f) => !f)}
          >
            <Text style={styles.flashIcon}>{flashOn ? 'â˜…' : 'âš¡'}</Text>
          </TouchableOpacity>

          {captureState === 'idle' && (
            <TouchableOpacity style={styles.startBtn} onPress={handleStartScanning}>
              <Text style={styles.startBtnText}>START SCANNING</Text>
            </TouchableOpacity>
          )}

          {captureState === 'loop_active' && (
            <TouchableOpacity style={styles.stopBtn} onPress={handleStopScanning}>
              <Text style={styles.stopBtnText}>â–   STOP</Text>
            </TouchableOpacity>
          )}

          {(captureState === 'analysing' || captureState === 'lock_on') && (
            <View style={[
              styles.statusPill,
              captureState === 'lock_on' && styles.statusPillLocked,
            ]}>
              <Text style={[
                styles.statusPillText,
                captureState === 'lock_on' && { color: colors.success },
              ]}>
                {captureState === 'lock_on' ? 'LOCKED ON â—†' : 'ANALYSING...'}
              </Text>
            </View>
          )}

          {/* Spacer to balance flash toggle */}
          <View style={{ width: 44 }} />
        </View>
      )}

      {/* â”€â”€ Inline toast â€” above control panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <InlineToast message={toastMessage} visible={toastVisible} />

      {/* â”€â”€ Result card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Animated.View style={[styles.resultCard, resultStyle]}>
        <View style={styles.resultHandle} />

        <Text style={styles.captureConfirm}>CAPTURE CONFIRMED âœ“</Text>

        <View style={styles.resultImageRow}>
          <Image
            source={{ uri: capturedPhotoUri ?? captured?.photoUrl }}
            style={styles.resultThumb}
            contentFit="cover"
          />
          <View style={styles.resultInfo}>
            <Text style={styles.resultSpecies}>{captured?.species ?? 'â€”'}</Text>
            {captured?.breed && (
              <Text style={styles.resultBreed}>{captured.breed}</Text>
            )}
            <Text style={styles.resultConfidence}>
              {Math.round((captured?.confidenceScore ?? 0) * 100)}% MATCH
            </Text>
          </View>
        </View>

        <View style={styles.resultTags}>
          {captured?.types.map((t) => (
            <TypeTagChip key={t} type={t} size="sm" />
          ))}
        </View>

        <View style={styles.resultRarity}>
          {captured && <RarityBadge rarity={captured.rarity} />}
          {captured?.region && (
            <Text style={styles.resultRegion}>â—‰ {captured.region}</Text>
          )}
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.retryBtn} onPress={handleClose}>
            <Text style={styles.retryBtnText}>CLOSE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleScanAgain}>
            <Text style={styles.addBtnText}>SCAN AGAIN</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* â”€â”€ Scan Limit Overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {scanLimitReached && (
        <View style={styles.scanLimitOverlay}>
          <Text style={styles.scanLimitTitle}>Daily Limit Reached</Text>
          <Text style={styles.scanLimitBody}>
            You've used all {FREE_SCAN_LIMIT} scans for today.
          </Text>
          <View style={styles.scanLimitActions}>
            <TouchableOpacity style={styles.scanLimitSecondary} onPress={() => router.back()}>
              <Text style={styles.scanLimitSecondaryText}>Remind Me Tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanLimitPrimary} onPress={() => router.back()}>
              <Text style={styles.scanLimitPrimaryText}>Go Premium</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* â”€â”€ Achievement Unlock Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {pendingAchievement && (
        <AchievementUnlockToast
          achievement={pendingAchievement}
          visible={pendingAchievement !== null}
          onHide={clearPendingAchievement}
        />
      )}
    </View>
  );
}

// â”€â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bezel,
  },
  viewfinder: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayDark,
  },

  // â”€â”€ Reticle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    borderColor: colors.text3,
  },
  lockOnGlow: {
    position: 'absolute',
    width: RETICLE_SIZE + 12,
    height: RETICLE_SIZE + 12,
    borderRadius: 8,
    backgroundColor: colors.success,
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
    borderColor: colors.text3,
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
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0, right: 0,
    height: 2,
    backgroundColor: colors.text3,
    opacity: 0.75,
    shadowColor: colors.text3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.80,
    shadowRadius: 6,
  },
  statusWrap: { alignItems: 'center' },
  statusText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.accent,
    letterSpacing: 2,
  },

  // â”€â”€ Top bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: colors.bezel,
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.textInverse,
    fontSize: 14,
    fontFamily: typography.fontFamily.bodyBold,
  },
  topLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
  },
  scanBadge: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  scanBadgeText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 0.5,
  },

  // â”€â”€ Control panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  controlPanel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.bezel,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    paddingVertical: 24,
    paddingHorizontal: 28,
    paddingBottom: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flashToggle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  flashIcon: {
    fontSize: 18,
    color: colors.textInverse,
  },
  startBtn: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: colors.navDark,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.text3,
    shadowColor: colors.text3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  startBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.textInverse,
    letterSpacing: 1.5,
  },
  stopBtn: {
    flex: 1,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  stopBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.text2,
    letterSpacing: 1.5,
  },
  statusPill: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statusPillLocked: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  statusPillText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 12,
    color: colors.text3,
    letterSpacing: 1.5,
  },

  // â”€â”€ Inline toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  inlineToast: {
    position: 'absolute',
    bottom: 140,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
  },
  inlineToastText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    textAlign: 'center',
  },

  // â”€â”€ Result card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  resultCard: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface2,
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
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  captureConfirm: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.success,
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
    borderColor: colors.border,
  },
  resultInfo: { flex: 1, gap: 4 },
  resultSpecies: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
    lineHeight: typography.fontSize['2xl'] * 1.12,
  },
  resultBreed: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
  },
  resultConfidence: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.accent,
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
    color: colors.text2,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  retryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.text2,
    letterSpacing: 1,
  },
  addBtn: {
    flex: 2,
    backgroundColor: colors.navDark,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.text3,
    shadowColor: colors.text3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 7,
  },
  addBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.textInverse,
    letterSpacing: 1,
  },

  // â”€â”€ Scan limit overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  scanLimitOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  scanLimitTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
    textAlign: 'center',
  },
  scanLimitBody: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text2,
    textAlign: 'center',
    marginBottom: 8,
  },
  scanLimitActions: {
    width: '100%',
    gap: 10,
  },
  scanLimitSecondary: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  scanLimitSecondaryText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 13,
    color: colors.text2,
    letterSpacing: 1,
  },
  scanLimitPrimary: {
    backgroundColor: colors.navDark,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.text3,
  },
  scanLimitPrimaryText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 13,
    color: colors.textInverse,
    letterSpacing: 1,
  },
});
