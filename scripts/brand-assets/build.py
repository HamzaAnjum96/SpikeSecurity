"""Spike Security brand assets: build step 1 of 2 (geometry and composition).

Writes outlined-text SVG logos and uniform artwork, the HTML compositions for
social, signage and email images, a render job list for render.cjs, and the
inline SVG symbols used by /branding.html.

Usage (from the repository root):
    pip install fonttools uharfbuzz
    python3 scripts/brand-assets/build.py
    node scripts/brand-assets/render.cjs        # needs Playwright + Chromium

The shield is copied verbatim from resources/SPIKE SECURITY LOGO.svg. Never edit it here.
"""
import json
import pathlib
import sys
import tempfile
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / 'resources' / 'brand'
WORK = pathlib.Path(tempfile.gettempdir()) / 'spike-brand-build'
FONT_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf'
FONT = WORK / 'Archivo-VF.ttf'

sys.path.insert(0, str(HERE))
from outline import shape_and_outline, outline_words, cap_height  # noqa: E402
from shield import D as SHIELD_D, X0, Y0, W as SW, H as SH  # noqa: E402

# ── Brand constants ────────────────────────────────────────────────────────
C = {
    'obsidian': '#0B0C0E', 'obsidian2': '#131417', 'graphite': '#1C1E23',
    'line': '#2A2B2D', 'ash': '#A39E94', 'bone': '#EEEAE0', 'bone2': '#E4DFD2',
    'stone': '#5E5A52', 'orange': '#FF5B1A', 'ember': '#B33A06',
}
# word_gap: extra word space (em) so SPIKE and SECURITY separate at small sizes and at distance
WORDMARK = dict(text='SPIKE SECURITY', wdth=62, wght=800, tracking=0.03, word_gap=0.10)
HORIZONTAL = dict(cap=0.40, gap=0.20, align=0.47)   # ratios of shield height
STACKED = dict(cap=0.21, gap=0.17)
CLEAR = 0.25                                         # clear space = 1/4 shield height
BLEED = 3                                            # mm of print bleed on site signs
PHONE, EMAIL, WEB = '020 3757 2767', 'info@spikesecurity.co.uk', 'spikesecurity.co.uk'

# colourway id -> (shield fill, wordmark fill, background for -bg exports, label)
COLOURWAYS = {
    'dark':     (C['orange'],   C['bone'],     C['obsidian'], 'Full colour, for dark backgrounds'),
    'light':    (C['orange'],   C['obsidian'], C['bone'],     'Full colour, for light backgrounds'),
    'orange':   (C['orange'],   C['orange'],   C['obsidian'], 'One colour, orange'),
    'bone':     (C['bone'],     C['bone'],     C['obsidian'], 'One colour, bone'),
    'obsidian': (C['obsidian'], C['obsidian'], C['orange'],   'One colour, obsidian'),
}
MARKS = {'orange': C['orange'], 'bone': C['bone'], 'obsidian': C['obsidian']}


