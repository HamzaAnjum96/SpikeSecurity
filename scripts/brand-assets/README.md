# Brand asset generator

Builds every downloadable file on `/branding` (`resources/brand/`) and keeps the page's inline logo artwork in sync.

```bash
pip install fonttools uharfbuzz
npm i -D playwright && npx playwright install chromium   # once

python3 scripts/brand-assets/build.py      # outlined SVGs, layouts, page symbols
node scripts/brand-assets/render.cjs       # PNG, JPEG and PDF, then the ZIP
```

- `build.py` downloads Archivo and Martian Mono (both SIL Open Font License) to your temp folder, converts the wordmark to outlines so SVG and PDF files print correctly without the font installed, and rewrites the `generated:symbols` and `generated:matrix` blocks in `branding.html`.
- `render.cjs` renders through Chromium so the variable font's width and weight axes come out exactly as they do in the browser.
- `shield.py` holds the shield path, copied verbatim from `resources/SPIKE SECURITY LOGO.svg`. Do not edit it.
- Lockup proportions, colourways and layouts are constants at the top of `build.py`. Change them there and rebuild; never edit the generated files by hand.
