# Brand Theme & Manual — Nido Centro de Terapias

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the purple-based Tailwind theme with a sage/teal brand system, swap fonts to Cormorant Garamond + DM Sans, update the sidebar with the real logo, and generate a `/brand` page + `docs/brand.md` brand manual.

**Architecture:** Single `src/styles/tokens.css` holds all raw brand values. `globals.css` imports it and maps tokens into Tailwind's `@theme inline`. All existing `indigo-*` Tailwind classes continue to work via an alias in `@theme` — zero component rewrites needed except Sidebar (which has hardcoded hex values).

**Tech Stack:** Next.js 16, Tailwind CSS v4, `next/font/google` (DM Sans + Cormorant Garamond), TypeScript, `next/image`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| CREATE | `src/styles/tokens.css` | All raw brand values — single source of truth |
| MODIFY | `src/app/globals.css` | Import tokens, `@theme inline` mapping, FC overrides |
| MODIFY | `src/app/layout.tsx` | Font loaders (DM Sans + Cormorant), metadata |
| MODIFY | `src/components/ui/Sidebar.tsx` | Logo PNG + sage color tokens replacing hardcoded hex |
| CREATE | `src/app/(app)/brand/page.tsx` | Brand manual web route (behind auth) |
| CREATE | `docs/brand.md` | Markdown brand manual for Notion/PDF |

---

## Task 1: Create `src/styles/tokens.css`

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Create the tokens file**

```css
/* src/styles/tokens.css
   Single source of truth for Nido brand values.
   Import this in globals.css — do not use these variables directly in components. */

:root {
  /* ── Sage / Teal scale ───────────────────────────────────────── */
  --nido-sage-50:  #F2F7F5;
  --nido-sage-100: #DEEEE8;
  --nido-sage-200: #BEDDD3;
  --nido-sage-300: #9DCABF;
  --nido-sage-500: #5EA697;
  --nido-sage-600: #8AAE9F;   /* primary — buttons, active nav   */
  --nido-sage-700: #6B9488;   /* hover                           */
  --nido-sage-800: #4D7A6E;
  --nido-sage-900: #2F5F54;   /* sidebar background              */

  /* ── Purple scale (secondary / status) ──────────────────────── */
  --nido-purple-100: #EBE0F5;
  --nido-purple-300: #C4AED8;
  --nido-purple-600: #9B7FC0;
  --nido-purple-700: #7B5FA0;
  --nido-purple-900: #3D2D5A;

  /* ── Neutrals ────────────────────────────────────────────────── */
  --nido-cream: #F5F2EC;
  --nido-black: #1C1C1C;

  /* ── Semantic ────────────────────────────────────────────────── */
  --background: var(--nido-cream);
  --foreground: var(--nido-black);

  /* ── FullCalendar overrides ──────────────────────────────────── */
  --fc-border-color:              #C8DDD8;
  --fc-button-bg-color:           var(--nido-sage-600);
  --fc-button-border-color:       var(--nido-sage-600);
  --fc-button-hover-bg-color:     var(--nido-sage-700);
  --fc-button-hover-border-color: var(--nido-sage-700);
  --fc-button-active-bg-color:    var(--nido-sage-800);
  --fc-today-bg-color:            var(--nido-sage-50);
  --fc-now-indicator-color:       #ef4444;
  --fc-highlight-color:           rgba(94, 166, 151, 0.12);
}
```

- [ ] **Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(brand): add tokens.css as single source of brand values"
```

---

## Task 2: Rewrite `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Replace the entire file content**

