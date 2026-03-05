/**
 * EmptyState â€” Field Naturalist Edition v2
 *
 * Domain-appropriate empty state: no emoji as icon â€” uses a circular
 * inkRule-bordered disc instead. Playfair italic title, DM Sans description,
 * forestFloor CTA button.
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
      {/* Domain icon disc â€” archival circle placeholder */}
      <View style={styles.iconDisc} />
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
    gap: 12,
  },

  // Circular domain icon disc
  iconDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.inkRule,
    marginBottom: 4,
  },

  title: {
    fontFamily: typography.fontFamily.heading,
    fontStyle: 'italic',
    fontSize: typography.fontSize.md,
    color: colors.inkFaded,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * typography.lineHeight.heading,
  },
  description: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.inkGhost,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  // CTA â€” forestFloor background, mossLight text
  cta: {
    marginTop: 8,
    backgroundColor: colors.forestFloor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  ctaPressed: {
    opacity: 0.75,
  },
  ctaLabel: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.sm,
    color: colors.mossLight,
    letterSpacing: typography.letterSpacing.wide,
  },
});


