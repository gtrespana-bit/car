// ============================================================================
//  CATÁLOGO AMPLIADO DE VEHÍCULOS
// ----------------------------------------------------------------------------
//  Los datos de homologación (cc, cilindros, CV, combustible) proceden de la
//  biblioteca de motores (engines.js). Las emisiones de CO₂ se declaran por
//  modelo y generación porque varían con el peso y la carrocería.
//
//  Las horquillas de precio NO son tablas oficiales: se estiman con un modelo
//  de depreciación de mercado (retention) aplicado al PVP nuevo de la época y
//  a un factor de demanda del modelo en Galicia. Sirven para presupuestar,
//  nunca para liquidar impuestos (para eso está el valor venal de Hacienda).
// ============================================================================
import { computeCvf } from '../../utils/calculations.js';
import { reliabilityOf } from './reliability.js';
import { ENGINES } from './engines.js';
import { VAG } from './vag.js';
import { PREMIUM } from './premium.js';
import { FRANCESES } from './franceses.js';
import { ASIATICOS } from './asiaticos.js';
import { OTROS } from './otros.js';

export const FUEL_LABEL = {
  D: 'Diésel', G: 'Gasolina', H: 'Híbrido', M: 'Microhíbrido',
  P: 'Híbrido enchufable', E: 'Eléctrico', L: 'GLP', N: 'GNC',
};
export const GEAR_LABEL = {
  M: 'Manual', A: 'Automático', D: 'Automático doble embrague', C: 'Automático CVT', E: 'Directo',
};

export const BRAND_ORIGIN = {
  Volkswagen: 'Alemania', Audi: 'Alemania', BMW: 'Alemania', 'Mercedes-Benz': 'Alemania',
  Mini: 'Alemania', Porsche: 'Alemania', Opel: 'Alemania', Smart: 'Alemania',
  Seat: 'España', Cupra: 'España',
  Skoda: 'Chequia', Peugeot: 'Francia', Citroën: 'Francia', DS: 'Francia', Renault: 'Francia',
  Dacia: 'Rumanía', Fiat: 'Italia', 'Alfa Romeo': 'Italia', Jeep: 'Italia', Lancia: 'Italia',
  Toyota: 'Bélgica / Japón', Lexus: 'Japón', Nissan: 'Reino Unido / Japón', Honda: 'Reino Unido',
  Mazda: 'Japón', Mitsubishi: 'Japón', Subaru: 'Japón', Suzuki: 'Hungría / Japón',
  Hyundai: 'Chequia / Corea', Kia: 'Eslovaquia / Corea',
  Ford: 'Alemania / España', Volvo: 'Suecia / Bélgica', 'Land Rover': 'Reino Unido',
  Jaguar: 'Reino Unido', Tesla: 'Alemania / EE. UU.', MG: 'China', SsangYong: 'Corea',
  Iveco: 'Italia', Citroen: 'Francia',
};

// Retención de valor en el mercado de ocasión alemán (precio de anuncio).
const CURVE = [
  [1, 0.80], [2, 0.70], [3, 0.625], [4, 0.555], [5, 0.495], [6, 0.445],
  [7, 0.405], [8, 0.370], [9, 0.340], [10, 0.315], [11, 0.293], [12, 0.274],
  [14, 0.240], [16, 0.212], [18, 0.190], [20, 0.170], [25, 0.140],
];

export function retention(ageYears) {
  const a = Math.max(1, Math.min(30, Math.round(ageYears)));
  if (a >= CURVE[CURVE.length - 1][0]) return CURVE[CURVE.length - 1][1];
  for (let i = 0; i < CURVE.length - 1; i += 1) {
    const [a1, r1] = CURVE[i];
    const [a2, r2] = CURVE[i + 1];
    if (a >= a1 && a <= a2) {
      const t = (a - a1) / (a2 - a1 || 1);
      return r1 + (r2 - r1) * t;
    }
  }
  return CURVE[0][1];
}

/** Etiqueta ambiental DGT a partir del combustible y el año de matriculación. */
export function badgeFor(fuelCode, year) {
  const y = Number(year) || 2020;
  if (fuelCode === 'E' || fuelCode === 'P') return '0 (Cero emisiones)';
  if (fuelCode === 'H' || fuelCode === 'M' || fuelCode === 'L' || fuelCode === 'N') return 'ECO (Azul/Verde)';
  if (fuelCode === 'D') {
    if (y >= 2014) return 'C (Verde)';
    if (y >= 2006) return 'B (Amarilla)';
    return 'Sin etiqueta';
  }
  if (y >= 2006) return 'C (Verde)';
  if (y >= 2001) return 'B (Amarilla)';
  return 'Sin etiqueta';
}

