/**
 * Anílog Achievement Definitions
 */

export type AchievementTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tier: AchievementTier;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_scan',    title: 'First Contact',    description: 'Scan your first Anímon',          emoji: '🔬', tier: 'Bronze'  },
  { id: 'scan_5',        title: 'Field Naturalist', description: 'Scan 5 Anímons',                  emoji: '🌿', tier: 'Bronze'  },
  { id: 'scan_10',       title: 'Explorer',         description: 'Scan 10 Anímons',                 emoji: '🗺️', tier: 'Silver'  },
  { id: 'scan_25',       title: 'Veteran Trainer',  description: 'Scan 25 Anímons',                 emoji: '⭐', tier: 'Gold'    },
  { id: 'first_rare',   title: 'Rare Find',         description: 'Discover a rare Anímon',          emoji: '💎', tier: 'Silver'  },
  { id: 'first_glossy', title: 'Glossy Hunter',     description: 'Discover a glossy colour variant', emoji: '✨', tier: 'Gold'    },
  { id: 'first_super_rare', title: 'Super Rare Find', description: 'Discover a Super Rare Anímon',   emoji: '💜', tier: 'Platinum'},
  { id: 'global_trainer', title: 'Global Trainer',  description: 'Catch Anímons on 5 continents',   emoji: '🌎', tier: 'Gold'    },
];