```css
@import "tailwindcss";
@import "../styles/tokens.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans:    var(--font-dm-sans);
  --font-heading: var(--font-cormorant);

  /* ── Sage scale (new primary) ──────────────────────────────── */
  --color-sage-50:  var(--nido-sage-50);
  --color-sage-100: var(--nido-sage-100);
  --color-sage-200: var(--nido-sage-200);
  --color-sage-300: var(--nido-sage-300);
  --color-sage-500: var(--nido-sage-500);
  --color-sage-600: var(--nido-sage-600);
  --color-sage-700: var(--nido-sage-700);
  --color-sage-800: var(--nido-sage-800);
  --color-sage-900: var(--nido-sage-900);

  /* ── Indigo aliased to sage (backward compat — no component rewrites needed) */
  --color-indigo-50:  var(--nido-sage-50);
  --color-indigo-100: var(--nido-sage-100);
  --color-indigo-200: var(--nido-sage-200);
  --color-indigo-300: var(--nido-sage-300);
  --color-indigo-500: var(--nido-sage-500);
  --color-indigo-600: var(--nido-sage-600);
  --color-indigo-700: var(--nido-sage-700);
  --color-indigo-800: var(--nido-sage-800);
  --color-indigo-900: var(--nido-sage-900);

  /* ── Blue aliased to sage (appointment badges) ─────────────── */
  --color-blue-100: var(--nido-sage-100);
  --color-blue-500: var(--nido-sage-500);
  --color-blue-600: var(--nido-sage-600);
  --color-blue-700: var(--nido-sage-700);

  /* ── Purple (secondary / status) ───────────────────────────── */
  --color-purple-100: var(--nido-purple-100);
  --color-purple-300: var(--nido-purple-300);
  --color-purple-600: var(--nido-purple-600);
  --color-purple-700: var(--nido-purple-700);

  /* ── Green (status: atendido) ───────────────────────────────── */
  --color-green-100: #E4EFE3;
  --color-green-600: #7A9E77;
  --color-green-700: #5F8A5C;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-dm-sans), system-ui, sans-serif;
}

/* ── FullCalendar layout overrides ─────────────────────────────── */
.fc .fc-toolbar-title {
  font-size: 1rem;
  font-weight: 600;
}

.fc .fc-button {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
}

.fc .fc-col-header-cell-cushion,
.fc .fc-daygrid-day-number {
  color: #374151;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border-color: var(--fc-border-color);
}

.fc .fc-timegrid-slot {
  height: 2rem;
}

.fc .fc-event {
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.fc .fc-resource-timeline-divider {
  border-color: var(--fc-border-color);
}
```

- [ ] **Verify the dev server compiles without errors**

```bash
npm run dev
```

Expected: no CSS compilation errors in terminal.

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "feat(brand): remap Tailwind theme to sage/teal primary via tokens"
```

---

## Task 3: Update fonts and metadata in `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Replace the file**

```tsx
import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Nido — Centro de Terapias',
  description: 'Sistema de gestión para Nido Centro de Terapias',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

- [ ] **Verify dev server — check browser tab title reads "Nido — Centro de Terapias" and body font is DM Sans (not Arial)**

```bash
npm run dev
# Open http://localhost:3000 in browser, inspect body font in DevTools
```

- [ ] **Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(brand): swap fonts to DM Sans + Cormorant Garamond, update metadata"
```

---

## Task 4: Update Sidebar with logo and sage colors

**Files:**
- Modify: `src/components/ui/Sidebar.tsx`

The sidebar has hardcoded hex values that aren't covered by the indigo→sage alias:
- `bg-[#2D1F4A]` → `bg-sage-900` (`#2F5F54`)
- `bg-[#3D2D5A]` → `bg-sage-800` (`#4D7A6E`) for hover/borders
- `border-[#3D2D5A]` → `border-sage-800`
- `text-indigo-300` → already aliased, but now resolves to sage-300 (correct)

- [ ] **Replace the file**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  DoorOpen,
  CalendarDays,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { logoutAction } from '@/app/(auth)/actions'
import { getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',     label: 'Panel Principal', icon: LayoutDashboard },
  { href: '/consultorios',  label: 'Consultorios',    icon: DoorOpen },
  { href: '/agenda',        label: 'Agenda',           icon: CalendarDays },
  { href: '/pacientes',     label: 'Pacientes',        icon: Users },
  { href: '/sesiones/nueva', label: 'Nueva sesión',   icon: FileText },
]

