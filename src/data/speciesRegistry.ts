/**
 * Anílog Species Registry
 *
 * Master database of all recognisable UK wildlife species.
 * Each entry maps a real animal (at a specific age stage) to its in-game
 * Anímon identity — types, stats, rarity, and identification hints for
 * Gemini Vision.
 *
 * Lookup helpers are derived directly from SPECIES_REGISTRY so there is
 * a single source of truth.
 */


// ─── Types ────────────────────────────────────────────────────────────────────

export type AgeStage = 'juvenile' | 'adult';
export type AnimonRarity = 'common' | 'uncommon' | 'rare' | 'glossy';

export interface SpeciesEntry {
  /** Unique entry key, e.g. 'european_robin_adult' */
  id: string;
  /** Base species — shared across all age stages, e.g. 'european_robin' */
  speciesId: string;
  commonName: string;
  scientificName: string;
  ageStage: AgeStage;
  category: 'bird' | 'mammal' | 'insect' | 'reptile' | 'amphibian' | 'marine';
  /** Biological taxonomy types — one per entry (multi-type reserved for future) */
  types: [string] | [string, string];
  rarity: AnimonRarity;
  /** ~30 words, naturalist field-guide tone */
  flavourText: string;
  /** All values 1–100 */
  baseStats: {
    speed: number;
    power: number;
    defence: number;
    stamina: number;
  };
  /** Filename stem used for illustration assets, e.g. 'european-robin-adult' */
  illustrationKey: string;
  /** Visual cues Gemini Vision should detect during identification */
  identificationHints: string[];
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const SPECIES_REGISTRY: SpeciesEntry[] = [

  // ── European Robin ──────────────────────────────────────────────────────────
  {
    id: 'european_robin_adult',
    speciesId: 'european_robin',
    commonName: 'European Robin',
    scientificName: 'Erithacus rubecula',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      "Britain's unofficial national bird. Ruthlessly territorial, its vivid orange-red breast is a warning to rivals as much as a charm to gardeners.",
    baseStats: { speed: 72, power: 28, defence: 38, stamina: 52 },
    illustrationKey: 'european-robin-adult',
    identificationHints: [
      'bright orange-red breast and face',
      'small round brown bird',
      'thin dark beak',
      'large dark eyes with alert expression',
      'olive-brown upperparts',
    ],
  },
  {
    id: 'european_robin_juvenile',
    speciesId: 'european_robin',
    commonName: 'Robin (Juvenile)',
    scientificName: 'Erithacus rubecula',
    ageStage: 'juvenile',
    category: 'bird',
    types: ['bird'],
    rarity: 'uncommon',
    flavourText:
      'Without its famous blush, the young robin hides in plain sight among leaf litter. Spotted buff plumage is its camouflage while it earns the right to colour.',
    baseStats: { speed: 82, power: 13, defence: 28, stamina: 42 },
    illustrationKey: 'european-robin-juvenile',
    identificationHints: [
      'no red breast — entirely spotted buff and brown plumage',
      'small round shape typical of robins',
      'scaly or speckled appearance on breast',
      'large dark eyes',
      'found close to ground or low vegetation',
    ],
  },

  // ── Eurasian Blackbird ───────────────────────────────────────────────────────
  {
    id: 'eurasian_blackbird_adult',
    speciesId: 'eurasian_blackbird',
    commonName: 'Eurasian Blackbird',
    scientificName: 'Turdus merula',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'Male jet-black with a vivid amber-yellow bill; females are brown and easily overlooked. A master songster, its evening fluting is the soundtrack of British gardens.',
    baseStats: { speed: 62, power: 32, defence: 40, stamina: 58 },
    illustrationKey: 'eurasian-blackbird-adult',
    identificationHints: [
      'male: entirely black plumage with orange-yellow bill and eye-ring',
      'female: warm brown overall with faint spotting on breast',
      'medium-sized thrush, upright posture',
      'longish tail often cocked',
      'hops across lawns turning over leaves',
    ],
  },
  {
    id: 'eurasian_blackbird_juvenile',
    speciesId: 'eurasian_blackbird',
    commonName: 'Blackbird (Juvenile)',
    scientificName: 'Turdus merula',
    ageStage: 'juvenile',
    category: 'bird',
    types: ['bird'],
    rarity: 'uncommon',
    flavourText:
      'Heavily streaked and speckled in rufous-brown, the young blackbird looks more thrush than blackbird. Its dark bill and scaly back betray an identity still in formation.',
    baseStats: { speed: 72, power: 17, defence: 30, stamina: 48 },
    illustrationKey: 'eurasian-blackbird-juvenile',
    identificationHints: [
      'rufous-brown with heavy streaking and spotting on breast',
      'scaly appearance on back and wings',
      'dark or dull bill, no yellow eye-ring',
      'medium thrush-sized bird',
      'similar to song thrush but warmer rufous tones',
    ],
  },

  // ── Red Fox ──────────────────────────────────────────────────────────────────
  {
    id: 'red_fox_adult',
    speciesId: 'red_fox',
    commonName: 'Red Fox',
    scientificName: 'Vulpes vulpes',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      'Supremely adaptable, the red fox thrives from moorland to city street. Amber-eyed and rust-furred, it is as much cunning survivor as it is wild spectacle.',
    baseStats: { speed: 85, power: 62, defence: 50, stamina: 68 },
    illustrationKey: 'red-fox-adult',
    identificationHints: [
      'rich reddish-orange fur on back and flanks',
      'white underparts and chin',
      'black legs and ear backs',
      'bushy tail with white tip',
      'pointed muzzle and upright triangular ears',
    ],
  },
  {
    id: 'red_fox_juvenile',
    speciesId: 'red_fox',
    commonName: 'Fox Kit',
    scientificName: 'Vulpes vulpes',
    ageStage: 'juvenile',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      'Born blind and chocolate-brown, the fox kit grows into its rust coat over weeks of tumbling, play-fighting, and cautious exploration around the den entrance.',
    baseStats: { speed: 95, power: 47, defence: 40, stamina: 58 },
    illustrationKey: 'red-fox-juvenile',
    identificationHints: [
      'smaller than adult, rounder head with oversized ears',
      'chocolate-brown to dull orange fur, less vivid than adult',
      'fluffy appearance, shorter legs relative to body',
      'often seen near den entrance or in family groups',
      'playful posture, tail held low',
    ],
  },

  // ── Roe Deer ─────────────────────────────────────────────────────────────────
  {
    id: 'roe_deer_adult',
    speciesId: 'roe_deer',
    commonName: 'Roe Deer',
    scientificName: 'Capreolus capreolus',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      "Britain's most widespread native deer. Secretive and solitary, it favours woodland edges at dawn. The male's short, rough-pearled antlers hint at ancient forest lineage.",
    baseStats: { speed: 88, power: 42, defence: 55, stamina: 80 },
    illustrationKey: 'roe-deer-adult',
    identificationHints: [
      'reddish-brown in summer, grey-brown in winter',
      'distinctive white rump patch, no visible tail',
      'small and compact compared to red deer',
      'males have short, rough antlers with up to three points',
      'large black nose, white chin patch',
    ],
  },
  {
    id: 'roe_deer_juvenile',
    speciesId: 'roe_deer',
    commonName: 'Roe Deer Fawn',
    scientificName: 'Capreolus capreolus',
    ageStage: 'juvenile',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      'Dappled with white spots that dissolve into woodland light, the roe fawn is designed to disappear. Laid hidden in long grass while its mother feeds nearby.',
    baseStats: { speed: 98, power: 27, defence: 45, stamina: 70 },
    illustrationKey: 'roe-deer-juvenile',
    identificationHints: [
      'reddish-brown coat with rows of white dappled spots',
      'much smaller than adult deer',
      'very large ears relative to head',
      'often curled up motionless in grass or bracken',
      'no antlers',
    ],
  },

  // ── Common Frog ──────────────────────────────────────────────────────────────
  {
    id: 'common_frog_adult',
    speciesId: 'common_frog',
    commonName: 'Common Frog',
    scientificName: 'Rana temporaria',
    ageStage: 'adult',
    category: 'amphibian',
    types: ['amphibian'],
    rarity: 'uncommon',
    flavourText:
      'Variable in colour from olive to brick-red, the common frog is the heartbeat of the British garden pond. A voracious hunter of slugs; the gardener\'s quiet ally.',
    baseStats: { speed: 58, power: 22, defence: 32, stamina: 48 },
    illustrationKey: 'common-frog-adult',
    identificationHints: [
      'smooth, moist skin — not warty',
      'highly variable colour: olive, brown, yellow, or reddish',
      'dark mask through eye extending to tympanum',
      'long hind legs folded at rest',
      'pointed snout; sits low and flat',
    ],
  },
  {
    id: 'common_frog_juvenile',
    speciesId: 'common_frog',
    commonName: 'Common Frog Tadpole',
    scientificName: 'Rana temporaria',
    ageStage: 'juvenile',
    category: 'amphibian',
    types: ['amphibian'],
    rarity: 'common',
    flavourText:
      'A comma of life in shallow water. Remarkable for carrying gills, a tail, and the blueprint for an entirely different creature within a single small body.',
    baseStats: { speed: 68, power: 7, defence: 22, stamina: 38 },
    illustrationKey: 'common-frog-tadpole',
    identificationHints: [
      'small dark oval body with a long tail fin',
      'found in dense shoals in shallow pond margins',
      'dark brownish-black, may have gold flecks',
      'no visible limbs in early stage; hind legs appear late',
      'gregarious — rarely seen alone',
    ],
  },

  // ── Common Seal ──────────────────────────────────────────────────────────────
  {
    id: 'common_seal_adult',
    speciesId: 'common_seal',
    commonName: 'Common Seal',
    scientificName: 'Phoca vitulina',
    ageStage: 'adult',
    category: 'marine',
    types: ['fish'],
    rarity: 'uncommon',
    flavourText:
      'The dog-faced seal of British coasts. Rounded head and concave profile distinguish it from the grey seal. Hauls out on sandbanks at low tide, watching the world with liquid eyes.',
    baseStats: { speed: 55, power: 65, defence: 72, stamina: 80 },
    illustrationKey: 'common-seal-adult',
    identificationHints: [
      'rounded, dog-like head with concave forehead profile',
      'grey-brown with dark spots',
      'smaller and rounder than grey seal',
      'V-shaped nostrils (grey seal has parallel nostrils)',
      'often hauled out on sandbanks or rocks',
    ],
  },
  {
    id: 'common_seal_juvenile',
    speciesId: 'common_seal',
    commonName: 'Common Seal Pup',
    scientificName: 'Phoca vitulina',
    ageStage: 'juvenile',
    category: 'marine',
    types: ['fish'],
    rarity: 'uncommon',
    flavourText:
      'Born during low tide on exposed sandbanks, the pup can swim within hours. Its pale coat and vast dark eyes give it an almost luminous, otherworldly quality on the shore.',
    baseStats: { speed: 65, power: 50, defence: 62, stamina: 70 },
    illustrationKey: 'common-seal-pup',
    identificationHints: [
      'pale grey-white or cream coat',
      'oversized dark liquid eyes',
      'smaller and rounder than adult',
      'often alone on beach or sandbank',
      'moulted lanugo already shed at birth (unlike grey seal)',
    ],
  },

  // ── European Hedgehog ────────────────────────────────────────────────────────
  {
    id: 'european_hedgehog_adult',
    speciesId: 'european_hedgehog',
    commonName: 'European Hedgehog',
    scientificName: 'Erinaceus europaeus',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      'Armoured in roughly 6,000 hollow spines, the hedgehog navigates gardens by scent, hoovering up beetles and worms. Its spines are modified hairs, not quills, and cannot be fired.',
    baseStats: { speed: 25, power: 30, defence: 85, stamina: 62 },
    illustrationKey: 'european-hedgehog-adult',
    identificationHints: [
      'dense coat of cream-tipped brown spines covering back',
      'dark brown soft fur on face, flanks, and belly',
      'small pointy snout with pale muzzle',
      'rolls into tight ball when threatened',
      'typically encountered at dusk/dawn',
    ],
  },
  {
    id: 'european_hedgehog_juvenile',
    speciesId: 'european_hedgehog',
    commonName: 'Hedgehog (Juvenile)',
    scientificName: 'Erinaceus europaeus',
    ageStage: 'juvenile',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      'Hoglets are born blind beneath a membrane that sheathes their first soft spines. As they dry and harden, a second set grows through — the first glimpse of the armour to come.',
    baseStats: { speed: 35, power: 15, defence: 75, stamina: 52 },
    illustrationKey: 'european-hedgehog-juvenile',
    identificationHints: [
      'noticeably smaller than adult',
      'paler, softer-looking spines — less sharply defined',
      'same snout and body shape as adult',
      'sometimes active during daylight (underweight juveniles)',
      'may be found wandering alone in autumn',
    ],
  },

  // ── Adult-only bird species ───────────────────────────────────────────────────

  {
    id: 'blue_tit_adult',
    speciesId: 'blue_tit',
    commonName: 'Blue Tit',
    scientificName: 'Cyanistes caeruleus',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'A jewel of the garden feeder. The combination of cobalt cap, lemon belly, and white cheek patches makes the blue tit one of the most instantly recognised birds in Britain.',
    baseStats: { speed: 80, power: 15, defence: 28, stamina: 40 },
    illustrationKey: 'blue-tit-adult',
    identificationHints: [
      'bright blue cap and wings',
      'yellow underparts',
      'white face with black eye stripe through to nape',
      'green back',
      'tiny, rounded form; acrobatic at feeders',
    ],
  },

  {
    id: 'great_tit_adult',
    speciesId: 'great_tit',
    commonName: 'Great Tit',
    scientificName: 'Parus major',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'The largest British tit and one of its most adaptable. The bold black stripe bisecting its yellow breast signals status: the broader the stripe on a male, the more dominant the bird.',
    baseStats: { speed: 70, power: 22, defence: 32, stamina: 48 },
    illustrationKey: 'great-tit-adult',
    identificationHints: [
      'yellow underparts with broad black central stripe',
      'glossy black head with white cheek patches',
      'blue-grey and green upperparts',
      'larger and more robust than blue tit',
      'pale wing bar visible in flight',
    ],
  },

  {
    id: 'house_sparrow_adult',
    speciesId: 'house_sparrow',
    commonName: 'House Sparrow',
    scientificName: 'Passer domesticus',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'Ubiquitous for centuries, the house sparrow has quietly declined by over 60% in the UK since the 1970s. Its cheerful chirping still soundtracks urban Britain — for now.',
    baseStats: { speed: 65, power: 18, defence: 30, stamina: 45 },
    illustrationKey: 'house-sparrow-adult',
    identificationHints: [
      'male: chestnut-streaked brown back, grey crown, black bib',
      'female: plain brown with buff eye-stripe, no bib',
      'stocky body with stout conical bill',
      'found in groups around buildings and gardens',
      'wing bars visible in flight',
    ],
  },

  {
    id: 'wood_pigeon_adult',
    speciesId: 'wood_pigeon',
    commonName: 'Wood Pigeon',
    scientificName: 'Columba palumbus',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'Britain\'s largest and most common pigeon. The white neck patch and wine-flushed breast are unmistakable. Walks with deliberate gravity across lawns as though conducting an inspection.',
    baseStats: { speed: 48, power: 35, defence: 48, stamina: 55 },
    illustrationKey: 'wood-pigeon-adult',
    identificationHints: [
      'white patch on side of neck',
      'pinkish-grey breast, blue-grey overall',
      'white wing bars prominent in flight',
      'large, heavy-looking pigeon',
      'small head relative to rounded body',
    ],
  },

  {
    id: 'magpie_adult',
    speciesId: 'magpie',
    commonName: 'Magpie',
    scientificName: 'Pica pica',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'Iridescent green and purple gloss on black wings and a tail that accounts for half its length. Highly intelligent, magpies store food, recognise their own reflection, and mourn their dead.',
    baseStats: { speed: 68, power: 42, defence: 45, stamina: 62 },
    illustrationKey: 'magpie-adult',
    identificationHints: [
      'bold black and white plumage',
      'long graduated tail with green and blue iridescent gloss',
      'white belly and shoulder patches',
      'white wing patches visible in flight',
      'raucous chattering call',
    ],
  },

  {
    id: 'carrion_crow_adult',
    speciesId: 'carrion_crow',
    commonName: 'Carrion Crow',
    scientificName: 'Corvus corone',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'common',
    flavourText:
      'All-black and disconcertingly intelligent. Crows use tools, solve puzzles, recognise human faces, and hold apparent grudges. It is difficult not to feel observed when one watches you.',
    baseStats: { speed: 65, power: 48, defence: 52, stamina: 70 },
    illustrationKey: 'carrion-crow-adult',
    identificationHints: [
      'entirely black plumage with slight purple-green iridescence',
      'heavy, curved black bill',
      'larger than rook; no pale face patch',
      'usually solitary or in pairs',
      'flat-topped head; fan-shaped tail in flight',
    ],
  },

  {
    id: 'red_kite_adult',
    speciesId: 'red_kite',
    commonName: 'Red Kite',
    scientificName: 'Milvus milvus',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'rare',
    flavourText:
      'Rescued from extinction in Britain by a landmark reintroduction programme. Its russet-orange tail, forked in flight, is unmistakable — a living symbol of conservation success.',
    baseStats: { speed: 90, power: 80, defence: 58, stamina: 75 },
    illustrationKey: 'red-kite-adult',
    identificationHints: [
      'deeply forked reddish-orange tail — diagnostic',
      'russet-red body with pale streaking',
      'pale grey head',
      'white patches on underside of long, angled wings',
      'larger than buzzard; effortless soaring flight',
    ],
  },

  {
    id: 'barn_owl_adult',
    speciesId: 'barn_owl',
    commonName: 'Barn Owl',
    scientificName: 'Tyto alba',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'rare',
    flavourText:
      'Ghost-white and utterly silent in flight, the barn owl hunts by sound alone. Its heart-shaped facial disc funnels the rustle of a vole heard beneath twelve inches of snow.',
    baseStats: { speed: 78, power: 68, defence: 48, stamina: 60 },
    illustrationKey: 'barn-owl-adult',
    identificationHints: [
      'ghost-white heart-shaped facial disc',
      'pale white or buff underparts',
      'golden-buff and grey upperparts with fine black spots',
      'long, rounded wings with silent, buoyant flight',
      'dark eyes set in the facial disc',
    ],
  },

  {
    id: 'common_kingfisher_adult',
    speciesId: 'common_kingfisher',
    commonName: 'Common Kingfisher',
    scientificName: 'Alcedo atthis',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'rare',
    flavourText:
      'An electric-blue arrow along clean rivers. The kingfisher\'s plumage is structural colour — no pigment, just microscopic crystal lattices that shatter light into impossible turquoise.',
    baseStats: { speed: 92, power: 55, defence: 42, stamina: 55 },
    illustrationKey: 'common-kingfisher-adult',
    identificationHints: [
      'brilliant turquoise-blue upperparts and crown',
      'vivid orange underparts and cheek patches',
      'large dagger-shaped bill relative to small body',
      'short tail, large head',
      'found perched low over clear running water',
    ],
  },

  {
    id: 'atlantic_puffin_adult',
    speciesId: 'atlantic_puffin',
    commonName: 'Atlantic Puffin',
    scientificName: 'Fratercula arctica',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'uncommon',
    flavourText:
      'The sea parrot of northern coasts. That striped, waxy bill is a summer accessory — shed in winter for a duller version. Each colourful plate signals breeding condition to watchful eyes.',
    baseStats: { speed: 75, power: 38, defence: 52, stamina: 78 },
    illustrationKey: 'atlantic-puffin-adult',
    identificationHints: [
      'large, triangular bill with red, yellow, and blue-grey banding in summer',
      'black upperparts, white underparts',
      'white face patch',
      'bright orange-red legs and feet',
      'upright posture; penguin-like on cliff ledges',
    ],
  },

  {
    id: 'great_spotted_woodpecker_adult',
    speciesId: 'great_spotted_woodpecker',
    commonName: 'Great Spotted Woodpecker',
    scientificName: 'Dendrocopos major',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'uncommon',
    flavourText:
      'Each drum-roll resonates at up to 20 strikes per second — the bill a precision chisel backed by a shock-absorbing skull. Its crimson under-tail is a flash of colour in winter woodland.',
    baseStats: { speed: 60, power: 55, defence: 60, stamina: 58 },
    illustrationKey: 'great-spotted-woodpecker-adult',
    identificationHints: [
      'black and white plumage with bold white shoulder patches',
      'red patch under tail (both sexes)',
      'male has red patch on back of head; female does not',
      'juvenile has red crown',
      'undulating bounding flight; drums loudly on dead wood',
    ],
  },

  // ── Adult-only mammal species ──────────────────────────────────────────────

  {
    id: 'grey_squirrel_adult',
    speciesId: 'grey_squirrel',
    commonName: 'Grey Squirrel',
    scientificName: 'Sciurus carolinensis',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'common',
    flavourText:
      'Introduced from North America in the 1870s, the grey squirrel has outcompeted its red cousin across most of England and Wales. Acrobatic, bold, and improbably good with a problem to solve.',
    baseStats: { speed: 78, power: 28, defence: 35, stamina: 55 },
    illustrationKey: 'grey-squirrel-adult',
    identificationHints: [
      'grey-silver coat with pale undersides',
      'rounded ears without tufts',
      'large bushy tail held upright or curved over back',
      'rusty-brown tinge often visible on flanks and face',
      'confident, bounding movement; frequent ground forager',
    ],
  },

  {
    id: 'red_squirrel_adult',
    speciesId: 'red_squirrel',
    commonName: 'Red Squirrel',
    scientificName: 'Sciurus vulgaris',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'rare',
    flavourText:
      'Native to Britain and increasingly scarce, the red squirrel clings on in Scotland, Northumberland, and the Isle of Wight. Its ear tufts and slimmer frame distinguish it at a glance.',
    baseStats: { speed: 82, power: 32, defence: 38, stamina: 58 },
    illustrationKey: 'red-squirrel-adult',
    identificationHints: [
      'rich chestnut-red coat, paler on belly',
      'prominent ear tufts, especially in winter',
      'smaller and slimmer than grey squirrel',
      'bushy reddish tail',
      'associated with native pine or broadleaf woodland',
    ],
  },

  {
    id: 'brown_hare_adult',
    speciesId: 'brown_hare',
    commonName: 'Brown Hare',
    scientificName: 'Lepus europaeus',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'uncommon',
    flavourText:
      'Built entirely for speed across open farmland, the brown hare can reach 45 mph in short bursts. In March, does box competing males in their famous, frenzied courtship displays.',
    baseStats: { speed: 95, power: 28, defence: 30, stamina: 72 },
    illustrationKey: 'brown-hare-adult',
    identificationHints: [
      'very long black-tipped ears — longer than head',
      'golden-brown coat with pale underparts',
      'black upper surface of tail with white sides visible in flight',
      'larger and longer-legged than rabbit',
      'yellowish eyes set on sides of face; prominent in field',
    ],
  },

  {
    id: 'european_rabbit_adult',
    speciesId: 'european_rabbit',
    commonName: 'European Rabbit',
    scientificName: 'Oryctolagus cuniculus',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'common',
    flavourText:
      'The rabbit engineered the chalk downland and shaped British countryside for centuries. Compact, cautious, and exquisitely alert, it anchors entire predator food webs.',
    baseStats: { speed: 72, power: 18, defence: 32, stamina: 50 },
    illustrationKey: 'european-rabbit-adult',
    identificationHints: [
      'medium brown fur, white cottony tail (scut)',
      'long ears — shorter than hare, without black tips',
      'compact, rounded body; shorter legs than hare',
      'found in warrens on grassland, dunes, field margins',
      'runs with characteristic bounding gait, white scut visible',
    ],
  },

  {
    id: 'european_badger_adult',
    speciesId: 'european_badger',
    commonName: 'European Badger',
    scientificName: 'Meles meles',
    ageStage: 'adult',
    category: 'mammal',
    types: ['mammal'],
    rarity: 'rare',
    flavourText:
      'Britain\'s largest land carnivore. The badger\'s powerful forearms can outdig any rival predator. Nocturnal, secretive, and deceptively swift for a 12-kilogram animal.',
    baseStats: { speed: 55, power: 72, defence: 78, stamina: 80 },
    illustrationKey: 'european-badger-adult',
    identificationHints: [
      'unmistakable black and white striped face',
      'grey, shaggy coat with black undersides and legs',
      'low, wide body; shuffling gait',
      'powerful stubby legs with long claws visible at rest',
      'nocturnal; seen crossing roads at night',
    ],
  },

  {
    id: 'grey_heron_adult',
    speciesId: 'grey_heron',
    commonName: 'Grey Heron',
    scientificName: 'Ardea cinerea',
    ageStage: 'adult',
    category: 'bird',
    types: ['bird'],
    rarity: 'uncommon',
    flavourText:
      'Patience made visible. The grey heron can stand motionless at a river margin for an hour before the lightning strike of its dagger bill. Among the most ancient-looking of British birds.',
    baseStats: { speed: 52, power: 68, defence: 55, stamina: 70 },
    illustrationKey: 'grey-heron-adult',
    identificationHints: [
      'pale grey back and wings, white head and neck',
      'black plumes behind eye forming crest',
      'black streak down white breast',
      'long yellow-orange dagger bill',
      'stands hunched and motionless at water edges; massive wingspan in flight',
    ],
  },

  // ── Adult-only insects ────────────────────────────────────────────────────────

  {
    id: 'common_dragonfly_adult',
    speciesId: 'common_dragonfly',
    commonName: 'Common Darter',
    scientificName: 'Sympetrum striolatum',
    ageStage: 'adult',
    category: 'insect',
    types: ['insect'],
    rarity: 'uncommon',
    flavourText:
      'The most commonly seen dragonfly in Britain, darting between perches over still water. Its four wings beat independently, allowing hovering, backward flight, and turns of improbable precision.',
    baseStats: { speed: 90, power: 20, defence: 18, stamina: 35 },
    illustrationKey: 'common-darter-adult',
    identificationHints: [
      'male: red-orange abdomen, yellow patches on thorax sides',
      'female: yellow-brown abdomen',
      'wings held flat at rest, angled slightly downward',
      'perches prominently on warm surfaces',
      'very common from July–November over ponds and ditches',
    ],
  },

  {
    id: 'red_admiral_adult',
    speciesId: 'red_admiral',
    commonName: 'Red Admiral',
    scientificName: 'Vanessa atalanta',
    ageStage: 'adult',
    category: 'insect',
    types: ['insect'],
    rarity: 'common',
    flavourText:
      'Velvet-black wings banded in vivid scarlet and edged with white dots: the red admiral needs no camouflage. A strong migrant that arrives from Europe each spring, topping up resident populations.',
    baseStats: { speed: 72, power: 8, defence: 8, stamina: 30 },
    illustrationKey: 'red-admiral-adult',
    identificationHints: [
      'black wings with broad red-orange diagonal bands on forewings',
      'white spots near wingtips',
      'red band across hindwing',
      'underside mottled brown with blue corner patches',
      'feeds on fallen fruit and buddleia',
    ],
  },

  {
    id: 'buff_tailed_bumblebee_adult',
    speciesId: 'buff_tailed_bumblebee',
    commonName: 'Buff-tailed Bumblebee',
    scientificName: 'Bombus terrestris',
    ageStage: 'adult',
    category: 'insect',
    types: ['insect'],
    rarity: 'common',
    flavourText:
      'The lardy aerial tanker of the pollinator world. Queens emerge in February before most flowers are open, sustaining themselves on memory. The most widespread bumblebee in Britain.',
    baseStats: { speed: 50, power: 15, defence: 22, stamina: 45 },
    illustrationKey: 'buff-tailed-bumblebee-adult',
    identificationHints: [
      'queen: yellow collar, yellow abdominal band, buff-white tail',
      'worker: similar but smaller, tail often whiter',
      'very large and round compared to other bees',
      'loud, distinctive buzz in flight',
      'pollen baskets visible as yellow lumps on hind legs',
    ],
  },

  {
    id: 'stag_beetle_adult',
    speciesId: 'stag_beetle',
    commonName: 'Stag Beetle',
    scientificName: 'Lucanus cervus',
    ageStage: 'adult',
    category: 'insect',
    types: ['insect'],
    rarity: 'rare',
    flavourText:
      "Britain's largest beetle and one of its most spectacular. The male's antler-like mandibles are for jousting with rivals, not feeding. Larvae spend up to seven years underground inside rotting oak.",
    baseStats: { speed: 30, power: 62, defence: 72, stamina: 48 },
    illustrationKey: 'stag-beetle-adult',
    identificationHints: [
      'male: enormous branched, antler-like reddish-brown mandibles',
      'female: smaller mandibles, rounder shape',
      'large, chunky black beetle with reddish-brown wing cases',
      'up to 7.5 cm in length (male with mandibles)',
      'flies at dusk in June–July, south-east England focus',
    ],
  },

  // ── Adult-only reptiles ───────────────────────────────────────────────────────

  {
    id: 'slow_worm_adult',
    speciesId: 'slow_worm',
    commonName: 'Slow Worm',
    scientificName: 'Anguis fragilis',
    ageStage: 'adult',
    category: 'reptile',
    types: ['reptile'],
    rarity: 'uncommon',
    flavourText:
      'Neither worm nor snake — the slow worm is a legless lizard that can live for 50 years. Its smooth, coppery scales and blinking eyes distinguish it from every true snake in Britain.',
    baseStats: { speed: 35, power: 18, defence: 45, stamina: 55 },
    illustrationKey: 'slow-worm-adult',
    identificationHints: [
      'smooth, glossy coppery-brown or grey scales',
      'blinking eyelids — snakes cannot blink',
      'no distinct neck; uniform cylindrical body',
      'female often has dark sides and dorsal stripe',
      'found under garden compost heaps, corrugated tin, or logs',
    ],
  },

  {
    id: 'common_lizard_adult',
    speciesId: 'common_lizard',
    commonName: 'Common Lizard',
    scientificName: 'Zootoca vivipara',
    ageStage: 'adult',
    category: 'reptile',
    types: ['reptile'],
    rarity: 'uncommon',
    flavourText:
      'Britain\'s most widespread reptile, gives birth to live young rather than laying eggs — an adaptation to its cool, northern climate. Basks openly on heathland in sunshine, vanishing at first shadow.',
    baseStats: { speed: 68, power: 15, defence: 32, stamina: 42 },
    illustrationKey: 'common-lizard-adult',
    identificationHints: [
      'brown or grey-brown with rows of dark spots or streaks along flanks',
      'male: vivid orange-yellow underside with black spots',
      'female: pale or cream underside, sometimes orange',
      'slender with a long tail, up to 15 cm overall',
      'basking on warm south-facing banks, heathland, railway embankments',
    ],
  },
];

// ─── Lookup Helpers ───────────────────────────────────────────────────────────

/**
 * Find the first entry whose commonName matches (case-insensitive).
 */
export function findSpeciesByName(commonName: string): SpeciesEntry | undefined {
  const lower = commonName.toLowerCase();
  return SPECIES_REGISTRY.find((e) => e.commonName.toLowerCase() === lower);
}

/**
 * Return the adult variant for a given base speciesId, if one exists.
 */
export function getAdultVariant(speciesId: string): SpeciesEntry | undefined {
  return SPECIES_REGISTRY.find(
    (e) => e.speciesId === speciesId && e.ageStage === 'adult',
  );
}

/**
 * Return the juvenile variant for a given base speciesId, if one exists.
 */
export function getJuvenileVariant(speciesId: string): SpeciesEntry | undefined {
  return SPECIES_REGISTRY.find(
    (e) => e.speciesId === speciesId && e.ageStage === 'juvenile',
  );
}
