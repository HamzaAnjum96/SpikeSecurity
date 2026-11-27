// Spike Security website build. Source in src/, output in _site/ (the only folder deployed).
import { graph } from "./lib/jsonld.mjs";
import { writeMarkdown } from "./lib/markdown.mjs";
import { readFileSync } from "node:fs";
const site = JSON.parse(readFileSync(new URL("./src/_data/site.json", import.meta.url)));
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "node_modules/leaflet/dist/leaflet.js": "assets/vendor/leaflet/leaflet.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/leaflet/dist/leaflet.css": "assets/vendor/leaflet/leaflet.css" });
  // The brand guidelines page and its downloads are maintained outside src/ by scripts/brand-assets.
  eleventyConfig.addPassthroughCopy("resources");
  eleventyConfig.addPassthroughCopy("branding.html");
  eleventyConfig.addPassthroughCopy("css/branding.css");
  eleventyConfig.addPassthroughCopy("js/branding.js");
  eleventyConfig.addPassthroughCopy("join-us");

  // "/services.html" -> "/services"; "/index.html" or "/" -> "/"
  eleventyConfig.addFilter("canon", (url) => (url || "/").replace(/index\.html$/, "").replace(/\.html$/, ""));
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("jsonld", graph);
  // Markdown copies of every page and llms-full.txt, for AI tools (lib/markdown.mjs)
  eleventyConfig.on("eleventy.after", ({ dir, results }) => {
    const n = writeMarkdown(dir.output, results, site);
    console.log(`[11ty] Wrote ${n} Markdown copies and llms-full.txt`);
  });
  // The Record Rule in a filter: times (and, with "mono", counts) set in Martian Mono. Output is HTML.
  const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const wrap = (m) => `<span class="data">${m}</span>`;
  eleventyConfig.addFilter("mono", (v) => esc(v).replace(/\b\d{1,2}:\d{2}\b|\b\d+(?:\.\d+)?\b/g, wrap));
  eleventyConfig.addFilter("monotimes", (v) => esc(v).replace(/\b\d{1,2}:\d{2}\b/g, wrap));
  eleventyConfig.addGlobalData("layout", "base.njk");
  // a page's date is its last real change in git, so the sitemap's <lastmod> means something
  eleventyConfig.addGlobalData("date", "git Last Modified");
  eleventyConfig.addGlobalData("build", () => Date.now().toString(36));
  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
