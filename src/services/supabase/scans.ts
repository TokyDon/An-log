/**
 * Anílog Scan Limit Service — Phase 1
 *
 * Server-authoritative daily scan counts.
 * Free users: 20 scans/day (enforced by increment_daily_scan RPC).
 * Subscribed users: unlimited (scan_count still incremented for analytics).
 *
 * Always call consumeScan() BEFORE processing a Gemini frame —
 * a scan is consumed at the point of analysis, not at the point of save.
 */

import { supabase } from './client';

export interface ConsumedScan {
  /** Today's total scan count (after this increment) */
  scanCount: number;
  /** Whether the user is on a paid subscription */
  isSubscribed: boolean;
  /** True when free user has hit or exceeded the 20-scan daily limit */
  limitReached: boolean;
}

/**
 * Read today's scan count without incrementing.
 * Returns 0 if no record exists yet (first scan of the day).
 */
export async function getScanCount(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const { data } = await supabase
    .from('daily_scans')
    .select('scan_count')
    .eq('user_id', userId)
    .eq('scan_date', today)
    .single();

  return data?.scan_count ?? 0;
}

/**
 * Atomically increment today's scan count and return the updated state.
 * Uses the increment_daily_scan RPC (SECURITY DEFINER, runs server-side).
 *
 * Call this before every Gemini frame analysis.
 * If ConsumedScan.limitReached is true, abort the scan loop.
 */
export async function consumeScan(userId: string): Promise<ConsumedScan> {
  const { data, error } = await supabase.rpc('increment_daily_scan', {
    p_user_id: userId,
  });

  if (error) throw new Error(`Scan counter failed: ${error.message}`);

  const row = Array.isArray(data) ? data[0] : data;
  return {
    scanCount:    row.scan_count    as number,
    isSubscribed: row.is_subscribed as boolean,
    limitReached: row.limit_reached as boolean,
  };
}
