// Spike Security website build. Source in src/, output in _site/ (the only folder deployed).
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
  eleventyConfig.addGlobalData("layout", "base.njk");
  eleventyConfig.addGlobalData("build", () => Date.now().toString(36));
  eleventyConfig.addGlobalData("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
