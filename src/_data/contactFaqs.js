// The contact page's questions, shared with its structured data so the two never disagree.
import { readFileSync } from "node:fs";
const site = JSON.parse(readFileSync(new URL("./site.json", import.meta.url)));

export default [
  { q: "How quickly can you send officers?", a: site.notice },
  { q: "Are all your officers licensed?", a: "Yes. Every officer holds a valid SIA licence for their role. We check each licence before every deployment and send you the numbers before the shift." },
  { q: "Do you offer flexible contracts?", a: "Yes: short-notice one-off cover, rolling monthly agreements and long-term contracts, all set out in a written agreement." },
  { q: "Which areas do you cover?", a: `Mainly ${site.areas.slice(0, -1).join(", ")} and ${site.areas.at(-1)}, and across the North West. Further afield, call us and we’ll tell you straight away if we can cover it.` },
];
