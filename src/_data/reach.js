// The coverage diagram on the home page: each area's position relative to the office (km, north up)
// and its straight-line distance in miles, worked out from the coordinates in site.json.
import { readFileSync } from "node:fs";
const site = JSON.parse(readFileSync(new URL("./site.json", import.meta.url)));

const R = 6371.0088; // mean Earth radius, km
const KM_PER_MILE = 1.609344;
const rad = (d) => (d * Math.PI) / 180;
const { lat: lat0, lon: lon0 } = site.office;

function miles(lat, lon) {
  const a = Math.sin(rad(lat - lat0) / 2) ** 2 + Math.cos(rad(lat0)) * Math.cos(rad(lat)) * Math.sin(rad(lon - lon0) / 2) ** 2;
  return (2 * R * Math.asin(Math.sqrt(a))) / KM_PER_MILE;
}
const round = (n, p = 2) => Number(n.toFixed(p));

export default {
  points: site.areaPoints.map((t) => ({
    name: t.name,
    label: t.label,
    x: round(rad(t.lon - lon0) * R * Math.cos(rad(lat0))),
    y: round(rad(t.lat - lat0) * R),
    miles: miles(t.lat, t.lon).toFixed(1),
  })).sort((a, b) => a.miles - b.miles), // nearest first, for anyone reading it as a list
  // rings every 5 miles, as radii in km
  rings: [5, 10].map((mi) => ({ mi, km: round(mi * KM_PER_MILE) })),
  bounds: site.areaPoints.map((t) => [t.lat, t.lon]),
};
