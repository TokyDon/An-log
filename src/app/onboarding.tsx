/**
 * Onboarding Screen — First-Launch Flow
 *
 * 5-step sequence: Welcome → Username → Camera Permission →
 * Notification Permission → Finish
 * Persists completion flag via AsyncStorage.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

const { width: W } = Dimensions.get('window');
const TOTAL_STEPS = 5;

type Step = 1 | 2 | 3 | 4 | 5;

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>(1);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraRequested, setCameraRequested] = useState(false);
  const [notifRequested, setNotifRequested] = useState(false);

  function advance() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step);
  }

  // Step 2 — validate and save username
  async function handleUsernameNext() {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameError('Please enter a name to continue.');
      return;
    }
    setUsernameError('');
    await AsyncStorage.setItem('username', trimmed);
    advance();
  }

  // Step 3 — request camera
  async function handleRequestCamera() {
    await requestCameraPermission();
    setCameraRequested(true);
  }

  // Step 4 — request notifications
  async function handleRequestNotifications() {
    await Notifications.requestPermissionsAsync();
    setNotifRequested(true);
  }

  // Step 5 — finish
  async function handleFinish() {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    router.replace('/(tabs)/anilog');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Progress dots ─────────────────────────────────────── */}
        <View style={styles.dotsRow}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i + 1 === step ? styles.dotActive : i + 1 < step ? styles.dotDone : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Step 1 — Welcome ──────────────────────────────── */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.logoMark}>
                <Text style={styles.logoGlyph}>A</Text>
              </View>
              <Text style={styles.headline}>Welcome to Anílog</Text>
              <Text style={styles.tagline}>
                Discover, scan and collect the wild world around you.
                Every walk is a new adventure.
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={advance}>
                <Text style={styles.primaryBtnText}>GET STARTED</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Step 2 — Username ─────────────────────────────── */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>STEP 2 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>What should we{'\n'}call you?</Text>
              <Text style={styles.tagline}>
                Your trainer name is shown on your profile and logbook.
              </Text>
              <TextInput
                style={[styles.input, usernameError ? styles.inputError : null]}
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  if (usernameError) setUsernameError('');
                }}
                placeholder="Trainer name…"
                placeholderTextColor={colors.text3}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleUsernameNext}
                maxLength={32}
              />
              {usernameError ? (
                <Text style={styles.errorText}>{usernameError}</Text>
              ) : null}
              <TouchableOpacity style={styles.primaryBtn} onPress={handleUsernameNext}>
                <Text style={styles.primaryBtnText}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Step 3 — Camera Permission ────────────────────── */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>STEP 3 OF {TOTAL_STEPS}</Text>
              <Text style={styles.permissionEmoji}>📷</Text>
              <Text style={styles.headline}>Camera Access</Text>
              <Text style={styles.tagline}>
                Anílog uses your camera to scan and identify wildlife around you.
              </Text>
              {cameraRequested ? (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {cameraPermission?.granted ? '✓ Camera ready' : '✗ Permission denied — you can enable it later in Settings'}
                  </Text>
                </View>
              ) : null}
              <View style={styles.btnStack}>
                {!cameraRequested && (
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleRequestCamera}>
                    <Text style={styles.primaryBtnText}>ALLOW CAMERA</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.ghostBtn} onPress={advance}>
                  <Text style={styles.ghostBtnText}>
                    {cameraRequested ? 'CONTINUE' : 'MAYBE LATER'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step 4 — Notifications Permission ────────────── */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>STEP 4 OF {TOTAL_STEPS}</Text>
              <Text style={styles.permissionEmoji}>🔔</Text>
              <Text style={styles.headline}>Stay Notified</Text>
              <Text style={styles.tagline}>
                Get alerts for rare Anímon sightings nearby and milestone unlocks.
              </Text>
              {notifRequested ? (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Notification preference saved</Text>
                </View>
              ) : null}
              <View style={styles.btnStack}>
                {!notifRequested && (
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleRequestNotifications}>
                    <Text style={styles.primaryBtnText}>ALLOW NOTIFICATIONS</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.ghostBtn} onPress={advance}>
                  <Text style={styles.ghostBtnText}>
                    {notifRequested ? 'CONTINUE' : 'MAYBE LATER'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step 5 — Finish ───────────────────────────────── */}
          {step === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.finishEmoji}>🎉</Text>
              <Text style={styles.headline}>You're all set!</Text>
              <Text style={styles.tagline}>
                Your journal is ready. Tap below to start discovering and scanning the world.
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish}>
                <Text style={styles.primaryBtnText}>START SCANNING</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: { flex: 1 },

  // Progress dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive:   { backgroundColor: colors.navDark,      width: 24 },
  dotDone:     { backgroundColor: colors.accent                  },
  dotInactive: { backgroundColor: colors.border                  },

  // Scroll
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },

  stepContainer: {
    alignItems: 'center',
    gap: 16,
  },

  // Logo mark (step 1)
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.navDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  logoGlyph: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: 40,
    color: colors.textInverse,
    lineHeight: 44,
  },

  stepNumber: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text3,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },

  headline: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: typography.fontSize['3xl'],
    color: colors.text1,
    textAlign: 'center',
    lineHeight: typography.fontSize['3xl'] * 1.2,
  },

  tagline: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text2,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * 1.6,
    maxWidth: W - 64,
  },

  // Username input
  input: {
    width: '100%',
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text1,
    marginTop: 4,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.error,
    alignSelf: 'flex-start',
    marginTop: -8,
  },

  // Permission emojis
  permissionEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  finishEmoji: {
    fontSize: 64,
    marginBottom: 4,
  },

  // Status badge
  statusBadge: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  statusText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    textAlign: 'center',
  },

  btnStack: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },

  // Primary CTA
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.navDark,
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.navDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Ghost / skip button
  ghostBtn: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostBtnText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
  },
});
