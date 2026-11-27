// Structured data (schema.org JSON-LD) for every page, built from the same facts as the pages so the two
// never disagree. Each page gets one connected graph: the business, the website, the page itself, its
// breadcrumbs, and where they apply the service it describes and its questions and answers.
import { readFileSync } from "node:fs";

const read = (f) => JSON.parse(readFileSync(new URL(`../src/_data/${f}`, import.meta.url)));
const site = read("site.json");
const services = read("services.json");

const ORG = `${site.url}/#business`;
const WEB = `${site.url}/#website`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ALL_DAY = { "@type": "OpeningHoursSpecification", dayOfWeek: DAYS, opens: "00:00", closes: "23:59" };
const text = (html) => String(html ?? "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const list = (a) => a.slice(0, -1).join(", ") + " and " + a.at(-1);

function business() {
  return {
    "@type": "LocalBusiness",
    "@id": ORG,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    description: `${site.legalName} supplies SIA-licensed security officers, vetted to BS 7858, to venues, events, shops and offices across ${list(site.areas)} and the North West: ${list(services.map((s) => s.name.toLowerCase()))}.`,
    slogan: site.line,
    logo: { "@type": "ImageObject", url: `${site.url}/resources/brand/logo/spike-security-shield-orange.png`, width: 930, height: 1199 },
    image: `${site.url}/assets/og/home.png`,
    telephone: site.phoneE164,
    email: site.email,
    foundingDate: String(site.founded),
    foundingLocation: { "@type": "Place", name: "Manchester, United Kingdom" },
    identifier: { "@type": "PropertyValue", propertyID: "Companies House company number", value: site.companyNumber },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.office.street,
      addressLocality: site.office.city,
      addressRegion: "Greater Manchester",
      postalCode: site.office.postcode,
      addressCountry: "GB",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.office.lat, longitude: site.office.lon },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${site.office.lat}%2C${site.office.lon}`,
    openingHoursSpecification: [ALL_DAY],
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer service", telephone: site.phoneE164, email: site.email, areaServed: "GB", availableLanguage: "en-GB", hoursAvailable: ALL_DAY },
      { "@type": "ContactPoint", contactType: "recruitment", email: site.careersEmail, areaServed: "GB", availableLanguage: "en-GB" },
    ],
    areaServed: site.areas.map((name) => ({ "@type": "AdministrativeArea", name })).concat([{ "@type": "AdministrativeArea", name: "North West England" }]),
    knowsAbout: ["Door supervision", "Event security", "Crowd management", "Retail security and loss prevention", "Office and reception security", "Mobile security patrols", "Keyholding and alarm response", "Remote CCTV monitoring", "SIA licensing", "BS 7858 security vetting"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Security services",
      itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", "@id": `${site.url}/${s.slug}#service`, name: s.name, url: `${site.url}/${s.slug}` } })),
    },
  };
}

const website = () => ({
  "@type": "WebSite",
  "@id": WEB,
  url: `${site.url}/`,
  name: site.name,
  description: `${site.descriptor}.`,
  publisher: { "@id": ORG },
  inLanguage: "en-GB",
});

// ctx: { url, title, description, pageType, crumb, crumbParent, svcSlug, faqs, image, modified }
export function graph(ctx) {
  const url = ctx.url;
  const nodes = [business(), website()];
  const svc = ctx.svcSlug ? services.find((s) => s.slug === ctx.svcSlug) : null;
  const faqs = svc ? svc.faqs : ctx.faqs;
  const kind = ctx.pageType && ctx.pageType !== "home" ? ctx.pageType : "WebPage";
  const page = {
    "@type": faqs && faqs.length ? [kind, "FAQPage"] : kind,
    "@id": `${url}#webpage`,
    url,
    name: ctx.title,
    description: ctx.description,
    isPartOf: { "@id": WEB },
    inLanguage: "en-GB",
    primaryImageOfPage: { "@type": "ImageObject", url: ctx.image, width: 1200, height: 630 },
  };
  if (ctx.modified) page.dateModified = ctx.modified;
  if (ctx.pageType === "home" || ctx.pageType === "AboutPage" || ctx.pageType === "ContactPage") page.about = { "@id": ORG };
  if (ctx.pageType === "home" || ctx.pageType === "AboutPage") page.mainEntity = { "@id": ORG };
  if (ctx.pageType === "CollectionPage") {
    page.mainEntity = {
      "@type": "ItemList",
      name: "Security services",
      itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${site.url}/${s.slug}` })),
    };
  }
  if (faqs && faqs.length) {
    page.mainEntity = faqs.map((f) => ({ "@type": "Question", name: text(f.q), acceptedAnswer: { "@type": "Answer", text: text(f.a) } }));
  }
  if (ctx.crumb) {
    page.breadcrumb = { "@id": `${url}#breadcrumb` };
    const items = [{ name: "Home", item: `${site.url}/` }];
    if (ctx.crumbParent) items.push({ name: ctx.crumbParent.name, item: `${site.url}${ctx.crumbParent.url}` });
    items.push({ name: ctx.crumb, item: url });
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, item: x.item })),
    });
  }
  if (svc) {
    page.about = { "@id": `${url}#service` };
    nodes.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: svc.name,
      serviceType: svc.name,
      description: svc.description,
      url,
      provider: { "@id": ORG },
      areaServed: site.areas.map((name) => ({ "@type": "AdministrativeArea", name })),
      audience: { "@type": "BusinessAudience", name: svc.goodFor.join(", ") },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${svc.name}: what you get`,
        itemListElement: svc.includes.map((i) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: i.h, description: i.p } })),
      },
      mainEntityOfPage: { "@id": `${url}#webpage` },
    });
  }
  nodes.push(page);
  // safe inside <script>: never let a value close the tag
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
