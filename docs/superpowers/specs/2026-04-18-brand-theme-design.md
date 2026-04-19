# Brand Theme & Manual — Nido Centro de Terapias

**Date:** 2026-04-18  
**Status:** Approved  
**Approach:** B — Separate `tokens.css` + `/brand` route

---

## Overview

Implement a maintainable brand theme system for the Nido Centro de Terapias management app, replacing the current inline/scattered styles with a structured token layer. Simultaneously generate a brand manual available as Markdown, and as a web route (`/brand`) in the app.

---

## Color System

Primary shifts from purple to sage/teal to match the actual logo.

| Token name         | Hex       | Role                          |
|--------------------|-----------|-------------------------------|
| `--color-sage-600` | `#8AAE9F` | Primary — buttons, active nav |
| `--color-sage-500` | `#5EA697` | Accent — links, highlights    |
| `--color-sage-700` | `#6B9488` | Hover state                   |
| `--color-sage-900` | `#2F5F54` | Sidebar background            |
| `--color-sage-100` | `#DEEEE8` | Soft backgrounds, badges      |
| `--color-sage-50`  | `#F2F7F5` | Subtle tints                  |
| `--background`     | `#F5F2EC` | Page background (warm cream)  |
| `--foreground`     | `#1C1C1C` | Primary text                  |
| `--color-purple-600` | `#9B7FC0` | Secondary accent (states UI) |
| `--color-purple-100` | `#EBE0F5` | Purple badge background      |

Purple is kept as a secondary semantic color for status badges (scheduled appointments etc.) but is no longer the primary interactive color.

---

## Typography

| Font                | Weight(s)     | Usage                          |
|---------------------|---------------|--------------------------------|
| Cormorant Garamond  | 400, 400i, 600, 700 | Page titles, display headings |
| DM Sans             | 300, 400, 500, 600  | All UI: nav, labels, body, buttons |

Both loaded via `next/font/google`. Geist Sans/Mono removed (were Next.js defaults, not brand fonts).

---

## Logo

- **File:** `public/logo-bird.png` — watercolor bird illustration, transparent background ✅ (already copied)
- **Wordmark:** "Nido" in DM Sans 300, letter-spacing 0.04em — rendered in CSS, not baked into image
- **Tagline:** "Centro de terapias" in DM Sans 300, letter-spacing 0.12em, 75% opacity
- **Usage on dark bg (sidebar):** bird PNG + white wordmark text
- **Usage on light bg:** bird PNG + sage-900 wordmark text

---

## File Structure (Approach B)

```
src/
  styles/
    tokens.css              ← NEW: all raw brand values
  app/
    globals.css             ← UPDATED: imports tokens, Tailwind @theme, FC overrides
    layout.tsx              ← UPDATED: DM Sans + Cormorant Garamond, metadata
    (app)/
      brand/
        page.tsx            ← NEW: brand manual web page
  components/
    ui/
      Sidebar.tsx           ← UPDATED: logo-bird.png + updated colors
public/
  logo-bird.png             ← DONE ✅
docs/
  brand.md                  ← NEW: Markdown brand manual (Notion/PDF)
```

---

## `src/styles/tokens.css`

Single source of truth. Contains only raw values — no Tailwind directives, no component rules.

```css
:root {
  /* Palette */
  --nido-sage-50:  #F2F7F5;
  --nido-sage-100: #DEEEE8;
  --nido-sage-200: #BEDDD3;
  --nido-sage-300: #9DCABF;
  --nido-sage-500: #5EA697;
  --nido-sage-600: #8AAE9F;   /* primary */
  --nido-sage-700: #6B9488;
  --nido-sage-800: #4D7A6E;
  --nido-sage-900: #2F5F54;   /* sidebar */

  --nido-purple-100: #EBE0F5;
  --nido-purple-300: #C4AED8;
  --nido-purple-600: #9B7FC0;
  --nido-purple-700: #7B5FA0;
  --nido-purple-900: #3D2D5A;

  --nido-cream:  #F5F2EC;
  --nido-black:  #1C1C1C;

  /* Semantic */
  --background: var(--nido-cream);
  --foreground: var(--nido-black);

  /* FullCalendar */
  --fc-border-color:            #C8DDD8;
  --fc-button-bg-color:         var(--nido-sage-600);
  --fc-button-border-color:     var(--nido-sage-600);
  --fc-button-hover-bg-color:   var(--nido-sage-700);
  --fc-button-hover-border-color: var(--nido-sage-700);
  --fc-button-active-bg-color:  var(--nido-sage-800);
  --fc-today-bg-color:          var(--nido-sage-50);
  --fc-now-indicator-color:     #ef4444;
  --fc-highlight-color:         rgba(94, 166, 151, 0.12);
}
```

---

## `src/app/globals.css`

Imports tokens, maps to Tailwind `@theme inline`, adds FC component overrides. No raw hex values here.

```css
@import "tailwindcss";
@import "../styles/tokens.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-dm-sans);
  --font-heading: var(--font-cormorant);

  /* Sage scale → replaces old indigo */
  --color-sage-50:  var(--nido-sage-50);
  --color-sage-100: var(--nido-sage-100);
  --color-sage-200: var(--nido-sage-200);
  --color-sage-300: var(--nido-sage-300);
  --color-sage-500: var(--nido-sage-500);
  --color-sage-600: var(--nido-sage-600);
  --color-sage-700: var(--nido-sage-700);
  --color-sage-900: var(--nido-sage-900);

  /* Keep indigo aliased to sage for backward compat during migration */
  --color-indigo-600: var(--nido-sage-600);
  --color-indigo-700: var(--nido-sage-700);
  --color-indigo-900: var(--nido-sage-900);

  /* Purple as secondary */
  --color-purple-100: var(--nido-purple-100);
  --color-purple-600: var(--nido-purple-600);
  --color-purple-700: var(--nido-purple-700);

  /* Semantic green (status: attended) */
  --color-green-100: #E4EFE3;
  --color-green-600: #7A9E77;
  --color-green-700: #5F8A5C;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-dm-sans), system-ui, sans-serif;
}
```

---

## `src/app/layout.tsx`

Replace Geist with DM Sans + Cormorant Garamond. Update metadata.

```tsx
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata = {
  title: 'Nido — Centro de Terapias',
  description: 'Sistema de gestión para Nido Centro de Terapias',
}
```

---

## Sidebar logo update

Replace current text-only logo in `Sidebar.tsx`:

```tsx
<Image src="/logo-bird.png" alt="Nido" width={28} height={28} className="object-contain" />
<span className="font-light tracking-wide text-white">Nido</span>
```

---

## Brand Manual (`/brand` route)

`src/app/(app)/brand/page.tsx` — a server component behind auth (same layout as the rest of the app). When the public site is built, this can be extracted to a public route. Renders a styled brand guide page with:

- Logo variations (on sage, dark, cream, black)
- Color palette swatches with hex codes and role labels
- Typography specimens (Cormorant Garamond + DM Sans at all weights)
- Do/Don't usage rules
- Download link for `logo-bird.png`

`docs/brand.md` — same content as Markdown, structured for Notion import and PDF export.

---

## Migration notes

- All existing `indigo-*` Tailwind classes in components continue to work via the alias in `@theme inline` — zero component changes needed during migration.
- Sidebar `bg-[#3D2D5A]` hardcodes → replaced with `bg-sage-900` (`#2F5F54`).
- FullCalendar overrides move from `globals.css` into `tokens.css` `:root` block so they're part of the token layer.
- `body { font-family: Arial }` → removed, now inherits from CSS variable set by Next.js font loader.
