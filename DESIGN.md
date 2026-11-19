---
name: Spike Security
description: Licensed security for Manchester and the North West. Calm, visible, accountable.
colors:
  obsidian: "#0B0C0E"
  obsidian-2: "#131417"
  graphite: "#1C1E23"
  line: "#2A2B2D"
  ash: "#A39E94"
  bone: "#EEEAE0"
  bone-2: "#E4DFD2"
  line-light: "#CECBC3"
  stone: "#5E5A52"
  spike-orange: "#FF5B1A"
  ember: "#B33A06"
typography:
  display:
    fontFamily: "Archivo, 'Arial Narrow', Arial, sans-serif"
    fontSize: "clamp(4rem, 12vw, 10rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Archivo, 'Arial Narrow', Arial, sans-serif"
    fontSize: "clamp(2.75rem, 7.4vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "0.005em"
  subhead:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.005em"
  small:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.spike-orange}"
    textColor: "{colors.obsidian}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.obsidian}"
  button-ghost:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.graphite}"
  input:
    backgroundColor: "{colors.obsidian-2}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
    height: "48px"
  download-chip:
    textColor: "{colors.bone}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
    height: "32px"
---

# Spike Security design system (brand v3.0)

> Source of truth for the brand defined on `/branding` (`branding.html`). It is a **draft for approval**: the live pages still use the v2 "Night Watch" stylesheet (`css/style.css`, Fraunces, Manrope and JetBrains Mono) until the site is rolled over to this system. New work should target this file. `css/branding.css` is the reference implementation of these tokens.

## 1. Overview

Spike Security protects venues, events, shops and offices across Manchester and the North West, mostly at night. The brand works the way a good officer does: **calm, visible, accountable.** Presence is the product, so the system is built around being seen clearly rather than being loud.

- **Dark first.** Obsidian is the canvas for every screen we control: the hours we keep.
- **Orange on purpose.** Spike Orange is the shield's colour and the brand's single signal. It carries large, deliberate moments (the mark, signs, hi-vis, one call to action) and never decorates.
- **One family, three widths.** Archivo, condensed for signs and headlines, normal for reading, expanded for labels.
- **Spec-sheet rigour.** Hairline rules, square corners, numbered sections and figures, like a standards manual rather than a magazine.

Physical scene: an operations manager checking cover on a phone in a car park after dark; a door supervisor's jacket under a streetlight; a sign on a site hoarding at 3am. Everything must read at a distance, in low light.

Layout: 12-column grid, container `min(100% - 2 × gutter, 1320px)`, gutter `clamp(16px, 4vw, 48px)`. Sections are separated by 1px rules and generous vertical rhythm (`clamp(72px, 10vw, 152px)`). Compositions are left-aligned and asymmetric: a big statement headline on the left, the supporting sentence on the right. Motion is limited to one cover entrance (staggered rise, `cubic-bezier(0.22, 1, 0.36, 1)`, about 700 ms) plus state transitions of 160 to 320 ms, and all of it is removed under `prefers-reduced-motion`.

## 2. Colors: Obsidian, Bone and the Signal

Default proportion on everyday surfaces is **70 obsidian / 20 bone / 10 orange**. Signs, hi-vis and campaign moments may lead with orange.

### Primary
- **Spike Orange** (`spike-orange`, oklch 68.3% 0.211 38.5): the shield, one call to action per screen, signs, hi-vis. 6.3:1 on obsidian, so it passes AA for text there. Nearest spot colour: Pantone Orange 021 C (approve a printed proof).

### Neutral
- **Obsidian** (`obsidian`, oklch 15.4% 0.005 264): every background. Print as rich black C60 M40 Y40 K100 or Pantone Black 6 C.
- **Obsidian 2** (`obsidian-2`) for raised panels and inputs; **Graphite** (`graphite`) for hover states and the Shadow supergraphic; **Line** (`line`) for hairlines on dark.
- **Bone** (`bone`, oklch 93.7% 0.014 88.7): text on dark (16.3:1) and the paper colour for light sections and documents. **Bone 2** and **Line light** support it.
- **Ash** (`ash`): secondary text on dark, 7.3:1. **Stone** (`stone`): secondary text on light, 5.7:1.
- **Ember** (`ember`, oklch 52% 0.165 38.4): Spike Orange's hue, darkened for text and links on light backgrounds (5.0:1 on bone).

### Named Rules
- **The Signal Rule.** Orange marks the thing that matters. If two things are orange, one of them is wrong.
- **Never bone on orange.** 2.6:1. Text on an orange field is always obsidian.
- **Never orange text on light.** Also 2.6:1. On bone or white, orange is for the shield only; text uses Ember.
- **Never pure black or white.** Obsidian and bone are the extremes.

