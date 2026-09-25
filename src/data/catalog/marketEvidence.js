// ============================================================================
//  EVIDENCIA DE MERCADO — PRECIOS OBSERVADOS EN ANUNCIOS REALES
// ----------------------------------------------------------------------------
//  Este fichero es la única fuente de precios «reales» del catálogo. Cada fila
//  es un anuncio (o una media agregada publicada por un portal) con su fuente,
//  su fecha de captura, el año del coche y sus kilómetros.
//
//  Reglas que se aplican aquí:
//   1. Solo se anotan precios leídos literalmente en la fuente citada. Nada de
//      estimaciones: si no se vio el número, no entra.
//   2. `kind: 'anuncio'`  → precio de un anuncio individual concreto.
//      `kind: 'media_portal'` → precio medio agregado que publica el portal
//      (coches.net / autouncle.es), útil porque pondera decenas de unidades.
//   3. Los precios de Alemania son PRECIO DE ANUNCIO (lo que pide el vendedor
//      alemán). El coste real de compra es inferior: lo descuenta
//      `PURCHASE_DISCOUNT` en index.js, no se mezcla aquí.
//   4. Los precios de España son PVP de profesional (con garantía e IVA), que
//      es exactamente lo que se pide en A Coruña al vender.
//
//  ⚠ Revisar cada 3-6 meses: el mercado de ocasión se mueve y estas cifras
//    caducan. `capturedAt` indica cuándo se tomaron.
// ============================================================================

export const EVIDENCE_CAPTURED_AT = '2026-09-24';

/**
 * Descuento medio entre el precio de anuncio alemán y lo que realmente se
 * paga al comprar (negociación, compra a particular, lotes de concesionario).
 * Estimación del negocio, no un dato publicado: ajústalo con tus compras.
 */
export const PURCHASE_DISCOUNT = 0.08;

/**
 * Sensibilidad del precio al kilometraje. Un coche pierde ~18 % de valor al
 * sumar 50.000 km (exp(-50.000/250.000) = 0,82), que es lo que se observa en
 * los portales al comparar dos unidades iguales con km distintos.
 */
export const KM_HALFLIFE = 250000;

/**
 * Lleva un precio observado al kilometraje de referencia.
 * Más kilómetros ⇒ menos valor, así que el exponente va NEGADO:
 * normalizar un coche de 70.000 km a 135.000 km le RESTA valor.
 */
export const normalizeKm = (price, kmFrom, kmTo) => {
  const p = Number(price) || 0;
  const delta = (Number(kmTo) || 0) - (Number(kmFrom) || 0);
  return p * Math.exp(-delta / KM_HALFLIFE);
};

/**
 * Cada observación:
 *  brand, model, gen  → claves para emparejar con el catálogo (index.js)
 *  market             → 'DE' (compra) | 'ES' (venta)
 *  kind               → 'anuncio' | 'media_portal'
 *  year, km, price    → datos del anuncio (km = kilometraje mediano si es media)
 *  engine             → motorización cuando la fuente la detalla
 *  source, url        → procedencia verificable
 */
