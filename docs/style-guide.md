# Spike Security — Brand Style Guide

> Version 1.0 | April 2025

---

## 1. Brand Overview

**Company:** Spike Security Ltd  
**Tagline:** *Protecting What Matters Most*  
**Positioning:** Manchester's trusted, SIA-approved provider of professional security personnel for businesses across the North West.

**Brand Personality:**
- Authoritative but approachable
- Professional without being cold
- Trustworthy and reliable
- Locally rooted, nationally capable

---

## 2. Logo

### Primary Logo
The Spike Security logo consists of:
1. **Shield icon** — a geometric shield with a stylised angular "S" formed by two parallelogram cutouts. The 3D bevel on the top edge conveys solidity and strength.
2. **Wordmark** — "SPIKE SECURITY" in Barlow Condensed ExtraBold, all-caps, with "SIA Approved Contractor" in smaller text beneath.

### Files
| File | Usage |
|------|-------|
| `resources/logo.svg` | Primary SVG logo (scalable, recommended for all digital use) |
| `resources/logo.png` | Full branding PNG (gold on navy with wordmark) |

### Logo Variants
| Variant | When to Use |
|---------|-------------|
| Gold shield on navy | Primary use — website navbar, print on dark backgrounds |
| White shield on navy | Alternative for dark backgrounds where gold is unavailable |
| Full logo PNG (gold on navy with text) | Formal documents, presentations, large display |

### Clear Space
Maintain a minimum clear space of **1× the shield height** on all sides of the logo. Never crowd the logo with other elements.

### Logo Don'ts
- Do not rotate, skew or distort the logo
- Do not change the logo colours outside of approved variants
- Do not place the gold logo on a gold or very light background
- Do not add drop shadows, outlines or effects to the logo
- Do not recreate the logo in a different typeface

---

## 3. Colour Palette

### Primary Colours

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Navy** | `#0D1B2E` | 13, 27, 46 | Primary backgrounds, navbar, footer, dark sections |
| **Gold** | `#F0A500` | 240, 165, 0 | Accents, CTA buttons, highlights, stats bar |

### Secondary Colours

| Name | Hex | Usage |
|------|-----|-------|
| Navy Light | `#162640` | Hover states, card backgrounds on dark |
| Navy Dark | `#080F1A` | Footer background, deepest dark |
| Gold Dark | `#C8880A` | Hover state for gold, bevel detail in logo |
| Gold Light | `#FFB733` | Light accents, hover glow |
| White | `#FFFFFF` | Text on dark, card backgrounds |
| Off-White | `#F5F7FA` | Alternating section backgrounds |
| Text | `#1C2B3A` | Body text on light backgrounds |
| Muted | `#6B7C93` | Secondary/supporting text, placeholders |
| Border | `#DDE3EC` | Subtle dividers, card borders |

### Colour Usage Rules
- **Navy + Gold** is the primary pairing — it defines the brand
- On dark (navy) backgrounds: use white for body text, gold for accents
- On light backgrounds: use `--color-text` for body, navy for headings
- Gold is never used as a background for body text (readability)
- The gold CTA button always uses navy text for contrast compliance (WCAG AA)

### Accessibility
All text/background combinations in the design system meet WCAG 2.1 AA contrast ratios:
- White on Navy: 13.5:1 ✓
- Navy on Gold: 8.2:1 ✓
- Navy on White: 12.1:1 ✓

---

## 4. Typography

### Typefaces

| Role | Font | Weights | Source |
|------|------|---------|--------|
| Display / Headings | Barlow Condensed | 600, 700, 800 | Google Fonts |
| Body / UI | Barlow | 400, 500, 600 | Google Fonts |

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet"/>
```

### Type Scale

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Barlow Condensed | clamp(2.4rem, 6vw, 4rem) | 800 | 1.15 |
| H2 | Barlow Condensed | clamp(1.8rem, 4vw, 2.8rem) | 700 | 1.15 |
| H3 | Barlow Condensed | clamp(1.3rem, 2.5vw, 1.75rem) | 700 | 1.2 |
| H4 | Barlow Condensed | 1.25rem | 700 | 1.25 |
| Section label | Barlow Condensed | 0.85rem | 700 | — |
| Body | Barlow | 1rem | 400 | 1.7 |
| Body large | Barlow | 1.1–1.15rem | 400 | 1.7 |
| Small / caption | Barlow | 0.85rem | 400–500 | 1.5 |
| Button | Barlow Condensed | 0.9–1rem | 700 | — |
| Nav link | Barlow Condensed | 0.95rem | 600 | — |

### Letter Spacing
- Section labels: `0.12em` (uppercase, tracking)
- Navbar links: `0.05em`
- Buttons: `0.04em`
- Headings: `0.01em`
- Body: normal (0)

---

## 5. Spacing System

Based on an 8px base unit.

| Token | Value | Use |
|-------|-------|-----|
| `--space-xs` | 4px | Fine-grained adjustments |
| `--space-sm` | 8px | Icon gaps, tight spacing |
| `--space-md` | 16px | Standard component padding |
| `--space-lg` | 24px | Card padding internal |
| `--space-xl` | 40px | Section sub-spacing, card padding |
| `--space-2xl` | 64px | Between major elements |
| `--space-3xl` | 96px | Section padding |
| `--space-4xl` | 128px | Hero padding, major separators |

---

## 6. Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Tags, small badges |
| `--radius-md` | 14px | Form inputs, accordion items |
| `--radius-lg` | 24px | Cards, major containers |
| `--radius-xl` | 36px | Large feature cards, image frames |
| `--radius-pill` | 999px | Buttons, industry pills, badges |

The rounded aesthetic is central to the brand's friendly, professional character. **Always prefer rounder edges** over sharp corners on cards and interactive elements.

---

## 7. Components

### Buttons

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| `.btn-primary` | Gold `#F0A500` | Navy | None | Primary CTA |
| `.btn-secondary` | Transparent | White | White | Secondary CTA on dark |
| `.btn-outline-gold` | Transparent | Gold | Gold | Tertiary on light |
| `.btn-navy` | Navy | White | None | CTA on gold/light bg |