## 3. Typography

**Archivo** (variable: width 62 to 125%, weight 100 to 900; SIL Open Font License, Google Fonts) is the only typeface. One family, used at three widths:

| Width | Role | Treatment |
|---|---|---|
| 62% condensed | Display lines, headlines, signs, the wordmark | ExtraBold 800, capitals, line-height 0.86 to 0.9, +0.5% tracking |
| 87% semi-condensed | Subheads, component titles | Bold 700, sentence case |
| 100% normal | Body, forms, documents | Regular 400, 1.65 to 1.7 line-height, max 54 to 62ch |
| 112 to 125% expanded | Labels, kickers, buttons, nav | SemiBold 600 or Bold 700, capitals, +6 to +14% tracking |

### Hierarchy
Display (`display`) is reserved for one line per page. Section headlines (`headline`) are short statements, not topic names ("One shield. Drawn once."). Subheads (`subhead`) name groups. Labels (`label`) carry numbering ("01 Logo"), figure captions ("Fig. 02 · Construction and clear space") and metadata. Numbers people act on use tabular figures.

### Named Rules
- **Capitals are for signs and labels.** Running text is sentence case. Never set body copy condensed.
- **Fallbacks.** Email uses Arial. Office documents use Archivo where installed, otherwise Arial. Never Impact, Bebas or a serif in place of the condensed capitals.

## 4. Elevation

Flat by design. **No shadows, no blur, no glass.** Depth comes from surface steps (obsidian → obsidian 2 → graphite) and 1px rules. Corners are square everywhere (`rounded.none`); the only circle is a profile picture crop. Focus is a 2px Spike Orange outline offset 3px (obsidian on bone or orange surfaces).

## 5. Components

### Buttons
Two kinds only. `button-primary`: orange fill, obsidian label, expanded capitals; hover flips to bone. `button-ghost`: obsidian with a 1px `#46474A` border and bone label; hover fills graphite. Minimum height 48px (44px touch targets elsewhere). Optional metadata inside the button ("ZIP · 2.8 MB") at 72% opacity.

### Chips
`download-chip`: format labels (SVG, PDF, PNG) as square outlined chips in expanded capitals, 32px tall (44px on touch screens), border at 32% of the current colour.

### Cards / Containers
Avoid cards. Group with rules and spacing. Where a framed area is needed (artwork previews, specimens), use a 1px `line` border on obsidian 2, never a shadow, never nested.

### Inputs / Fields
`input`: obsidian 2 fill, 1px `#46474A` border, square, 48px tall, label above in normal-width SemiBold. Focus: 2px orange outline and orange border. Segmented controls for small sets of options, with the selected option in bone.

### Navigation
A slim sticky bar (60px): the shield, section links in expanded capitals with an orange 2px underline for the current section, and one primary action on the right. On small screens the links scroll horizontally and the active link stays in view.

### The Shield and the Supergraphic (signature components)
- The shield is one path, copied verbatim from `resources/SPIKE SECURITY LOGO.svg`. Lockups (horizontal, stacked) pair it with the wordmark SPIKE SECURITY in Archivo 62%/800, cap height 0.40 of the shield (horizontal) with a 0.20 gap and the cap centre at 47% of the shield's height (its visual centre). Clear space: a quarter of the shield's height. Minimum: shield 16px or 6 mm, horizontal lockup 120px or 30 mm.
- Five colourways: full colour on dark (orange + bone), full colour on light (orange + obsidian), and one-colour orange, bone and obsidian.
- **Supergraphic**: a deep crop of the shield (at least 3× any logo on the surface) showing a curve and the diagonal. Signal mode is orange on obsidian; Shadow mode is graphite on obsidian and may sit behind text. One crop per surface; never text over Signal orange; the full logo still appears.
- Artwork generator: `scripts/brand-assets/` (outlined SVG, PDF and PNG).

## 6. Do's and Don'ts

### Do:
- Lead with obsidian and let one orange element carry each screen.
- Write in plain British English with specifics: "Two SIA-licensed door supervisors, 9pm to 3am."
- Use the supplied logo files; pick the colourway that matches the background.
- Keep everything legible at a distance: big condensed capitals for messages, normal width for reading.
- Show real things: licences, response times, named people, real sites.

### Don't:
- Recolour, stretch, rotate, outline or add effects to the shield, or retype the wordmark.
- Put bone or white text on orange, or orange text on light backgrounds.
- Use tactical or fear-based imagery and copy: skulls, crosshairs, camouflage, "elite", "don't become the next victim".
- Fake live data: status lights, "live" readouts or counters that are not real.
- Add shadows, gradients, glass, rounded cards or a second accent colour.
- Use em dashes in interface copy, or drop caps and serif italics in headlines.
