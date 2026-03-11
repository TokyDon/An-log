/**
 * Starter Anímons
 *
 * The three generic starters offered to every new trainer during onboarding.
 * Photo URLs are stable Unsplash public images.
 */

import type { Animon } from '../types/animon';

export const STARTER_ANIMONS: Animon[] = [
  {
    id: 'starter_cat',
    userId: 'local',
    species: 'Domestic Cat',
    breed: 'Moggy',
    colour: 'Orange Tabby',
    gender: 'unknown',
    rarity: 'common',
    ageStage: 'adult',
    types: ['light', 'psychic'],
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    region: 'Worldwide',
    capturedAt: '2026-01-01T00:00:00.000Z',
    confidenceScore: 1.0,
  },
  {
    id: 'starter_dog',
    userId: 'local',
    species: 'Domestic Dog',
    breed: 'Mixed',
    colour: 'Golden Brown',
    gender: 'unknown',
    rarity: 'common',
    ageStage: 'adult',
    types: ['grass', 'ground'],
    photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    region: 'Worldwide',
    capturedAt: '2026-01-01T00:00:00.000Z',
    confidenceScore: 1.0,
  },
  {
    id: 'starter_bird',
    userId: 'local',
    species: 'Common Pigeon',
    breed: null,
    colour: 'Grey',
    gender: 'unknown',
    rarity: 'common',
    ageStage: 'adult',
    types: ['steel', 'light'],
    photoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80',
    region: 'Worldwide',
    capturedAt: '2026-01-01T00:00:00.000Z',
    confidenceScore: 1.0,
  },
];
