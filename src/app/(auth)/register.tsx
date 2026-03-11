/**
 * Registration Screen — /(auth)/register.tsx
 *
 * Email + password signup. Password hints update live as user types.
 * On success → /onboarding.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signUpWithEmail } from '../../services/supabase/auth';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

// ─── Validation helpers ───────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasMinLength(pw: string): boolean { return pw.length >= 8; }
function hasUppercase(pw: string): boolean { return /[A-Z]/.test(pw); }
function hasNumber(pw: string): boolean { return /[0-9]/.test(pw); }
function isPasswordValid(pw: string): boolean {
  return hasMinLength(pw) && hasUppercase(pw) && hasNumber(pw);
}

// ─── Password Hint Row ────────────────────────────────────────────────────────

interface HintRowProps {
  met: boolean | null; // null = field is empty
  label: string;
}

function HintRow({ met, label }: HintRowProps) {
  const icon = met === null ? '·' : met ? '✓' : '✗';
  const iconColor = met === null ? colors.text3 : met ? colors.success : colors.error;
  const textColor = met === true ? colors.success : colors.text2;
  return (
    <View style={hintStyles.row}>
      <Text style={[hintStyles.icon, { color: iconColor }]}>{icon}</Text>
      <Text style={[hintStyles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const hintStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { fontFamily: typography.fontFamily.monoBold, fontSize: 11, width: 12 },
  label: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.base },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  // Form card fade-in on mount
  const cardOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  // Live password hint states
  const pwEmpty = password.length === 0;
  const minLengthMet = pwEmpty ? null : hasMinLength(password);
  const upperMet = pwEmpty ? null : hasUppercase(password);
  const numberMet = pwEmpty ? null : hasNumber(password);

  async function handleSubmit() {
    // Clear previous errors
    setEmailError('');
    setPasswordError(null);
    setServerError('');

    // Client-side validation
    if (!email.trim()) {
      setEmailError('This field is required.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setEmailError("That doesn't look like a valid email address.");
      return;
    }
    if (!isPasswordValid(password)) {
      setPasswordError('Password needs at least 8 characters, one uppercase letter, and one number.');
      return;
    }

    setIsLoading(true);
    try {
      const { session } = await signUpWithEmail(email.trim().toLowerCase(), password);
      if (!session) {
        // Email confirmation is ON — tell user to check inbox
        setServerError('Account created! Please check your email to confirm your address, then sign in.');
      }
      // If session exists, navigation is handled by onAuthStateChange in _layout.tsx
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.toLowerCase().includes('already registered') ||
          message.toLowerCase().includes('user already exists')) {
        setServerError('An account with this email already exists. Try signing in instead.');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back row ───────────────────────────────────────── */}
          <View style={styles.backRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backBtn}
            >
              <Text style={styles.backChevron}>‹</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* ── Header ─────────────────────────────────────────── */}
          <Text style={styles.screenMeta}>CREATE ACCOUNT</Text>
          <Text style={styles.headline}>Join Anílog.</Text>
          <Text style={styles.subHeadline}>Start your field journal today.</Text>

          {/* ── Form card ──────────────────────────────────────── */}
          <Animated.View style={[styles.formCard, { opacity: cardOpacity }]}>
            {/* Email field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email address</Text>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : undefined,
                ]}
                value={email}
                onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                placeholder="you@example.com"
                placeholderTextColor={colors.text3}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              {emailError ? (
                <Text style={styles.fieldError}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password field */}
            <View style={[styles.fieldGroup, { marginTop: 16 }]}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, styles.inputWithEye]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(null); }}
                  placeholder="Create a password"
                  placeholderTextColor={colors.text3}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Inline password error (submit-time) */}
            {passwordError ? (
              <Text style={styles.fieldError}>{passwordError}</Text>
            ) : null}

            {/* Password hints */}
            <View style={styles.hintsContainer}>
              <HintRow met={minLengthMet} label="At least 8 characters" />
              <HintRow met={upperMet} label="One uppercase letter" />
              <HintRow met={numberMet} label="One number" />
            </View>

            {/* Server error banner */}
            {serverError ? (
              <View style={styles.serverErrorBanner}>
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            ) : null}
          </Animated.View>

          {/* ── Submit ─────────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Text style={styles.primaryBtnText}>Create account</Text>
            )}
          </TouchableOpacity>

          {/* ── Sign-in redirect ───────────────────────────────── */}
          <View style={styles.redirectRow}>
            <Text style={styles.redirectText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.redirectLink}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
    flexGrow: 1,
  },

  // ── Back row ───────────────────────────────────────────────────────────────
  backRow: {
    height: 44,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backChevron: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 20,
    color: colors.accent,
    lineHeight: 24,
  },
  backText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.md,
    color: colors.accent,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  screenMeta: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.widest,
    color: colors.accent,
    marginBottom: 6,
  },
  headline: {
    fontFamily: typography.fontFamily.bodyExtra,
    fontSize: typography.fontSize['2xl'],
    color: colors.text1,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.squeezed,
    marginBottom: 4,
  },
  subHeadline: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg,
    color: colors.text2,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
    marginBottom: 32,
  },

  // ── Form card ─────────────────────────────────────────────────────────────
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Field ─────────────────────────────────────────────────────────────────
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    color: colors.text1,
    marginBottom: 6,
  },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text1,
  },
  inputWithEye: { paddingRight: 44 },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    height: 48,
    justifyContent: 'center',
  },
  eyeIcon: { fontSize: 16 },
  fieldError: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.error,
    marginTop: 4,
    lineHeight: typography.fontSize.base * typography.lineHeight.label,
  },

  // ── Password hints ────────────────────────────────────────────────────────
  hintsContainer: { marginTop: 10, gap: 6 },

  // ── Server error ──────────────────────────────────────────────────────────
  serverErrorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    marginTop: 12,
  },
  serverErrorText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.error,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  // ── Primary button ────────────────────────────────────────────────────────
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.accentDeep,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.border,
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    letterSpacing: typography.letterSpacing.label,
    color: colors.textInverse,
  },

  // ── Redirect row ──────────────────────────────────────────────────────────
  redirectRow: {
    marginTop: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  redirectText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    color: colors.text2,
  },
  redirectLink: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    color: colors.accent,
  },
});