def n(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


OFL_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/OFL.txt'
MONO_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/MartianMono%5Bwdth,wght%5D.ttf'
MONO_OFL_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/OFL.txt'
MONO = WORK / 'MartianMono-VF.ttf'
ZIP_NAME = 'spike-security-brand-assets.zip'

README = f'''SPIKE SECURITY BRAND ASSETS
Brand guidelines: https://www.spikesecurity.co.uk/branding

WHICH LOGO FILE?
  On a dark background ........ logo/spike-security-horizontal-dark
  On a white or light page .... logo/spike-security-horizontal-light
  One colour print ............ -orange, -bone or -obsidian versions
  Square spaces, signs ........ logo/spike-security-stacked-*
  Favicons, app icons ......... logo/spike-security-shield-*
  Files ending -bg.png include the background colour.

FORMATS
  SVG and PDF are vector: use them for print, signs and embroidery.
  PNG is for documents, slides and the web. Never stretch or recolour the logo.

SIGNS AND UNIFORMS
  Sign PDFs are A3 with 3 mm bleed on every edge (page 303 x 426 mm); trim to A3.
  Uniform inks: Pantone Orange 021 C for the shield, white ink for bone lettering.

EMAIL
  email/ holds the two images the signature builder on the brand page links to.

COLOURS
  Obsidian      #0B0C0E   background
  Spike Orange  #FF5B1A   the shield (nearest spot colour: Pantone Orange 021 C, check against a swatch)
  Bone          #EEEAE0   text on dark, light surfaces
  Ember         #B33A06   orange text on light backgrounds

FONTS
  Archivo for words. Martian Mono, at 87.5% width, for the numbers people
  dial, check or copy: the phone number, times, references, licence and
  company numbers, colour values. Both are free under the SIL Open Font
  License, in the font folder. Without them: Arial for words, Consolas for
  numbers. Email signatures always use Arial.

Questions: {EMAIL} · {PHONE}
'''


def ensure_font():
    WORK.mkdir(parents=True, exist_ok=True)
    if not FONT.exists():
        print('Downloading Archivo (SIL Open Font License)…')
        urllib.request.urlretrieve(FONT_URL, FONT)
    if not (WORK / 'OFL.txt').exists():
        urllib.request.urlretrieve(OFL_URL, WORK / 'OFL.txt')
    if not MONO.exists():
        print('Downloading Martian Mono (SIL Open Font License)…')
        urllib.request.urlretrieve(MONO_URL, MONO)
    if not (WORK / 'OFL-MartianMono.txt').exists():
        urllib.request.urlretrieve(MONO_OFL_URL, WORK / 'OFL-MartianMono.txt')


def package():
    """Zip every downloadable asset (not page previews) with the font and a README."""
    import zipfile
    ensure_font()
    top = 'Spike Security brand assets'
    target = OUT / ZIP_NAME
    with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.writestr(f'{top}/README.txt', README)
        for sub in ('logo', 'social', 'signage', 'uniform', 'email'):
            for f in sorted((OUT / sub).iterdir()):
                if f.is_file() and not f.name.endswith('-preview.jpg'):
                    z.write(f, f'{top}/{sub}/{f.name}')
        z.write(FONT, f'{top}/font/Archivo-VariableFont_wdth,wght.ttf')
        z.write(WORK / 'OFL.txt', f'{top}/font/OFL-Archivo.txt')
        z.write(MONO, f'{top}/font/MartianMono-VariableFont_wdth,wght.ttf')
        z.write(WORK / 'OFL-MartianMono.txt', f'{top}/font/OFL-MartianMono.txt')
    print(f'Packaged {target.relative_to(ROOT)} ({target.stat().st_size / 1e6:.1f} MB)')


def text_path(text, cap, wdth, wght, tracking):
    """Outline text so its cap height equals `cap` units. Returns (d, bbox)."""
    size = cap / cap_height(str(FONT))
    d, bbox, _ = shape_and_outline(text, wdth, wght, size, tracking, str(FONT))
    return d, bbox


def fit(text, width, wdth=62, wght=800, tracking=0.0):
    """Font size at which `text` (CSS layout advance) is exactly `width` wide."""
    _, _, adv = shape_and_outline(text, wdth, wght, 1.0, tracking, str(FONT))
    return width / adv


# ── Lockups ────────────────────────────────────────────────────────────────
def wordmark_path(cap):
    """The SPIKE SECURITY wordmark, outlined, with cap height `cap` units."""
    size = cap / cap_height(str(FONT))
    return outline_words(WORDMARK['text'], WORDMARK['wdth'], WORDMARK['wght'], size,
                         WORDMARK['tracking'], str(FONT), WORDMARK['word_gap'])


def horizontal():
    cap = HORIZONTAL['cap'] * SH
    d, (bx0, by0, bx1, by1) = wordmark_path(cap)
    gap = HORIZONTAL['gap'] * SH
    tx = SW + gap - bx0
    ty = HORIZONTAL['align'] * SH + cap / 2
    top = min(0, ty + by0)
    bottom = max(SH, ty + by1)
    return dict(w=SW + gap + (bx1 - bx0), h=bottom - top,
                shield=(-X0, -Y0 - top), word=(tx, ty - top), word_d=d)


def stacked():
    cap = STACKED['cap'] * SH
    d, (bx0, by0, bx1, by1) = wordmark_path(cap)
    ww = bx1 - bx0
    w = max(SW, ww)
    ty = SH + STACKED['gap'] * SH + cap
    return dict(w=w, h=ty + max(0, by1),
                shield=((w - SW) / 2 - X0, -Y0), word=((w - ww) / 2 - bx0, ty), word_d=d)


def mark():
    return dict(w=SW, h=SH, shield=(-X0, -Y0), word=None, word_d=None)


def logo_svg(L, shield_fill, word_fill, pad=0.0, bg=None, title='Spike Security'):
    w, h = L['w'] + 2 * pad, L['h'] + 2 * pad
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(w)} {n(h)}" width="{n(w)}" height="{n(h)}" role="img" aria-label="{title}">',
             f'<title>{title}</title>']
    if bg:
        parts.append(f'<rect width="{n(w)}" height="{n(h)}" fill="{bg}"/>')
    sx, sy = L['shield']
    parts.append(f'<path fill="{shield_fill}" transform="translate({n(sx + pad)} {n(sy + pad)})" d="{SHIELD_D}"/>')
    if L['word_d']:
        wx, wy = L['word']
        parts.append(f'<path fill="{word_fill}" transform="translate({n(wx + pad)} {n(wy + pad)})" d="{L["word_d"]}"/>')
    parts.append('</svg>')
    return '\n'.join(parts) + '\n'