export const MARKET_OBSERVATIONS = [
  // ---------------------------------------------------------------- GOLF ---
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2018, km: 70856, price: 16900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-vi-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG', year: 2018, km: 143776, price: 11950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-7-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG', year: 2018, km: 89022, price: 17990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-variant-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Aut.', year: 2019, km: 109500, price: 15499, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-variant-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2019, km: 106012, price: 16990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-variant-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG', year: 2019, km: 127147, price: 15980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-150-ps.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG', year: 2014, km: 97500, price: 12300, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-150-ps.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII (5G)', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 184 CV GTD', year: 2016, km: 102659, price: 16490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-vi-tdi.html' },

  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Advance', year: 2018, km: 109163, price: 17990, source: 'Autocasión (A Coruña)', url: 'https://www.autocasion.com/coches-segunda-mano/volkswagen-golf-ocasion/la-coruna/diesel' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Advance', year: 2019, km: 107117, price: 19770, source: 'Autocasión (A Coruña)', url: 'https://www.autocasion.com/coches-segunda-mano/volkswagen-golf-ocasion/la-coruna/diesel' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Advance', year: 2017, km: 115000, price: 19900, source: 'Autocasión', url: 'https://www.autocasion.com/coches-segunda-mano/volkswagen-golf-ocasion/la-coruna/diesel' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV 6v', year: 2017, km: 125038, price: 15900, source: 'AGC Multimarca Galicia (San Sadurniño)', url: 'https://www.agcmultimarcagalicia.com/vehiculos.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV BMT Advance', year: 2018, km: 120000, price: 15490, source: 'Wallapop (A Coruña)', url: 'https://es.wallapop.com/coches-segunda-mano/volkswagen-golf-tdi/a-coruna' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Advance', year: 2018, km: 148403, price: 15190, source: 'auto10.com (A Coruña)', url: 'https://www.auto10.com/segunda-mano/volkswagen/golf/a-coruna' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2018, km: 134694, price: 18621, source: 'coches.net (media Golf 2018)', url: 'https://www.coches.net/volkswagen/golf/segunda-mano/2018/' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2018, km: 116900, price: 18558, source: 'AutoUncle (media Golf VII 2018)', url: 'https://www.autouncle.es/es/coches-segunda-mano/VW/Golf%20VII/y-2018' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2019, km: 105000, price: 20285, source: 'AutoUncle (media Golf VII 2019)', url: 'https://www.autouncle.es/es/coches-segunda-mano/VW/Golf%20VII' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Advance', year: 2019, km: 160000, price: 14900, source: 'coches.net (Alicante)', url: 'https://www.coches.net/volkswagen/golf/tdi/segunda-mano/' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Advance', year: 2018, km: 114000, price: 16590, source: 'coches.net (Granada)', url: 'https://www.coches.net/volkswagen/golf/segunda-mano/2018/' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 184 CV GTD DSG', year: 2018, km: 108105, price: 23300, source: 'Coches.com (Sada, A Coruña)', url: 'https://www.coches.com/coches-segunda-mano/ocasion-volkswagen-golf-184-20tdi-gtd-dsg7-135kw.htm' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VII Variant', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Variant', year: 2020, km: 85480, price: 19190, source: 'Coches.com (A Coruña)', url: 'https://www.coches.com/coches-segunda-mano/volkswagen-golf-en-coruna-a.htm' },

  // ---------------------------------------------------------- GOLF VIII ---
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VIII', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Style', year: 2020, km: 99620, price: 21339, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-ps-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VIII', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG', year: 2020, km: 73397, price: 21859, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-ps-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VIII', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Life', year: 2020, km: 46500, price: 21990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-150-ps.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VIII', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Life', year: 2022, km: 87993, price: 16990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-150-ps.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VIII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Life', year: 2021, km: 107900, price: 17980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-150-ps.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VIII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Life', year: 2021, km: 136960, price: 16990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-150.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VIII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Life', year: 2021, km: 95722, price: 19639, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-ps-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VIII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Life', year: 2021, km: 121925, price: 19790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-ps-tdi.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VIII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Life', year: 2021, km: 120000, price: 17500, source: 'mobile.de (particular)', url: 'https://suchen.mobile.de/auto/volkswagen-golf-8-variant.html' },
  { brand: 'Volkswagen', model: 'Golf Variant', gen: 'Golf VIII Variant', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Life', year: 2021, km: 62680, price: 20808, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-8-variant.html' },

  // -------------------------------------------------------------- TIGUAN ---
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG 4Motion', year: 2018, km: 112927, price: 19750, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-tiguan-diesel.html' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Highline', year: 2018, km: 106885, price: 20999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-tiguan-tdi-dsg.html' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Highline', year: 2018, km: 99300, price: 21790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-tiguan-tdi-dsg.html' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Highline', year: 2019, km: 97717, price: 21990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-tiguan-tdi-dsg.html' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV 4M Join DSG', year: 2018, km: 112767, price: 19980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-tiguan-tdi-dsg.html' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV BMT Highline', year: 2018, km: 94578, price: 18990, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/volkswagen/tiguan/ft_diesel' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV IQ.DRIVE', year: 2019, km: 122331, price: 17899, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/volkswagen/tiguan/ft_diesel' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Join', year: 2019, km: 146300, price: 16880, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/volkswagen/tiguan/ft_diesel' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline 4Motion', year: 2016, km: 91363, price: 19990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-tiguan-diesel.html' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan II', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Life', year: 2019, km: 110000, price: 25490, source: 'Wallapop / Flexicar (A Coruña)', url: 'https://es.wallapop.com/coches-segunda-mano/volkswagen-golf-tdi/a-coruna' },

  // ------------------------------------------------------------- OCTAVIA ---
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Ambition', year: 2018, km: 85600, price: 15990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-2-0-tdi.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition LED', year: 2018, km: 84720, price: 18990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Clever Aut.', year: 2018, km: 89947, price: 16810, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-2018.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Ambition', year: 2019, km: 88734, price: 23280, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-2-0-tdi.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Clever', year: 2018, km: 137716, price: 15200, source: 'Kleinanzeigen.de', url: 'https://www.kleinanzeigen.de/s-autos/skoda-octavia-2.0-tdi/k0c216' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2018, km: 105123, price: 16000, source: 'Kleinanzeigen.de', url: 'https://www.kleinanzeigen.de/s-autos/skoda-octavia-2.0-tdi/k0c216+autos.typ_s:kombi' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2017, km: 169000, price: 11600, source: 'Kleinanzeigen.de', url: 'https://www.kleinanzeigen.de/s-autos/skoda-octavia-2.0-tdi/k0c216+autos.typ_s:kombi' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2018, km: 165000, price: 14300, source: 'Kleinanzeigen.de', url: 'https://www.kleinanzeigen.de/s-autos/skoda-octavia-2.0-tdi/k0c216' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2018, km: 153000, price: 17999, source: 'Kleinanzeigen.de', url: 'https://www.kleinanzeigen.de/s-autos/skoda-octavia-2.0-tdi/k0c216' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Clever', year: 2018, km: 177000, price: 17900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-2018.html' },

  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Ambition', year: 2018, km: 150000, price: 15950, source: 'coches.net', url: 'https://www.coches.net/skoda/octavia/familiar/segunda-mano/' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Style', year: 2018, km: 194000, price: 14499, source: 'Autocasión (Madrid)', url: 'https://www.autocasion.com/coches-segunda-mano/skoda-octavia-ocasion/octavia-combi-2-0tdi-cr-style-ref19406383' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Ambition', year: 2018, km: 180000, price: 11500, source: 'coches.net (Madrid)', url: 'https://www.coches.net/skoda/octavia/segunda-mano/2018/' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi III', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2018, km: 167339, price: 15190, source: 'coches.net (media Octavia Familiar)', url: 'https://www.coches.net/skoda/octavia/familiar/segunda-mano/' },


  // ==== AMPLIACIÓN 24-09-2026: Audi A3, Mercedes Clase A, Toyota Corolla, Seat León ====
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2017, km: 101282, price: 16030, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV quattro', year: 2017, km: 99529, price: 14560, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line S-tronic', year: 2018, km: 96160, price: 18490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-2-0.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Virtual', year: 2018, km: 98200, price: 16480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-2-0.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Design', year: 2017, km: 116745, price: 16780, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-2-0.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV sport', year: 2017, km: 61318, price: 19930, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-2-0.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV design', year: 2018, km: 68449, price: 18950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-2-0.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition', year: 2016, km: 94623, price: 16300, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S-Line', year: 2017, km: 113570, price: 18250, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Virtual', year: 2018, km: 90084, price: 17940, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S-Tronic', year: 2018, km: 99159, price: 16490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV 35 TDI', year: 2018, km: 105116, price: 17980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport DSG', year: 2016, km: 96000, price: 17490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-2-0-tdi.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line', year: 2018, km: 123000, price: 18500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-2-0-tdi.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Virtual', year: 2017, km: 218000, price: 12400, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-2-0-tdi.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '1.5 TFSI 150 CV S-Tronic', year: 2017, km: 93840, price: 15950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TFSI 190 CV quattro', year: 2017, km: 113856, price: 19560, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Limousine', year: 2017, km: 83785, price: 19200, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-2-0.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8Y', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV advanced DSG', year: 2022, km: 54033, price: 24450, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-a3-diesel-sportback.html' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2018, km: 125946, price: 21383, source: 'coches.net (media A3 2018, 172 uds)', url: 'https://www.coches.net/audi/a3/segunda-mano/2018/' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'ES', kind: 'anuncio', engine: 'diésel sin detallar', year: 2018, km: 163000, price: 21000, source: 'coches.net (A Coruña, particular)', url: 'https://www.coches.net/audi/a3/segunda-mano/a_coruna/particulares/' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'ES', kind: 'anuncio', engine: 'TDI sin detallar', year: 2018, km: 85000, price: 21999, source: 'Milanuncios (Galicia)', url: 'https://www.milanuncios.com/audi-de-segunda-mano-en-galicia/a3-tdi.htm' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8V', market: 'ES', kind: 'anuncio', engine: '1.5 TFSI 150 CV S tronic', year: 2019, km: 71000, price: 22500, source: 'coches.net (A Coruña)', url: 'https://www.coches.net/audi/a3/segunda-mano/a_coruna/particulares/' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV', year: 2020, km: 113304, price: 19650, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV', year: 2020, km: 90555, price: 22990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-diesel.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV', year: 2019, km: 123000, price: 19990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-diesel.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV Progressive', year: 2019, km: 127270, price: 20577, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-diesel.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV AMG-Line', year: 2020, km: 82476, price: 23890, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-diesel.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV Edition 19', year: 2020, km: 120285, price: 19900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-diesel.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 d 150 CV Edition 19', year: 2020, km: 116489, price: 19500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-diesel.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 180 d 116 CV', year: 2019, km: 95000, price: 18999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-klasse-w177.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 180 d 116 CV', year: 2019, km: 95000, price: 18500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-klasse-w177.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV', year: 2019, km: 112507, price: 16900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-klasse-w177.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV 4MATIC DCT', year: 2020, km: 75000, price: 20200, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV AMG Line', year: 2020, km: 67000, price: 24900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV AMG-Line', year: 2020, km: 95258, price: 23440, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV Edition 19', year: 2020, km: 83201, price: 22880, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV Progressive', year: 2020, km: 109500, price: 18480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV', year: 2020, km: 87601, price: 18950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 200 163 CV Edition 19', year: 2020, km: 65681, price: 21660, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/mercedes-benz-a-200-2020.html' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 220 d 190 CV', year: 2020, km: 46277, price: 21580, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/mercedes-benz/a-220/re_2020' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 220 d 190 CV Progressive', year: 2020, km: 172182, price: 15980, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/mercedes-benz/a-220/re_2020' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 220 d 190 CV AMG-Line', year: 2020, km: 190616, price: 15890, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/mercedes-benz/a-220/re_2020' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 220 d 190 CV AMG', year: 2020, km: 96000, price: 24950, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/mercedes-benz/a-220/re_2020' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 220 d 190 CV Progressive', year: 2020, km: 106500, price: 22480, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/mercedes-benz/a-220/re_2020' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177', market: 'DE', kind: 'anuncio', engine: 'A 220 d 177 CV 4Matic', year: 2020, km: 196000, price: 14950, source: 'AutoScout24.de (particular)', url: 'https://www.autoscout24.de/lst/mercedes-benz/a-220/re_2020' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV GR Sport', year: 2020, km: 70734, price: 25480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 179 CV Lounge', year: 2019, km: 95990, price: 24880, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Club', year: 2019, km: 77922, price: 20950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Club', year: 2019, km: 70413, price: 20790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Lounge', year: 2020, km: 95000, price: 22990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV GR Sport', year: 2020, km: 106500, price: 22490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Team D', year: 2020, km: 79995, price: 22222, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Lounge', year: 2019, km: 66100, price: 23329, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Club', year: 2019, km: 65360, price: 19980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2-0.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV GR Sport', year: 2020, km: 60436, price: 24280, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-kombi.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Lounge', year: 2019, km: 90290, price: 22390, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-kombi.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Club', year: 2019, km: 94449, price: 19970, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-kombi.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Club', year: 2019, km: 87000, price: 20990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-kombi.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV GR Sport', year: 2020, km: 120500, price: 21490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2020.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Team D', year: 2020, km: 123000, price: 18000, source: 'mobile.de (particular)', url: 'https://suchen.mobile.de/auto/toyota-corolla-2020.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 179 CV GR Sport', year: 2020, km: 70500, price: 24370, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2020.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV Lounge', year: 2020, km: 63725, price: 24500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2020.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 179 CV Lounge', year: 2020, km: 90252, price: 22934, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2020.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 179 CV GR Sport', year: 2020, km: 100975, price: 21490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-gr-sport.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 184 CV GR Sport', year: 2020, km: 89800, price: 24450, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-gr-sport.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 152 CV', year: 2019, km: 91600, price: 21970, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-kombi.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'DE', kind: 'anuncio', engine: '2.0 Hybrid 152 CV GR Sport', year: 2019, km: 150000, price: 18299, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-gr-sport.html' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', market: 'DE', kind: 'anuncio', engine: 'gasolina sin detallar', year: 2020, km: 81000, price: 13990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/toyota-corolla-2020.html' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'ES', kind: 'anuncio', engine: '2.0 180H Active Tech', year: 2020, km: 75450, price: 21900, source: 'coches.net (Córdoba)', url: 'https://www.coches.net/toyota/corolla/hibrido/segunda-mano/' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'ES', kind: 'anuncio', engine: '2.0 180H Advance', year: 2019, km: 154270, price: 18990, source: 'coches.net (Alicante)', url: 'https://www.coches.net/toyota/corolla/segunda-mano/2019/' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'ES', kind: 'anuncio', engine: '2.0 180H Style', year: 2020, km: 85505, price: 21700, source: 'coches.net (Madrid)', url: 'https://www.coches.net/toyota/corolla/style/segunda-mano/' },
  { brand: 'Toyota', model: 'Corolla Touring Sports', gen: 'Corolla TS E210', market: 'ES', kind: 'anuncio', engine: '2.0 180H Style', year: 2021, km: 99000, price: 21900, source: 'coches.net (Madrid)', url: 'https://www.coches.net/toyota/corolla/style/segunda-mano/' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', market: 'ES', kind: 'anuncio', engine: '1.8 125H Active', year: 2020, km: 84000, price: 20700, source: 'coches.net (La Rioja)', url: 'https://www.coches.net/toyota/corolla/segunda-mano/2020/' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', market: 'ES', kind: 'anuncio', engine: '1.8 125H Active', year: 2019, km: 91000, price: 19999, source: 'coches.net (Barcelona)', url: 'https://www.coches.net/toyota/corolla/segunda-mano/2019/' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', market: 'ES', kind: 'anuncio', engine: '1.8 125H Active Tech', year: 2019, km: 114000, price: 18500, source: 'coches.net (Madrid)', url: 'https://www.coches.net/toyota/corolla/segunda-mano/particulares/' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2020, km: 111182, price: 18538, source: 'coches.net (media Corolla 2020, 90 uds)', url: 'https://www.coches.net/toyota/corolla/segunda-mano/2020/' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', market: 'ES', kind: 'media_portal', engine: 'todas', year: 2019, km: 116675, price: 18161, source: 'coches.net (media Corolla 2019, 87 uds)', url: 'https://www.coches.net/toyota/corolla/segunda-mano/2019/' },
  { brand: 'Seat', model: 'León ST', gen: 'León ST 5F', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Style Edition', year: 2020, km: 66490, price: 18199, source: 'Milanuncios (Barcelona)', url: 'https://www.milanuncios.com/seat-de-segunda-mano/seat-leon-2-0-tdi-style-s-s-150cv.htm' },

  // ----------------------------------------------------------- BMW SERIE 3 --
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring F31', market: 'ES', kind: 'anuncio', engine: '320d 190 CV', year: 2018, km: 180000, price: 23900, source: 'Milanuncios (Melide, A Coruña)', url: 'https://www.milanuncios.com/bmw-de-segunda-mano/bmw-320d-touring-f31.htm' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring F31', market: 'ES', kind: 'anuncio', engine: '320d 190 CV', year: 2018, km: 150000, price: 19200, source: 'Milanuncios (Murcia)', url: 'https://www.milanuncios.com/bmw-de-segunda-mano/bmw-320d-touring-184cv.htm' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring F31', market: 'ES', kind: 'anuncio', engine: '320d xDrive 190 CV', year: 2018, km: 104804, price: 18090, source: 'Ocasionplus', url: 'https://www.ocasionplus.com/coches-segunda-mano/bmw/serie-3' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring F31', market: 'ES', kind: 'anuncio', engine: '320d 190 CV M-Sport Shadow', year: 2017, km: 61000, price: 20900, source: 'Milanuncios (Almería)', url: 'https://www.milanuncios.com/bmw-de-segunda-mano/bmw-320d-touring-f31.htm' },
  // --------------------------------------------------------- DACIA DUSTER II --
  // Alemania (compra) — mobile.de, buscadores «Duster Diesel / Dci / 1.5 / 4x4».
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2019, km: 76363, price: 13990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-diesel.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2019, km: 121887, price: 12898, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-diesel.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV', year: 2019, km: 58523, price: 13390, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-diesel.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2019, km: 131169, price: 12498, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-diesel.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 dCi 110 CV Prestige', year: 2018, km: 131638, price: 10299, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-diesel.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige 4WD', year: 2020, km: 103701, price: 16490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige 4WD', year: 2020, km: 63657, price: 16890, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2021, km: 83116, price: 14930, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 dCi 110 CV Automatik', year: 2018, km: 82000, price: 13970, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 dCi 110 CV Prestige', year: 2018, km: 77000, price: 13480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Expression', year: 2023, km: 97297, price: 14490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige 4WD', year: 2022, km: 73500, price: 18490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort', year: 2022, km: 66429, price: 15990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2021, km: 83195, price: 14430, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 dCi 110 CV Prestige Automatik', year: 2018, km: 70871, price: 12990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4x4', year: 2019, km: 113284, price: 11999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4x4', year: 2018, km: 119758, price: 11999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4x4', year: 2019, km: 123215, price: 11999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Deal 4WD', year: 2021, km: 94000, price: 12990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4WD', year: 2020, km: 140295, price: 11990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Celebration 4WD', year: 2021, km: 90660, price: 16891, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-1-5.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort', year: 2021, km: 125000, price: 11590, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige+', year: 2022, km: 82630, price: 17490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2019, km: 137648, price: 11842, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2019, km: 115000, price: 12995, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2020, km: 88826, price: 14980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-dci.html' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'DE', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige', year: 2022, km: 80388, price: 15690, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-duster-allradantrieb-dci.html' },
  // España (venta) — coches.net, autocasion.com, Ocasionplus y Syrsa.
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4x4', year: 2020, km: 111598, price: 15990, source: 'coches.net (Valladolid)', url: 'https://www.coches.net/dacia/duster/segunda-mano/2020/' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4x4', year: 2020, km: 119500, price: 13200, source: 'coches.net (Barcelona)', url: 'https://www.coches.net/dacia/duster/segunda-mano/2020/' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige 4x2', year: 2020, km: 85159, price: 15990, source: 'coches.net (Valencia)', url: 'https://www.coches.net/dacia/duster/segunda-mano/' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Prestige 4x2', year: 2020, km: 98809, price: 14990, source: 'Autocasión (Lugo)', url: 'https://www.autocasion.com/marcas/dacia/duster-todoterrenos/duster-1-0-tce-prestige-4x2-67kw-5-puertas-91861' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: 'diésel 115 CV sin detallar', year: 2020, km: 128393, price: 14500, source: 'Renault Syrsa (ocasión)', url: 'https://www.renault.syrsa.com/coches-segunda-mano/dacia/duster/diesel' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 95 CV Essential 4x2', year: 2020, km: 92583, price: 15500, source: 'Renault Syrsa (ocasión)', url: 'https://www.renault.syrsa.com/coches-segunda-mano/dacia/duster/diesel' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Essential 4x2', year: 2021, km: 119340, price: 17000, source: 'Renault Syrsa (ocasión)', url: 'https://www.renault.syrsa.com/coches-segunda-mano/dacia/duster/diesel' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.5 Blue dCi 115 CV Comfort 4x2', year: 2020, km: 98476, price: 13990, source: 'Ocasionplus (Pamplona)', url: 'https://www.ocasionplus.com/coches-segunda-mano/dacia/duster' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'anuncio', engine: '1.6 GLP Prestige 4x2 115 CV', year: 2020, km: 147469, price: 14490, source: 'Ocasionplus', url: 'https://www.ocasionplus.com/coches-segunda-mano/dacia/duster' },
  { brand: 'Dacia', model: 'Duster', gen: 'Duster II', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2020, km: 120090, price: 13742, source: 'coches.net (media de 44 uds. del año 2020)', url: 'https://www.coches.net/dacia/duster/segunda-mano/2020/' },

  // --------------------------------------------------------- KIA SPORTAGE QL --
  // Alemania (compra) — mobile.de, buscadores «Sportage 1.6 / Sportage / Eco».
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV Vision', year: 2019, km: 82117, price: 17390, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT-Line 4WD', year: 2019, km: 79703, price: 20990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT-Line 4WD Automatik', year: 2019, km: 81727, price: 18950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT-Line AWD', year: 2017, km: 94500, price: 17889, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT-Line 2WD', year: 2018, km: 94400, price: 17990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 GDi 132 CV Edition 7', year: 2017, km: 99173, price: 12990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 GDi 132 CV', year: 2017, km: 69035, price: 15990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 GDi 132 CV Vision', year: 2016, km: 110047, price: 11990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-1-6.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 GDi 132 CV Edition 7', year: 2017, km: 96136, price: 12490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV Vision AWD DCT7', year: 2020, km: 105877, price: 16450, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV Spirit AWD', year: 2020, km: 57590, price: 17990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT Line 4WD', year: 2017, km: 94762, price: 16990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT Line AWD', year: 2018, km: 86532, price: 17999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 177 CV GT Line 4WD', year: 2016, km: 68602, price: 17950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 GDi 132 CV Vision', year: 2016, km: 111000, price: 13780, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 4x4', year: 2018, km: 93800, price: 16700, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV EcoDynamics+ 2WD', year: 2019, km: 99055, price: 16990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-eco.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV EcoDynamics+ Vision 2WD', year: 2020, km: 85500, price: 18950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-eco.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV EcoDynamics+ DCT 4WD', year: 2019, km: 64000, price: 18990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-eco.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV EcoDynamics+ Vision 4WD', year: 2020, km: 69800, price: 16800, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-eco.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV EcoDynamics+ Vision 2WD', year: 2019, km: 133000, price: 14000, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-eco.html' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV EcoDynamics+ AWD GT Line', year: 2020, km: 41500, price: 22489, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/kia-sportage-eco.html' },
  // España (venta) — coches.net, AutoScout24.es y Ocasionplus.
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 TGDi 177 CV GT Line Essential 4x2', year: 2019, km: 160021, price: 14500, source: 'coches.net (Madrid)', url: 'https://www.coches.net/kia/sportage/segunda-mano/2019/' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 115 CV Business 4x2', year: 2019, km: 101836, price: 14430, source: 'coches.net (Madrid)', url: 'https://www.coches.net/kia/sportage/segunda-mano/2019/' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV GT Line Essential 4x2', year: 2019, km: 117301, price: 18999, source: 'coches.net (Jaén)', url: 'https://www.coches.net/kia/sportage/segunda-mano/2019/' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV Drive 4x2', year: 2019, km: 87270, price: 17990, source: 'coches.net (Valencia)', url: 'https://www.coches.net/kia/sportage/diesel/segunda-mano/' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV Concept 4x2', year: 2019, km: 156844, price: 15999, source: 'coches.net (Huelva)', url: 'https://www.coches.net/kia-sportage-1.6-crdi-100kw-136cv-concept-4x2-5p-diesel-2019-en-huelva-57147563-covo.aspx' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 116 CV MHEV Drive 4x2', year: 2019, km: 125779, price: 14480, source: 'AutoScout24.es', url: 'https://www.autoscout24.es/lst/kia/sportage/re_2019' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV MHEV Drive 4x2', year: 2019, km: 96381, price: 14500, source: 'AutoScout24.es', url: 'https://www.autoscout24.es/lst/kia/sportage/re_2019' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV GT Line Essential 4x2', year: 2019, km: 104109, price: 14790, source: 'AutoScout24.es (A Coruña)', url: 'https://www.autoscout24.es/lst/kia/sportage/re_2019' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV Business 2WD', year: 2019, km: 97881, price: 15047, source: 'AutoScout24.es (Barcelona)', url: 'https://www.autoscout24.es/lst/kia/sportage/re_2019' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV MHEV Concept 4x2', year: 2019, km: 131816, price: 13364, source: 'AutoScout24.es (Barcelona)', url: 'https://www.autoscout24.es/lst/kia/sportage/re_2019' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 136 CV MHEV Concept 4x2', year: 2019, km: 116242, price: 14364, source: 'AutoScout24.es', url: 'https://www.autoscout24.es/lst/kia/sportage/re_2019' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'anuncio', engine: '1.6 CRDi 115 CV Drive 4x2', year: 2019, km: 112440, price: 15850, source: 'Ocasionplus (Valencia)', url: 'https://www.ocasionplus.com/coches-segunda-mano/kia/sportage' },
  { brand: 'Kia', model: 'Sportage', gen: 'Sportage QL', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2019, km: 104056, price: 16835, source: 'coches.net (media de 141 uds. del año 2019)', url: 'https://www.coches.net/kia/sportage/segunda-mano/2019/' },

  // ------------------------------------------------------- VOLKSWAGEN CADDY --
  // Alemania (compra) — mobile.de, buscadores «Caddy Diesel Kombi 2.0 / 2021 / 2022».
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 4', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Trendline Maxi', year: 2018, km: 126219, price: 17950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 4', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV BMT DSG', year: 2018, km: 96000, price: 17900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Kombi', year: 2023, km: 71000, price: 17888, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV', year: 2021, km: 37000, price: 19390, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Life', year: 2021, km: 78000, price: 18950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Life', year: 2022, km: 77570, price: 20790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Life Maxi', year: 2022, km: 97754, price: 23800, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Life Maxi', year: 2022, km: 117700, price: 22700, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 75 CV Basis', year: 2022, km: 123800, price: 15999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 122 CV Cargo DSG', year: 2022, km: 112860, price: 20940, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Kombi EcoProfi', year: 2022, km: 79850, price: 19789, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '1.5 TSI 114 CV Style', year: 2022, km: 57200, price: 24690, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 122 CV Kombi 4Motion', year: 2022, km: 95300, price: 19430, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2022.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 122 CV 4Motion', year: 2021, km: 65421, price: 22990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV', year: 2021, km: 55500, price: 17900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Cargo', year: 2021, km: 173100, price: 10980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV', year: 2021, km: 86000, price: 18988, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Move Panorama', year: 2021, km: 84254, price: 21480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 122 CV DSG', year: 2021, km: 85452, price: 21900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 122 CV Move Automatik', year: 2021, km: 74150, price: 22810, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Life', year: 2021, km: 102923, price: 17978, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-2021.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Basis', year: 2021, km: 174000, price: 11990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-i.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV', year: 2021, km: 45648, price: 23550, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-i.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Life Euro 6d', year: 2021, km: 78014, price: 19490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-i.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 102 CV Kombi Euro 6d', year: 2022, km: 88356, price: 19490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-i.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 75 CV Kombi Euro 6d', year: 2021, km: 67967, price: 15990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-i.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 75 CV', year: 2022, km: 60000, price: 22950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-i.html' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 75 CV Kastenwagen', year: 2021, km: 97530, price: 15500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-caddy-kastenwagen.html' },
  // España (venta) — coches.net, Valencia, Murcia y Asturias.
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 75 CV Cargo', year: 2021, km: 169000, price: 13900, source: 'coches.net (Asturias)', url: 'https://www.coches.net/volkswagen/caddy/vehiculos-industriales/' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 102 CV Beach BMT', year: 2021, km: 108000, price: 18900, source: 'coches.net (Valencia)', url: 'https://www.coches.net/volkswagen/caddy/segunda-mano/valencia/' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 122 CV Origin DSG', year: 2021, km: 58168, price: 25499, source: 'coches.net (Valencia)', url: 'https://www.coches.net/volkswagen/caddy/segunda-mano/valencia/' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 122 CV Origin 4Motion', year: 2021, km: 119000, price: 18900, source: 'coches.net (Murcia)', url: 'https://www.coches.net/volkswagen/caddy/segunda-mano/murcia/' },
  { brand: 'Volkswagen', model: 'Caddy', gen: 'Caddy 5', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2020, km: 142072, price: 17985, source: 'coches.net Valencia (media de 28 uds.)', url: 'https://www.coches.net/volkswagen/caddy/segunda-mano/valencia/' },

  // --------------------------------------------------------------- AUDI Q3 --
  // Alemania (compra) — Q3 8U (2015-2018).
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport', year: 2016, km: 101500, price: 13999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-diesel.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV XenonPlus', year: 2015, km: 89750, price: 16530, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-diesel.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV design quattro', year: 2016, km: 85230, price: 17999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-diesel.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Design', year: 2015, km: 85639, price: 15630, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-diesel.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV basis quattro', year: 2015, km: 103715, price: 14490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport Automatik', year: 2017, km: 80850, price: 17649, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-tdi.html' },
  // Alemania (compra) — Q3 F3 (2018-2025).
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line', year: 2023, km: 46777, price: 31990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line quattro Business', year: 2022, km: 91580, price: 28780, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV quattro S line', year: 2018, km: 85774, price: 23530, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line', year: 2019, km: 89915, price: 25970, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic', year: 2019, km: 63000, price: 24990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line', year: 2020, km: 116450, price: 27989, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic S line', year: 2020, km: 106121, price: 28390, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-35-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV advanced S tronic', year: 2020, km: 84400, price: 25790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-diesel.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV advanced', year: 2023, km: 64882, price: 26970, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV advanced', year: 2022, km: 67449, price: 27299, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-tdi.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2025, km: 36664, price: 31880, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2025.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic', year: 2025, km: 21211, price: 31940, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2025.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV basis', year: 2025, km: 59400, price: 28400, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2025.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line', year: 2024, km: 116460, price: 25790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2024.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic quattro', year: 2024, km: 118330, price: 29960, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2024.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV S line Matrix', year: 2024, km: 92500, price: 29930, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2024.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '35 TFSI 150 CV S line S tronic', year: 2024, km: 27400, price: 39780, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2024.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '35 TFSI 150 CV S line', year: 2024, km: 82345, price: 28299, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2024.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '35 TFSI 150 CV S line', year: 2024, km: 46300, price: 30780, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2024.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '35 TFSI 150 CV advanced', year: 2025, km: 28470, price: 33980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2025.html' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'DE', kind: 'anuncio', engine: '35 TFSI 150 CV S tronic', year: 2025, km: 13850, price: 32880, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/audi-q3-2025.html' },
  // España (venta) — coches.net, Autocasión y Spoticar.
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic Advanced', year: 2019, km: 56281, price: 27245, source: 'Spoticar', url: 'https://www.spoticar.es/comprar-coches-de-ocasion/audi/q3/galicia' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Advanced', year: 2021, km: 63070, price: 31995, source: 'Spoticar', url: 'https://www.spoticar.es/comprar-coches-de-ocasion/audi/q3/galicia' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic', year: 2021, km: 95442, price: 32990, source: 'Spoticar', url: 'https://www.spoticar.es/comprar-coches-de-ocasion/audi/q3/galicia' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Attraction', year: 2018, km: 77798, price: 24250, source: 'Spoticar', url: 'https://www.spoticar.es/comprar-coches-de-ocasion/audi/q3/galicia' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 190 CV S tronic quattro S Line', year: 2019, km: 53550, price: 32880, source: 'coches.net (Navarra)', url: 'https://www.coches.net/audi/q3/segunda-mano/2019/' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '35 TFSI 150 CV S line S tronic', year: 2019, km: 165000, price: 22500, source: 'coches.net (Navarra)', url: 'https://www.coches.net/audi/q3/segunda-mano/2019/' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Black line S tronic', year: 2019, km: 119900, price: 25900, source: 'coches.net (Valencia)', url: 'https://www.coches.net/audi/q3/segunda-mano/2019/' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Advanced S tronic', year: 2019, km: 190000, price: 19890, source: 'coches.net (A Coruña)', url: 'https://www.coches.net/audi/q3/segunda-mano/2019/' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV S tronic', year: 2019, km: 91089, price: 25000, source: 'coches.net (La Rioja)', url: 'https://www.coches.net/audi/q3/diesel/segunda-mano/' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2016, km: 150000, price: 16999, source: 'coches.net (Jaén)', url: 'https://www.coches.net/audi/q3/tdi/segunda-mano/' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'anuncio', engine: '35 TFSI 150 CV S line S tronic', year: 2019, km: 115164, price: 26690, source: 'Autocasión (Pontevedra)', url: 'https://www.autocasion.com/coches-segunda-mano/audi-q3-ocasion/pontevedra' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Design edition S tronic', year: 2018, km: 95499, price: 24690, source: 'Autocasión (Pontevedra)', url: 'https://www.autocasion.com/coches-segunda-mano/audi-q3-ocasion/pontevedra' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 8U', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Black Line quattro S tronic', year: 2018, km: 112813, price: 26450, source: 'Autocasión (Pontevedra)', url: 'https://www.autocasion.com/coches-segunda-mano/audi-q3-ocasion/pontevedra' },
  { brand: 'Audi', model: 'Q3', gen: 'Q3 F3', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2019, km: 109317, price: 24752, source: 'coches.net (media de 108 uds. del año 2019)', url: 'https://www.coches.net/audi/q3/segunda-mano/2019/' },

  // ------------------------------------------------------ HYUNDAI TUCSON TL --
  // Alemania (compra) — mobile.de, buscadores «Tucson Diesel / Crdi / 4x4».
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '2.0 CRDi 136 CV Intro Edition 4WD', year: 2016, km: 103800, price: 15990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV Style 4WD DCT', year: 2019, km: 110000, price: 17500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV', year: 2019, km: 91355, price: 17990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '2.0 CRDi 136 CV Intro Edition 4WD', year: 2016, km: 125000, price: 13899, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 2WD DCT', year: 2019, km: 75699, price: 18900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '2.0 CRDi 185 CV Style N-Line 4WD', year: 2019, km: 91899, price: 21495, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 4WD Advantage', year: 2016, km: 80000, price: 16780, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-crdi.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV Automatik', year: 2019, km: 109024, price: 18490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-crdi.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '2.0 CRDi 136 CV Intro Edition', year: 2016, km: 87496, price: 14890, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-allradantrieb-crdi.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV Premium 4WD', year: 2019, km: 89462, price: 22450, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-allradantrieb-crdi.html' },
  // Tucson NX4 (2021-2025): el 1.6 CRDi de esta generación es siempre 48 V.
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Prime', year: 2021, km: 100400, price: 21900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Mild Hybrid 2WD', year: 2021, km: 119698, price: 16500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Prime 4WD DCT', year: 2021, km: 75000, price: 25850, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-crdi.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Select Automatik', year: 2021, km: 63177, price: 22490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-crdi.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Trend', year: 2021, km: 78000, price: 23985, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Select Automatik', year: 2023, km: 71040, price: 22880, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Automatik', year: 2021, km: 73800, price: 20800, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Trend DCT', year: 2021, km: 62385, price: 20490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 180 CV 48V Prime 4WD', year: 2021, km: 83000, price: 22850, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 180 CV 48V', year: 2021, km: 74000, price: 20950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 180 CV 48V N Line', year: 2021, km: 52994, price: 23990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Trend 7-DCT 4WD', year: 2021, km: 77777, price: 26999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-allradantrieb-crdi.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Trend 2WD DCT', year: 2022, km: 67000, price: 24850, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-v6.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 150 CV Trend', year: 2023, km: 94204, price: 21440, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi 150 CV Trend DCT', year: 2023, km: 106744, price: 21790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V 4WD', year: 2023, km: 104353, price: 20490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V 2WD', year: 2023, km: 93647, price: 23220, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Trend 4WD', year: 2023, km: 99390, price: 23990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 T-GDi Plug-in Hybrid 265 CV N-Line 4WD', year: 2023, km: 43500, price: 34000, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Select 2WD', year: 2023, km: 24250, price: 28400, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-2023.html' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson NX4', market: 'DE', kind: 'anuncio', engine: '1.6 CRDi 136 CV 48V Prime', year: 2025, km: 15400, price: 33990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/hyundai-tucson-diesel.html' },
  // España (venta) — coches.net, Autocasión, HR Motor y AutoUncle.
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: '1.7 CRDi 115 CV BlueDrive Klass 4x2', year: 2018, km: 58486, price: 17990, source: 'coches.net (Valencia)', url: 'https://www.coches.net/hyundai/tucson/segunda-mano/2018/' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: '1.7 CRDi 115 CV BD Kosmo 4x2 DCT', year: 2018, km: 170000, price: 15790, source: 'Autocasión (Vizcaya)', url: 'https://www.autocasion.com/coches-segunda-mano/hyundai-tucson-ocasion' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: '1.7 CRDi 115 CV Klass BlueDrive 2WD', year: 2018, km: 31983, price: 17899, source: 'Autocasión (Barcelona)', url: 'https://www.autocasion.com/coches-segunda-mano/hyundai-tucson-ocasion' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: 'diésel sin detallar Tecno', year: 2017, km: 189000, price: 15800, source: 'Autocasión (Valladolid)', url: 'https://www.autocasion.com/coches-segunda-mano/hyundai-tucson-ocasion' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: '1.7 CRDi 115 CV BlueDrive Klass 4x2', year: 2018, km: 58550, price: 17990, source: 'HR Motor', url: 'https://www.hrmotor.com/coches-segunda-mano/hyundai/tucson/' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: '1.7 CRDi 115 CV BlueDrive Essence 4x2', year: 2018, km: 156186, price: 14390, source: 'HR Motor (Valencia)', url: 'https://www.hrmotor.com/coches-segunda-mano/hyundai/tucson/' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'anuncio', engine: '1.6 gasolina BlueDrive 2WD Essence', year: 2018, km: 119136, price: 13499, source: 'Autohero (precio al contado)', url: 'https://www.autohero.com/es/auto/hyundai-tucson/' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2018, km: 118196, price: 16348, source: 'coches.net (media de 66 uds. del año 2018)', url: 'https://www.coches.net/hyundai/tucson/segunda-mano/2018/' },
  { brand: 'Hyundai', model: 'Tucson', gen: 'Tucson TL', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2018, km: 98900, price: 16337, source: 'AutoUncle (media de 119 anuncios de 2018)', url: 'https://www.autouncle.es/es/coches-segunda-mano/Hyundai/Tucson/y-2018' },

  // ------------------------------------------------------- SKODA OCTAVIA IV --
  // España (venta): la berlina, no el Combi (que ya tenía su propia evidencia).
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia IV', market: 'ES', kind: 'anuncio', engine: '1.5 TSI 150 CV Ambition', year: 2020, km: 72128, price: 16900, source: 'AutoScout24.es', url: 'https://www.autoscout24.es/lst/skoda/octavia' },
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia IV', market: 'ES', kind: 'anuncio', engine: '1.6 TDI 115 CV CR Active', year: 2020, km: 155600, price: 12999, source: 'AutoScout24.es', url: 'https://www.autoscout24.es/lst/skoda/octavia' },
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG', year: 2020, km: 108754, price: 19728, source: 'AutoScout24.es', url: 'https://www.autoscout24.es/lst/skoda/octavia' },
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Style', year: 2020, km: 97593, price: 15699, source: 'Coches.com (Madrid)', url: 'https://www.coches.com/coches-segunda-mano/skoda-octavia-diesel.htm' },
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia III', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV CR Ambition DSG', year: 2019, km: 122990, price: 14590, source: 'Coches.com (Zaragoza)', url: 'https://www.coches.com/coches-segunda-mano/skoda-octavia-diesel.htm' },
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 115 CV Ambition', year: 2023, km: 42604, price: 23900, source: 'Ocasionplus', url: 'https://www.ocasionplus.com/coches-segunda-mano/skoda/octavia' },
  { brand: 'Skoda', model: 'Octavia', gen: 'Octavia IV', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2020, km: 127539, price: 15442, source: 'coches.net (media de 42 uds. del año 2020)', url: 'https://www.coches.net/skoda/octavia/segunda-mano/2020/' },
  // Alemania (compra) — Combi IV, que completa la evidencia que ya existía.
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV First Edition Automatik', year: 2020, km: 83314, price: 20060, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-kombi-2-0.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV First Edition Automatik', year: 2020, km: 77348, price: 19770, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-kombi-2-0.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG Combi Tour', year: 2020, km: 115938, price: 14950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-kombi-2-0.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 200 CV RS Automatik', year: 2021, km: 72243, price: 24840, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-kombi-2-0.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG', year: 2021, km: 72176, price: 21499, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV', year: 2021, km: 60773, price: 24490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV DSG AHK', year: 2020, km: 97300, price: 20800, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-combi.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV First Edition', year: 2020, km: 131689, price: 17499, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-combi.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV First Edition DSG', year: 2021, km: 107290, price: 21500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-diesel-combi.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG HeadUp', year: 2021, km: 120887, price: 18990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-bis-25000-euro.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'DE', kind: 'anuncio', engine: '1.5 TSI 150 CV Tour', year: 2020, km: 105000, price: 14750, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-octavia-bis-25000-euro.html' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV CR Style', year: 2020, km: 146000, price: 14490, source: 'coches.net (Barcelona)', url: 'https://www.coches.net/skoda/octavia/segunda-mano/2020/' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'ES', kind: 'anuncio', engine: '1.6 TDI 115 CV CR Ambition', year: 2020, km: 205000, price: 12990, source: 'coches.net (Sevilla)', url: 'https://www.coches.net/skoda/octavia/segunda-mano/2020/' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'ES', kind: 'anuncio', engine: '1.6 TDI 115 CV CR Ambition', year: 2020, km: 163000, price: 12500, source: 'Autocasión (Cantabria)', url: 'https://www.autocasion.com/coches-segunda-mano/skoda-octavia-ocasion' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 115 CV Ambition 85 kW', year: 2022, km: 111843, price: 20900, source: 'Autocasión (Valladolid)', url: 'https://www.autocasion.com/coches-segunda-mano/skoda-octavia-ocasion' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 115 CV Ambition Plus Manual', year: 2024, km: 24734, price: 16999, source: 'Coches.com (Pontevedra)', url: 'https://www.coches.com/coches-segunda-mano/skoda-octavia-diesel.htm' },
  { brand: 'Skoda', model: 'Octavia Combi', gen: 'Octavia Combi IV', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 115 CV Ambition Manual', year: 2023, km: 90043, price: 20390, source: 'Coches.com (Valladolid)', url: 'https://www.coches.com/coches-segunda-mano/skoda-octavia-diesel.htm' },

  // ------------------------------------------------------- DACIA SANDERO III --
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway', year: 2021, km: 71424, price: 11970, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-schwarz-stepway.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2022, km: 110000, price: 11900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-schwarz-stepway.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2021, km: 83896, price: 11990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-schwarz-stepway.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Expression CVT', year: 2024, km: 13700, price: 15500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-berlin.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway', year: 2021, km: 47872, price: 15950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-berlin.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway CVT', year: 2022, km: 79957, price: 12790, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-berlin.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway', year: 2021, km: 49998, price: 14990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-berlin.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 SCe 65 CV Comfort', year: 2021, km: 53444, price: 13990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-berlin.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2021, km: 44700, price: 12400, source: 'autoanzeigen.de', url: 'https://www.autoanzeigen.de/auto/dacia/sandero' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 90 CV Comfort', year: 2021, km: 58366, price: 19325, source: 'autoanzeigen.de', url: 'https://www.autoanzeigen.de/auto/dacia/sandero' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'DE', kind: 'anuncio', engine: '1.0 TCe 100 CV Stepway Essential GLP', year: 2022, km: 20400, price: 15990, source: 'autoanzeigen.de', url: 'https://www.autoanzeigen.de/auto/dacia/sandero' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero II', market: 'DE', kind: 'anuncio', engine: '0.9 TCe 90 CV Stepway Essential', year: 2019, km: 60947, price: 9050, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/dacia-sandero-berlin.html' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero II', market: 'DE', kind: 'anuncio', engine: '0.9 TCe 90 CV Stepway', year: 2019, km: 45000, price: 9890, source: 'autoanzeigen.de', url: 'https://www.autoanzeigen.de/auto/dacia/sandero' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero II', market: 'ES', kind: 'anuncio', engine: '1.2 75 CV Ambiance', year: 2015, km: 75000, price: 6800, source: 'coches.net (Zaragoza, particular)', url: 'https://www.coches.net/dacia/sandero/segunda-mano/particulares/' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: 'sin detallar', year: 2021, km: 74000, price: 10200, source: 'coches.net (Murcia, particular)', url: 'https://www.coches.net/dacia/sandero/segunda-mano/particulares/' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2021, km: 92439, price: 11900, source: 'coches.net (Baleares)', url: 'https://www.coches.net/dacia/sandero/segunda-mano/baleares/' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 90 CV Comfort', year: 2022, km: 20000, price: 11500, source: 'coches.net (Baleares)', url: 'https://www.coches.net/dacia/sandero/segunda-mano/baleares/' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 100 CV Essential GLP', year: 2021, km: 65626, price: 11900, source: 'coches.net (Baleares)', url: 'https://www.coches.net/dacia/sandero/segunda-mano/baleares/' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2021, km: 48900, price: 12900, source: 'coches.net (Alicante)', url: 'https://www.coches.net/dacia/sandero/stepway/segunda-mano/' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2021, km: 106942, price: 10490, source: 'Coches.com (Madrid)', url: 'https://www.coches.com/coches-segunda-mano/dacia-sandero.htm' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Comfort', year: 2021, km: 44163, price: 11999, source: 'Coches.com (Madrid)', url: 'https://www.coches.com/coches-segunda-mano/dacia-sandero.htm' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero III', market: 'ES', kind: 'anuncio', engine: '1.0 TCe 90 CV Stepway Expression', year: 2023, km: 16309, price: 14199, source: 'Coches.com (Madrid)', url: 'https://www.coches.com/coches-segunda-mano/dacia-sandero.htm' },
  { brand: 'Dacia', model: 'Sandero', gen: 'Sandero II', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2019, km: 87909, price: 10643, source: 'coches.net (media de 1.308 uds., año más común 2019)', url: 'https://www.coches.net/dacia/sandero/segunda-mano/' },

  // --------------------------------------------------------- SKODA KODIAQ I --
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Sportline', year: 2021, km: 88663, price: 29430, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV 4x4 Ambition', year: 2017, km: 95662, price: 19260, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition Tour', year: 2023, km: 78619, price: 25613, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style 4x4', year: 2018, km: 106912, price: 21990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Tour DSG', year: 2022, km: 122552, price: 24890, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 200 CV Sportline 4x4 DSG', year: 2022, km: 82500, price: 34000, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 200 CV Sportline 4x4', year: 2022, km: 72164, price: 37950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition Clever', year: 2021, km: 81940, price: 27480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Tour DSG', year: 2022, km: 101000, price: 26490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 190 CV Style 4x4 Automatik', year: 2018, km: 96929, price: 22930, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style 4x4 Automatik', year: 2018, km: 73223, price: 22330, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG', year: 2018, km: 95044, price: 25490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel-automatik.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 200 CV Style 4x4 DSG Matrix', year: 2022, km: 58650, price: 33949, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG', year: 2022, km: 117000, price: 28890, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Tour 4x4 DSG', year: 2022, km: 80000, price: 31900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 200 CV Sportline 4x4 DSG', year: 2022, km: 123000, price: 31900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style', year: 2022, km: 86698, price: 27420, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '1.5 TSI 150 CV Ambition', year: 2022, km: 89500, price: 25900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '1.5 TSI 150 CV Clever DSG', year: 2022, km: 86124, price: 25470, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2022.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition DSG', year: 2023, km: 72500, price: 26390, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG', year: 2023, km: 75000, price: 29900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition DSG', year: 2023, km: 126600, price: 27900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Style DSG', year: 2023, km: 45597, price: 27895, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Sportline DSG', year: 2023, km: 81528, price: 32590, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '1.5 TSI 150 CV Style', year: 2023, km: 89451, price: 26900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition DSG', year: 2023, km: 87100, price: 25490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-2023.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Sportline', year: 2025, km: 50054, price: 39990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-jahreswagen.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq II', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Selection DSG', year: 2024, km: 47530, price: 39550, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/skoda-kodiaq-diesel.html' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 190 CV Sportline DSG 4x4', year: 2019, km: 92572, price: 27900, source: 'coches.net (Cádiz)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/2019/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV AdBlue 4x4', year: 2019, km: 47878, price: 31499, source: 'coches.net (Madrid)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/2019/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '1.4 TSI 150 CV DSG 4x4', year: 2018, km: 102188, price: 20800, source: 'coches.net (Barcelona)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/7_plazas/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 190 CV Scout DSG 4x4', year: 2020, km: 175862, price: 27490, source: 'coches.net (Málaga)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/7_plazas/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV AdBlue DSG 4x4', year: 2019, km: 94516, price: 25490, source: 'coches.net (Castellón)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/7_plazas/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV AdBlue DSG 4x4', year: 2019, km: 130049, price: 21490, source: 'coches.net (Valencia)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/7_plazas/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Ambition DSG 4x2', year: 2019, km: 184500, price: 16600, source: 'coches.net (Cuenca)', url: 'https://www.coches.net/skoda/segunda-mano/2019/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 240 CV RS DSG 4x4', year: 2019, km: 189100, price: 23900, source: 'coches.net (Madrid)', url: 'https://www.coches.net/skoda/kodiaq/rs/segunda-mano/' },
  { brand: 'Skoda', model: 'Kodiaq', gen: 'Kodiaq I', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2019, km: 82721, price: 27258, source: 'coches.net (media de 24 uds. del año 2019)', url: 'https://www.coches.net/skoda/kodiaq/segunda-mano/2019/' },

  // ------------------------------------------------------- BMW SERIE 3 G20 --
  // Alemania (compra) — sólo berlina; los Touring van a «Serie 3 Touring G21».
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Laser Leder', year: 2019, km: 114000, price: 24999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-g20.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Automatik M-Paket', year: 2019, km: 124400, price: 24290, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-g20.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV', year: 2020, km: 58115, price: 23499, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV SportLine', year: 2020, km: 168500, price: 20600, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Advantage', year: 2020, km: 99986, price: 22990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Sport Line', year: 2020, km: 86004, price: 23180, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Luxury Line', year: 2020, km: 79966, price: 23160, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Advantage', year: 2020, km: 83920, price: 22960, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Advantage', year: 2020, km: 87990, price: 22990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-2020.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Sport Line', year: 2020, km: 114350, price: 20900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-diesel-320d.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Advantage', year: 2020, km: 72765, price: 23499, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-diesel-320d.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive SportLine', year: 2020, km: 131228, price: 24999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-diesel-320d.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Luxury Line', year: 2020, km: 103192, price: 26170, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-320d-luxury.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Luxury Line', year: 2019, km: 141000, price: 22991, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-320d-luxury.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Advantage', year: 2020, km: 90419, price: 21380, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-3er-320d.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'DE', kind: 'anuncio', engine: '320i 184 CV Luxury Line', year: 2020, km: 121499, price: 22900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-320d-luxury.html' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 F30 LCI', market: 'DE', kind: 'anuncio', engine: '320d 190 CV M Sport Shadow', year: 2019, km: 112807, price: 21760, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-3er-320d.html' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Touring M Sport', year: 2021, km: 146500, price: 21990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-g20.html' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Touring Advantage', year: 2020, km: 67785, price: 26400, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-diesel-320d.html' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'DE', kind: 'anuncio', engine: '320d 190 CV Touring Luxury Line', year: 2020, km: 101500, price: 24400, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-320d-luxury.html' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Touring Luxury Line', year: 2020, km: 123966, price: 22650, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-320d-luxury.html' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Touring Luxury', year: 2020, km: 115000, price: 26599, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-320d-luxury.html' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'DE', kind: 'anuncio', engine: '320d 190 CV xDrive Touring M Sport', year: 2019, km: 135990, price: 25990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-320-3er-320d.html' },
  // España (venta).
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'ES', kind: 'anuncio', engine: '320d 190 CV Automático', year: 2019, km: 147500, price: 17280, source: 'coches.net (Pontevedra)', url: 'https://www.coches.net/bmw/serie_3/320d/segunda-mano/' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'ES', kind: 'anuncio', engine: '320d 190 CV', year: 2019, km: 144345, price: 23499, source: 'coches.net (Madrid)', url: 'https://www.coches.net/bmw/serie_3/320d/segunda-mano/madrid/' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'ES', kind: 'anuncio', engine: '320d 190 CV Automático', year: 2019, km: 145000, price: 18480, source: 'coches.net (Pontevedra, particular)', url: 'https://www.coches.net/bmw/serie_3/segunda-mano/particulares/' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'ES', kind: 'anuncio', engine: '320d 190 CV', year: 2019, km: 121753, price: 25890, source: 'Milanuncios (Leganés, Madrid)', url: 'https://www.milanuncios.com/bmw-de-segunda-mano/320d.htm' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20', market: 'ES', kind: 'anuncio', engine: 'diésel sin detallar', year: 2019, km: 123000, price: 17800, source: 'Milanuncios (Guadalajara, particular)', url: 'https://www.milanuncios.com/bmw-de-segunda-mano/bmw-serie-3-del-2019.htm' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 F30 LCI', market: 'ES', kind: 'anuncio', engine: '320d 184 CV EfficientDynamics', year: 2016, km: 107500, price: 17500, source: 'coches.net (Madrid, particular)', url: 'https://www.coches.net/bmw/serie_3/segunda-mano/particulares/' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring G21', market: 'ES', kind: 'anuncio', engine: '320d 190 CV xDrive Touring Automático', year: 2019, km: 101600, price: 27900, source: 'coches.net (Madrid)', url: 'https://www.coches.net/bmw/serie_3/320d/segunda-mano/madrid/' },

  // ------------------------------------------------------- BMW SERIE 1 F20 --
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M Sport', year: 2018, km: 107724, price: 18950, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Sport Line', year: 2015, km: 88000, price: 15990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Advantage Automatik', year: 2018, km: 112400, price: 16990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Automatik', year: 2018, km: 116381, price: 15240, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Automatik 5 puertas', year: 2018, km: 91500, price: 17900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Sport Line', year: 2018, km: 89429, price: 16480, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M Sport', year: 2018, km: 74400, price: 16900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M-Paket Automatik', year: 2018, km: 133000, price: 17990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M-Paket', year: 2016, km: 97000, price: 14800, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV F20 M-Paket', year: 2017, km: 106000, price: 16000, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV F20 Automatik', year: 2017, km: 169700, price: 11990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV F20 Facelift Automatik', year: 2017, km: 117136, price: 14800, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118i 136 CV F20 Sport Line Automatik', year: 2015, km: 70000, price: 10900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '116i 109 CV F20 LCI Advantage', year: 2015, km: 123200, price: 8290, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20-facelift.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118i 150 CV F20 M-Paket Facelift', year: 2018, km: 148000, price: 13000, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20-facelift.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Facelift Automatik', year: 2015, km: 220000, price: 10500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20-facelift.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118i 136 CV F20 Facelift', year: 2016, km: 150000, price: 8400, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-f20-facelift.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV F20 Sport Line', year: 2018, km: 140000, price: 11990, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-diesel-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV F20 Automatik', year: 2015, km: 90262, price: 13200, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-diesel-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV xDrive F20', year: 2015, km: 105000, price: 12600, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-diesel-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Sport F20', year: 2017, km: 92000, price: 15200, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-diesel-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'DE', kind: 'anuncio', engine: '118d 150 CV F20 M Sport Automatik', year: 2019, km: 97000, price: 19900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-1er-reihe-diesel-f20.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M Sport', year: 2022, km: 51800, price: 25980, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Sport Line Automatik', year: 2021, km: 138697, price: 17645, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV Sport Line', year: 2020, km: 96982, price: 19590, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-automatik-118d.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV', year: 2021, km: 98158, price: 20370, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M Sport', year: 2022, km: 80000, price: 23900, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M-Paket', year: 2022, km: 76564, price: 21290, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M-Paket', year: 2020, km: 63200, price: 25500, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M-Paket Automatik', year: 2022, km: 77700, price: 25490, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'DE', kind: 'anuncio', engine: '118d 150 CV M-Paket', year: 2021, km: 80500, price: 20999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/bmw-118-118d-m-paket.html' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'ES', kind: 'anuncio', engine: '116d 116 CV', year: 2018, km: 72355, price: 18490, source: 'coches.net (Madrid)', url: 'https://www.coches.net/bmw/serie_1/segunda-mano/2018/' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'ES', kind: 'anuncio', engine: '118d 150 CV', year: 2018, km: 163807, price: 18890, source: 'coches.net (Murcia)', url: 'https://www.coches.net/bmw/serie_1/118d/segunda-mano/murcia/' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F40', market: 'ES', kind: 'anuncio', engine: '118d 150 CV', year: 2021, km: 122700, price: 16450, source: 'coches.net (Barcelona)', url: 'https://www.coches.net/bmw/serie_1/118d/segunda-mano/barcelona/' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'ES', kind: 'anuncio', engine: '118d diésel', year: 2018, km: 228968, price: 12990, source: 'Milanuncios (Loeches, Madrid)', url: 'https://www.milanuncios.com/coches-de-segunda-mano/bmw-118d.htm' },
  { brand: 'BMW', model: 'Serie 1', gen: 'Serie 1 F20 LCI', market: 'ES', kind: 'media_portal', engine: 'todas las motorizaciones', year: 2018, km: 129382, price: 16175, source: 'coches.net (media de 142 uds. del año 2018)', url: 'https://www.coches.net/bmw/serie_1/segunda-mano/2018/' },

  // Contraste aportado por el usuario (24-09-2026): anuncio alemán + comparables españoles legibles.
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII (5G)', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline', year: 2013, km: 94300, price: 13450, source: 'mobile.de (Forst)', url: 'https://www.mobile.de/es/veh%C3%ADculos/detalles.html?id=44350265897440' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII (5G)', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport', year: 2015, km: 127011, price: 16900, source: 'Milanuncios (Santiago de Compostela)', url: 'https://www.milanuncios.com/coches-de-segunda-mano/golf-tdi-150cv.htm' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII (5G)', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Lounge', year: 2015, km: 210000, price: 10990, source: 'Milanuncios (Asturias)', url: 'https://www.milanuncios.com/coches-de-segunda-mano/volkswagen-golf-vii-2-0-tdi-r-line-150cv.htm' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport', year: 2017, km: 80500, price: 17490, source: 'Milanuncios (Granada)', url: 'https://www.milanuncios.com/volkswagen-de-segunda-mano/volkswagen-golf-sport-2-0-tdi-110kw-150cv-453447345.htm' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport DSG', year: 2019, km: 96000, price: 18500, source: 'Milanuncios (Mejorada del Campo, Madrid)', url: 'https://www.milanuncios.com/volkswagen-de-segunda-mano/volkswagen-golf-sport-2-0-tdi-110kw-150c-615450368.htm' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'ES', kind: 'anuncio', engine: '2.0 TDI 150 CV Sport R-Line DSG', year: 2019, km: 101128, price: 21990, source: 'Milanuncios (Santiago de Compostela)', url: 'https://www.milanuncios.com/volkswagen-de-segunda-mano/volkswagen-golf-sport-rline-2-0-tdi-110k-611047196.htm' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline DSG', year: 2019, km: 86461, price: 18430, source: 'mobile.de (Autohero)', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-highline.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline', year: 2019, km: 88470, price: 16999, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-highline.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline DSG', year: 2019, km: 119310, price: 17250, source: 'mobile.de', url: 'https://suchen.mobile.de/auto/volkswagen-golf-tdi-highline.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline DSG', year: 2019, km: 140760, price: 17480, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/volkswagen/golf-(alle)/re_2019' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline R-Line DSG', year: 2019, km: 98278, price: 19950, source: 'AutoScout24.de (Eisenach)', url: 'https://www.autoscout24.de/lst/volkswagen/golf-(alle)/re_2019' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV IQ.DRIVE DSG', year: 2019, km: 107726, price: 16990, source: 'mobile.de (Autohero)', url: 'https://suchen.mobile.de/auto/volkswagen-golf-diesel-kombi-2-0.html' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV IQ.DRIVE DSG', year: 2019, km: 81000, price: 16890, source: 'AutoScout24.de (Rastede)', url: 'https://www.autoscout24.de/lst/volkswagen/golf-alle/ft_diesel' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Join', year: 2019, km: 138500, price: 14950, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/volkswagen/golf' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Comfortline', year: 2019, km: 132450, price: 14749, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/c/volkswagen-golf-bis-15000-euro' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline', year: 2019, km: 116000, price: 14950, source: 'AutoScout24.de', url: 'https://www.autoscout24.de/lst/c/volkswagen-golf-bis-15000-euro' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII.5', market: 'DE', kind: 'anuncio', engine: '2.0 TDI 150 CV Highline', year: 2019, km: 155000, price: 14380, source: 'AutoScout24.de (Berlin)', url: 'https://www.autoscout24.de/lst/c/volkswagen-golf-bis-15000-euro' },
];

