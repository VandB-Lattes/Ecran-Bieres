// Récupère le catalogue bières de https://www.vandb.fr/biere (toutes les pages)
// et l'écrit dans data/catalogue.json pour la recherche de l'écran.
// Lancé chaque semaine par .github/workflows/catalogue.yml (Node 20+).
import { writeFile } from "node:fs/promises";

const BASE = "https://www.vandb.fr/biere";
const MAX_PAGES = 80;
const PAUSE_MS = 700;

const COUNTRIES = {
  "france": "FR", "belgique": "BE", "allemagne": "DE", "irlande": "IE", "italie": "IT",
  "pays-bas": "NL", "espagne": "ES", "autriche": "AT", "serbie": "RS", "republique tcheque": "CZ",
  "tchequie": "CZ", "pologne": "PL", "norvege": "NO", "danemark": "DK", "suede": "SE",
  "ecosse": "SCT", "royaume-uni": "GB", "angleterre": "GB", "etats-unis": "US", "japon": "JP", "suisse": "CH", "croatie": "HR", "mexique": "MX",
  "la reunion": "FR", "polynesie francaise": "FR",
};

const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const decode = (s) => s
  .replace(/&amp;/g, "&").replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const SUB = /^(.+?) - (.+?) - alc\. ([\d.,]+) ?% vol\.(?: - (.+))?$/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cleanName(n) {
  return n
    .replace(/\s*(Promo web|Nouveauté|Exclu V and B|Exclu)\b.*$/i, "")
    .replace(/\s*\d+([.,]\d+)?\s*c?l\b\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePage(html) {
  const byHref = new Map();
  const re = /<a\b[^>]*href="(?:https:\/\/www\.vandb\.fr)?(\/eshop\/biere\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const t = text(m[2]);
    if (!t) continue;
    if (!byHref.has(m[1])) byHref.set(m[1], []);
    byHref.get(m[1]).push(t);
  }
  const out = [];
  for (const [href, texts] of byHref) {
    const sub = texts.find((t) => SUB.test(t));
    if (!sub) continue;
    const names = texts.filter((t) => t !== sub && !SUB.test(t)).sort((a, b) => a.length - b.length);
    if (!names.length) continue;
    const [, color, style, abv, tail = ""] = sub.match(SUB);
    const parts = tail.split(" - ").map((x) => x.trim()).filter(Boolean);
    const country = parts.length > 1 || COUNTRIES[fold(parts[0])] ? parts.pop() : "";
    const brewery = parts.join(" - ");
    const n = cleanName(names[0]);
    if (!n) continue;
    out.push({
      n,
      b: brewery.trim(),
      c: COUNTRIES[fold(country)] || "",
      s: style.trim(),
      a: +abv.replace(",", "."),
      d: [color.trim() ? `Bière ${color.trim().toLowerCase()}` : "", brewery.trim() ? `brasserie ${brewery.trim()}` : ""].filter(Boolean).join(" · "),
      u: "https://www.vandb.fr" + href,
    });
  }
  return out;
}

const all = new Map();
for (let page = 1; page <= MAX_PAGES; page++) {
  const url = page === 1 ? BASE : `${BASE}?page=${page}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (VandB Lattes ecran pression)", "Accept-Language": "fr-FR" } });
  if (!res.ok) { console.log(`Page ${page} : HTTP ${res.status}, arrêt.`); break; }
  const items = parsePage(await res.text());
  let added = 0;
  for (const b of items) {
    const key = fold(b.n);
    if (!all.has(key)) { all.set(key, b); added++; }
  }
  console.log(`Page ${page} : ${items.length} bières lues, ${added} nouvelles (total ${all.size})`);
  if (!items.length) break;
  await sleep(PAUSE_MS);
}

if (all.size < 20) {
  console.error(`Seulement ${all.size} bières trouvées : la structure du site a sans doute changé. Fichier non modifié.`);
  process.exit(1);
}
const list = [...all.values()].sort((a, b) => a.n.localeCompare(b.n, "fr"));
await writeFile("data/catalogue.json", JSON.stringify(list, null, 1) + "\n");
console.log(`data/catalogue.json : ${list.length} bières.`);
