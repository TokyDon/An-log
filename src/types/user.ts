/**
 * Anílog Core Types — User Profile
 */

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string; // ISO 8601
  emailConfirmed: boolean;
}

export interface UserStats {
  totalCaptures: number;
  uniqueSpecies: number;
  glossyCount: number;
  regionsExplored: number;
  currentStreak: number;
  longestStreak: number;
}
