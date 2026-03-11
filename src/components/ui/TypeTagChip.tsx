/**
 * TypeTagChip — v3 Clean Modern
 *
 * Solid vivid filled pill. Background = type colour.
 * White text (dark for electric/bug/light). Fully rounded. No border.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTypeDefinition } from '../../constants/typeSystem';
import { typography } from '../../constants/typography';

interface TypeTagChipProps {
  type: string;
  size?: 'sm' | 'md';
  onCard?: boolean;
}

export function TypeTagChip({ type, size = 'md', onCard = false }: TypeTagChipProps) {
  const def = getTypeDefinition(type);

  const isLightType = def.textColor !== '#FFFFFF';
  const chipBg = onCard
    ? (isLightType ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.22)')
    : def.color;

  return (
    <View
      style={[
        styles.chip,
        size === 'sm' ? styles.chipSm : styles.chipMd,
        { backgroundColor: chipBg },
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'sm' ? styles.labelSm : styles.labelMd,
          { color: def.textColor },
        ]}
      >
        {def.label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipMd: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: {
    fontFamily: typography.fontFamily.bodySemiBold,
    letterSpacing: typography.letterSpacing.label,
  },
  labelSm: { fontSize: typography.fontSize.xs },
  labelMd: { fontSize: typography.fontSize.sm },
});