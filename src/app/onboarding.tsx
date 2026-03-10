/**
 * Onboarding Screen — 6-step flow
 *
 * Step 1: What's an Animon? (educational, skip to step 3)
 * Step 2: How to catch one (educational, skip to step 3)
 * Step 3: Choose your first Animon (MANDATORY — single select)
 * Step 4: Meet your Animon (rename + addToParty)
 * Step 5: Camera permission (skippable)
 * Step 6: Notification permission (skippable — all paths set onboarding flag)
 */
import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { STARTER_ANIMONS } from '../data/starters';
import { usePartyStore } from '../store/partyStore';
import { TypeTagChip } from '../components/ui/TypeTagChip';
import { RarityBadge } from '../components/ui/RarityBadge';
import type { Animon } from '../types/animon';

const { width: W } = Dimensions.get('window');
const TOTAL_STEPS = 6;

// ── Progress Dots ─────────────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              isDone && styles.dotDone,
              isActive && styles.dotActive,
              !isDone && !isActive && styles.dotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

// ── Starter Card ──────────────────────────────────────────────────────────────
function StarterCard({
  animon,
  selected,
  onPress,
}: {
  animon: Animon;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.03 : 1,
      useNativeDriver: true,
      tension: 180,
      friction: 12,
    }).start();
  }, [selected]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.starterCard,
          selected && styles.starterCardSelected,
          { transform: [{ scale }] },
        ]}
      >
        <Image
          source={{ uri: animon.photoUrl }}
          style={styles.starterPhoto}
          resizeMode="cover"
        />
        <View style={styles.starterInfo}>
          <Text style={styles.starterSpecies}>{animon.species}</Text>
          <View style={styles.starterTypeRow}>
            {animon.types.map((t) => (
              <TypeTagChip key={t} type={t} size="sm" />
            ))}
          </View>
        </View>
        {selected && (
          <View style={styles.starterCheckmark}>
            <Text style={styles.starterCheckmarkText}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [selectedStarter, setSelectedStarter] = useState<Animon | null>(null);
  const [nickname, setNickname] = useState('');
  const [cameraRequested, setCameraRequested] = useState(false);
  const [notifRequested, setNotifRequested] = useState(false);
  const addToParty = usePartyStore((s) => s.addToParty);
  const [, requestCameraPermission] = useCameraPermissions();

  // Entrance animation for catch card (step 4)
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  useEffect(() => {
    if (step === 4) {
      cardOpacity.setValue(0);
      cardTranslateY.setValue(30);
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step]);

  const advance = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goToStep = (n: number) => setStep(n);

  const handleConfirmStarter = () => {
    if (!selectedStarter) return;
    setNickname(selectedStarter.species);
    advance();
  };

  const handleAddToParty = () => {
    if (!selectedStarter) return;
    advance();
  };

  const handleRequestCamera = async () => {
    await requestCameraPermission();
    setCameraRequested(true);
  };

  const handleRequestNotifications = async () => {
    await Notifications.requestPermissionsAsync();
    setNotifRequested(true);
  };

  const handleFinish = async () => {
    if (selectedStarter) {
      addToParty(selectedStarter, nickname.trim() || selectedStarter.species);
    }
    await AsyncStorage.setItem('onboarding_complete', 'true');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ProgressDots current={step} total={TOTAL_STEPS} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Step 1 — What's an Animon? ── */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.brandHero}>
                <Text style={styles.brandWordmark}>ANÍLOG</Text>
                <Text style={styles.brandTagline}>
                  {`The world is full of creatures.\nStart capturing them.`}
                </Text>
              </View>
              <Text style={styles.stepLabel}>STEP 1 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>What's an Animon?</Text>
              <Text style={styles.bodyText}>
                {`An Animon is any real animal you've found out in the wild — a fox crossing the road, a heron on the riverbank, the beetle under a log. You spot it. You catch it. It's yours.\n\nEvery creature you find becomes a permanent part of your collection.`}
              </Text>
              <View style={styles.btnStack}>
                <TouchableOpacity style={styles.primaryBtn} onPress={advance}>
                  <Text style={styles.primaryBtnText}>GOT IT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ghostBtn} onPress={() => goToStep(3)}>
                  <Text style={styles.ghostBtnText}>SKIP TO STARTER</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step 2 — How to catch one ── */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.permissionEmoji}>📷</Text>
              <Text style={styles.stepLabel}>STEP 2 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>How to catch one</Text>
              <Text style={styles.bodyText}>
                {`Open the camera and point it at any animal — or a photo of one. Anílog identifies the species and catches it for you. First time finding that species? It joins your party as a brand new Animon.\n\nAlready got one? Find it again — your collection grows deeper.`}
              </Text>
              <View style={styles.btnStack}>
                <TouchableOpacity style={styles.primaryBtn} onPress={advance}>
                  <Text style={styles.primaryBtnText}>MAKES SENSE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ghostBtn} onPress={() => goToStep(3)}>
                  <Text style={styles.ghostBtnText}>SKIP TO STARTER</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step 3 — Choose starter ── */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepLabel}>STEP 3 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>Choose your first Animon</Text>
              <Text style={styles.bodyText}>
                {`Every trainer needs a starter. Pick the Animon that feels like yours — the wild is full of plenty more waiting to be caught.`}
              </Text>
              <View style={styles.starterList}>
                {STARTER_ANIMONS.map((a) => (
                  <StarterCard
                    key={a.id}
                    animon={a}
                    selected={selectedStarter?.id === a.id}
                    onPress={() => setSelectedStarter(a)}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={[styles.primaryBtn, !selectedStarter && styles.btnDisabled]}
                onPress={handleConfirmStarter}
                disabled={!selectedStarter}
              >
                <Text style={styles.primaryBtnText}>CHOOSE THIS ONE</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Step 4 — Meet your Animon ── */}
          {step === 4 && selectedStarter && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepLabel}>STEP 4 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>Meet your Animon</Text>
              <Animated.View
                style={[
                  styles.catchCard,
                  {
                    opacity: cardOpacity,
                    transform: [{ translateY: cardTranslateY }],
                  },
                ]}
              >
                <Image
                  source={{ uri: selectedStarter.photoUrl }}
                  style={styles.catchCardPhoto}
                  resizeMode="cover"
                />
                <View style={styles.catchCardBody}>
                  <View style={styles.catchCardHeader}>
                    <Text style={styles.catchCardSpecies}>{selectedStarter.species}</Text>
                    <RarityBadge rarity={selectedStarter.rarity} />
                  </View>
                  <View style={styles.catchCardTypes}>
                    {selectedStarter.types.map((t) => (
                      <TypeTagChip key={t} type={t} size="sm" />
                    ))}
                  </View>
                </View>
              </Animated.View>
              <Text style={styles.fieldLabel}>Give it a name</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder={selectedStarter.species}
                placeholderTextColor={colors.text3}
                autoCapitalize="words"
                returnKeyType="done"
              />
              <TouchableOpacity style={[styles.primaryBtn, styles.mtSm]} onPress={handleAddToParty}>
                <Text style={styles.primaryBtnText}>ADD TO PARTY</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Step 5 — Camera permission ── */}
          {step === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.permissionEmoji}>📷</Text>
              <Text style={styles.stepLabel}>STEP 5 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>Your adventure starts here</Text>
              <Text style={styles.bodyText}>
                Point your camera at any animal and catch it on the spot. Give Anílog access and start building your party.
              </Text>
              {cameraRequested && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Camera preference saved</Text>
                </View>
              )}
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

          {/* ── Step 6 — Notifications permission ── */}
          {step === 6 && (
            <View style={styles.stepContainer}>
              <Text style={styles.permissionEmoji}>🔔</Text>
              <Text style={styles.stepLabel}>STEP 6 OF {TOTAL_STEPS}</Text>
              <Text style={styles.headline}>Never miss a rare one</Text>
              <Text style={styles.bodyText}>
                Turn on notifications and we'll alert you when a legendary Animon is spotted nearby — or when you hit a new milestone.
              </Text>
              {notifRequested && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Notification preference saved</Text>
                </View>
              )}
              <View style={styles.btnStack}>
                {!notifRequested && (
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleRequestNotifications}>
                    <Text style={styles.primaryBtnText}>ALLOW NOTIFICATIONS</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.ghostBtn} onPress={handleFinish}>
                  <Text style={styles.ghostBtnText}>
                    {notifRequested ? 'START MY JOURNEY' : 'MAYBE LATER'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const W_MINUS_PAD = W - 48;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: { flex: 1 },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive:   { width: 24, backgroundColor: colors.accent },
  dotDone:     { width: 8,  backgroundColor: colors.accentDeep },
  dotInactive: { width: 8,  backgroundColor: colors.border },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  stepContainer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },

  // Brand hero — Step 1 dramatic wordmark
  brandHero: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 4,
  },
  brandWordmark: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: 52,
    letterSpacing: 14,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  brandTagline: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text2,
    textAlign: 'center',
    letterSpacing: 0.4,
    marginTop: 14,
    lineHeight: typography.fontSize.md * 1.75,
  },

  // Legacy logo mark — kept for safety but replaced by brandHero on step 1
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.navDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoGlyph: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: 38,
    color: colors.accent,
    lineHeight: 42,
  },

  stepLabel: {
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
  bodyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text2,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * 1.65,
    maxWidth: W_MINUS_PAD,
  },
  permissionEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },

  starterList: {
    width: '100%',
    gap: 10,
    marginVertical: 4,
  },
  starterCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  starterCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(212,160,23,0.07)',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 6,
  },
  starterPhoto: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.surface2,
  },
  starterInfo: {
    flex: 1,
    gap: 6,
  },
  starterSpecies: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.base,
    color: colors.text1,
  },
  starterTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  starterCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starterCheckmarkText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '700',
  },

  catchCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  catchCardPhoto: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surface2,
  },
  catchCardBody: {
    padding: 14,
    gap: 8,
  },
  catchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catchCardSpecies: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.lg,
    color: colors.text1,
  },
  catchCardTypes: {
    flexDirection: 'row',
    gap: 6,
  },

  fieldLabel: {
    alignSelf: 'flex-start',
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.sm,
    color: colors.text2,
    letterSpacing: typography.letterSpacing.label,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text1,
  },

  statusBadge: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  statusText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.success,
    textAlign: 'center',
  },

  btnStack: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 8,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.bg,
    letterSpacing: typography.letterSpacing.wide,
  },
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
  btnDisabled: {
    opacity: 0.4,
  },
  mtSm: {
    marginTop: 4,
  },
});