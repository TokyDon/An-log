---
applyTo: "src/constants/colors.ts,src/app/**/*.tsx,src/components/**/*.tsx"
---

# Anílog — Design Agent Rules (ENFORCED)

These rules apply to every agent touching design files. Non-negotiable.

## WCAG Contrast — Hard Limits

Every text colour MUST pass WCAG AA (4.5:1) against every background it appears on.
Body text and headings MUST pass WCAG AAA (7.0:1) against primary backgrounds.

### Required contrast ratios for Anílog tokens

| Token | Minimum ratio | Backgrounds it appears on |
|-------|--------------|--------------------------|
| `text1` | ≥ 7.0:1 | `bg`, `surface`, `surface2` |
| `text2` | ≥ 4.5:1 | `bg`, `surface`, `surface2` |
| `text3` | ≥ 4.5:1 | `bg`, `surface`, `surface2` |
| `accent` text on `accentSoft` | ≥ 4.5:1 | `accentSoft` |
| `textInverse` | ≥ 4.5:1 | `accent` (button background) |

### Banned values — never use these for text on light backgrounds

| Hex | Contrast on white | Status |
|-----|------------------|--------|
| `#999999` | 2.85:1 | ❌ FAILS AA |
| `#AAAAAA` | 2.32:1 | ❌ FAILS AA |
| `#BBBBBB` | 1.87:1 | ❌ FAILS AA |
| `#888888` | 3.54:1 | ❌ FAILS AA |
| `#777777` | 4.48:1 | ❌ FAILS AA (borderline) |

### Minimum passing values for text3 on white (#FFFFFF)
- `#767676` gives exactly 4.54:1 — minimum safe value
- **Use `#5E5E5E` (5.8:1) or darker for any text intended to be read**

## colors.ts Rules

1. Every new token MUST have its contrast ratio in a comment: `// 5.8:1 on bg ✓`
2. `text3` must NEVER be lighter than `#767676` when the background is white or near-white
3. After changing any text or background token, recalculate ALL contrast pairs affected
4. Use https://webaim.org/resources/contrastchecker/ logic: ratio = (L1 + 0.05) / (L2 + 0.05)

## Commit Discipline

- `colors.ts` must ALWAYS be a standalone first commit — never bundled with screen files
- Each screen file is a separate commit
- tsc must pass (0 errors) before every commit
- Commit message format: `design: <what changed>` or `fix(a11y): <what was fixed>`

## Style Rules

- No hardcoded hex values inside `StyleSheet.create` — import and use `colors.*` tokens only
- Exception: camera overlay `rgba()` values are permitted as literals (blended over live feed)
- No logic changes — only style values change in a design pass
- All tap targets ≥ 44pt height (minHeight: 44)
- Body text font size ≥ 15pt
- Card heights ≥ 72pt

## React Native Specifics

- `StyleSheet.create` shadow syntax for iOS: `{ shadowColor, shadowOffset, shadowOpacity, shadowRadius }`
- Android elevation: always pair with `elevation: N` alongside iOS shadow props
- `borderStyle: 'dashed'` requires `overflow: 'hidden'` on the parent on Android
- No Tailwind — this project uses React Native StyleSheet exclusively
