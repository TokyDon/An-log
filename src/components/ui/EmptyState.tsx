/**
 * EmptyState — v3 Clean Modern
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconDisc}>
        <Text style={styles.iconDiscSymbol}>◈</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {ctaLabel && onCta && (
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={onCta}
        >
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
  },
  iconDisc: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  iconDiscSymbol: {
    fontFamily: typography.fontFamily.body,
    fontSize: 28,
    color: colors.text3,
  },
  title: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.text1,
    textAlign: 'center',
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  description: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  cta: {
    marginTop: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 99,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  ctaLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    letterSpacing: typography.letterSpacing.label,
  },
});