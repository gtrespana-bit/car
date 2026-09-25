// Descarga anuncios de coches de milanuncios desde su API pública de búsqueda
// (la misma que usa la web) y guarda una versión compacta en data/milanuncios/raw.json.
// Uso: node scripts/milanuncios-scrape.mjs   (necesita Node 18+ con fetch)
import { writeFileSync, mkdirSync } from 'node:fs';

const QUERIES = [
  'volkswagen golf', 'volkswagen golf variant', 'volkswagen tiguan', 'volkswagen t-roc', 'volkswagen passat variant', 'volkswagen caddy',
  'skoda octavia', 'skoda octavia combi', 'skoda kodiaq', 'skoda karoq', 'skoda superb',
  'audi a3', 'audi q3', 'audi q5', 'audi a4 avant', 'audi a6',
  'mercedes clase a', 'mercedes glc', 'mercedes clase c', 'mercedes clase e',
  'bmw serie 1', 'bmw serie 3', 'bmw serie 3 touring', 'bmw serie 5', 'bmw x1', 'bmw x3',
  'toyota corolla', 'toyota corolla touring sports', 'toyota rav4',
  'seat leon', 'seat leon st', 'seat ateca', 'cupra formentor',
  'dacia duster', 'dacia sandero', 'kia sportage', 'hyundai tucson',
  'volvo xc60', 'nissan qashqai', 'peugeot 3008', 'peugeot 5008',
];
const PAGES = Number(process.env.MA_PAGES || 10), LIMIT = 40;
const attr = (ad, k) => ad.attributes?.find((a) => a.field?.raw === k)?.value?.raw ?? null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const seen = new Map();
const log = [];
for (const text of QUERIES) {
  let got = 0;
  for (let p = 0; p < PAGES; p++) {
    const url = `https://searchapi.gw.milanuncios.com/v3/classifieds?text=${encodeURIComponent(text)}&category=13&limit=${LIMIT}&offset=${p * LIMIT}&page=${p + 1}`;
    let j;
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', Accept: 'application/json' } });
      if (!r.ok) { log.push(`${text} p${p}: HTTP ${r.status}`); break; }
      j = await r.json();
    } catch (e) { log.push(`${text} p${p}: ${e.message}`); break; }
    const ads = j.ads || [];
    let fresh = 0;
    for (const ad of ads) {
      if (seen.has(ad.id)) continue;
      fresh++;
      seen.set(ad.id, {
        id: ad.id, query: text, title: ad.title, year: +attr(ad, 'year') || null, km: +attr(ad, 'kilometers') || null,
        hp: +attr(ad, 'hp') || null, fuel: attr(ad, 'fuel'), gearbox: attr(ad, 'transmission'),
        price: ad.price?.cash?.value ?? null, financed: ad.price?.financed?.value ?? null,
        seller: ad.type, province: ad.location?.province?.name, region: ad.location?.region?.name,
        url: 'https://www.milanuncios.com' + ad.url, published: ad.publicationDate,
        desc: (ad.description || '').slice(0, 400),
      });
    }
    got += fresh;
    if (!ads.length || !fresh) break;
    await sleep(700);
  }
  log.push(`${text}: ${got}`);
}
mkdirSync('data/milanuncios', { recursive: true });
writeFileSync('data/milanuncios/raw.json', JSON.stringify({ capturedAt: new Date().toISOString(), log, ads: [...seen.values()] }, null, 0));
console.log(log.join('\n'), '\nTotal', seen.size);
