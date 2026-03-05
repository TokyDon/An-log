/**
 * TypeTagChip
 *
 * Skeuomorphic raised classification tab — pinned to a specimen board.
 * Inset top highlight + bottom shadow simulate a physical raised tab.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPE_DEFINITIONS } from '../../constants/typeSystem';
import { typography } from '../../constants/typography';
import type { AnimonType } from '../../types/animon';

interface TypeTagChipProps {
  type: AnimonType;
  size?: 'sm' | 'md';
}

export function TypeTagChip({ type, size = 'md' }: TypeTagChipProps) {
  const def = TYPE_DEFINITIONS[type];
  if (!def) return null;

  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: def.color },
        size === 'sm' ? styles.chipSm : styles.chipMd,
      ]}
    >
      {/* Inner highlight top edge */}
      <View style={styles.highlightEdge} />
      <Text
        style={[
          styles.label,
          { color: def.textColor },
          size === 'sm' ? styles.labelSm : styles.labelMd,
        ]}
      >
        <Text style={size === 'sm' ? styles.emojiSm : styles.emojiMd}>{def.emoji}</Text>
        {'  '}{def.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    // Physical raised shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 2,
    elevation: 2,
    // Bottom shadow edge (shadow base)
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.18)',
  },
  chipSm: {
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  chipMd: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  // Top highlight stripe overlay
  highlightEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  label: {
    fontFamily: typography.fontFamily.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  labelSm: { fontSize: 10 },
  labelMd: { fontSize: 12 },
  emojiSm: { fontSize: 12 },
  emojiMd: { fontSize: 14 },
});
