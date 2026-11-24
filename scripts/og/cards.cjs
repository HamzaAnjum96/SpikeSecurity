// Link preview cards (Open Graph images) for WhatsApp, iMessage, LinkedIn, Facebook, Slack and X.
// One 1200 x 630 card per main page, drawn like the site's cover: the page headline in condensed
// capitals, the 24-hour number in Martian Mono, and the shield in Signal mode on the right.
//
//   npm run build && node scripts/og/cards.cjs
//
// Writes src/assets/og/<page>.png (picked up by base.njk through src/_data/og.js) and copies the
// home card into the brand pack as the link preview. Re-run it when a headline changes.
// Set PLAYWRIGHT_PATH if Playwright is installed somewhere Node cannot resolve.
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = path.join(ROOT, '_site');
const OUT = path.join(ROOT, 'src', 'assets', 'og');
const BRAND = path.join(ROOT, 'resources', 'brand', 'social');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', '_data', 'site.json'), 'utf8'));
const services = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', '_data', 'services.json'), 'utf8'));
const font = (f) => 'file://' + path.join(ROOT, 'src', 'assets', 'fonts', f);
const symbols = fs.readFileSync(path.join(ROOT, 'src', '_includes', 'symbols.njk'), 'utf8').replace(/\{#[\s\S]*?#\}/g, '');

// Every main page gets its own card; anything else uses the home card.
const PAGES = [
  { slug: 'home', file: 'index.html', sub: 'Licensed security for Manchester and the North West' },
  { slug: 'services', file: 'services.html', sub: 'Security services in Manchester and the North West' },
  ...services.map((s) => ({ slug: s.slug, file: s.slug + '.html', sub: s.name + ' in Manchester and the North West' })),
  { slug: 'how-we-work', file: 'how-we-work.html', sub: 'How we vet, brief and report' },
  { slug: 'about', file: 'about.html', sub: 'About Spike Security' },
  { slug: 'careers', file: 'careers.html', sub: 'Security jobs, paid weekly' },
  { slug: 'contact', file: 'contact.html', sub: 'Get a quote, or call any time' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function card(lines, sub) {
  const head = lines.map((l, i) => `<span class="l${lines.length > 1 && i === lines.length - 1 && lines.accent ? ' o' : ''}">${esc(l)}</span>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Archivo; src: url("${font('archivo-latin.woff2')}") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: "Martian Mono"; src: url("${font('martian-mono-latin.woff2')}") format("woff2"); font-weight: 100 800; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: #0B0C0E; color: #EEEAE0; font-family: Archivo, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-kerning: normal; }
.card { position: relative; width: 1200px; height: 630px; padding: 56px 0 52px 64px; }
.copy { position: absolute; left: 64px; top: 56px; bottom: 52px; width: 640px; display: flex; flex-direction: column; }
.lockup { display: block; height: 40px; width: auto; align-self: flex-start; flex: none; }
.head { margin-top: auto; font-weight: 800; font-stretch: 62%; text-transform: uppercase; letter-spacing: 0.005em; line-height: 0.88; font-size: 112px; text-wrap: balance; }
.head .l { display: block; }
.head.flow .l { display: inline; }
.o { color: #FF5B1A; }
.sub { margin-top: 22px; font-size: 25px; line-height: 1.3; color: #A39E94; max-width: 34ch; text-wrap: balance; }
.call { margin-top: 30px; padding-top: 22px; border-top: 2px solid #2A2B2D; display: flex; align-items: baseline; gap: 18px; }
.call-l { font-size: 21px; font-weight: 600; color: #A39E94; }
.call-n { font-family: "Martian Mono", Consolas, monospace; font-weight: 700; font-size: 40px; line-height: 1; letter-spacing: 0; color: #EEEAE0; }
.art { position: absolute; right: 56px; top: 56px; bottom: 52px; width: 384px; overflow: hidden; background: #131417; border: 1px solid #2A2B2D; }
.sg { position: absolute; height: 150%; width: auto; left: 26%; top: -26%; --shield: #FF5B1A; }
</style></head><body>${symbols}
<div class="card">
  <div class="copy">
    <svg class="lockup" viewBox="0 0 2080.8 453.19"><use href="#ss-horizontal"/></svg>
    <h1 class="head${lines.length === 1 ? ' flow' : ''}">${head}</h1>
    <p class="sub">${esc(sub).replace('North West', 'North&nbsp;West')}</p>
    <p class="call"><span class="call-l">Call 24/7</span><span class="call-n">${esc(site.phone)}</span></p>
  </div>
  <div class="art"><svg class="sg" viewBox="0 0 351.64 453.19"><use href="#ss-shield"/></svg></div>
</div>
<script>
  // shrink the headline until it fits its space (the column, at most 4 lines); run once the fonts are in
  window.fit = () => {
    const h = document.querySelector('.head'), copy = document.querySelector('.copy'), logo = document.querySelector('.lockup');
    // fits: no wider than the column, at most 4 lines, and at least 32px clear below the logo
    const fits = () => h.scrollWidth <= copy.clientWidth + 1
      && h.offsetHeight <= parseFloat(getComputedStyle(h).fontSize) * 0.88 * 4 + 2
      && h.getBoundingClientRect().top - logo.getBoundingClientRect().bottom >= 32;
    let size = 112; h.style.fontSize = size + 'px';
    while (!fits() && size > 56) { size -= 2; h.style.fontSize = size + 'px'; }
    return size;
  };
</script></body></html>`;
}

(async () => {
  if (!fs.existsSync(path.join(SITE, 'index.html'))) throw new Error('Build the site first: npm run build');
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {};
  const browser = await chromium.launch();
  const reader = await browser.newPage();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const p of PAGES) {
    // the headline comes from the built page, so the card always matches the site
    await reader.goto('file://' + path.join(SITE, p.file), { waitUntil: 'domcontentloaded' });
    const got = await reader.evaluate(() => {
      const dl = [...document.querySelectorAll('.cover-h1 .dl')].map((e) => e.textContent.trim());
      if (dl.length) return { lines: dl, accent: true };
      const t = document.querySelector('.page-title');
      return { lines: [t ? t.textContent.replace(/\s+/g, ' ').trim() : ''], accent: false };
    });
    const lines = got.lines; lines.accent = got.accent;
    const html = path.join(require('os').tmpdir(), 'spike-og-' + p.slug + '.html');
    fs.writeFileSync(html, card(lines, p.sub));
    await page.goto('file://' + html, { waitUntil: 'load' });
    const ok = await page.evaluate(async () => { await document.fonts.load('800 20px Archivo'); await document.fonts.load('700 20px "Martian Mono"'); await document.fonts.ready; return document.fonts.check('800 20px Archivo') && document.fonts.check('700 20px "Martian Mono"'); });
    if (!ok) throw new Error('Fonts did not load for ' + p.slug);
    const size = await page.evaluate(() => window.fit());
    const out = path.join(OUT, p.slug + '.png');
    await page.screenshot({ path: out, type: 'png' });
    console.log(`${p.slug.padEnd(18)} ${(fs.statSync(out).size / 1024).toFixed(0)} KB  ${size}px  ${lines.join(' / ')}`);
    manifest[p.slug] = {
      alt: `${lines.join(' ')} ${p.sub}. Spike Security, call 24/7 on ${site.phone}.`,
      v: require('crypto').createHash('sha1').update(fs.readFileSync(out)).digest('hex').slice(0, 8),
    };
    if (p.slug === 'home') {
      // the brand pack's link preview is the home card
      fs.copyFileSync(out, path.join(BRAND, 'spike-security-share-1200x630.png'));
      const prev = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 0.8 });
      await prev.goto('file://' + html, { waitUntil: 'load' });
      await prev.evaluate(async () => { await document.fonts.load('800 20px Archivo'); await document.fonts.load('700 20px "Martian Mono"'); await document.fonts.ready; window.fit(); });
      await prev.screenshot({ path: path.join(BRAND, 'spike-security-share-1200x630-preview.jpg'), type: 'jpeg', quality: 84 });
      await prev.close();
    }
    fs.unlinkSync(html);
  }
  await browser.close();
  // read by base.njk: which pages have a card, its alt text, and a version that changes with the image
  fs.writeFileSync(path.join(ROOT, 'src', '_data', 'og.json'), JSON.stringify(manifest, null, 2) + '\n');
})().catch((e) => { console.error(e); process.exit(1); });
