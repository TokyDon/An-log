-- Anílog — Daily Scans & Age Stage Migration
-- Migration: 002_daily_scans
-- Adds: age_stage to animons, is_subscribed to users, daily_scans table, scan increment RPC

-- ========================================
-- AGE STAGE — extends animons
-- ========================================
ALTER TABLE public.animons
  ADD COLUMN IF NOT EXISTS age_stage TEXT NOT NULL DEFAULT 'adult'
    CHECK (age_stage IN ('juvenile', 'adult'));

-- ========================================
-- SUBSCRIPTION FLAG — extends users
-- ========================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN NOT NULL DEFAULT false;

-- ========================================
-- DAILY SCANS
-- Tracks per-user scan usage per day.
-- Server-authoritative — cannot be bypassed by clearing app storage.
-- ========================================
CREATE TABLE IF NOT EXISTS public.daily_scans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scan_date   DATE NOT NULL,
  scan_count  INT NOT NULL DEFAULT 0 CHECK (scan_count >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, scan_date)
);

CREATE INDEX IF NOT EXISTS daily_scans_user_date_idx
  ON public.daily_scans (user_id, scan_date);

ALTER TABLE public.daily_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scan counts"
  ON public.daily_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan records"
  ON public.daily_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scan records"
  ON public.daily_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- ATOMIC SCAN INCREMENT RPC
-- Call this before every scan attempt.
-- Returns: current count, subscription status, and whether limit is reached.
-- SECURITY DEFINER so RLS on daily_scans doesn't block the upsert.
-- ========================================
CREATE OR REPLACE FUNCTION increment_daily_scan(p_user_id UUID)
RETURNS TABLE(
  scan_count     INT,
  is_subscribed  BOOLEAN,
  limit_reached  BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count      INT;
  v_subscribed BOOLEAN;
  v_limit      INT := 20;
BEGIN
  -- Get current subscription status
  SELECT u.is_subscribed
    INTO v_subscribed
    FROM public.users u
   WHERE u.id = p_user_id;

  -- Upsert today's scan count atomically
  INSERT INTO public.daily_scans (user_id, scan_date, scan_count)
    VALUES (p_user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, scan_date)
    DO UPDATE SET scan_count = public.daily_scans.scan_count + 1
    RETURNING public.daily_scans.scan_count INTO v_count;

  RETURN QUERY
    SELECT
      v_count,
      v_subscribed,
      (NOT v_subscribed AND v_count >= v_limit);
END;
$$;
