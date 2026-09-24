// Depreciación oficial del BOE según años de antigüedad
export const BOE_DEPRECIATION_RATES = [
  { maxYears: 1, rate: 1.00 },
  { maxYears: 2, rate: 0.84 },
  { maxYears: 3, rate: 0.67 },
  { maxYears: 4, rate: 0.56 },
  { maxYears: 5, rate: 0.47 },
  { maxYears: 6, rate: 0.39 },
  { maxYears: 7, rate: 0.34 },
  { maxYears: 8, rate: 0.28 },
  { maxYears: 9, rate: 0.24 },
  { maxYears: 10, rate: 0.19 },
  { maxYears: 11, rate: 0.17 },
  { maxYears: 12, rate: 0.13 },
  { maxYears: 99, rate: 0.10 },
];

export function getBoeDepreciation(ageYears) {
  const match = BOE_DEPRECIATION_RATES.find(item => ageYears <= item.maxYears);
  return match ? match.rate : 0.10;
}

// Tramos de Impuesto de Matriculación (IEDMT - Modelo 576 AEAT)
export function getIedmtRate(co2) {
  const emissions = Number(co2) || 0;
  if (emissions <= 120) return 0.0;
  if (emissions <= 159) return 0.0475; // 4.75%
  if (emissions <= 199) return 0.0975; // 9.75%
  return 0.1475; // 14.75%
}

// Impuesto de Tracción Mecánica (IVTM) Concello de A Coruña aproximado anual
export function getCorunaIvtm(cvf) {
  const power = Number(cvf) || 12;
  if (power < 8) return 25.24;
  if (power < 12) return 68.16;
  if (power < 16) return 143.88;
  if (power < 20) return 179.22;
  return 224.00;
}

// Cálculo del IRPF para particular por Ganancia Patrimonial (Base del Ahorro en España / Galicia)
export function calculateIrpfOnGain(gain) {
  if (gain <= 0) return 0;
  let tax = 0;
  let remaining = gain;

  // Tramo 1: Hasta 6.000 € al 19%
  const t1 = Math.min(remaining, 6000);
  tax += t1 * 0.19;
  remaining -= t1;

  if (remaining <= 0) return tax;

  // Tramo 2: De 6.000 a 50.000 € al 21%
  const t2 = Math.min(remaining, 44000);
  tax += t2 * 0.21;
  remaining -= t2;

  if (remaining <= 0) return tax;

  // Tramo 3: De 50.000 a 200.000 € al 23%
  const t3 = Math.min(remaining, 150000);
  tax += t3 * 0.23;
  remaining -= t3;

  if (remaining <= 0) return tax;

  // Tramo 4: Más de 200.000 € al 27%
  tax += remaining * 0.27;

  return tax;
}

// Cálculo del régimen REBU (IVA al 21% solo sobre el margen bruto para empresas)
export function calculateRebuVat(grossMargin) {
  if (grossMargin <= 0) return 0;
  // Margen bruto incluye IVA -> Base = margen / 1.21 -> IVA = margen - base
  const netBase = grossMargin / 1.21;
  return grossMargin - netBase;
}

// Cálculo consolidado de un vehículo en la app
export function calculateVehicleSummary(v) {
  const purchase = Number(v.purchasePrice) || 0;
  const transport = Number(v.transportCost) || 0;
  const coc = Number(v.cocOrFichaCost) || 0;
  const itv = Number(v.itvCost) || 0;
  const dgt = Number(v.dgtFee) || 99.77;
  const ivtm = Number(v.ivtmCost) || 0;
  const iedmt = Number(v.iedmtTax) || 0;
  const itp = Number(v.itpTax) || 0;
  const plates = Number(v.platesCost) || 28;
  const recond = Number(v.reconditioningCost) || 0;
  const maint = Number(v.maintenanceCost) || 0;

  const totalCostsWithoutCar = transport + coc + itv + dgt + ivtm + iedmt + itp + plates + recond + maint;
  const totalCost = purchase + totalCostsWithoutCar;

  const effectiveSalePrice = v.status === "sold" && v.actualSalePrice ? Number(v.actualSalePrice) : Number(v.targetSalePrice) || 0;
  const grossProfit = effectiveSalePrice - totalCost;
  const grossRoi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

  // IRPF particular
  const estimatedIrpf = calculateIrpfOnGain(grossProfit);
  const netProfit = grossProfit - estimatedIrpf;
  const netRoi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    purchase,
    totalCostsWithoutCar,
    totalCost,
    effectiveSalePrice,
    grossProfit,
    grossRoi,
    estimatedIrpf,
    netProfit,
    netRoi,
    breakdown: {
      transport,
      coc,
      itv,
      dgt,
      ivtm,
      iedmt,
      itp,
      plates,
      recond,
      maint
    }
  };
}

export function formatEuro(amount) {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
}

export function formatEuroDetailed(amount) {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}
