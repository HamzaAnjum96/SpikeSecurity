# Spike Security website

The website for Spike Security Limited, www.spikesecurity.co.uk.

- `src/` is the site: Eleventy templates (`.njk`), data (`src/_data/`), CSS, JavaScript, the fonts (Archivo for words, Martian Mono for numbers) and icons. Facts such as the phone number, addresses and reply times live once, in `src/_data/site.json`.
- `branding.html`, `css/branding.css`, `js/branding.js` and `resources/` are the brand guidelines page and its downloads, maintained by `scripts/brand-assets/`.
- `DESIGN.md` is the design system; `PRODUCT.md` describes the users and principles; `docs/site-improvement-plan.md` is the plan for the site.

## Build

```
npm ci
npm run build    # writes _site/
npm run serve    # local preview with live reload
```

Pushing to `main` builds the site and publishes `_site/` to GitHub Pages (`.github/workflows/deploy.yml`).

## Forms

The quote and application forms open the visitor's email app with the message filled in. To receive them without the email app, set `formEndpoint` in `src/_data/site.json` to a form service URL that accepts a POST; the forms then send directly and show sent or failed states.
