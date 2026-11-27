// Plain-Markdown copies of every page, for AI tools and anyone who wants the text without the design.
// After each build: /<page>.md beside each page (linked from its <head>), and /llms-full.txt with all of
// them in reading order (linked from /llms.txt). Made from the built HTML, so they never drift from it.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseDocument } from "htmlparser2";

const SKIP_TAGS = new Set(["script", "style", "svg", "noscript", "template", "form", "button", "input", "select", "textarea", "canvas"]);
const BLOCK = new Set(["h1", "h2", "h3", "h4", "p", "ul", "ol", "li", "dl", "dt", "dd", "table", "tr", "figure", "figcaption", "section", "article", "aside", "header", "footer", "div", "nav", "details", "summary", "address", "blockquote"]);
// reading order for llms-full.txt; anything else follows
const ORDER = ["/", "/services", "/door-supervisors", "/event-security", "/retail-security", "/office-security", "/mobile-patrols", "/cctv-monitoring", "/how-we-work", "/about", "/careers", "/contact", "/legal", "/privacy"];

const cls = (n) => (n.attribs && n.attribs.class ? n.attribs.class.split(/\s+/) : []);
const skip = (n) =>
  n.type === "tag" &&
  (SKIP_TAGS.has(n.name) || n.attribs.hidden !== undefined || n.attribs["aria-hidden"] === "true" ||
    cls(n).some((c) => ["map-canvas", "map-gate-pin", "map-gate-note", "map-credit", "faq-mark", "reach-ring", "reach-ring-label", "reach-office", "reach-key-rings", "role-go", "cover-art", "skip"].includes(c)));
const decode = (s) => String(s || "")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const squash = (s) => s.replace(/[ \t\n\r\f\u00a0]+/g, " ");
const tidy = (s) => squash(s).replace(/ ([.,:;!?])/g, "$1").trim();

function abs(href, base) {
  if (!href || href.startsWith("#")) return null;
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  return base + (href.startsWith("/") ? href : "/" + href);
}

// Inline text of a node; adjacent elements are kept apart with a space so "On site." and "On time." never run together
function inline(node, base) {
  if (node.type === "text") return node.data;
  if (node.type !== "tag" || skip(node)) return "";
  const kids = () => {
    let out = "";
    let prevTag = false;
    for (const c of node.children || []) {
      const t = inline(c, base);
      if (!t) continue;
      // keep neighbouring elements apart ("On site." "On time."), and a label from the word after it
      const touching = out && !/\s$/.test(out) && !/^\s/.test(t);
      if (touching && (c.type === "tag" || (prevTag && /^[\p{L}\p{N}]/u.test(t)))) out += " ";
      out += t;
      prevTag = c.type === "tag";
    }
    return out;
  };
  switch (node.name) {
    case "br": return "\n";
    case "b": case "strong": { const t = tidy(kids()); return t ? `**${t}**` : ""; }
    case "em": case "i": { const t = tidy(kids()); return t ? `*${t}*` : ""; }
    case "a": {
      const href = abs(node.attribs.href, base);
      const title = (node.children || []).find((c) => c.type === "tag" && cls(c).some((k) => ["svc-name", "role-t"].includes(k)));
      if (title && href) {
        const rest = (node.children || []).filter((c) => c !== title).map((c) => {
          const t = tidy(inline(c, base));
          if (!t) return "";
          return (cls(c).includes("svc-for") ? "Best for: " : "") + (/[.!?]$/.test(t) ? t : t + ".");
        }).filter(Boolean).join(" ");
        return `[${tidy(inline(title, base))}](${href})${rest ? ": " + rest : ""}`;
      }
      const t = tidy(kids());
      return t && href ? `[${t}](${href})` : t;
    }
    default: return kids();
  }
}