# ── Uniform back print (outlined) ──────────────────────────────────────────
def back_print():
    """Shield over 'SECURITY'. Units are millimetres: 280 mm wide artwork."""
    width = 280.0
    d, (bx0, by0, bx1, by1) = text_path('SECURITY', 100, 62, 800, 0.08)
    s = width / (bx1 - bx0)                        # scale text to full width
    cap = 100 * s
    shield_h = cap * 1.75
    k = shield_h / SH
    gap = cap * 0.42
    height = shield_h + gap + cap
    return dict(w=width, h=height, k=k, s=s, shield_h=shield_h, text=(d, bx0), base=shield_h + gap + cap)


def back_print_svg(B, shield_fill, text_fill, title):
    d, bx0 = B['text']
    sw = SW * B['k']
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(B["w"])} {n(B["h"])}" width="{n(B["w"])}mm" height="{n(B["h"])}mm" role="img" aria-label="{title}">\n'
            f'<title>{title}</title>\n'
            f'<path fill="{shield_fill}" transform="translate({n((B["w"] - sw) / 2)} 0) scale({B["k"]:.6f}) translate({n(-X0)} {n(-Y0)})" d="{SHIELD_D}"/>\n'
            f'<path fill="{text_fill}" transform="translate(0 {n(B["base"])}) scale({B["s"]:.6f}) translate({n(-bx0)} 0)" d="{d}"/>\n'
            '</svg>\n')