// ---------------------------------------------------------------------------
//  ESTADÍSTICOS
// ---------------------------------------------------------------------------
const quantile = (sorted, q) => {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
};

const key = (brand, model, gen, market) => `${brand}|${model}|${gen}|${market}`;

/** Potencia declarada en el texto del motor; null si la fuente dice «todas». */
/**
 * Potencia declarada en el texto del motor. Acepta «150 CV», «150 PS» y las
 * nomenclaturas comerciales tipo «180H» o «125H». null si la fuente no la
 * detalla (medias de portal con «todas»).
 */
export const cvOf = (obs) => {
  if (obs.cv) return Number(obs.cv);
  const m = /(\d{2,3})\s*(?:CV|cv|PS|hp|H\b)/.exec(obs.engine || '');
  return m ? Number(m[1]) : null;
};

/**
 * Combustible deducido del texto del motor. Importa tanto como la potencia:
 * un Corolla 1.8 gasolina no vale lo que el 1.8 híbrido, y mezclarlos era el
 * mayor error del ajuste.
 */
export const fuelOf = (obs) => {
  if (obs.fuel) return obs.fuel;
  const t = (obs.engine || '').toLowerCase();
  // El orden importa: el enchufable y el microhíbrido se detectan antes que el
  // híbrido genérico, porque sus nombres también contienen «hybrid».
  if (/plug-?in|phev/.test(t)) return 'Híbrido enchufable';
  // Un mild-hybrid (48 V) sigue siendo de combustible: en el catálogo se
  // clasifica aparte porque su precio de reventa no es el del híbrido completo.
  if (/\b48v\b|mild[- ]?hyb|mhev|microhíbrido|microhibrido/.test(t)) return 'Microhíbrido';
  if (/hybrid|híbrido|híbrida|\d{2,3}h\b|hev/.test(t)) return 'Híbrido';
  // Cubre también las nomenclaturas Mercedes/BMW: «A 200 d», «320d», «C 220 d».
  if (/tdi|dci|crdi|diesel|diésel|bluehd|\d\s+d\b|\d{3}d\b|om654/.test(t)) return 'Diésel';
  // «T-GDi» y «GDi» son Hyundai/Kia; sin esta regla se quedaban sin combustible
  // y no casaban con ninguna sonda del catálogo.
  if (/tsi|tfsi|gasolina|benzin|tce|t-?gdi|\bgdi\b|cvvt|scept|skyactiv-g|\bmpi\b/.test(t)) return 'Gasolina';
  if (/\bglp\b|autogas|\blpg\b|bifuel/.test(t)) return 'GLP';
  if (/\bg-?tec\b|\bcng\b|gas natural/.test(t)) return 'GNC';
  return null;
};

