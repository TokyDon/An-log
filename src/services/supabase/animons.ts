/**
 * Anímon CRUD Operations — Supabase
 *
 * All database operations for the `animons` table.
 * Supabase returns snake_case column names; mapRow() converts them to the
 * camelCase Animon TypeScript interface.
 */

import { supabase } from './client';
import type { Animon, AgeStage, AnimonRarity, AnimonType } from '../../types/animon';

const TABLE = 'animons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: Record<string, any>): Animon {
  return {
    id:              row.id,
    userId:          row.user_id,
    species:         row.species,
    breed:           row.breed ?? null,
    colour:          row.colour ?? 'N/A',
    gender:          row.gender ?? 'unknown',
    rarity:          row.rarity as AnimonRarity,
    ageStage:        (row.age_stage ?? 'adult') as AgeStage,
    types:           row.types as AnimonType[],
    photoUrl:        row.photo_url,
    region:          row.region ?? 'Unknown location',
    capturedAt:      row.captured_at,
    confidenceScore: row.confidence_score ?? 0,
  };
}

export async function getCollection(userId: string): Promise<Animon[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('captured_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getAnimon(id: string): Promise<Animon | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function createAnimon(
  animon: Omit<Animon, 'id' | 'capturedAt'>,
): Promise<Animon> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id:          animon.userId,
      species:          animon.species,
      breed:            animon.breed,
      colour:           animon.colour,
      gender:           animon.gender,
      rarity:           animon.rarity,
      age_stage:        animon.ageStage,
      types:            animon.types,
      photo_url:        animon.photoUrl,
      region:           animon.region,
      confidence_score: animon.confidenceScore,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function deleteAnimon(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