# ── HTML compositions (rendered by render.cjs) ─────────────────────────────
def page(body, w, h, extra_css='', unit='px'):
    font, mono = FONT.as_uri(), MONO.as_uri()
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Archivo;src:url("{font}") format("truetype");font-weight:100 900;font-stretch:62% 125%}}
@font-face{{font-family:"Martian Mono";src:url("{mono}") format("truetype");font-weight:100 800;font-stretch:75% 112.5%}}
@page{{size:{w}{unit} {h}{unit};margin:0}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{w}{unit};height:{h}{unit};overflow:hidden}}
body{{font-family:Archivo,Arial,sans-serif;background:{C['obsidian']};color:{C['bone']};-webkit-font-smoothing:antialiased;font-kerning:normal}}
.cap{{text-transform:uppercase}}
.disp{{font-weight:800;font-stretch:62%;text-transform:uppercase;line-height:.9;letter-spacing:.005em}}
.label{{font-weight:600;font-stretch:100%;letter-spacing:0}}
.mono{{font-family:"Martian Mono",Consolas,monospace;font-stretch:87.5%;letter-spacing:0}}
.o{{color:{C['orange']}}}
{extra_css}
</style></head><body>{body}</body></html>'''


def shield_svg(fill, style):
    return (f'<svg viewBox="0 0 {n(SW)} {n(SH)}" style="{style}" aria-hidden="true">'
            f'<path fill="{fill}" transform="translate({n(-X0)} {n(-Y0)})" d="{SHIELD_D}"/></svg>')


def inline_lockup(L, shield_fill, word_fill, style):
    sx, sy = L['shield']
    wx, wy = L['word']
    return (f'<svg viewBox="0 0 {n(L["w"])} {n(L["h"])}" style="{style}" role="img" aria-label="Spike Security">'
            f'<path fill="{shield_fill}" transform="translate({n(sx)} {n(sy)})" d="{SHIELD_D}"/>'
            f'<path fill="{word_fill}" transform="translate({n(wx)} {n(wy)})" d="{L["word_d"]}"/></svg>')


def compositions(H_):
    lk = lambda f1, f2, h, u='px': inline_lockup(H_, f1, f2, f'display:block;height:{h}{u};width:auto;align-self:flex-start;flex:none')
    cmp = {}

    # Profile picture: centre the shield's visual mass (centroid at 45.1% of its height)
    sh = 580
    cmp['social/spike-security-profile-1080'] = (page(
        shield_svg(C['orange'], f'position:absolute;height:{sh}px;left:{(1080 - sh * SW / SH) / 2:.1f}px;top:{540 - 0.4509 * sh:.1f}px'),
        1080, 1080), 1080, 1080)

    # Wide banner (LinkedIn profile / X header). Avatar overlaps bottom-left, so copy sits right.
    cmp['social/spike-security-banner-1584x396'] = (page(f'''
      {shield_svg(C['orange'], 'position:absolute;height:816px;left:-20px;top:-126px')}
      <div style="position:absolute;left:740px;right:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:30px">
        {lk(C['orange'], C['bone'], 46)}
        <p class="disp" style="font-size:84px">On site. On time.<br><span class="o">On record.</span></p>
        <p class="label" style="font-size:19px;color:{C['ash']}">Licensed security · Manchester &amp; the North West</p>
      </div>''', 1584, 396), 1584, 396)

    # The link preview (social/spike-security-share-1200x630) is the website's home card, drawn with
    # the site's own cards by scripts/og/cards.cjs, so it is not composed here.

    # Signs: A3 portrait, vector PDF + PNG preview
    # A3 sign: orange message panel (top 62%) over an obsidian sign-off panel.
    inner = 297 - 2 * 22                                   # live width in mm
    sign_css = f'''
      .sheet{{position:relative;width:{297 + 2 * BLEED}mm;height:{420 + 2 * BLEED}mm;background:{C['obsidian']}}}
      .top{{position:absolute;left:0;right:0;top:0;height:{262 + BLEED}mm;background:{C['orange']};color:{C['obsidian']};
           padding:{22 + BLEED}mm {22 + BLEED}mm 20mm;display:flex;flex-direction:column}}
      .msg{{margin-top:auto}}
      .bot{{position:absolute;left:0;right:0;bottom:0;height:{158 + BLEED}mm;padding:18mm {22 + BLEED}mm {20 + BLEED}mm;display:flex;flex-direction:column}}
      .disp{{white-space:nowrap}}
      .body{{font-weight:500;font-stretch:100%;font-size:8mm;line-height:1.3;max-width:220mm}}
      .tel{{font-family:"Martian Mono",Consolas,monospace;font-weight:700;font-stretch:87.5%;font-size:20mm;line-height:1;letter-spacing:0;color:{C['orange']};white-space:nowrap}}
      .lab{{font-weight:600;font-stretch:100%;letter-spacing:0;font-size:6.6mm;color:{C['ash']}}}
    '''
    foot = lambda first: f'''
        <p class="lab" style="margin-bottom:7mm">{first}</p>
        {lk(C['orange'], C['bone'], 26, 'mm')}
        <div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:10mm">
          <div><p class="lab" style="margin-bottom:4mm">24-hour response</p><p class="tel">{PHONE}</p></div>
          <p class="lab" style="color:{C['bone']};padding-bottom:1.5mm">{WEB}</p>
        </div>'''
    cmp['signage/spike-security-sign-site-protected-a3'] = (page(f'''
      <div class="sheet">
        <div class="top">
          {shield_svg(C['obsidian'], 'display:block;height:72mm;width:auto;align-self:flex-start')}
          <div class="msg">
            <p class="disp" style="font-size:{fit('THIS SITE IS', inner * 0.62, tracking=0.005):.2f}mm">This site is</p>
            <p class="disp" style="font-size:{fit('PROTECTED', inner, tracking=0.005):.2f}mm;line-height:.8;margin-top:2mm">Protected</p>
          </div>
        </div>
        <div class="bot">{foot('Protected by')}</div>
      </div>''', 297 + 2 * BLEED, 420 + 2 * BLEED, sign_css, 'mm'), 297, 420)

    camera = (f'<svg viewBox="0 0 120 80" style="display:block;height:50mm;width:auto;align-self:flex-start" aria-hidden="true">'
              f'<g fill="{C["obsidian"]}"><path d="M8 18 L84 6 L92 46 L16 58 Z"/><path d="M92 18 L118 12 L118 44 L94 38 Z"/>'
              f'<rect x="38" y="56" width="10" height="16"/><rect x="20" y="70" width="46" height="8"/></g></svg>')
    cmp['signage/spike-security-sign-cctv-a3'] = (page(f'''
      <div class="sheet">
        <div class="top">
          {camera}
          <div class="msg">
            <p class="disp" style="font-size:{fit('CCTV', inner * 0.62, tracking=0.005):.2f}mm;line-height:.8">CCTV</p>
            <p class="disp" style="font-size:{fit('IN OPERATION', inner * 0.62, tracking=0.005):.2f}mm;margin-top:4mm">In operation</p>
            <p class="body" style="margin-top:9mm">Images are monitored and recorded for crime prevention and public safety.</p>
          </div>
        </div>
        <div class="bot">{foot('Monitored by')}</div>
      </div>''', 297 + 2 * BLEED, 420 + 2 * BLEED, sign_css, 'mm'), 297, 420)

    return cmp


# ── /branding.html generated blocks ────────────────────────────────────────
PAGE = ROOT / 'branding.html'
MATRIX = [  # colourway id, row name, what it is for
    ('dark', 'Full colour, dark', 'Orange shield, bone name. The primary logo for every dark surface.'),
    ('light', 'Full colour, light', 'Orange shield, obsidian name. For white paper, bone and pale photos.'),
    ('orange', 'Orange', 'One colour. Embroidery and single-colour print on dark garments.'),
    ('bone', 'Bone', 'One colour. Photography, etching and dark garments.'),
    ('obsidian', 'Obsidian', 'One colour. Hi-vis, Spike Orange panels and print on light stock.'),
]
SHIELD_FOR = {'dark': 'orange', 'light': 'orange', 'orange': 'orange', 'bone': 'bone', 'obsidian': 'obsidian'}


def matrix_html(lockups):
    rows = []
    for cw, name, use in MATRIX:
        sf, wf, _, label = COLOURWAYS[cw]
        cells = []
        for kind, title in (('horizontal', 'Horizontal'), ('stacked', 'Stacked'), ('shield', 'Shield')):
            if kind == 'shield':
                vb, sym, base = f'0 0 {n(SW)} {n(SH)}', 'ss-shield', f'spike-security-shield-{SHIELD_FOR[cw]}'
                desc = f'shield, {SHIELD_FOR[cw]}'
            else:
                L = lockups[kind]
                vb, sym, base = f'0 0 {n(L["w"])} {n(L["h"])}', f'ss-{kind}', f'spike-security-{kind}-{cw}'
                desc = f'{kind} logo, {label.lower()}'
            links = ' '.join(
                f'<a href="resources/brand/logo/{base}.{ext}" download aria-label="Download {desc}, {ext.upper()}">{ext.upper()}</a>'
                for ext in ('svg', 'pdf', 'png'))
            cells.append(
                f'<figure class="cw-cell cw-cell--{kind}">'
                f'<div class="cw-art"><svg class="lk lk--{kind}" viewBox="{vb}" style="--shield:{sf};--word:{wf}" role="img" aria-label="{desc.capitalize()}"><use href="#{sym}"/></svg></div>'
                f'<figcaption class="dl"><span class="dl-name">{title}</span><span class="dl-links">{links}</span></figcaption></figure>')
        rows.append(f'<div class="cw cw--{cw}"><div class="cw-head"><h4 class="cw-name">{name}</h4><p class="cw-use">{use}</p></div>{"".join(cells)}</div>')
    return '\n'.join(rows)


def space_figure(L):
    """Clear-space diagram for the horizontal lockup: x = CLEAR × shield height on every side."""
    x = CLEAR * SH
    w, h = L['w'], L['h']
    return (f'<svg viewBox="{n(-x)} {n(-x)} {n(w + 2 * x)} {n(h + 2 * x)}" role="img" aria-label="Horizontal lockup with clear space of x on every side">'
            f'<rect class="fig-zone" x="{n(-x)}" y="{n(-x)}" width="{n(w + 2 * x)}" height="{n(h + 2 * x)}"/>'
            f'<rect class="fig-box" x="0" y="0" width="{n(w)}" height="{n(h)}"/>'
            f'<use href="#ss-horizontal" x="0" y="0" width="{n(w)}" height="{n(h)}"/>'
            + ''.join(f'<text class="fig-t fig-t--big" x="{n(tx)}" y="{n(ty)}" text-anchor="middle">x</text>'
                      for tx, ty in ((-x / 2, h / 2 + 20), (w + x / 2, h / 2 + 20), (w / 2, -x / 2 + 20), (w / 2, h + x / 2 + 20)))
            + '</svg>')


def sync_viewboxes(text, lockups):
    """Keep hand-written <svg viewBox> values for the lockups in step with the generated symbols."""
    import re
    for kind, L in lockups.items():
        h = n(L['h'])
        text = re.sub(rf'viewBox="0 0 (?!{re.escape(n(SW))} )[\d.]+ {re.escape(h)}"',
                      f'viewBox="0 0 {n(L["w"])} {h}"', text)
    return text


def inject(name, html):
    """Replace the block between <!-- generated:NAME:start/end --> markers in branding.html."""
    if not PAGE.exists():
        return
    start, end = f'<!-- generated:{name}:start -->', f'<!-- generated:{name}:end -->'
    text = PAGE.read_text()
    a, b = text.find(start), text.find(end)
    if a == -1 or b == -1:
        print(f'branding.html has no {name} markers; skipped')
        return
    PAGE.write_text(text[:a + len(start)] + '\n' + html + '\n' + text[b:])


def main():
    ensure_font()
    for sub in ('logo', 'social', 'signage', 'uniform', 'email'):
        (OUT / sub).mkdir(parents=True, exist_ok=True)
    WORK.mkdir(parents=True, exist_ok=True)
    jobs = []

    lockups = {'horizontal': horizontal(), 'stacked': stacked()}
    for kind, L in lockups.items():
        for cw, (sf, wf, bg, label) in COLOURWAYS.items():
            base = f'spike-security-{kind}-{cw}'
            svg = logo_svg(L, sf, wf, title=f'Spike Security logo, {kind}, {label.lower()}')
            (OUT / 'logo' / f'{base}.svg').write_text(svg)
            png_w = 2400 if kind == 'horizontal' else 1600
            jobs.append(dict(svg=str(OUT / 'logo' / f'{base}.svg'), out=str(OUT / 'logo' / f'{base}.png'), width=png_w, transparent=True))
            jobs.append(dict(svg=str(OUT / 'logo' / f'{base}.svg'), out=str(OUT / 'logo' / f'{base}.pdf'), width=png_w / 4, pdf=True))
            pad = (2 if kind == 'horizontal' else 1.8) * CLEAR * SH     # -bg exports: twice the clear space
            bgsvg = logo_svg(L, sf, wf, pad=pad, bg=bg, title=f'Spike Security logo on background, {kind}, {label.lower()}')
            p = WORK / f'{base}-bg.svg'
            p.write_text(bgsvg)
            jobs.append(dict(svg=str(p), out=str(OUT / 'logo' / f'{base}-bg.png'), width=png_w, transparent=False))
    M = mark()
    for col, fill in MARKS.items():
        base = f'spike-security-shield-{col}'
        (OUT / 'logo' / f'{base}.svg').write_text(logo_svg(M, fill, None, title=f'Spike Security shield, {col}'))
        jobs.append(dict(svg=str(OUT / 'logo' / f'{base}.svg'), out=str(OUT / 'logo' / f'{base}.png'), width=930, transparent=True))
        jobs.append(dict(svg=str(OUT / 'logo' / f'{base}.svg'), out=str(OUT / 'logo' / f'{base}.pdf'), width=240, pdf=True))

    # Email signature images, 3x for sharp screens: the shield (34 x 44 px) for the
    # Light style and the full-colour lockup (180 px wide) for the Dark block style
    jobs.append(dict(svg=str(OUT / 'logo' / 'spike-security-shield-orange.svg'), out=str(OUT / 'email' / 'spike-security-email-shield.png'), width=102, transparent=True))
    jobs.append(dict(svg=str(OUT / 'logo' / 'spike-security-horizontal-dark.svg'), out=str(OUT / 'email' / 'spike-security-email-lockup.png'), width=540, transparent=True))

    # Uniform back prints
    B = back_print()
    for cw, (sf, tf, label) in {'dark-garment': (C['orange'], C['bone'], 'for black garments'),
                                'hi-vis': (C['obsidian'], C['obsidian'], 'one colour, for hi-vis garments')}.items():
        base = f'spike-security-back-print-{cw}'
        (OUT / 'uniform' / f'{base}.svg').write_text(back_print_svg(B, sf, tf, f'Spike Security back print, {label}'))
        jobs.append(dict(svg=str(OUT / 'uniform' / f'{base}.svg'), out=str(OUT / 'uniform' / f'{base}.png'), width=2400, transparent=True))
        jobs.append(dict(svg=str(OUT / 'uniform' / f'{base}.svg'), out=str(OUT / 'uniform' / f'{base}.pdf'), width_mm=B['w'], height_mm=B['h'], pdf=True))

    # Composed artwork
    for name, (html, w, h) in compositions(lockups['horizontal']).items():
        p = WORK / (name.replace('/', '__') + '.html')
        p.write_text(html)
        if name.startswith('signage/'):
            px = lambda mm: mm / 25.4 * 96
            full_w, full_h = px(w + 2 * BLEED), px(h + 2 * BLEED)          # page incl. bleed, CSS px
            trim = dict(x=px(BLEED), y=px(BLEED), width=px(w), height=px(h))
            jobs.append(dict(html=str(p), out=str(OUT / f'{name}.pdf'), pdf=True, width_mm=w + 2 * BLEED, height_mm=h + 2 * BLEED))
            jobs.append(dict(html=str(p), out=str(OUT / f'{name}.png'), css_w=full_w, css_h=full_h, scale=150 / 96, clip=trim))  # 150 dpi
            jobs.append(dict(html=str(p), out=str(OUT / f'{name}-preview.jpg'), css_w=full_w, css_h=full_h, scale=720 / px(w), jpeg=True, clip=trim))
        else:
            jobs.append(dict(html=str(p), out=str(OUT / f'{name}.png'), css_w=w, css_h=h, scale=1))
            jobs.append(dict(html=str(p), out=str(OUT / f'{name}-preview.jpg'), css_w=w, css_h=h, scale=min(1, 960 / w), jpeg=True))

    (WORK / 'jobs.json').write_text(json.dumps(jobs, indent=1))

    # Inline symbols for /branding.html (fills come from CSS custom properties)
    sym = ['<!-- Generated by scripts/brand-assets/build.py. Do not edit by hand. -->',
           '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>',
           f'<symbol id="ss-shield" viewBox="0 0 {n(SW)} {n(SH)}"><path fill="var(--shield, {C["orange"]})" transform="translate({n(-X0)} {n(-Y0)})" d="{SHIELD_D}"/></symbol>']
    for kind, L in lockups.items():
        sx, sy = L['shield']
        wx, wy = L['word']
        sym.append(f'<symbol id="ss-{kind}" viewBox="0 0 {n(L["w"])} {n(L["h"])}">'
                   f'<path fill="var(--shield, {C["orange"]})" transform="translate({n(sx)} {n(sy)})" d="{SHIELD_D}"/>'
                   f'<path fill="var(--word, {C["bone"]})" transform="translate({n(wx)} {n(wy)})" d="{L["word_d"]}"/></symbol>')
    sym.append('</defs></svg>')
    (WORK / 'symbols.html').write_text('\n'.join(sym) + '\n')

    inject('symbols', '\n'.join(sym[1:]))
    inject('matrix', matrix_html(lockups))
    inject('spacefig', space_figure(lockups['horizontal']))
    if PAGE.exists():
        PAGE.write_text(sync_viewboxes(PAGE.read_text(), lockups))

    meta = {k: {'w': round(L['w'], 3), 'h': round(L['h'], 3)} for k, L in lockups.items()}
    meta['shield'] = {'w': round(SW, 3), 'h': round(SH, 3)}
    meta['back_print_mm'] = {'w': round(B['w'], 1), 'h': round(B['h'], 1)}
    (WORK / 'meta.json').write_text(json.dumps(meta, indent=1))
    print(json.dumps(meta))
    print(f'{len(jobs)} render jobs → {WORK / "jobs.json"}')


if __name__ == '__main__':
    package() if '--zip' in sys.argv else main()
