/**
 * TypeTagChip â€” Field Naturalist Edition v2
 *
 * Inset/recessed classification pill. Background is the neutral insetPanel
 * (not the type colour). The type colour appears only in the borders and text,
 * giving a specimen-drawer label aesthetic rather than a filled pill.
 *
 * Border breakdown (all use type colour with opacity):
 *   top    â€” rgba(255,255,255,0.40)  â† white highlight = recessed bevel
 *   bottom â€” typeColor @ 60%
 *   left   â€” typeColor @ 40%
 *   right  â€” typeColor @ 40%
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPE_DEFINITIONS } from '../../constants/typeSystem';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import type { AnimonType } from '../../types/animon';

interface TypeTagChipProps {
  type: AnimonType;
  size?: 'sm' | 'md';
}

/** Convert a 6-digit hex color string to rgba(r,g,b,alpha) */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function TypeTagChip({ type, size = 'md' }: TypeTagChipProps) {
  const def = TYPE_DEFINITIONS[type];
  if (!def) return null;

  const typeHex = def.color;

  return (
    <View
      style={[
        styles.chip,
        size === 'sm' ? styles.chipSm : styles.chipMd,
        {
          borderTopColor:    'rgba(255,255,255,0.40)',
          borderBottomColor: hexToRgba(typeHex, 0.60),
          borderLeftColor:   hexToRgba(typeHex, 0.40),
          borderRightColor:  hexToRgba(typeHex, 0.40),
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'sm' ? styles.labelSm : styles.labelMd,
          { color: hexToRgba(typeHex, 0.90) },
        ]}
      >
        {def.label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.insetPanel,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSm: {
    height: 20,
    paddingHorizontal: 6,
  },
  chipMd: {
    height: 24,
    paddingHorizontal: 8,
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    letterSpacing: typography.letterSpacing.label,
  },
  labelSm: { fontSize: 9 },
  labelMd: { fontSize: 10 },
});