interface SidebarProps {
  userFullName: string
  userRole: string
}

export default function Sidebar({ userFullName, userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  const navContent = (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-sage-600 text-white'
                  : 'text-sage-300 hover:text-white hover:bg-sage-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sage-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {getInitials(userFullName)}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-medium truncate">{userFullName}</p>
            <p className="text-sage-300 text-xs capitalize">{userRole}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-sage-300 hover:text-white hover:bg-sage-800 rounded-lg text-sm transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-sage-900 flex items-center gap-3 px-4 border-b border-sage-800">
        <button
          onClick={() => setIsOpen(true)}
          className="text-sage-300 hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/logo-bird.png" alt="Nido" width={28} height={28} className="object-contain" />
          <span className="text-white text-sm font-light tracking-wide">Nido</span>
        </div>
      </header>

      {/* Backdrop overlay (mobile only) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 min-h-screen bg-sage-900 flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-sage-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-bird.png" alt="Nido" width={40} height={40} className="object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-white font-light text-lg tracking-wide">Nido</span>
              <span className="text-sage-300 font-light text-xs tracking-widest">Centro de terapias</span>
            </div>
          </div>
          <button
            onClick={close}
            className="md:hidden text-sage-300 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {navContent}
      </aside>
    </>
  )
}
```

- [ ] **Open the app, verify sidebar shows bird logo + "Nido / Centro de terapias", active link is sage green (not purple), hover states work**

```bash
npm run dev
# Open http://localhost:3000 — log in and check sidebar
```

- [ ] **Commit**

```bash
git add src/components/ui/Sidebar.tsx
git commit -m "feat(brand): update sidebar with logo-bird.png and sage color tokens"
```

---

## Task 5: Create `/brand` page (web brand manual)

**Files:**
- Create: `src/app/(app)/brand/page.tsx`

- [ ] **Create the brand page**

```tsx
import Image from 'next/image'

export const metadata = {
  title: 'Manual de Marca — Nido Centro de Terapias',
}

const colors = [
  { name: 'Sage 600', hex: '#8AAE9F', role: 'Primario', textLight: false },
  { name: 'Sage 500', hex: '#5EA697', role: 'Acento',   textLight: false },
  { name: 'Sage 700', hex: '#6B9488', role: 'Hover',    textLight: false },
  { name: 'Sage 900', hex: '#2F5F54', role: 'Sidebar',  textLight: true  },
  { name: 'Sage 100', hex: '#DEEEE8', role: 'Fondos suaves', textLight: false },
  { name: 'Crema',    hex: '#F5F2EC', role: 'Background',    textLight: false, border: true },
  { name: 'Purple 600', hex: '#9B7FC0', role: 'Acento UI', textLight: true },
  { name: 'Purple 100', hex: '#EBE0F5', role: 'Badge fondo', textLight: false },
  { name: 'Verde 600',  hex: '#7A9E77', role: 'Atendido',    textLight: true },
  { name: 'Negro',      hex: '#1C1C1C', role: 'Texto',       textLight: true },
]

const logoVariants = [
  { bg: '#8AAE9F', textColor: '#fff',     tagColor: 'rgba(255,255,255,0.75)', label: 'Primario (sage)' },
  { bg: '#2F5F54', textColor: '#fff',     tagColor: 'rgba(255,255,255,0.75)', label: 'Oscuro' },
  { bg: '#F5F2EC', textColor: '#2F5F54',  tagColor: '#6B7280',               label: 'Claro (crema)', border: true },
  { bg: '#1C1C1C', textColor: '#fff',     tagColor: 'rgba(255,255,255,0.6)', label: 'Negro' },
]

export default function BrandPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-14">

      {/* Header */}
      <section>
        <div
          className="rounded-2xl p-12 flex items-center justify-center gap-6"
          style={{ background: '#8AAE9F' }}
        >
          <Image src="/logo-bird.png" alt="Nido" width={120} height={120} className="object-contain" />
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 64, letterSpacing: '0.03em', color: '#fff' }}>
              Nido
            </span>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 18, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>
              Centro de terapias
            </span>
          </div>
        </div>
      </section>

      {/* Logo variants */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-1">Logo</h2>
        <p className="text-sm text-gray-500 mb-6">El logo puede usarse sobre cualquiera de estos fondos. Siempre mantener el ícono del pájaro junto al wordmark.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {logoVariants.map((v) => (
            <div
              key={v.label}
              className="rounded-xl p-6 flex flex-col items-center gap-3"
              style={{ background: v.bg, border: v.border ? '1px solid #ddd' : undefined }}
            >
              <Image src="/logo-bird.png" alt="Nido" width={96} height={96} className="object-contain" />
              <div className="text-center leading-tight">
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 24, letterSpacing: '0.04em', color: v.textColor }}>
                  Nido
                </div>
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 10, letterSpacing: '0.12em', color: v.tagColor, marginTop: 3 }}>
                  Centro de terapias
                </div>
              </div>
              <span className="text-xs mt-1" style={{ color: v.tagColor }}>{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-1">Paleta de color</h2>
        <p className="text-sm text-gray-500 mb-6">Sage/teal es el color primario de la marca. Purple se reserva para elementos de estado en la UI.</p>
        <div className="flex flex-wrap gap-4">
          {colors.map((c) => (
            <div key={c.hex} className="flex flex-col gap-2 w-24">
              <div
                className="w-24 h-24 rounded-xl"
                style={{ background: c.hex, border: c.border ? '1px solid #ddd' : undefined }}
              />
              <div className="text-xs font-semibold text-gray-900">{c.name}</div>
              <div className="text-xs font-mono text-gray-500">{c.hex}</div>
              <div className="text-xs text-gray-400">{c.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-1">Tipografía</h2>
        <p className="text-sm text-gray-500 mb-8">Dos familias tipográficas complementarias: una serif elegante para títulos, una sans humanista para la interfaz.</p>
        <div className="space-y-8">
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              Cormorant Garamond 700<br/>Títulos / Display
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 48, fontWeight: 700, lineHeight: 1.1 }}>
              Bienestar integral
            </div>
          </div>
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              Cormorant Garamond 400i<br/>Subtítulos
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 28, fontStyle: 'italic', color: '#444' }}>
              Un espacio seguro para crecer
            </div>
          </div>
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              DM Sans 500<br/>Labels / Navegación
            </div>
            <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 16, fontWeight: 500 }}>
              Panel Principal · Agenda · Pacientes
            </div>
          </div>
          <div className="flex gap-6 items-baseline">
            <div className="text-xs text-gray-400 w-40 shrink-0 leading-relaxed">
              DM Sans 400<br/>Cuerpo / UI
            </div>
            <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 15, color: '#6B7280', lineHeight: 1.6 }}>
              En Nido encontrás un espacio de escucha, cuidado y acompañamiento profesional para atravesar cada etapa de la vida.
            </div>
          </div>
        </div>
      </section>

      {/* Logo download */}
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-4">Recursos</h2>
        <a
          href="/logo-bird.png"
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          Descargar logo (PNG transparente)
        </a>
      </section>

    </div>
  )
}
```

- [ ] **Add the brand link to the nav items in Sidebar.tsx** (add after existing items)

In `src/components/ui/Sidebar.tsx`, add to `navItems`:
```tsx
{ href: '/brand', label: 'Manual de marca', icon: Palette },
```

Also add `Palette` to the lucide-react import:
```tsx
import { LayoutDashboard, DoorOpen, CalendarDays, Users, FileText, LogOut, Menu, X, Palette } from 'lucide-react'
```

- [ ] **Open http://localhost:3000/brand — verify the page renders with logo (large), color swatches, typography specimens, and download button**

- [ ] **Commit**

```bash
git add src/app/(app)/brand/page.tsx src/components/ui/Sidebar.tsx
git commit -m "feat(brand): add /brand page with full brand manual"
```

---

## Task 6: Create `docs/brand.md` (Markdown brand manual)

**Files:**
- Create: `docs/brand.md`

- [ ] **Create the file**

```markdown
# Manual de Marca — Nido Centro de Terapias

