// Análisis de oportunidades con anuncios REALES (sin el modelo estimado).
// Para cada grupo modelo+generación+combustible+potencia se llevan todos los
// anuncios al mismo año y km con los coeficientes ajustados, y se calcula el
// beneficio neto con los gastos reales de importación.
import { MARKET_OBSERVATIONS as O, cvOf, fuelOf } from '../src/data/catalog/marketEvidence.js';
import { priceFit } from '../src/data/catalog/priceModel.js';
import { catalogEstimate } from '../src/domain/catalogEstimate.js';
import { GENERATED_DB } from '../src/data/catalog/index.js';

const q = (a, p) => { const s = [...a].sort((x, y) => x - y); const i = (s.length - 1) * p; const l = Math.floor(i); return s[l] + (s[Math.min(l + 1, s.length - 1)] - s[l]) * (i - l); };
const F = { DE: priceFit('DE'), ES: priceFit('ES') };
const MIN_DE = 4, MIN_ES = 3;
// OLS log(precio) ~ 1 + ES + (año−Y) + (km−K)/1000. Devuelve null si no es fiable.
function groupFit(rows, Y, K) {
  if (rows.length < 12) return null;
  const X = rows.map((o) => [1, o.market === 'ES' ? 1 : 0, o.year - Y, (o.km - K) / 1000]);
  const y = rows.map((o) => Math.log(o.price));
  const n = 4, A = Array.from({ length: n }, () => Array(n + 1).fill(0));
  X.forEach((x, r) => { for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) A[i][j] += x[i] * x[j]; A[i][n] += x[i] * y[r]; } });
  for (let c = 0; c < n; c++) {
    let pv = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[pv][c])) pv = r;
    if (Math.abs(A[pv][c]) < 1e-9) return null;
    [A[c], A[pv]] = [A[pv], A[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let j = c; j <= n; j++) A[r][j] -= f * A[c][j]; }
  }
  const b = A.map((row, i) => row[n] / row[i]);
  const yearCoef = b[2], kmCoef = b[3]; // kmCoef < 0, como en priceModel
  // Plausible: 3-20 %/año y 0,05-0,6 %/1.000 km
  if (!(yearCoef > 0.03 && yearCoef < 0.20 && kmCoef < -0.0005 && kmCoef > -0.006)) return null;
  return { yearCoef, kmCoef };
}


const groups = new Map();
for (const o of O) {
  if (o.kind !== 'anuncio') continue;
  const cv = cvOf(o); const fuel = fuelOf(o);
  if (!cv || !fuel) continue;
  const band = Math.round(cv / 30) * 30;
  const k = [o.brand, o.model, o.gen, fuel, band].join('|');
  if (!groups.has(k)) groups.set(k, { DE: [], ES: [] });
  groups.get(k)[o.market].push(o);
}