/**
 * Resumen de la evidencia disponible para una generación y mercado.
 *
 * Devuelve la banda de precio NORMALIZADA al kilometraje de referencia, para
 * que sea comparable con el resto de la ficha. Con pocas observaciones la
 * banda se abre (min-máx) en vez de usar cuartiles: con dos datos no se puede
 * fingir precisión.
 *
 * @param cv si se indica, se descartan los anuncios de otra potencia
 *           (un GTD de 184 CV no vale lo que un TDI de 150 CV).
 */
export function evidenceStats(brand, model, gen, market, kmRef = 120000, cv = null) {
  const all = MARKET_OBSERVATIONS.filter((o) => key(o.brand, o.model, o.gen, o.market) === key(brand, model, gen, market));
  // Con `cv` indicado se exigen anuncios DE ESA POTENCIA. Las medias de portal
  // («todas») no sirven aquí: mezclan motores y falsearían la variante.
  const rows = cv
    ? all.filter((o) => { const c = cvOf(o); return c !== null && Math.abs(c - cv) <= Math.max(10, cv * 0.1); })
    : all;
  const used = rows;
  if (!used.length) return null;
  const normalized = used.map((o) => normalizeKm(o.price, o.km, kmRef));
  const sorted = [...normalized].sort((a, b) => a - b);
  const few = used.length < 4;
  const med = quantile(sorted, 0.5);
  // Con 1 o 2 anuncios no se puede deducir una dispersión real: se abre una
  // banda mínima alrededor de la mediana en vez de devolver un punto único.
  const minSpread = used.length === 1 ? 0.10 : used.length <= 3 ? 0.07 : 0;
  return {
    n: used.length,
    nTotal: all.length,
    capturedAt: EVIDENCE_CAPTURED_AT,
    min: Math.round(sorted[0]),
    p25: Math.round(Math.min(few ? sorted[0] : quantile(sorted, 0.25), med * (1 - minSpread))),
    median: Math.round(med),
    p75: Math.round(Math.max(few ? sorted[sorted.length - 1] : quantile(sorted, 0.75), med * (1 + minSpread))),
    max: Math.round(sorted[sorted.length - 1]),
    kmRef,
    wide: few,
    sources: [...new Set(used.map((r) => r.source))],
    observations: used.map(({ brand: _b, model: _m, gen: _g, market: _mk, ...rest }) => rest),
  };
}

/** Índice rápido: cuántas generaciones del catálogo tienen evidencia real. */
export function evidenceCoverage() {
  const gens = new Map();
  MARKET_OBSERVATIONS.forEach((o) => {
    const k = `${o.brand} ${o.model} ${o.gen}`;
    if (!gens.has(k)) gens.set(k, { DE: 0, ES: 0 });
    gens.get(k)[o.market] += 1;
  });
  return gens;
}
