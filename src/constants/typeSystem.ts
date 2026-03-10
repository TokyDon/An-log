/**
 * Anílog Type System v3
 *
 * 12 elemental fantasy types. These provide all colour in the UI:
 * type chips, card gradients, and badge accents.
 */
export const ANIMON_TYPES = [
  'fire', 'water', 'grass', 'electric',
  'ice', 'dragon', 'psychic', 'bug',
  'steel', 'ground', 'rock', 'light',
] as const;

export type AnimonTypeName = (typeof ANIMON_TYPES)[number];

export interface TypeDefinition {
  label: string;
  color: string;      // background chip colour
  textColor: string;  // foreground text colour
}

export const TYPE_DEFINITIONS: Record<AnimonTypeName, TypeDefinition> = {
  fire:     { label: 'Fire',     color: '#DC2626', textColor: '#FFFFFF' },
  water:    { label: 'Water',    color: '#2563EB', textColor: '#FFFFFF' },
  grass:    { label: 'Grass',    color: '#22C55E', textColor: '#0F172A' },  // unchanged color; textColor → dark
  electric: { label: 'Electric', color: '#EAB308', textColor: '#0F172A' },  // unchanged
  ice:      { label: 'Ice',      color: '#0E7490', textColor: '#FFFFFF' },
  dragon:   { label: 'Dragon',   color: '#7C3AED', textColor: '#FFFFFF' },
  psychic:  { label: 'Psychic',  color: '#DB2777', textColor: '#FFFFFF' },
  bug:      { label: 'Bug',      color: '#84CC16', textColor: '#0F172A' },  // unchanged
  steel:    { label: 'Steel',    color: '#475569', textColor: '#FFFFFF' },
  ground:   { label: 'Ground',   color: '#B45309', textColor: '#FFFFFF' },
  rock:     { label: 'Rock',     color: '#57534E', textColor: '#FFFFFF' },
  light:    { label: 'Light',    color: '#F59E0B', textColor: '#0F172A' },  // unchanged
};
