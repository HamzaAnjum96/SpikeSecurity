# Spike Security — Brand Style Guide

> Version 2.0 · "The Night Watch" · April 2026
> Editorial surveillance. Obsidian, bone, signal.

---

## 1. Design Concept

**Codename:** *The Night Watch*
**Aesthetic:** Editorial surveillance — the gravity of a British broadsheet crossed with the operational calm of a modern control room.

Spike Security protects venues, events and commercial sites twenty-four hours a day. The brand expression should feel the same way at 3am as it does at 3pm: composed, legible, disciplined, never theatrical. The site is not a billboard — it is an operations desk rendered in type.

### Tone

- Editorial, not corporate
- Operational, not gimmicky
- Disciplined, not cold
- British restraint, not American salesmanship
- A single warm signal amber does the heavy lifting; everything else earns its space

### The Three Moves

Every page leans on three recurring gestures:

1. **The serif headline.** Fraunces at display size, set tight, set serious.
2. **The mono readout.** JetBrains Mono small-caps for timestamps, unit codes, section labels, status pills. These read like a dispatcher's log.
3. **The hairline rule.** 1px rules separate everything. The grid is quiet but always visible.

---

## 2. Logo

No change from v1. The Spike shield and wordmark remain intact.

- `resources/SPIKE SECURITY LOGO.svg` — primary
- `resources/logo.svg` — fallback
- `resources/logo.png` — print / heavy composite use

The wordmark pairs with the Fraunces display serif in the site navigation — the logo supplies the geometry, the type supplies the voice. Maintain 1× shield-height clear space on all sides.

---

## 3. Colour — "Obsidian & Bone"

The palette is dominant-dark. Roughly 70% obsidian, 25% bone, 5% signal. Do not equalise; the asymmetry is the point.

### Core Tokens

| Name | Hex | Role |
|------|-----|------|
| **Obsidian** | `#0B0C0E` | Primary background. Near-black with a warm cast. |
| **Obsidian 2** | `#131417` | Elevated panel, card surface on dark. |
| **Obsidian 3** | `#1C1E23` | Accent/hover surface on dark. |
| **Bone** | `#EEEAE0` | Primary light surface. Warm off-white paper. |
| **Bone 2** | `#E4DFD2` | Subtle light variation — alternating sections. |
| **Ink** | `#0B0C0E` | Body text on bone. Same value as Obsidian. |
| **Signal** | `#FF5B1A` | The one accent. Amber-orange. |
| **Signal Dim** | `#C9440F` | Signal in hover/pressed state. |
| **LED** | `#34D399` | Live status dot only. Never for text. |

### Derived Tokens

| Name | Value | Role |
|------|-------|------|
| `--hairline-dark` | `rgba(238,234,224,0.12)` | 1px rules on obsidian |
| `--hairline-light` | `rgba(11,12,14,0.12)` | 1px rules on bone |
| `--mute-dark` | `rgba(238,234,224,0.62)` | Secondary text on obsidian |
| `--mute-light` | `rgba(11,12,14,0.60)` | Secondary text on bone |
| `--grid-dark` | `rgba(238,234,224,0.04)` | Graph-paper background on obsidian |
| `--grid-light` | `rgba(11,12,14,0.04)` | Graph-paper background on bone |

### Usage Rules

- Obsidian is the default canvas. Bone sections are editorial interludes, not the default.
- Signal amber is used **once per viewport** wherever possible. It marks action, not decoration.
- Never place signal on bone at small type sizes below 14px without weight ≥ 600.
- Status LED green is reserved for the live indicator in the nav/ticker. Nowhere else.
- Gradients are forbidden except one very low-contrast radial wash on hero backgrounds.

### Accessibility

| Pair | Ratio | Notes |
|------|-------|-------|
| Bone on Obsidian | 15.1 : 1 | Body text, headings |
| Signal on Obsidian | 5.6 : 1 | Large text and buttons only |
| Ink on Bone | 14.8 : 1 | Body text, headings |
| Signal on Bone | 3.9 : 1 | Large text (≥ 24px) only |

---

## 4. Typography

Three typefaces, each with one job.

### Typefaces