const out = [];
for (const [k, m] of groups) {
  if (m.DE.length < MIN_DE || m.ES.length < MIN_ES) continue;
  const [brand, model, gen, fuel, band] = k.split('|');
  const all = [...m.DE, ...m.ES];
  const Y = Math.round(q(all.map((o) => o.year), 0.5));
  const K = Math.round(q(all.map((o) => o.km), 0.5) / 1000) * 1000;
  // Coeficientes año/km del PROPIO grupo (DE y ES juntos, con desplazamiento por mercado),
  // para que añadir anuncios de otros modelos no altere este resultado.
  const gf = groupFit(all, Y, K);
  const coef = (mk) => gf || F[mk];
  const norm = (o, mk) => o.price * Math.exp(coef(mk).yearCoef * (Y - o.year) + coef(mk).kmCoef * (K - o.km) / 1000);
  const de = m.DE.map((o) => norm(o, 'DE')); const es = m.ES.map((o) => norm(o, 'ES'));
  const cvs = all.map(cvOf);
  const cv = Math.round(q(cvs, 0.5));
  const v = GENERATED_DB.filter((x) => x.brand === brand && x.model === model && x.gen === gen && x.fuel === fuel)
    .sort((a, b) => Math.abs(a.cv - cv) - Math.abs(b.cv - cv))[0]
    || GENERATED_DB.find((x) => x.brand === brand && x.model === model && x.gen === gen) || {};
  const est = (buy, sell, regime) => catalogEstimate({ ...v, fuel, cv, years: [Y, Y], dePrice: [buy, buy], esPrice: [sell, sell] }, undefined, new Date(), { regime });
  const d25 = q(de, 0.25), d50 = q(de, 0.5), e25 = q(es, 0.25), e50 = q(es, 0.5);
  const real = est(d25, e50, 'rebu');
  // Solo milanuncios: misma normalización, venta = mediana de sus anuncios (mín. 3).
  const mil = m.ES.filter((o) => /milanuncios/i.test(o.source || '')).map((o) => norm(o, 'ES'));
  const m50 = mil.length >= MIN_ES ? q(mil, 0.5) : null;
  out.push({
    name: `${brand} ${model} (${gen}) ${fuel} ~${cv} CV`, nDE: m.DE.length, nES: m.ES.length, Y, K,
    d25: Math.round(d25), d50: Math.round(d50), e25: Math.round(e25), e50: Math.round(e50),
    uplift: e50 / d50 - 1,
    expenses: real.expenses,
    pReal: real.profit, pMed: est(d50, e50, 'rebu').profit, pPrud: est(d25, e25, 'rebu').profit,
    pRealPart: est(d25, e50, 'particular').profit,
    roi: real.profit / (d25 + real.expenses),
    nMil: mil.length, m50, pMil: m50 ? est(d25, m50, 'rebu').profit : null,
  });
}
out.sort((a, b) => b.pReal - a.pReal);

const eur = (x) => `${Math.round(x).toLocaleString('es-ES')} €`;
const pct = (x) => `${(x * 100).toFixed(0)} %`;
const verdict = (r) => r.pPrud > 500 ? '🟢 Sólida' : r.pReal > 1000 ? '🟡 Buena si compras bien' : r.pReal > 0 ? '🟠 Marginal' : '🔴 No rentable';

let md = `# Oportunidades de importación medidas con anuncios reales\n\n`;
md += `Generado por \`node scripts/opportunities.mjs\` sobre ${O.length} anuncios (${O.filter((o) => o.market === 'DE').length} DE / ${O.filter((o) => o.market === 'ES').length} ES).\n`;
md += `Todos los anuncios de cada grupo se llevan al mismo año y km. Beneficio neto en **REBU** tras transporte, ITV, impuesto de matriculación (según CO₂), DGT, gestoría, preparación, garantía e IVA del margen.\n\n`;
md += `- **Realista:** compras en el 25 % más barato de Alemania, vendes al precio mediano español.\n- **Medio:** mediana contra mediana.\n- **Prudente:** compras barato y vendes en el 25 % más barato de España (venta rápida).\n\n`;
md += `| Veredicto | Grupo | Anuncios DE/ES | Año · km | Compra DE (ganga / mediana) | Venta ES (mediana) | ES sobre DE | Realista | Medio | Prudente | Como particular | Rentab. | Solo milanuncios (n · venta · realista) |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
for (const r of out) md += `| ${verdict(r)} | ${r.name} | ${r.nDE}/${r.nES} | ${r.Y} · ${(r.K / 1000).toFixed(0)}k | ${eur(r.d25)} / ${eur(r.d50)} | ${eur(r.e50)} | ${r.uplift >= 0 ? '+' : ''}${pct(r.uplift)} | **${eur(r.pReal)}** | ${eur(r.pMed)} | ${eur(r.pPrud)} | ${eur(r.pRealPart)} | ${pct(r.roi)} | ${r.m50 ? `${r.nMil} · ${eur(r.m50)} · **${eur(r.pMil)}**` : `${r.nMil} anuncios (mín. ${MIN_ES})`} |\n`;
const sum = (f) => out.filter(f).length;
md += `\n**Resumen:** ${out.length} grupos medidos · 🟢 ${sum((r) => verdict(r).startsWith('🟢'))} · 🟡 ${sum((r) => verdict(r).startsWith('🟡'))} · 🟠 ${sum((r) => verdict(r).startsWith('🟠'))} · 🔴 ${sum((r) => verdict(r).startsWith('🔴'))}\n`;
console.log(md);
