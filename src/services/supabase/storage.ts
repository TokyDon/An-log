/**
 * Anílog Supabase Storage — Phase 1
 *
 * Both buckets are PRIVATE. All access is via short-lived signed URLs.
 * Never use the /object/public/ URL pattern for either bucket.
 *
 * Bucket: species-illustrations — species artwork (private, auth-only read)
 * Bucket: animon-photos         — user capture photos (private, owner-only read+insert)
 */

import { supabase } from './client';

// ─── Species illustrations ────────────────────────────────────────────────────

/**
 * Generate a 5-minute signed URL for a species illustration.
 * Returns null if the file doesn't exist or the session is invalid.
 *
 * @param illustrationKey — e.g. 'european-robin-adult' (no .png extension)
 */
export async function getIllustrationUrl(
  illustrationKey: string,
  expiresIn = 300,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('species-illustrations')
    .createSignedUrl(`${illustrationKey}.png`, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

// ─── User capture photos ──────────────────────────────────────────────────────

/**
 * Upload a capture photo from base64 JPEG data.
 * Returns the storage path (not a URL) — call getCapturePhotoUrl() for display.
 *
 * Path format: {userId}/{capturedAt_ISO_sanitised}.jpg
 * e.g. 'abc123/2026-03-10T14-22-00-000Z.jpg'
 *
 * @param userId     — the authenticated user's UUID
 * @param base64Jpeg — base64-encoded JPEG (no data URL prefix)
 */
export async function uploadCapturePhoto(
  userId: string,
  base64Jpeg: string,
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `${userId}/${timestamp}.jpg`;

  // Convert base64 to Uint8Array without requiring expo-file-system
  const binaryString = atob(base64Jpeg);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const { error } = await supabase.storage
    .from('animon-photos')
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(`Photo upload failed: ${error.message}`);
  return path;
}

/**
 * Generate a short-lived signed URL for a capture photo.
 * Use the storage path returned by uploadCapturePhoto().
 * Returns null if the path doesn't exist or session is invalid.
 *
 * @param storagePath — e.g. '{userId}/{timestamp}.jpg'
 * @param expiresIn   — seconds until expiry (default: 60)
 */
export async function getCapturePhotoUrl(
  storagePath: string,
  expiresIn = 60,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('animon-photos')
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