| Role | Font | Weights | Why |
|------|------|---------|-----|
| Display | **Fraunces** | 300, 500, 700, 900 (+ italic) | Variable serif with optical sizing. Serious without being stiff. Sharp at 72px, gentle at 24px. |
| Body / UI | **Manrope** | 400, 500, 700 | Clean grotesque with distinctive rounded terminals. Readable, modern, not Inter. |
| Mono / Data | **JetBrains Mono** | 400, 500, 700 | The dispatcher's typewriter. Used at small sizes for timestamps, codes and status. |

### Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet"/>
```

### Type Scale

| Element | Font | Size | Weight | Tracking | Leading |
|---------|------|------|--------|----------|---------|
| Display H1 | Fraunces | clamp(3rem, 8vw, 6.5rem) | 500 | -0.02em | 0.95 |
| Display H2 | Fraunces | clamp(2rem, 5vw, 3.75rem) | 500 | -0.015em | 1.02 |
| H3 | Fraunces | clamp(1.35rem, 2.5vw, 1.85rem) | 500 | -0.01em | 1.15 |
| H4 | Fraunces | 1.25rem | 500 | -0.005em | 1.2 |
| Body L | Manrope | 1.0625rem | 400 | 0 | 1.65 |
| Body | Manrope | 1rem | 400 | 0 | 1.65 |
| Small | Manrope | 0.875rem | 500 | 0 | 1.55 |
| Mono label | JetBrains Mono | 0.75rem | 500 | 0.14em | 1 |
| Mono data | JetBrains Mono | 0.8125rem | 400 | 0.02em | 1.4 |
| Button | Manrope | 0.875rem | 700 | 0.08em | 1 |

### Typographic Details

- Display headlines use Fraunces **italic** for the single emphasised phrase per section (e.g. *every time*, *on watch*, *built for 3am*). Never emphasise more than one phrase per headline.
- Mono labels are **always uppercase** and take a leading glyph: `◉ LIVE` · `▸ OPS/01` · `⌁ UNIT READY`.
- Numbered services use Fraunces italic at 96–144px set as the dominant compositional element.
- Body text uses Manrope 400 only. Never bold body copy — weight is reserved for UI.
- Avoid centred paragraphs for anything longer than one line. Editorial layout is left-aligned.

---

## 5. Spacing

Keep the 8px base but double the scale above `2xl` — editorial layouts breathe.

| Token | Value |
|-------|-------|
| `--space-3xs` | 2px |
| `--space-2xs` | 4px |
| `--space-xs` | 8px |
| `--space-sm` | 12px |
| `--space-md` | 20px |
| `--space-lg` | 32px |
| `--space-xl` | 48px |
| `--space-2xl` | 72px |
| `--space-3xl` | 112px |
| `--space-4xl` | 160px |
| `--space-5xl` | 224px |

Section vertical rhythm uses `--space-3xl` minimum between blocks, `--space-4xl` between major acts.

---

## 6. Corners & Radius

The v1 design was pillowy and rounded. v2 is **hard-edged**. The only rounding comes from typography.

| Token | Value | Use |
|-------|-------|-----|
| `--radius-0` | 0 | Default — everything is square |
| `--radius-1` | 2px | Small UI chrome (status pills) |
| `--radius-2` | 4px | Form inputs |
| `--radius-full` | 999px | Status LED only |

**Never** use rounded corners on cards, buttons, images or sections. The grid is the decoration.

---

## 7. Lines & Rules

Hairlines are the primary structural element. They replace borders, dividers and cards.

- All rules are 1px.
- Rule colour is `--hairline-dark` on obsidian, `--hairline-light` on bone.
- A **double rule** (1px + 3px gap + 1px) marks the top of major sections.
- A **signal rule** (2px in `--signal`) marks the single emphasised item per page.
- Cards do not have four-sided borders. They have **top-and-bottom rules** only.

---

## 8. Components

### 8.1 Navbar

- Fixed. 64px tall.
- Obsidian background with a 1px bottom hairline.
- Brand on the left (logo + Fraunces wordmark at 1.05rem, letterspaced).
- Links centred in Manrope 500, 0.875rem, tracking 0.08em, uppercase.
- On the right: a `◉ LIVE` pill with a pulsing `--led` dot, then the primary CTA.
- Active link sits above a 2px signal underline.
- Scroll state: background remains, hairline intensifies to full `--hairline-dark`.

### 8.2 Ticker

- A 28px-tall strip immediately above the navbar on obsidian.
- Continuous marquee of mono labels separated by `◆`.
- Content: `OPS CHANNEL 01 ◆ MCR HQ ◆ 24/7/365 ◆ SIA LICENSED ◆ BS 7858 VETTED ◆ RAPID DEPLOYMENT ◆ EMERGENCY COVER AVAILABLE`.
- Signal amber text on obsidian, JetBrains Mono 0.75rem, letterspaced.
- Paused on hover.

### 8.3 Buttons

Only two button types.

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| `.btn-primary` | Signal | Obsidian | None | Single primary CTA per section |
| `.btn-ghost` | Transparent | Current | 1px current | Everything else |

- Shape: square (`--radius-0`).
- Padding: 16px 28px standard, 20px 36px large, 10px 18px small.
- On hover: the button flips — primary fades to obsidian with a signal border; ghost fills with signal. No translate, no shadow.
- Mono caret prefix: `→` sits inside the button with 12px padding on the right.

### 8.4 Cards / "Entries"

Cards are reframed as "entries" — magazine items divided by hairlines.

- No background fill. No border-radius. No shadow.
- 1px top rule + 1px bottom rule only.
- A huge mono number in the top-right corner (`01 / 06`) in Fraunces italic, size `clamp(3rem, 6vw, 5.5rem)`.
- Title in Fraunces 500 at 1.6rem.
- A `◉ TAG` mono strip below the title in signal amber.
- On hover: title shifts left 8px and a 2px signal rule slides across the bottom from left to right over 400ms.

### 8.5 Status Pills

- JetBrains Mono 0.6875rem uppercase, 0.14em tracking.
- Padding 4px 10px, `--radius-1`.
- Three kinds: live (green LED + signal text), alert (signal bg, obsidian text), standby (hairline border, muted text).

### 8.6 Forms

- Inputs have no border box — only a 1px **bottom** rule, `--hairline-dark`.
- Labels sit above in JetBrains Mono 0.6875rem uppercase signal.
- Focus: bottom rule becomes 2px signal, no ring.
- Placeholder: Manrope italic at `--mute-dark`.
- Select chevron: custom mono `▾`.
- Errors: a 1px signal rule on the left of the field + mono error message below.

### 8.7 Accordion (Careers)

- Each entry is row-based, full-width, separated by hairlines.
- Left column: role title (Fraunces 1.5rem) and mono meta (`▸ PART-TIME ◆ MCR CITY ◆ CODE · DS-PT`).
- Right column: `+` glyph in Fraunces 2rem that rotates 45° to `×` when open.
- Open body: mono description block with a 2px signal left rule and a ghost "APPLY" button aligned right.

### 8.8 Tables / Step Lists

The three-step process is a horizontal **log**:

```
01 ── ENQUIRE       02 ── PLAN         03 ── DEPLOY
       ─────────────────────────────────────
       Mono copy     Mono copy          Mono copy
