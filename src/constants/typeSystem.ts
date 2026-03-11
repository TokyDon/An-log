/**
 * Anílog Type System v4 — Biological Taxonomy
 *
 * Card background colours derive from an Animon's core biological category.
 * All WCAG AA (4.5:1) verified against stated text colours.
 * Source: Notion UX & UI Design Spec §1.3
 *
 * Types are flexible strings — add new entries to TYPE_DEFINITIONS at any time.
 * Unknown types fall back to the 'wild' definition.
 *
 * Multiple types per Animon are supported — types[0] drives the card colour,
 * additional types show as secondary chips.
 */

export const ANIMON_TYPES = [
  'mammal',
  'bird',
  'reptile',
  'insect',
  'fish',
  'amphibian',
  'dog',
  'cat',
  'wild',
  'domestic',
] as const;

export type AnimonTypeName = typeof ANIMON_TYPES[number];

export interface TypeDefinition {
  label: string;
  color: string;      // card / chip background
  textColor: string;  // foreground text on that background
}

export const TYPE_DEFINITIONS: Record<string, TypeDefinition> = {
  // ── Core biological taxonomy ─────────────────────────────────────────────
  mammal:    { label: 'Mammal',    color: '#92400E', textColor: '#FFFBEB' },  // Earthy Umber   — 6.8:1 ✓
  bird:      { label: 'Bird',      color: '#1E3A5F', textColor: '#DBEAFE' },  // Deep Sky Blue  — 7.1:1 ✓
  reptile:   { label: 'Reptile',   color: '#14532D', textColor: '#DCFCE7' },  // Jungle Green   — 8.2:1 ✓
  insect:    { label: 'Insect',    color: '#4C1D95', textColor: '#EDE9FE' },  // Royal Purple   — 9.4:1 ✓
  fish:      { label: 'Fish',      color: '#0C4A6E', textColor: '#E0F2FE' },  // Deep Ocean     — 8.9:1 ✓
  amphibian: { label: 'Amphibian', color: '#064E3B', textColor: '#D1FAE5' },  // Pond Green     — 9.7:1 ✓
  dog:       { label: 'Dog',       color: '#78350F', textColor: '#FEF3C7' },  // Warm Caramel   — 7.4:1 ✓
  cat:       { label: 'Cat',       color: '#831843', textColor: '#FCE7F3' },  // Dusky Rose     — 8.1:1 ✓
  wild:      { label: 'Wild',      color: '#7F1D1D', textColor: '#FEE2E2' },  // Danger Red     — 8.6:1 ✓
  domestic:  { label: 'Domestic',  color: '#312E81', textColor: '#EEF2FF' },  // Gentle Indigo  — 9.2:1 ✓
} as const;

/**
 * Returns the TypeDefinition for a given type string.
 * Falls back to 'wild' for any unknown future type.
 */
export function getTypeDefinition(type: string): TypeDefinition {
  return TYPE_DEFINITIONS[type] ?? TYPE_DEFINITIONS['wild'];
}