## Logo

El logo de Nido combina la ilustración del pájaro (acuarela estilo) con el wordmark "Nido" en tipografía ligera.

**Archivo:** `public/logo-bird.png` — PNG con fondo transparente

### Uso correcto
- Mantener siempre el ícono del pájaro junto al wordmark
- Usar sobre fondos: sage (#8AAE9F), verde oscuro (#2F5F54), crema (#F5F2EC), negro (#1C1C1C)
- Mínimo de espacio libre alrededor: igual a la altura de la letra "N" del wordmark

### Uso incorrecto
- No distorsionar las proporciones
- No usar sobre fondos con poco contraste
- No recrear el logo con otra tipografía

---

## Paleta de color

| Token         | Hex       | Uso                              |
|---------------|-----------|----------------------------------|
| Sage 600      | `#8AAE9F` | Color primario (botones, nav)    |
| Sage 500      | `#5EA697` | Acento, links                    |
| Sage 700      | `#6B9488` | Hover                            |
| Sage 900      | `#2F5F54` | Sidebar, fondos oscuros          |
| Sage 100      | `#DEEEE8` | Fondos suaves, badges            |
| Crema         | `#F5F2EC` | Background general de la app     |
| Purple 600    | `#9B7FC0` | Acento secundario (estado UI)    |
| Purple 100    | `#EBE0F5` | Badge fondo (estado "agendado")  |
| Verde 600     | `#7A9E77` | Estado "atendido"                |
| Negro         | `#1C1C1C` | Texto principal                  |

---

## Tipografía

### Cormorant Garamond
- **Uso:** Títulos de página, display, subtítulos en itálica
- **Pesos:** 400, 400 italic, 600, 700
- **Fuente:** Google Fonts

### DM Sans
- **Uso:** Todo el resto — navegación, labels, cuerpo, botones, formularios
- **Pesos:** 300 (wordmark logo), 400 (cuerpo), 500 (labels/nav), 600 (botones)
- **Fuente:** Google Fonts

### Escala de tamaños
| Elemento          | Familia          | Tamaño | Peso |
|-------------------|------------------|--------|------|
| Título de página  | Cormorant        | 2xl    | 700  |
| Subtítulo         | Cormorant italic | xl     | 400  |
| Navegación        | DM Sans          | sm     | 500  |
| Cuerpo            | DM Sans          | sm     | 400  |
| Label             | DM Sans          | xs     | 600  |
| Botón primario    | DM Sans          | sm     | 500  |

---

## Voz y tono

- **Cercano y profesional:** Hablamos de vos a vos, sin tecnicismos innecesarios
- **Cálido sin ser informal:** Transmitimos calidez y contención, no informalidad
- **Claro y directo:** Las comunicaciones son breves y accionables

---

## Recursos digitales

- Logo PNG transparente: `public/logo-bird.png`
- Tokens de color: `src/styles/tokens.css`
- Vista web del manual: `/brand` (en la aplicación)
```

- [ ] **Commit**

```bash
git add docs/brand.md
git commit -m "docs: add markdown brand manual for Nido"
```

---

## Task 7: TypeScript build check

- [ ] **Run TypeScript compiler**

```bash
npx tsc --noEmit
```

Expected: no errors. If there are errors, fix them before proceeding.

- [ ] **Run Next.js build**

```bash
npm run build
```

Expected: build completes successfully with no type errors.

- [ ] **If build passes, commit any fixes and push**

```bash
git push origin development
```