```

Large Fraunces numerals, mono rules between steps, Manrope body below.

---

## 9. Section Layout

### 9.1 The Grid

The site runs on a 12-column grid with `--space-md` gutters. The outer container is `min(92vw, 1360px)`. Breakout rules are allowed — images and headlines may extend to the viewport edge.

### 9.2 Backgrounds

- **Default:** obsidian with a faint graph-paper grid (`--grid-dark`, 40px squares).
- **Section bone:** bone with `--grid-light` grid.
- **Grain overlay:** a fixed-position SVG noise layer at 3% opacity sits over the entire site, pinned to the viewport. Source: inline SVG `feTurbulence` with `baseFrequency=0.9`.
- **No photography on hero by default.** If imagery is used, it is monochromed to obsidian with a 60% darken overlay and placed as a side column, never full-bleed.

### 9.3 Section Rhythm

Alternate in this order, top to bottom:

1. Obsidian (hero)
2. Obsidian (secondary)
3. Bone (editorial interlude)
4. Obsidian (dark stats / credentials)
5. Bone (CTA spread)
6. Obsidian (footer)

This dominant-dark cadence reinforces the night-watch concept. A bone section always feels like paper pulled out of a folder.

### 9.4 Hero Composition

The hero is **asymmetric**:

- Left 7 columns: Fraunces headline, mono eyebrow, one sentence of Manrope body, primary CTA.
- Right 5 columns: an operations panel — a stack of mono readouts (UNIT STATUS, COVERAGE, ON-CALL, LAST DEPLOYMENT) with blinking LED.
- Bottom full-width: the ticker.
- Background: obsidian + grid + a very soft signal radial at 8% in the top-right.

### 9.5 Section Headings

Every section starts with a three-line stamp:

```
▸ SECTION 02 / 06
─────────────────
THE SERVICES WE OPERATE
```

Line 1: JetBrains Mono signal label.
Line 2: 1px rule, 48px long.
Line 3: Fraunces headline.

---

## 10. Motion

Restrained. Purposeful. Never decorative.

- **Page load:** a single 600ms vertical text reveal on the hero headline (clip-path inset from 0 100% to 0 0). One headline. No others.
- **Ticker:** continuous linear translate, 60s cycle. Paused on hover.
- **LED pulse:** 2s ease-in-out alternate, opacity 0.35 → 1.
- **Section reveal:** body elements fade + rise 12px over 500ms on intersection. Stagger 60ms between siblings. Max 6 items staggered.
- **Entry hover:** title translateX(8px), signal rule slides across bottom over 400ms `cubic-bezier(0.2, 0, 0, 1)`.
- **Button hover:** 200ms colour swap, no transform.
- **Respects `prefers-reduced-motion`:** all non-essential motion is disabled.

---

## 11. Iconography

- Material Symbols **Outlined** weight 300 — thin, technical.
- Default size 20px. Inline with mono labels at baseline.
- Signal amber **only** when paired with the live/alert state. Everything else inherits text colour.
- No filled icons. No rounded variants.

---

## 12. Photography

Photography is a last resort, not a default.

- If used, convert to grayscale, pull highlights down, push shadows deeper. Image should read as 90% black with one or two silver midtones.
- Overlay a 40% obsidian scrim with a signal-amber 4% wash.
- No rounded corners. Images are rectangles with a 1px hairline above and below.
- Captions mandatory: JetBrains Mono 0.75rem, signal label + Manrope description.

---

## 13. Tone of Voice

Same rules as v1 with two additions:

- Prefer **numbers and specifics.** "24/7, 365" beats "always available".
- Use **dispatch language** sparingly in mono UI: UNIT, CHANNEL, COVERAGE, DEPLOYMENT, ON-CALL. Never in body copy.

---

## 14. Design Tokens Reference

For direct copy into CSS:

```css
:root {
  /* Surface */
  --obsidian:   #0B0C0E;
  --obsidian-2: #131417;
  --obsidian-3: #1C1E23;
  --bone:       #EEEAE0;
  --bone-2:     #E4DFD2;

  /* Ink */
  --ink:        #0B0C0E;
  --bone-ink:   #EEEAE0;

  /* Accent */
  --signal:     #FF5B1A;
  --signal-dim: #C9440F;
  --led:        #34D399;

  /* Hairlines / atmosphere */
  --hairline-dark:  rgba(238, 234, 224, 0.12);
  --hairline-light: rgba(11, 12, 14, 0.12);
  --mute-dark:      rgba(238, 234, 224, 0.62);
  --mute-light:     rgba(11, 12, 14, 0.60);
  --grid-dark:      rgba(238, 234, 224, 0.04);
  --grid-light:     rgba(11, 12, 14, 0.04);

  /* Type */
  --font-display: "Fraunces", "Georgia", serif;
  --font-body:    "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;

  /* Motion */
  --ease-editorial: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 200ms;
  --dur-mid:  400ms;
  --dur-slow: 600ms;

  /* Grid */
  --container: min(92vw, 1360px);
  --gutter:    20px;
}
```

---

## 15. What To Avoid

Explicit no-gos, learned from the v1 refresh:

- Gold gradients on navy. The v1 pairing is retired.
- Rounded pill buttons.
- Drop shadows.
- Centred hero copy for the homepage.
- Stock photography of "a man in a suit".
- Iconography as the primary storytelling device.
- Multiple accent colours. There is one signal. That is the discipline.

---

## 16. Contact Details (Placeholder)

| | |
|--|--|
| **Company** | SPIKE SECURITY LIMITED |
| **Address** | Cheetham Hill, Manchester |
| **Phone** | 020 37 57 27 67 |
| **General email** | info@spikesecurity.co.uk |
| **Careers email** | careers@spikesecurity.co.uk |
| **Hours (office)** | Mon–Fri, 8am–6pm |
| **Hours (operational)** | 24/7, 365 days a year |
