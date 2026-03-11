# Anílog — Image Recognition Research

> Which AI approach do we use when a user scans a real animal?
> This is the most technically critical decision in the app.

---

## What we need from AI

1. **Species identification** — "This is a European Robin (Erithacus rubecula)"
2. **Confidence score** — how sure is it? (affects rarity roll)
3. **Animal category** — mammal / bird / insect / reptile / fish → maps to elemental type
4. **Rich description** — habitat, behaviour, etc. → flavour text for the Animon

---

## Options evaluated

### Option A — Google Gemini Vision (Recommended for MVP)
| | |
|---|---|
| **API** | `gemini-2.0-flash` or `gemini-1.5-pro` multimodal |
| **How it works** | Send base64 image + prompt → get structured JSON back |
| **Cost** | Gemini Flash: ~$0.075/1M input tokens (very cheap per scan) |
| **Latency** | ~1–2 seconds |
| **Accuracy** | Excellent — especially common species |
| **Killer feature** | Single API call can identify AND generate game stats, type, flavour text all at once |

**Example prompt:**
```
You are the AI engine for Anílog, an animal-catching game like Pokémon Go.

Analyse this photo and return JSON:
{
  "identified": true,
  "commonName": "European Robin",
  "scientificName": "Erithacus rubecula",
  "confidence": 0.94,
  "category": "bird",
  "gameType": "fire",          // fire|water|grass|electric|ice|dragon|psychic|bug|steel|ground|rock|light
  "gameType2": null,           // second type or null
  "suggestedRarity": "common", // common|uncommon|rare|glossy
  "flavourText": "A feisty territorial bird known for its vivid orange breast...",
  "baseStats": { "speed": 72, "power": 45, "defence": 38, "stamina": 60 }
}

If no animal is visible, return { "identified": false }.
```

**Why we like this:** One call, complete game entity. Can swap the prompt to tune balance without touching infrastructure.

---

### Option B — iNaturalist / Seek API
| | |
|---|---|
| **API** | iNaturalist Computer Vision API |
| **How it works** | Purpose-built for wildlife ID — trained on 100M+ citizen science photos |
| **Cost** | Free (with attribution) — community backed |
| **Latency** | ~0.5–1 second |
| **Accuracy** | Outstanding for common wildlife; best-in-class for rare/obscure species |
| **Killer feature** | Taxonomic output — exact species, genus, family tree |

**Limitation:** Returns taxonomy only — we'd need a second LLM call to generate type/stats/flavour text, or a local lookup table mapping species → game entity.

**Best for:** High-accuracy species ID as a foundation, with Gemini for the game layer on top.

---

### Option C — OpenAI GPT-4o Vision
| | |
|---|---|
| **API** | `gpt-4o` with `vision` |
| **Cost** | ~$0.005 per image (more expensive than Gemini Flash) |
| **Accuracy** | Very good, comparable to Gemini |
| **Latency** | ~1.5–3 seconds |

Viable but more expensive than Gemini for the same output. No compelling reason to choose over Gemini for this use case.

---

### Option D — On-device ML (Apple Vision / TensorFlow Lite)
| | |
|---|---|
| **Cost** | Zero per inference |
| **Latency** | <100ms |
| **Accuracy** | Limited to trained species set |
| **Dev cost** | HIGH — need to train, fine-tune, ship model (~50MB+) |

**Not recommended for MVP** — too much upfront investment. Revisit for v2 if we need offline mode or want to reduce API costs at scale.

---

## Recommendation: Hybrid Gemini + iNaturalist

### MVP (Phase 1)
**Use Gemini Vision only.**  
Single API call returns identification + full game entity. Fast to ship, easy to tune, cheap enough at beta scale.

### Production (Phase 2)
**iNaturalist for ID → Gemini for game layer.**  
- iNaturalist gives us the best-in-class species confidence score  
- Gemini takes the species name + confidence and generates game stats  
- Cleaner separation: accuracy model vs. game design model  
- iNaturalist has a free tier and is trusted by naturalists worldwide  

---

## Type mapping logic

When AI returns `category: "bird"`, we need game types. Suggested defaults:

| Animal category   | Primary game type | Notes |
|-------------------|-------------------|-------|
| Bird              | Air / Light       | small + fast birds → electric |
| Mammal (small)    | Ground            | |
| Mammal (large)    | Ground / Steel    | |
| Reptile           | Dragon            | |
| Amphibian         | Water             | |
| Insect / Bug      | Bug               | |
| Arachnid          | Psychic           | eerie |
| Fish              | Water             | |
| Jellyfish / Marine| Ice               | |
| Plant / Fungi     | Grass             | yes for mobile plants |

Gemini can override these defaults inline — the prompt asks it to assign type directly.

---

## Rarity logic

Rarity is determined by two signals, combined:
1. **Observation frequency** — how often this species appears in iNaturalist data (common/uncommon/rare)
2. **Confidence of scan** — low confidence = higher chance of "rare" roll (hard to scan = should be rewarded)

```
if (iNaturalistFrequency === 'common' && confidence > 0.85) → common (70%) / uncommon (25%) / rare (5%)
if (iNaturalistFrequency === 'uncommon') → uncommon (50%) / rare (40%) / glossy (10%)
if (iNaturalistFrequency === 'rare') → rare (60%) / glossy (40%)
glossy = rare + shiny animation, worth more in trades
```

---

## Next actions

- [ ] Create Gemini API key in Google AI Studio
- [ ] Build `/services/imageRecognition.ts` — takes photo URI, returns `AnimonScanResult`
- [ ] Define `AnimonScanResult` type in `/types/animon.ts`
- [ ] Wire camera screen capture → recognition service → reveal screen
- [ ] Test with 20 common UK animals (robins, squirrels, foxes, pigeons, etc.)
- [ ] Spike iNaturalist Seek API for Phase 2 accuracy comparison

---

## API setup

### Gemini (MVP)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Get API key → add to `.env`: `GEMINI_API_KEY=...`
3. Install: `npm install @google/generative-ai`
4. Usage: send image as base64 with the structured prompt above

### iNaturalist (Phase 2)
- API docs: `https://api.inaturalist.org/v1/docs/`
- Computer Vision endpoint: `POST /computervision/score_image`
- No API key required for public endpoints (rate limited)

---

## Cost estimate at scale

| Monthly scans | Gemini Flash cost | iNat (free) + Gemini name→stats |
|---------------|-------------------|---------------------------------|
| 1,000         | ~$0.08            | ~$0.01 |
| 10,000        | ~$0.80            | ~$0.10 |
| 100,000       | ~$8.00            | ~$1.00 |
| 1,000,000     | ~$80              | ~$10 |

Well within free tier for beta. Switch to hybrid at 10k+ MAU.
