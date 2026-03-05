/**
 * EmptyState
 *
 * Generic empty state component with optional CTA button.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({
  emoji = '🔍',
  title,
  description,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {ctaLabel && onCta && (
        <TouchableOpacity style={styles.cta} onPress={onCta}>
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </TouchableOpacity>
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
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  cta: {
    marginTop: 24,
    backgroundColor: colors.scannerGreen,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  ctaLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
  },
});
