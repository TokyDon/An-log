/**
 * Anílog AI Identification Service — Gemini Vision
 *
 * Uses Google Gemini Vision API to identify animals from live camera captures.
 * Returns a structured AiIdentificationResult. If confidence < 0.7, the top-3
 * alternative candidates are returned so the user can manually disambiguate.
 *
 * IMPORTANT: This module is the AI abstraction layer.
 * If we ever switch from Gemini to another provider (e.g. GPT-4V, Claude),
 * only this file and its types need to change — all callers remain unaffected.
 *
 * API Reference: https://ai.google.dev/api/generate-content
 */

import type { AiIdentificationResult, AnimonScanResult } from './types';
import type { AnimonType } from '../../types/animon';

// ─── Config ───────────────────────────────────────────────────────────────────

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-flash';

// TODO: Move to environment variable — NEVER commit real API key to git
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

const CONFIDENCE_THRESHOLD = 0.7;

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are an expert wildlife and animal identification system for a mobile app called Anílog.

Given an image of an animal, respond ONLY with valid JSON matching this schema:
{
  "species": "string (common name)",
  "breed": "string | null (specific breed if identifiable, else null)",
  "colour": "string (primary colour description)",
  "gender": "male | female | unknown",
  "isGlossy": boolean (true if the animal has unusually iridescent/rare markings),
  "confidenceScore": number (0-1, your confidence in the primary identification),
  "suggestedTypes": string[] (from: mammal, bird, reptile, insect, fish, amphibian, dog_breed, cat_breed, wild, domestic),
  "alternativeCandidates": [
    { "species": "string", "confidence": number }
  ] (only include top 3 alternatives if confidenceScore < 0.7)
}

Rules:
- If the image does not contain an animal, set confidenceScore to 0 and species to "unknown"
- Never invent species — use "unknown" if unsure
- isGlossy should be true for albino, melanistic, or visually extraordinary individuals
- Keep species names in English
`.trim();

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Identify an animal from a base64-encoded image using Gemini Vision API.
 *
 * @param base64Image - Base64-encoded image data (no data URL prefix)
 * @param mimeType - Image MIME type (default: image/jpeg)
 * @returns Structured identification result
 * @throws Error if the API call fails or returns unparseable data
 */
export async function identifyAnimal(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg',
): Promise<AiIdentificationResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set');
  }

  const endpoint = `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          { text: SYSTEM_PROMPT },
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1, // deterministic identification
      maxOutputTokens: 512,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  try {
    const result = JSON.parse(text) as AiIdentificationResult;
    // Sanitise: strip alternativeCandidates if confidence is high enough
    if (result.confidenceScore >= CONFIDENCE_THRESHOLD) {
      result.alternativeCandidates = undefined;
    }
    return result;
  } catch {
    throw new Error(`Failed to parse Gemini response: ${text}`);
  }
}

/**
 * Determine rarity from AI result.
 * Glossy beats all — isGlossy flag from Gemini drives this.
 */
export function deriveRarity(
  result: AiIdentificationResult,
): 'common' | 'uncommon' | 'rare' | 'glossy' {
  if (result.isGlossy) return 'glossy';
  if (result.confidenceScore >= 0.95) return 'rare';
  if (result.confidenceScore >= 0.8) return 'uncommon';
  return 'common';
}

/**
 * Combine a captured photo URI and AI result into an AnimonScanResult,
 * ready to present to the user for confirmation before saving.
 */
export function buildScanResult(
  photoUri: string,
  aiResult: AiIdentificationResult,
  region?: string,
): AnimonScanResult {
  return {
    photoUri,
    aiResult,
    rarity: deriveRarity(aiResult),
    scannedAt: new Date().toISOString(),
    region,
  };
}
