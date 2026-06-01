# Design

## Theme

Dark museum-vitrine. Near-black velvet surface with a faint cool-green tint (the shadow inside a display case), raised panels catching a soft top-light, and a glowing jade-lime primary that reads as a spotlight on foil. Warm gold is the value/trust accent (ratings, premium, legendary). Color strategy: **Committed** — the dark green-tinted surface plus the glowing primary carry the identity; everything else is restrained neutrals and a semantic rarity ramp.

## Color

OKLCH throughout. Dark theme is the default and only theme for the MVP.

```css
/* Surfaces — vitrine shadow, faint cool-green tint */
--bg:        oklch(0.158 0.012 156);  /* app background */
--surface:   oklch(0.205 0.014 156);  /* cards, panels */
--surface-2: oklch(0.252 0.015 156);  /* raised / hover */
--line:      oklch(0.300 0.014 156);  /* hairline borders */

/* Text */
--ink:       oklch(0.965 0.005 156);  /* primary text  (~16:1 on bg) */
--muted:     oklch(0.740 0.012 156);  /* secondary     (~6:1 on bg)  */
--faint:     oklch(0.560 0.012 156);  /* tertiary/meta (~3.6:1)      */

/* Brand */
--primary:       oklch(0.840 0.168 132); /* jade-lime foil glow — DARK text on fills */
--primary-ink:   oklch(0.180 0.040 150); /* text on primary fills */
--primary-dim:   oklch(0.500 0.110 134); /* primary on dark for borders/icons */
--accent:        oklch(0.790 0.150 78);  /* warm gold — ratings, premium, legendary */
--accent-ink:    oklch(0.220 0.040 70);

/* Semantic */
--success: oklch(0.760 0.150 152);
--danger:  oklch(0.660 0.190 25);
--warning: oklch(0.800 0.140 80);
--info:    oklch(0.720 0.120 240);

/* Rarity ramp — distinct from brand, label+icon always accompany */
--r-comum:    oklch(0.680 0.020 156); /* grey   */
--r-incomum:  oklch(0.720 0.110 195); /* teal   */
--r-rara:     oklch(0.700 0.140 250); /* blue   */
--r-epica:    oklch(0.680 0.170 305); /* purple */
--r-lendaria: oklch(0.800 0.150 78);  /* gold (= accent), gets holo shimmer */
```

White text on saturated fills; dark `--primary-ink` on the pale-bright primary; dark `--accent-ink` on gold.

## Typography

Three families on contrast axes.

- **Display / wordmark:** Space Grotesk — quirky grotesque, gives collector-tech character to big headings and the CardLink wordmark.
- **Body / UI:** Inter Variable — neutral, dense, trustworthy for labels, buttons, body, data.
- **Mono:** JetBrains Mono — set numbers, card codes, stats ("151/165", "#4/102").

Fixed rem scale (product register, not fluid). Ratio ~1.2.
`--step--1: 0.833rem; --step-0: 1rem; --step-1: 1.2rem; --step-2: 1.44rem; --step-3: 1.728rem; --step-4: 2.074rem; --step-5: 2.488rem`. Display headings cap ~2.5rem in-app (this is product UI, not a hero page).

## Layout

Mobile-first. Bottom tab bar (Descobrir, Mensagens, +Adicionar, Perfil) on mobile; persistent left sidebar nav on ≥1024px with a top context bar. Item grid: `repeat(auto-fill, minmax(150px, 1fr))` so cards stay card-shaped (2.5:3.5 aspect). Content max-width ~1200px on desktop. Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.

## Components

Card-shaped collectibles rendered as procedural SVG `CardArt` (holo foil for rare+; type icon; rarity-driven). Rarity badge = color + icon + label. RatingStars (gold). Avatar = initials on deterministic gradient. Every interactive control has default / hover / focus-visible / active / disabled / loading. Skeleton loaders, teaching empty states.

## Motion

150–250ms, ease-out. Page/route crossfade + slide-up (12px). Card hover: lift + foil sheen sweep. Holo shimmer on rare cards (slow, subtle). Staggered grid entrance on first load. All gated behind `prefers-reduced-motion: reduce` → crossfade/instant. Library: Framer Motion (`motion`).

## Icons

lucide-react only.
