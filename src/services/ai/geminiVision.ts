/**
 * Anílog AI Identification Service — Gemini Vision (Phase 1)
 *
 * Identifies animals from base64-encoded JPEG frames.
 * Returns a GeminiResult discriminated union — callers must check `identified`.
 *
 * MOCK MODE: When EXPO_PUBLIC_GEMINI_API_KEY is absent or set to 'mock',
 * analyseFrame returns a pre-seeded mock response (no network call).
 * Set EXPO_PUBLIC_MOCK_SCENARIO to test other ACs:
 *   screen_detected | no_animal | unknown_species | juvenile
 */

import type {
  GeminiResult,
  GeminiIdentifiedResult,
  GeminiFailedResult,
  AgeStage,
} from '../../types/animon';

// ─── Mock mode ────────────────────────────────────────────────────────────────

const MOCK_MODE =
  !process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY === 'mock';

const MOCK_SCENARIO = process.env.EXPO_PUBLIC_MOCK_SCENARIO ?? '';

const MOCK_SCREEN_DETECTED: GeminiFailedResult = {
  identified: false, isRealAnimal: false, screenDetected: true, reason: 'screen_detected',
};
const MOCK_NO_ANIMAL: GeminiFailedResult = {
  identified: false, isRealAnimal: true, screenDetected: false, reason: 'no_animal',
};
const MOCK_UNKNOWN: GeminiIdentifiedResult = {
  identified: true, isRealAnimal: true, screenDetected: false,
  commonName: 'Purple Wombat', ageStage: 'adult', confidence: 0.85,
};
const MOCK_JUVENILE: GeminiIdentifiedResult = {
  identified: true, isRealAnimal: true, screenDetected: false,
  commonName: 'European Robin', ageStage: 'juvenile', confidence: 0.91,
};
const MOCK_DEFAULT: GeminiIdentifiedResult = {
  identified: true, isRealAnimal: true, screenDetected: false,
  commonName: 'European Robin', ageStage: 'adult', confidence: 0.94,
};

const MOCK_RESPONSES: Record<string, GeminiResult> = {
  screen_detected: MOCK_SCREEN_DETECTED,
  no_animal:       MOCK_NO_ANIMAL,
  unknown_species: MOCK_UNKNOWN,
  juvenile:        MOCK_JUVENILE,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-1.5-flash';

// ─── Prompt ───────────────────────────────────────────────────────────────────

const GEMINI_PROMPT = `You are an animal identification system for a wildlife app.

Analyse the image and respond with ONLY a JSON object — no markdown, no explanation, no extra text.

FIRST check: Is this image showing a real live animal directly in front of a camera, or is it showing a photo/screen/image/painting OF an animal?
- If it appears to be a photo of a photo, a screen, a book, or any non-live capture, set screenDetected: true.
- A live animal in natural or domestic settings is screenDetected: false.

If a real live animal is present and identified with confidence >= 0.70:
- If the animal's age stage is clearly juvenile (young, cub, kit, chick, fledgling, puppy, lamb) set ageStage: "juvenile". Otherwise set ageStage: "adult".
{
  "identified": true,
  "isRealAnimal": true,
  "screenDetected": false,
  "commonName": "<common name in English, e.g. European Robin>",
  "ageStage": "adult",
  "confidence": <0.0–1.0>
}

If a screen or photo-of-photo is detected:
{
  "identified": false,
  "isRealAnimal": false,
  "screenDetected": true,
  "reason": "screen_detected"
}

If no animal is visible or confidence < 0.70:
{
  "identified": false,
  "isRealAnimal": true,
  "screenDetected": false,
  "reason": "no_animal"
}

Respond ONLY with the JSON object. No other text.`.trim();

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Analyse a base64-encoded JPEG frame and return a structured identification result.
 *
 * In mock mode (no API key or key === 'mock'), returns a pre-seeded result
 * after a simulated 1.5s delay. Set EXPO_PUBLIC_MOCK_SCENARIO to test edge cases.
 */
export async function analyseFrame(base64Jpeg: string): Promise<GeminiResult> {
  if (MOCK_MODE) {
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    return MOCK_RESPONSES[MOCK_SCENARIO] ?? MOCK_DEFAULT;
  }

  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
  const endpoint = `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${key}`;

  const body = {
    contents: [{
      parts: [
        { text: GEMINI_PROMPT },
        { inlineData: { mimeType: 'image/jpeg', data: base64Jpeg } },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 256,
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
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  try {
    return JSON.parse(text) as GeminiResult;
  } catch {
    // Treat parse failures as no_animal — never throw to the user
    return MOCK_NO_ANIMAL;
  }
}