export const marketValue = (pvp, age, demand = 1) => (Number(pvp) || 0) * retention(age) * (Number(demand) || 1);

const round100 = (n) => Math.max(0, Math.round(n / 50) * 50);

/**
 * Factores de mercado:
 *  - DE_ADJUST: lo que se paga realmente en Alemania frente al precio de anuncio.
 *  - esFactor(age): el diferencial España/Alemania es pequeño en coches casi
 *    nuevos (compites con el concesionario local) y se ensancha con la edad,
 *    donde el coche revisado, matriculado y con garantía vale bastante más.
 */
const DE_ADJUST = 0.97;
export const esFactor = (age) => 1.06 + 0.024 * Math.max(0, Math.min(11, (Number(age) || 1) - 1));

export const MODEL_DATA = [...VAG, ...PREMIUM, ...FRANCESES, ...ASIATICOS, ...OTROS];

export function buildCatalog(models = MODEL_DATA, currentYear = new Date().getFullYear()) {
  const out = [];
  const seen = new Set();
  for (const m of models) {
    const demand = m.dmd || 1;
    for (const gen of m.g) {
      const [genName, from, to, pvp, engines] = gen;
      const ageNewest = Math.max(1, currentYear - to);
      const ageOldest = Math.max(ageNewest, currentYear - from);
      const valueNew = marketValue(pvp, ageNewest, demand);
      const valueOld = marketValue(pvp, ageOldest, demand);
      const deRange = [round100(valueOld * DE_ADJUST), round100(valueNew * DE_ADJUST)].sort((a, b) => a - b);
      const esRange = [
        round100(valueOld * esFactor(ageOldest)),
        round100(valueNew * esFactor(ageNewest)),
      ].sort((a, b) => a - b);

      for (const e of engines) {
        const [code, co2, ov = {}] = e;
        // Se admite un sufijo tras el código ("20tdi150 4x4") para distinguir
        // variantes que comparten motor dentro de la misma generación.
        const base = ENGINES[code] || ENGINES[String(code).split(' ')[0]];
        if (!base) {
          console.warn(`[catálogo] motor desconocido: ${code}`);
          continue;
        }
        const [name, cc, cyl, hp, fuelCode, gearCode, relCode] = base;
        const engineName = ov.name || name;
        const cv = ov.hp || hp;
        const fuel = ov.fuel || fuelCode;
        const gear = ov.gear || gearCode;
        const rel = reliabilityOf(ov.rel || relCode);
        const midYear = Math.round((from + to) / 2);
        const id = `${m.b}-${m.m}-${genName}-${code}-${cv}-${from}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (seen.has(id)) continue;
        seen.add(id);

        out.push({
          id,
          source: 'catalog',
          brand: m.b,
          model: m.m,
          gen: genName,
          segment: m.seg,
          body: m.body || m.seg,
          version: `${engineName}${gear === 'M' ? ' Manual' : ` ${GEAR_LABEL[gear] || ''}`.trimEnd()}`,
          engine: engineName,
          engineCode: code,
          fuel: ov.fuelLabel || FUEL_LABEL[fuel] || fuel,
          transmission: GEAR_LABEL[gear] || 'Manual',
          gearCode: gear,
          years: [from, to],
          cv,
          cc,
          cyl,
          co2,
          badge: ov.badge || badgeFor(fuel, midYear),
          newPrice: pvp,
          cvf: Number(computeCvf(cc, cyl || 4).toFixed(2)),
          dePrice: deRange,
          esPrice: esRange,
          kmRef: Math.round(((ageNewest + ageOldest) / 2) * 18000),
          origin: BRAND_ORIGIN[m.b] || 'UE',
          demand,
          rotationDays: Math.max(25, Math.min(120, Math.round(58 / demand))),
          winner: demand >= 1.05 && rel.reliability !== 'banned',
          ...rel,
        });
      }
    }
  }
  return out;
}

export const GENERATED_DB = buildCatalog();

// --- Utilidades de análisis del catálogo -----------------------------------
export const catalogBrands = () => [...new Set(GENERATED_DB.map((v) => v.brand))].sort();
export const catalogSegments = () => [...new Set(GENERATED_DB.map((v) => v.segment))].sort();
