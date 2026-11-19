// Spike Security brand assets: build step 2 of 2 (PNG, JPEG and PDF output).
//
// Run after build.py, from the repository root:
//   node scripts/brand-assets/render.cjs
// Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
// Set PLAYWRIGHT_PATH if Playwright is installed somewhere Node cannot resolve.
//
// Chromium is used instead of librsvg/sharp so the variable font axes (width,
// weight) in the composed artwork render exactly as they do in the browser.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const WORK = path.join(os.tmpdir(), 'spike-brand-build');
const jobs = JSON.parse(fs.readFileSync(path.join(WORK, 'jobs.json'), 'utf8'));

function svgSize(svg) {
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  return { w: parseFloat(m[1]), h: parseFloat(m[2]) };
}

function svgPage(svg, w, h, transparent) {
  const sized = svg.replace(/ width="[^"]+" height="[^"]+"/, ` width="${w}" height="${h}"`);
  return `<!doctype html><html><head><style>@page{size:${w}px ${h}px;margin:0}html,body{margin:0;background:${transparent ? 'transparent' : '#fff'}}svg{display:block}</style></head><body>${sized}</body></html>`;
}

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  let done = 0;
  for (const job of jobs) {
    if (job.svg) {
      const svg = fs.readFileSync(job.svg, 'utf8');
      const { w, h } = svgSize(svg);
      if (job.pdf) {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        if (job.width_mm) {
          const mmSvg = svg.replace(/ width="[^"]+" height="[^"]+"/, ` width="${job.width_mm}mm" height="${job.height_mm}mm"`);
          await page.setContent(`<!doctype html><html><head><style>@page{size:${job.width_mm}mm ${job.height_mm}mm;margin:0}html,body{margin:0}svg{display:block}</style></head><body>${mmSvg}</body></html>`);
          await page.pdf({ path: job.out, width: `${job.width_mm}mm`, height: `${job.height_mm}mm`, printBackground: true, pageRanges: '1' });
        } else {
          const pw = Math.round(job.width), ph = Math.round(job.width * h / w);
          await page.setContent(svgPage(svg, pw, ph, true));
          await page.pdf({ path: job.out, width: `${pw}px`, height: `${ph}px`, printBackground: true, pageRanges: '1' });
        }
        await ctx.close();
      } else {
        const pw = Math.round(job.width), ph = Math.round(job.width * h / w);
        const ctx = await browser.newContext({ viewport: { width: pw, height: ph }, deviceScaleFactor: 1 });
        const page = await ctx.newPage();
        await page.setContent(svgPage(svg, pw, ph, job.transparent));
        await page.screenshot({ path: job.out, omitBackground: !!job.transparent, clip: { x: 0, y: 0, width: pw, height: ph } });
        await ctx.close();
      }
    } else if (job.html) {
      const url = 'file://' + job.html;
      if (job.pdf) {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        await page.goto(url, { waitUntil: 'load' });
        await page.evaluate(async () => { await document.fonts.load('800 20px Archivo'); await document.fonts.ready; });
        await page.pdf({ path: job.out, width: `${job.width_mm}mm`, height: `${job.height_mm}mm`, printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
        await ctx.close();
      } else {
        const vw = Math.round(job.css_w), vh = Math.round(job.css_h);
        const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: job.scale || 1 });
        const page = await ctx.newPage();
        await page.goto(url, { waitUntil: 'load' });
        const ok = await page.evaluate(async () => {
          await document.fonts.load('800 20px Archivo');
          await document.fonts.ready;
          return document.fonts.check('800 20px Archivo');
        });
        if (!ok) throw new Error(`Archivo did not load for ${job.html}`);
        const opts = { path: job.out, clip: { x: 0, y: 0, width: vw, height: vh } };
        if (job.jpeg) Object.assign(opts, { type: 'jpeg', quality: 84 });
        await page.screenshot(opts);
        await ctx.close();
      }
    }
    done++;
    if (done % 10 === 0) process.stdout.write(`${done}/${jobs.length} `);
  }
  await browser.close();
  console.log(`\nRendered ${done} files.`);
  execFileSync(process.env.PYTHON || 'python3', [path.join(__dirname, 'build.py'), '--zip'], { stdio: 'inherit' });
})().catch((err) => { console.error(err); process.exit(1); });