function blocks(node, base, out, depth = 0) {
  if (node.type === "text") { const t = tidy(node.data); if (t) out.push(t); return; }
  if (node.type !== "tag" || skip(node)) return;
  const n = node.name;
  if (/^h[1-4]$/.test(n)) { const t = tidy(inline(node, base)); if (t) out.push("#".repeat(+n[1]) + " " + t); return; }
  if (n === "p" || n === "figcaption" || n === "address" || n === "caption") {
    const t = inline(node, base).split("\n").map(tidy).filter(Boolean).join("  \n");
    if (t) out.push(n === "figcaption" ? `*${t}*` : t);
    return;
  }
  if (n === "ul" || n === "ol") {
    let i = 0;
    const items = [];
    for (const li of node.children || []) {
      if (li.type !== "tag" || li.name !== "li" || skip(li)) continue;
      i++;
      const hasBlocks = (li.children || []).some((c) => c.type === "tag" && BLOCK.has(c.name));
      let t;
      if (hasBlocks) {
        const parts = [];
        for (const c of li.children) {
          if (c.type !== "tag" || skip(c)) continue;
          const x = tidy(inline(c, base));
          if (!x) continue;
          parts.push(/^h[2-4]$/.test(c.name) ? `**${x.replace(/\.$/, "")}.**` : x);
        }
        t = parts.join(" ");
      } else t = tidy(inline(li, base));
      if (t) items.push((n === "ol" ? `${i}. ` : "- ") + t);
    }
    if (items.length) out.push((node.attribs["aria-label"] ? `**${node.attribs["aria-label"]}:**\n\n` : "") + items.join("\n"));
    return;
  }
  if (n === "dl") {
    const items = [];
    const pairs = (el) => {
      let dt = null;
      for (const c of el.children || []) {
        if (c.type !== "tag") continue;
        if (c.name === "div") pairs(c);
        else if (c.name === "dt") dt = tidy(inline(c, base));
        else if (c.name === "dd") items.push(`- **${dt}:** ${tidy(inline(c, base))}`);
      }
    };
    pairs(node);
    if (items.length) out.push(items.join("\n"));
    return;
  }
  if (n === "table") {
    const rows = [];
    const walk = (el) => {
      for (const c of el.children || []) {
        if (c.type !== "tag") continue;
        if (c.name === "caption") { const t = tidy(inline(c, base)); if (t) out.push(`**${t}**`); }
        else if (c.name === "tr") {
          const cells = (c.children || []).filter((x) => x.type === "tag" && (x.name === "th" || x.name === "td")).map((x) => tidy(inline(x, base)));
          if (cells.length) rows.push("- " + cells.join(": "));
        } else walk(c);
      }
    };
    walk(node);
    if (rows.length) out.push(rows.join("\n"));
    return;
  }
  // containers: an element whose children are all inline becomes one paragraph
  const kids = (node.children || []).filter((c) => !(c.type === "text" && !c.data.trim()));
  const allInline = kids.length && kids.every((c) => c.type === "text" || (c.type === "tag" && !BLOCK.has(c.name)));
  if (allInline && n !== "main") { const t = tidy(inline(node, base)); if (t) out.push(t); return; }
  for (const c of node.children || []) blocks(c, base, out, depth + 1);
}

const find = (node, test) => {
  if (test(node)) return node;
  for (const c of node.children || []) { const f = find(c, test); if (f) return f; }
  return null;
};
const attr = (doc, test, key) => { const el = find(doc, test); return el ? el.attribs[key] : ""; };

export function toMarkdown(html, site) {
  const doc = parseDocument(html);
  const main = find(doc, (n) => n.type === "tag" && n.name === "main");
  if (!main) return null;
  const title = tidy(inline(find(doc, (n) => n.type === "tag" && n.name === "title") || { type: "text", data: "" }, site.url));
  const description = decode(attr(doc, (n) => n.type === "tag" && n.name === "meta" && n.attribs.name === "description", "content"));
  const canonical = attr(doc, (n) => n.type === "tag" && n.name === "link" && n.attribs.rel === "canonical", "href");
  const robots = attr(doc, (n) => n.type === "tag" && n.name === "meta" && n.attribs.name === "robots", "content");
  if (/noindex/.test(robots || "")) return null;
  const out = [];
  blocks(main, site.url, out);
  const body = out.join("\n\n").replace(/\n{3,}/g, "\n\n");
  const contact = `---\n\n${site.legalName}. Phone, answered 24 hours: ${site.phone}. Email: ${site.email}. Jobs: ${site.careersEmail}. Office: ${site.office.street}, ${site.office.area}, ${site.office.city} ${site.office.postcode}. Registered in England and Wales, company number ${site.companyNumber}. Registered office: ${site.registeredOffice}.`;
  return { canonical, title, text: `---\ntitle: ${title}\nurl: ${canonical}\ndescription: ${description}\n---\n\n${body}\n\n${contact}\n` };
}

export function writeMarkdown(outputDir, results, site) {
  const pages = [];
  for (const r of results) {
    if (!r.outputPath || !r.outputPath.endsWith(".html")) continue;
    const md = toMarkdown(r.content, site);
    if (!md || !md.canonical) continue;
    const path = md.canonical.replace(site.url, "") || "/";
    const file = path === "/" ? "index.md" : path.slice(1) + ".md";
    writeFileSync(join(outputDir, file), md.text);
    pages.push({ path, ...md });
  }
  pages.sort((a, b) => {
    const ia = ORDER.indexOf(a.path), ib = ORDER.indexOf(b.path);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const head = `# ${site.name}: the full text of ${site.url.replace("https://", "")}\n\n> Every page of the ${site.name} website as plain Markdown, in reading order, for AI tools and assistants. The short guide is ${site.url}/llms.txt. Each page is also at its own address with .md on the end.\n`;
  writeFileSync(join(outputDir, "llms-full.txt"), head + pages.map((p) => `\n\n${p.text}`).join(""));
  return pages.length;
}
