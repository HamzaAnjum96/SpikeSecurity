// Structured data built from the same facts as the pages, so they never disagree.
import { readFileSync } from "node:fs";
const site = JSON.parse(readFileSync(new URL("./site.json", import.meta.url)));
const services = JSON.parse(readFileSync(new URL("./services.json", import.meta.url)));

const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  legalName: site.legalName,
  description: site.descriptor + ".",
  slogan: site.line,
  url: `${site.url}/`,
  logo: `${site.url}/resources/brand/logo/spike-security-shield-orange.png`,
  image: `${site.url}/resources/brand/social/spike-security-share-1200x630.png`,
  telephone: site.phoneE164,
  email: site.email,
  foundingDate: String(site.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.office.street,
    addressLocality: site.office.city,
    postalCode: site.office.postcode,
    addressCountry: "GB",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.office.lat, longitude: site.office.lon },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  }],
  areaServed: site.areas.map((name) => ({ "@type": "City", name })).concat([{ "@type": "AdministrativeArea", name: "North West England" }]),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Security services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: `${site.url}/${s.slug}` },
    })),
  },
};

export default { business };
