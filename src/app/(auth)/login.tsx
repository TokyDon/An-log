/**
 * Login Screen — /(auth)/login.tsx
 *
 * Email + password sign in.
 * Forgot password handled inline via state swap (no navigation).
 * On success → /.
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
  LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signInWithEmail } from '../../services/supabase/auth';
import { supabase } from '../../services/supabase/client';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

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

  // Sync resetEmail with whatever email was typed in the main form
  function openForgotPassword() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setResetEmail(email);
    setResetError('');
    setResetSent(false);
    setShowForgotPassword(true);
  }

  function closeForgotPassword() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowForgotPassword(false);
    setResetError('');
  }

  async function handleSubmit() {
    setServerError('');

    if (!email.trim() || !password) {
      setServerError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Navigation is handled by onAuthStateChange in _layout.tsx
      await signInWithEmail(email.trim().toLowerCase(), password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (
        message.toLowerCase().includes('invalid login') ||
        message.toLowerCase().includes('invalid credentials') ||
        message.toLowerCase().includes('wrong') ||
        message.toLowerCase().includes('incorrect')
      ) {
        setServerError('Email or password is incorrect. Try again.');
      } else if (message.toLowerCase().includes('email not confirmed')) {
        setServerError('Please confirm your email address before signing in. Check your inbox.');
      } else {
        setServerError('Something went wrong. Check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendReset() {
    setResetError('');
    if (!resetEmail.trim()) {
      setResetError('This field is required.');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase());
      if (error) throw error;
      setResetSent(true);
    } catch {
      setResetError("No account found with that email.");
    } finally {
      setResetLoading(false);
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
          <Text style={styles.screenMeta}>SIGN IN</Text>
          <Text style={styles.headline}>Welcome back.</Text>
          <Text style={styles.subHeadline}>Your Anímons are waiting.</Text>

          {/* ── Form card ──────────────────────────────────────── */}
          <Animated.View style={[styles.formCard, { opacity: cardOpacity }]}>
            {showForgotPassword ? (
              /* ── Forgot password view ──────────────────────── */
              <>
                <TouchableOpacity
                  onPress={closeForgotPassword}
                  style={styles.backToLogin}
                >
                  <Text style={styles.backToLoginText}>← Back to sign in</Text>
                </TouchableOpacity>

                <Text style={styles.forgotTitle}>Reset your password</Text>
                <Text style={styles.forgotDesc}>
                  Enter your email and we'll send you a link to reset your password.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    value={resetEmail}
                    onChangeText={(t) => { setResetEmail(t); setResetError(''); }}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.text3}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSendReset}
                  />
                  {resetError ? (
                    <Text style={styles.fieldError}>{resetError}</Text>
                  ) : null}
                </View>

                {resetSent ? (
                  <View style={styles.successBanner}>
                    <Text style={styles.successIcon}>✓</Text>
                    <View style={styles.successTexts}>
                      <Text style={styles.successTitle}>Check your email</Text>
                      <Text style={styles.successBody}>
                        {`We've sent a password reset link to ${resetEmail}.`}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.primaryBtn, resetLoading && styles.primaryBtnDisabled]}
                    onPress={handleSendReset}
                    disabled={resetLoading}
                    activeOpacity={0.85}
                  >
                    {resetLoading ? (
                      <ActivityIndicator color={colors.textInverse} size="small" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Send reset link</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            ) : (
              /* ── Standard login view ───────────────────────── */
              <>
                {/* Email field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(t) => { setEmail(t); setServerError(''); }}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.text3}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>

                {/* Password field */}
                <View style={[styles.fieldGroup, { marginTop: 16 }]}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      ref={passwordRef}
                      style={[styles.input, styles.inputWithEye]}
                      value={password}
                      onChangeText={(t) => { setPassword(t); setServerError(''); }}
                      placeholder="Your password"
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

                {/* Forgot password link */}
                <View style={styles.forgotRow}>
                  <TouchableOpacity onPress={openForgotPassword}>
                    <Text style={styles.forgotLink}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Server error banner */}
                {serverError ? (
                  <View style={styles.serverErrorBanner}>
                    <Text style={styles.serverErrorText}>{serverError}</Text>
                  </View>
                ) : null}
              </>
            )}
          </Animated.View>

          {/* ── Submit button (only in standard view) ──────── */}
          {!showForgotPassword && (
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign in</Text>
              )}
            </TouchableOpacity>
          )}

          {/* ── Register redirect ──────────────────────────── */}
          {!showForgotPassword && (
            <View style={styles.redirectRow}>
              <Text style={styles.redirectText}>New here?</Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
                <Text style={styles.redirectLink}> Create an account</Text>
              </TouchableOpacity>
            </View>
          )}
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
  fieldGroup: { marginBottom: 0 },
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

  // ── Forgot password row ───────────────────────────────────────────────────
  forgotRow: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  forgotLink: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.base,
    color: colors.accent,
  },

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

  // ── Forgot password inline view ───────────────────────────────────────────
  backToLogin: { marginBottom: 16 },
  backToLoginText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.md,
    color: colors.accent,
  },
  forgotTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.lg,
    color: colors.text1,
    marginBottom: 6,
  },
  forgotDesc: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text2,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    marginBottom: 20,
  },

  // ── Success banner ────────────────────────────────────────────────────────
  successBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  successIcon: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 16,
    color: colors.success,
  },
  successTexts: { flex: 1 },
  successTitle: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.fontSize.md,
    color: '#166534',
    marginBottom: 2,
  },
  successBody: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: '#166534',
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
