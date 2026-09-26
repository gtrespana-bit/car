// Modelos NUEVOS a investigar (no estaban en el catálogo) y generaciones más antiguas.
// Los dos scrapers (autoscout24.de y milanuncios) los descargan además de los grupos
// que ya existen; opportunities.mjs usa co2/newPrice para el impuesto de matriculación.
//
// Criterios de selección (por qué pueden ganar dinero importándolos):
//  · Premium alemán diésel 150-260 CV: en España se paga más que en Alemania.
//  · Etiqueta ECO/CERO (híbridos, enchufables, eléctricos): en España valen más
//    (zonas de bajas emisiones, ayudas) y los enchufables no pagan matriculación.
//  · Todoterrenos/SUV grandes y furgonetas vivienda: muy demandados en España.
//  · Generaciones anteriores (2013-2018): mucho kilometraje en DE, precio bajo.
// Excluidos a propósito por fabricarse en España (no compensa): Seat/Cupra,
// Mercedes Clase V/Vito (Vitoria), Ford Kuga (Valencia), Audi A1, VW Polo/T-Cross,
// Renault Captur/Mégane, Peugeot 2008, Opel Corsa, Citroën C4.
//
// co2: g/km homologado (NEDC hasta 2020, WLTP después) de la versión indicada; newPrice:
// precio nuevo aproximado. Ambos son APROXIMADOS y solo sirven para el impuesto de
// matriculación (0 % ≤120 g, 4,75 % ≤160, 9,75 % ≤200, 14,75 % >200).
// as: [marca, modelo, carrocería] en autoscout24.de (5 = Kombi, 6 = Limousine).
// ban: palabras que descartan el anuncio (otra carrocería/versión) en ambos portales.
// word: palabra que debe aparecer en el anuncio de milanuncios.
export const CANDIDATES = [
  // ── Generaciones anteriores de premium alemán ──
  { brand: 'Mercedes-Benz', model: 'Clase E', gen: 'Clase E W212', fuel: 'Diésel', cv: 170, y0: 2013, y1: 2016, engine: 'E 220 BlueTEC 170 CV diésel', co2: 125, newPrice: 47000, as: ['mercedes-benz', 'e-klasse', 6], ban: 't-modell|kombi|estate|coup|cabrio', word: 'clase e' },
  { brand: 'Mercedes-Benz', model: 'Clase C', gen: 'Clase C W205 pre', fuel: 'Diésel', cv: 170, y0: 2014, y1: 2018, engine: 'C 220 d 170 CV diésel', co2: 108, newPrice: 42000, as: ['mercedes-benz', 'c-klasse', 6], ban: 't-modell|kombi|estate|coup|cabrio', word: 'clase c' },
  { brand: 'Mercedes-Benz', model: 'GLC', gen: 'GLC X253 pre', fuel: 'Diésel', cv: 170, y0: 2015, y1: 2019, engine: 'GLC 220 d 170 CV diésel', co2: 143, newPrice: 50000, as: ['mercedes-benz', 'glc', null], ban: 'coup', word: 'glc' },
  { brand: 'Mercedes-Benz', model: 'GLA', gen: 'GLA X156', fuel: 'Diésel', cv: 136, y0: 2015, y1: 2019, engine: 'GLA 200 d 136 CV diésel', co2: 114, newPrice: 36000, as: ['mercedes-benz', 'gla', null], ban: 'amg 45', word: 'gla' },
  { brand: 'Mercedes-Benz', model: 'CLA', gen: 'CLA C117', fuel: 'Diésel', cv: 136, y0: 2015, y1: 2019, engine: 'CLA 200 d 136 CV diésel', co2: 108, newPrice: 36000, as: ['mercedes-benz', 'cla', null], ban: 'shooting', word: 'cla' },
  { brand: 'Mercedes-Benz', model: 'CLA', gen: 'CLA C118', fuel: 'Diésel', cv: 150, y0: 2019, y1: 2023, engine: 'CLA 200 d 150 CV diésel', co2: 125, newPrice: 40000, as: ['mercedes-benz', 'cla', null], ban: 'shooting', word: 'cla' },
  { brand: 'Mercedes-Benz', model: 'GLB', gen: 'GLB X247', fuel: 'Diésel', cv: 150, y0: 2020, y1: 2023, engine: 'GLB 200 d 150 CV diésel', co2: 140, newPrice: 44000, as: ['mercedes-benz', 'glb', null], ban: '', word: 'glb' },
  { brand: 'Mercedes-Benz', model: 'Clase B', gen: 'Clase B W247', fuel: 'Diésel', cv: 150, y0: 2019, y1: 2023, engine: 'B 200 d 150 CV diésel', co2: 125, newPrice: 38000, as: ['mercedes-benz', 'b-klasse', null], ban: '', word: 'clase b' },
  { brand: 'Mercedes-Benz', model: 'GLE', gen: 'GLE W166', fuel: 'Diésel', cv: 204, y0: 2015, y1: 2018, engine: 'GLE 250 d 204 CV diésel', co2: 149, newPrice: 62000, as: ['mercedes-benz', 'gle', null], ban: 'coup', word: 'gle' },
  { brand: 'Mercedes-Benz', model: 'GLE', gen: 'GLE V167', fuel: 'Diésel', cv: 245, y0: 2019, y1: 2022, engine: 'GLE 300 d 245 CV diésel', co2: 175, newPrice: 72000, as: ['mercedes-benz', 'gle', null], ban: 'coup', word: 'gle' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 F30 LCI', fuel: 'Diésel', cv: 190, y0: 2015, y1: 2019, engine: '320d 190 CV diésel', co2: 112, newPrice: 42000, as: ['bmw', '3er', 6], ban: 'touring|\\bgt\\b|gran turismo', word: 'serie 3' },
  { brand: 'BMW', model: 'Serie 3 Touring', gen: 'Serie 3 Touring F31', fuel: 'Diésel', cv: 190, y0: 2015, y1: 2019, engine: '320d Touring 190 CV diésel', co2: 117, newPrice: 44000, as: ['bmw', '3er', 5], ban: '\\bgt\\b|gran turismo', word: 'touring' },
  { brand: 'BMW', model: 'Serie 5', gen: 'Serie 5 F10', fuel: 'Diésel', cv: 190, y0: 2014, y1: 2016, engine: '520d 190 CV diésel', co2: 119, newPrice: 48000, as: ['bmw', '5er', 6], ban: 'touring|\\bgt\\b|gran turismo', word: 'serie 5' },
  { brand: 'BMW', model: 'X3', gen: 'X3 F25', fuel: 'Diésel', cv: 190, y0: 2014, y1: 2017, engine: 'xDrive20d 190 CV diésel', co2: 139, newPrice: 48000, as: ['bmw', 'x3', null], ban: '', word: 'x3' },
  { brand: 'BMW', model: 'X4', gen: 'X4 F26', fuel: 'Diésel', cv: 190, y0: 2015, y1: 2018, engine: 'xDrive20d X4 190 CV diésel', co2: 139, newPrice: 52000, as: ['bmw', 'x4', null], ban: '', word: 'x4' },
  { brand: 'BMW', model: 'X4', gen: 'X4 G02', fuel: 'Diésel', cv: 190, y0: 2018, y1: 2022, engine: 'xDrive20d X4 G02 190 CV diésel', co2: 145, newPrice: 56000, as: ['bmw', 'x4', null], ban: '', word: 'x4' },
  { brand: 'BMW', model: 'X5', gen: 'X5 F15', fuel: 'Diésel', cv: 258, y0: 2014, y1: 2018, engine: 'xDrive30d 258 CV diésel', co2: 157, newPrice: 70000, as: ['bmw', 'x5', null], ban: '', word: 'x5' },
  { brand: 'BMW', model: 'X5', gen: 'X5 G05', fuel: 'Diésel', cv: 265, y0: 2019, y1: 2022, engine: 'xDrive30d G05 265 CV diésel', co2: 170, newPrice: 80000, as: ['bmw', 'x5', null], ban: '', word: 'x5' },
  { brand: 'BMW', model: 'Serie 4 Gran Coupé', gen: 'Serie 4 Gran Coupé F36', fuel: 'Diésel', cv: 190, y0: 2015, y1: 2020, engine: '420d Gran Coupé 190 CV diésel', co2: 117, newPrice: 48000, as: ['bmw', '4er', null], ban: 'cabrio', word: 'gran coup' },
  { brand: 'BMW', model: 'Serie 2 Active Tourer', gen: 'Serie 2 AT F45', fuel: 'Diésel', cv: 150, y0: 2015, y1: 2021, engine: '218d Active Tourer 150 CV diésel', co2: 112, newPrice: 34000, as: ['bmw', '2er', null], ban: 'gran tourer|coup|cabrio|gran coup', word: 'active tourer' },
  { brand: 'Audi', model: 'Q5', gen: 'Q5 8R', fuel: 'Diésel', cv: 190, y0: 2014, y1: 2017, engine: '2.0 TDI quattro 190 CV', co2: 140, newPrice: 50000, as: ['audi', 'q5', null], ban: 'sportback|hybrid', word: 'q5' },
  { brand: 'Audi', model: 'A4', gen: 'A4 B9', fuel: 'Diésel', cv: 150, y0: 2016, y1: 2020, engine: 'A4 2.0 TDI 150 CV', co2: 106, newPrice: 38000, as: ['audi', 'a4', 6], ban: 'avant|allroad', word: 'a4' },
  { brand: 'Audi', model: 'A6', gen: 'A6 C7', fuel: 'Diésel', cv: 190, y0: 2015, y1: 2018, engine: 'A6 2.0 TDI ultra 190 CV', co2: 114, newPrice: 50000, as: ['audi', 'a6', null], ban: 'allroad', word: 'a6' },
  { brand: 'Audi', model: 'A5 Sportback', gen: 'A5 Sportback F5', fuel: 'Diésel', cv: 190, y0: 2017, y1: 2020, engine: 'A5 Sportback 2.0 TDI 190 CV', co2: 117, newPrice: 46000, as: ['audi', 'a5', null], ban: 'cabrio|coup(?!.*sportback)', word: 'sportback' },
  { brand: 'Audi', model: 'A3', gen: 'A3 8Y', fuel: 'Diésel', cv: 150, y0: 2020, y1: 2023, engine: 'A3 35 TDI 150 CV', co2: 118, newPrice: 34000, as: ['audi', 'a3', null], ban: 'limousine|sedan', word: 'a3' },
  { brand: 'Audi', model: 'Q7', gen: 'Q7 4M 50', fuel: 'Diésel', cv: 272, y0: 2016, y1: 2019, engine: 'Q7 3.0 TDI 272 CV', co2: 163, newPrice: 75000, as: ['audi', 'q7', null], ban: 'e-tron', word: 'q7' },
  { brand: 'Volkswagen', model: 'Golf', gen: 'Golf VII (5G)', fuel: 'Diésel', cv: 150, y0: 2013, y1: 2016, engine: '2.0 TDI 150 CV', co2: 106, newPrice: 28000, as: ['volkswagen', 'golf', null], ban: 'variant|sportsvan|\\bgtd\\b|alltrack|plus', word: 'golf' },
  { brand: 'Volkswagen', model: 'Tiguan', gen: 'Tiguan I', fuel: 'Diésel', cv: 150, y0: 2013, y1: 2016, engine: '2.0 TDI 150 CV Tiguan I', co2: 139, newPrice: 34000, as: ['volkswagen', 'tiguan', null], ban: 'allspace', word: 'tiguan' },
  { brand: 'Volkswagen', model: 'Multivan', gen: 'Multivan T6', fuel: 'Diésel', cv: 150, y0: 2016, y1: 2021, engine: 'Multivan 2.0 TDI 150 CV', co2: 170, newPrice: 50000, as: ['volkswagen', 't6-multivan', null], ban: 'california|kasten|transporter', word: 'multivan' },
  { brand: 'Volkswagen', model: 'California', gen: 'California T6', fuel: 'Diésel', cv: 150, y0: 2016, y1: 2021, engine: 'California 2.0 TDI 150 CV', co2: 185, newPrice: 58000, as: ['volkswagen', 't6-california', null], ban: 'kasten', word: 'california' },
  // ── Todoterreno / SUV grande ──
  { brand: 'Porsche', model: 'Macan', gen: 'Macan 95B', fuel: 'Gasolina', cv: 252, y0: 2016, y1: 2021, engine: 'Macan 2.0 252 CV gasolina', co2: 185, newPrice: 62000, as: ['porsche', 'macan', null], ban: '\\bgts\\b|turbo|\\bs\\b', word: 'macan' },
  { brand: 'Porsche', model: 'Cayenne', gen: 'Cayenne 92A', fuel: 'Diésel', cv: 262, y0: 2015, y1: 2017, engine: 'Cayenne Diesel 262 CV', co2: 173, newPrice: 80000, as: ['porsche', 'cayenne', null], ban: '\\bs\\b|coup', word: 'cayenne' },
  { brand: 'Land Rover', model: 'Range Rover Evoque', gen: 'Evoque L538', fuel: 'Diésel', cv: 150, y0: 2016, y1: 2018, engine: 'Evoque 2.0 TD4 150 CV diésel', co2: 125, newPrice: 42000, as: ['land-rover', 'range-rover-evoque', null], ban: 'cabrio', word: 'evoque' },
  { brand: 'Land Rover', model: 'Discovery Sport', gen: 'Discovery Sport L550', fuel: 'Diésel', cv: 150, y0: 2016, y1: 2019, engine: 'Discovery Sport 2.0 TD4 150 CV diésel', co2: 139, newPrice: 44000, as: ['land-rover', 'discovery-sport', null], ban: '', word: 'discovery sport' },
  { brand: 'Land Rover', model: 'Range Rover Sport', gen: 'Range Rover Sport L494', fuel: 'Diésel', cv: 249, y0: 2015, y1: 2018, engine: 'Range Rover Sport 3.0 SDV6 249 CV diésel', co2: 185, newPrice: 85000, as: ['land-rover', 'range-rover-sport', null], ban: 'svr|phev', word: 'range rover sport' },
  { brand: 'Volvo', model: 'XC90', gen: 'XC90 II', fuel: 'Diésel', cv: 235, y0: 2015, y1: 2019, engine: 'XC90 D5 AWD 235 CV diésel', co2: 152, newPrice: 65000, as: ['volvo', 'xc90', null], ban: 't8|recharge', word: 'xc90' },
  { brand: 'Volvo', model: 'V60', gen: 'V60 II', fuel: 'Diésel', cv: 190, y0: 2018, y1: 2020, engine: 'V60 D4 190 CV diésel', co2: 117, newPrice: 44000, as: ['volvo', 'v60', 5], ban: 'cross country|t6|t8', word: 'v60' },
  { brand: 'Mazda', model: 'CX-5', gen: 'CX-5 KF', fuel: 'Diésel', cv: 150, y0: 2017, y1: 2021, engine: 'CX-5 2.2 Skyactiv-D 150 CV diésel', co2: 132, newPrice: 32000, as: ['mazda', 'cx-5', null], ban: '', word: 'cx-5' },
  { brand: 'Toyota', model: 'Land Cruiser', gen: 'Land Cruiser J150', fuel: 'Diésel', cv: 177, y0: 2015, y1: 2020, engine: 'Land Cruiser 2.8 D-4D 177 CV diésel', co2: 194, newPrice: 50000, as: ['toyota', 'land-cruiser', null], ban: 'v8|200', word: 'land cruiser' },
  { brand: 'Mini', model: 'Countryman', gen: 'Countryman F60', fuel: 'Diésel', cv: 150, y0: 2017, y1: 2021, engine: 'Cooper D Countryman 150 CV diésel', co2: 118, newPrice: 34000, as: ['mini', 'mini-countryman', null], ban: 'hybrid|\\bse\\b', word: 'countryman' },
  // ── Híbridos (etiqueta ECO) ──
  { brand: 'Toyota', model: 'C-HR', gen: 'C-HR I', fuel: 'Híbrido', cv: 122, y0: 2017, y1: 2022, engine: 'C-HR 1.8 Hybrid 122 CV', co2: 86, newPrice: 28000, as: ['toyota', 'c-hr', null], ban: '', word: 'c-hr' },
  { brand: 'Toyota', model: 'Yaris', gen: 'Yaris III', fuel: 'Híbrido', cv: 100, y0: 2015, y1: 2020, engine: 'Yaris 1.5 Hybrid 100 CV', co2: 75, newPrice: 19000, as: ['toyota', 'yaris', null], ban: 'cross|\\bgr\\b', word: 'yaris' },
  { brand: 'Toyota', model: 'Yaris', gen: 'Yaris IV', fuel: 'Híbrido', cv: 116, y0: 2020, y1: 2023, engine: 'Yaris 1.5 Hybrid 116 CV', co2: 92, newPrice: 22000, as: ['toyota', 'yaris', null], ban: 'cross|\\bgr\\b', word: 'yaris' },
  { brand: 'Toyota', model: 'Corolla', gen: 'Corolla E210', fuel: 'Híbrido', cv: 122, y0: 2019, y1: 2022, engine: 'Corolla 1.8 Hybrid 122 CV', co2: 101, newPrice: 26000, as: ['toyota', 'corolla', null], ban: 'touring|kombi|\\bts\\b|sedan|limousine', word: 'corolla' },
  { brand: 'Toyota', model: 'RAV4', gen: 'RAV4 IV', fuel: 'Híbrido', cv: 197, y0: 2016, y1: 2018, engine: 'RAV4 2.5 Hybrid 197 CV', co2: 118, newPrice: 34000, as: ['toyota', 'rav-4', null], ban: '', word: 'rav4' },
  { brand: 'Lexus', model: 'NX', gen: 'NX 300h', fuel: 'Híbrido', cv: 197, y0: 2015, y1: 2021, engine: 'NX 300h 197 CV Hybrid', co2: 121, newPrice: 45000, as: ['lexus', 'nx-300', null], ban: '', word: 'nx' },
  { brand: 'Lexus', model: 'UX', gen: 'UX 250h', fuel: 'Híbrido', cv: 184, y0: 2019, y1: 2023, engine: 'UX 250h 184 CV Hybrid', co2: 105, newPrice: 38000, as: ['lexus', 'ux-250h', null], ban: '', word: 'ux' },
  { brand: 'Lexus', model: 'CT', gen: 'CT 200h', fuel: 'Híbrido', cv: 136, y0: 2014, y1: 2020, engine: 'CT 200h 136 CV Hybrid', co2: 88, newPrice: 30000, as: ['lexus', 'ct-200h', null], ban: '', word: 'ct' },
  { brand: 'Kia', model: 'Niro', gen: 'Niro DE HEV', fuel: 'Híbrido', cv: 141, y0: 2017, y1: 2021, engine: 'Niro 1.6 GDi Hybrid 141 CV', co2: 88, newPrice: 27000, as: ['kia', 'niro', null], ban: 'plug|phev|e-niro|elektro', word: 'niro' },
  { brand: 'Hyundai', model: 'Ioniq', gen: 'Ioniq HEV', fuel: 'Híbrido', cv: 141, y0: 2017, y1: 2021, engine: 'Ioniq 1.6 GDi Hybrid 141 CV', co2: 79, newPrice: 26000, as: ['hyundai', 'ioniq', null], ban: 'plug|phev|elektro|electric', word: 'ioniq' },
  { brand: 'Hyundai', model: 'Kona', gen: 'Kona HEV', fuel: 'Híbrido', cv: 141, y0: 2020, y1: 2022, engine: 'Kona 1.6 GDi Hybrid 141 CV', co2: 99, newPrice: 27000, as: ['hyundai', 'kona', null], ban: 'elektro|electric', word: 'kona' },
  // ── Enchufables (etiqueta CERO, sin impuesto de matriculación) ──
  { brand: 'Mitsubishi', model: 'Outlander', gen: 'Outlander PHEV III', fuel: 'Híbrido enchufable', cv: 224, y0: 2016, y1: 2021, engine: 'Outlander PHEV Plug-in Hybrid 224 CV', co2: 46, newPrice: 42000, as: ['mitsubishi', 'outlander', null], ban: '', word: 'outlander' },
  { brand: 'BMW', model: 'Serie 3', gen: 'Serie 3 G20 330e', fuel: 'Híbrido enchufable', cv: 292, y0: 2019, y1: 2022, engine: '330e Plug-in Hybrid 292 CV', co2: 39, newPrice: 50000, as: ['bmw', '3er', null], ban: '', word: '330e' },
  { brand: 'BMW', model: 'X1', gen: 'X1 F48 25e', fuel: 'Híbrido enchufable', cv: 220, y0: 2020, y1: 2022, engine: 'xDrive25e Plug-in Hybrid 220 CV', co2: 43, newPrice: 48000, as: ['bmw', 'x1', null], ban: '', word: '25e' },
  { brand: 'BMW', model: 'Serie 2 Active Tourer', gen: 'Serie 2 AT F45 225xe', fuel: 'Híbrido enchufable', cv: 224, y0: 2016, y1: 2021, engine: '225xe Plug-in Hybrid 224 CV', co2: 46, newPrice: 42000, as: ['bmw', '2er', null], ban: 'gran tourer', word: '225xe' },
  { brand: 'Mercedes-Benz', model: 'Clase A', gen: 'Clase A W177 250e', fuel: 'Híbrido enchufable', cv: 218, y0: 2020, y1: 2023, engine: 'A 250 e Plug-in Hybrid 218 CV', co2: 30, newPrice: 44000, as: ['mercedes-benz', 'a-klasse', null], ban: 'limousine|sedan', word: '250e' },
  { brand: 'Mercedes-Benz', model: 'GLC', gen: 'GLC X253 300e', fuel: 'Híbrido enchufable', cv: 320, y0: 2020, y1: 2022, engine: 'GLC 300 e Plug-in Hybrid 320 CV', co2: 55, newPrice: 62000, as: ['mercedes-benz', 'glc', null], ban: 'coup', word: '300e' },
  { brand: 'Volvo', model: 'XC60', gen: 'XC60 II T8', fuel: 'Híbrido enchufable', cv: 390, y0: 2018, y1: 2021, engine: 'XC60 T8 Plug-in Hybrid 390 CV', co2: 55, newPrice: 70000, as: ['volvo', 'xc60', null], ban: '', word: 't8' },
  { brand: 'Volvo', model: 'XC40', gen: 'XC40 T5 Recharge', fuel: 'Híbrido enchufable', cv: 262, y0: 2020, y1: 2023, engine: 'XC40 T5 Recharge Plug-in Hybrid 262 CV', co2: 47, newPrice: 48000, as: ['volvo', 'xc40', null], ban: '', word: 'xc40' },
  { brand: 'Audi', model: 'Q5', gen: 'Q5 FY 55 TFSIe', fuel: 'Híbrido enchufable', cv: 367, y0: 2020, y1: 2022, engine: 'Q5 55 TFSIe Plug-in Hybrid 367 CV', co2: 52, newPrice: 68000, as: ['audi', 'q5', null], ban: 'sportback', word: 'q5' },
  { brand: 'Volkswagen', model: 'Passat Variant', gen: 'Passat Variant B8 GTE', fuel: 'Híbrido enchufable', cv: 218, y0: 2016, y1: 2022, engine: 'Passat Variant GTE Plug-in Hybrid 218 CV', co2: 40, newPrice: 48000, as: ['volkswagen', 'passat', 5], ban: '', word: 'gte' },
  { brand: 'Peugeot', model: '3008', gen: '3008 II Hybrid4', fuel: 'Híbrido enchufable', cv: 300, y0: 2020, y1: 2023, engine: '3008 Hybrid4 Plug-in Hybrid 300 CV', co2: 31, newPrice: 48000, as: ['peugeot', '3008', null], ban: '', word: 'hybrid4' },
  // ── Eléctricos (etiqueta CERO) ──
  { brand: 'Tesla', model: 'Model 3', gen: 'Model 3', fuel: 'Eléctrico', cv: 283, y0: 2019, y1: 2023, engine: 'Model 3 Eléctrico 283 CV', co2: 0, newPrice: 45000, as: ['tesla', 'model-3', null], ban: 'performance', word: 'model 3' },
  { brand: 'Hyundai', model: 'Kona', gen: 'Kona EV', fuel: 'Eléctrico', cv: 204, y0: 2019, y1: 2022, engine: 'Kona Eléctrico 204 CV 64 kWh', co2: 0, newPrice: 40000, as: ['hyundai', 'kona', null], ban: 'hybrid', word: 'kona' },
  { brand: 'Kia', model: 'Niro', gen: 'e-Niro', fuel: 'Eléctrico', cv: 204, y0: 2019, y1: 2022, engine: 'e-Niro Eléctrico 204 CV 64 kWh', co2: 0, newPrice: 40000, as: ['kia', 'niro', null], ban: 'hybrid|phev', word: 'niro' },
  { brand: 'Volkswagen', model: 'ID.3', gen: 'ID.3', fuel: 'Eléctrico', cv: 204, y0: 2020, y1: 2023, engine: 'ID.3 Eléctrico 204 CV', co2: 0, newPrice: 38000, as: ['volkswagen', 'id.3', null], ban: '', word: 'id.3' },
  { brand: 'Renault', model: 'Zoe', gen: 'Zoe R135', fuel: 'Eléctrico', cv: 136, y0: 2020, y1: 2023, engine: 'Zoe R135 Eléctrico 136 CV', co2: 0, newPrice: 33000, as: ['renault', 'zoe', null], ban: 'miete|batteriemiete|alquiler', word: 'zoe' },
];
