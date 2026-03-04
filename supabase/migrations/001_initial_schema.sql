-- Anílog — Initial Database Schema
-- Migration: 001_initial_schema
-- Run via: supabase db push

-- ========================================
-- USERS (extends Supabase auth.users)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read any profile (for friend comparison)
CREATE POLICY "Public profiles are viewable by all users"
  ON public.users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- ANIMONS (the core collection table)
-- ========================================
CREATE TYPE animon_rarity AS ENUM ('common', 'uncommon', 'rare', 'glossy');
CREATE TYPE animon_gender AS ENUM ('male', 'female', 'unknown');

CREATE TABLE IF NOT EXISTS public.animons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  species           TEXT NOT NULL,
  breed             TEXT,                         -- NULL for non-breed-differentiated species
  colour            TEXT NOT NULL,
  gender            animon_gender NOT NULL DEFAULT 'unknown',
  rarity            animon_rarity NOT NULL DEFAULT 'common',
  types             TEXT[] NOT NULL DEFAULT '{}', -- Anímon type tags
  photo_url         TEXT NOT NULL,                -- Supabase Storage URL
  region            TEXT NOT NULL,                -- CITY/REGION ONLY — never precise GPS
  confidence_score  FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  captured_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX animons_user_id_idx ON public.animons (user_id);
CREATE INDEX animons_species_idx ON public.animons (species);
CREATE INDEX animons_rarity_idx ON public.animons (rarity);
CREATE INDEX animons_captured_at_idx ON public.animons (captured_at DESC);

-- Enable Row-Level Security
ALTER TABLE public.animons ENABLE ROW LEVEL SECURITY;

-- PRIVACY: Users can only see their own captures by default
CREATE POLICY "Users can view their own animons"
  ON public.animons FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own captures
CREATE POLICY "Users can insert their own animons"
  ON public.animons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own captures (e.g. gender correction)
CREATE POLICY "Users can update their own animons"
  ON public.animons FOR UPDATE
  USING (auth.uid() = user_id);

-- Friends comparison: read-only access to friends' animons (implement via friend_id check)
-- NOTE: Expand this policy when friend system is built

-- ========================================
-- MILESTONES
-- ========================================
CREATE TABLE IF NOT EXISTS public.milestones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  milestone_id TEXT NOT NULL,   -- e.g. "all_british_garden_birds", "first_glossy"
  earned_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, milestone_id)
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own milestones"
  ON public.milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones"
  ON public.milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- STORAGE BUCKET (run separately in Supabase dashboard or via CLI)
-- ========================================
-- Create bucket: animon-photos (private, authenticated users only)
-- INSERT INTO storage.buckets (id, name) VALUES ('animon-photos', 'animon-photos');