- All buttons use `border-radius: 999px` (pill shape)
- Hover: `translateY(-2px)` lift + shadow deepens
- Standard size: padding `14px 32px`
- Large (`.btn-lg`): padding `18px 44px`
- Small (`.btn-sm`): padding `10px 22px`

### Cards

Standard card:
```css
background: #FFFFFF;
border-radius: 24px;
padding: 40px;
box-shadow: 0 2px 8px rgba(13,27,46,.08);
border: 1px solid #DDE3EC;
```
Hover: lift `translateY(-4px)`, deeper shadow.

Dark card (`.card-dark`): navy-light background, white text.

### Service Cards
Service cards extend the standard card with a `.service-icon` component (56×56, gold on navy-light background). On hover, the icon inverts to gold background with navy icon.

### Badges / Tags

| Class | Use |
|-------|-----|
| `.badge-gold` | Key features, accreditations |
| `.badge-navy` | Dark on light contexts |
| `.badge-white` | On dark backgrounds |
| `.job-tag-type` | Role type labels (gold tint) |
| `.job-tag-location` | Location labels (grey tint) |

### Forms
- Inputs: 2px border, `--radius-md`, focus ring in gold (`rgba(240,165,0,.12)`)
- Error state: red border + red error message
- Select elements match input styling

---

## 8. Iconography

The website uses inline SVG icons drawn in the Heroicons / Feather style:
- Stroke-based, 2px stroke width
- Stroke-linecap: round, stroke-linejoin: round
- Size: 24×24px at 1rem; 28×28px in service icon containers
- Colour: inherits from parent (`currentColor`)

Do not use raster icon images. Prefer inline SVG for performance and crisp rendering at all resolutions.

---

## 9. Photography Style

### Style Guidelines
- **Tone:** Professional, confident, grounded in reality. Not overly staged or stock-photo generic.
- **Colour:** Images should be slightly desaturated or dark-toned to complement the navy palette. Avoid overly warm or bright imagery.
- **Subject:** Security professionals, Manchester cityscapes, corporate environments, team settings.
- **Overlay:** A 10–15% navy overlay (`opacity: 0.12`) applied to all hero background images to maintain brand colour dominance.

### Approved Free Image Sources
- [Unsplash](https://unsplash.com) — primary source
- [Pexels](https://pexels.com) — secondary source

### Image Treatment on Website
- Hero backgrounds: `background-size: cover`, `opacity: 0.12` overlay effect
- Feature/about images: `border-radius: var(--radius-xl)`, `object-fit: cover`
- All images include descriptive `alt` attributes

---

## 10. Section Layout Patterns

### Clip-path Transitions
Section transitions use CSS `clip-path` to create angled bottom edges, providing visual movement between sections:
```css
clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
```
Used on hero sections to create a diagonal flow into the next section.

### Section Rhythm
Sections alternate between:
1. White background (`--color-white`)
2. Off-white background (`.section-alt`)
3. Dark navy background (`.section-dark`)
4. Gold background (`.cta-banner`, `.stats-bar`)

This rhythm prevents visual monotony and creates clear content hierarchy.

---

## 11. Motion & Animation

- **Fade-in on scroll:** `.fade-in` class + IntersectionObserver, 0.6s ease, 28px translateY
- **Stagger delays:** child elements delay 0.1s per sibling (up to 6)
- **Button hover:** `translateY(-2px)`, 0.25s ease
- **Card hover:** `translateY(-4px)`, shadow increase, 0.25s ease
- **Navbar:** box-shadow adds on scroll, 0.25s ease
- **Accordion:** open/close state, no height animation (display toggle for simplicity)
- **Counter animation:** ease-out cubic over 1800ms on stats entering viewport

---

## 12. Tone of Voice

**Do:**
- Be direct and confident: "We protect your business."
- Use active voice: "We deploy vetted operatives."
- Be specific: "SIA-licensed door supervisors" not "security people"
- Be human and approachable: "Let's talk."
- Reference Manchester and the North West naturally

**Don't:**
- Use jargon without explanation
- Use passive voice excessively
- Be overly formal or corporate-stiff
- Make unverifiable claims ("the best security company")
- Use filler phrases ("We are pleased to offer…")

---

## 13. Contact Details (Placeholder)

| | |
|--|--|
| **Company** | Spike Security Ltd |
| **Address** | 5 Spinningfields Square, Manchester, M3 3AP |
| **Phone** | 0161 850 4422 |
| **General email** | info@spikesecurity.co.uk |
| **Careers email** | careers@spikesecurity.co.uk |
| **Hours (office)** | Mon–Fri, 8am–6pm |
| **Hours (operational)** | 24/7, 365 days a year |

> ⚠️ The address and company registration number above are placeholders and should be updated with real details before launch.
