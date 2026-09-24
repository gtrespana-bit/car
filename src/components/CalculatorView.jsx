import React, { useState } from 'react';
import { 
  Calculator, 
  Car, 
  Euro, 
  Fuel, 
  Gauge, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Printer, 
  RotateCcw,
  Info,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { 
  getIedmtRate, 
  getCorunaIvtm, 
  getBoeDepreciation, 
  calculateIrpfOnGain, 
  formatEuro, 
  formatEuroDetailed 
} from '../utils/calculations';

const PRESETS = [
  {
    name: "Volkswagen Golf 7.5 2.0 TDI",
    brand: "Volkswagen",
    model: "Golf 7.5",
    version: "2.0 TDI 150 CV DSG R-Line",
    year: 2019,
    km: 115000,
    fuel: "Diésel",
    co2: 118,
    cvf: 13.2,
    purchasePrice: 13500,
    originCountry: "Alemania",
    originCity: "Frankfurt",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 200,
    maintCost: 150,
    targetPrice: 17900,
    badge: "C (Verde)",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hyundai Tucson 1.6 CRDi 48V N-Line (ECO)",
    brand: "Hyundai",
    model: "Tucson",
    version: "1.6 CRDi 136 CV 48V N-Line 4x2 DCT",
    year: 2020,
    km: 98000,
    fuel: "Diésel Microhíbrido",
    co2: 122, // 4.75% IEDMT
    cvf: 11.6,
    purchasePrice: 16200,
    originCountry: "Alemania",
    originCity: "Stuttgart",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 180,
    maintCost: 150,
    targetPrice: 22900,
    badge: "ECO (Microhíbrido)",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Kia Sportage 1.6 CRDi GT-Line (ECO)",
    brand: "Kia",
    model: "Sportage",
    version: "1.6 CRDi 136 CV MHEV GT-Line DCT 4x2",
    year: 2019,
    km: 104000,
    fuel: "Diésel Microhíbrido",
    co2: 123,
    cvf: 11.6,
    purchasePrice: 15500,
    originCountry: "Alemania",
    originCity: "Colonia",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 180,
    maintCost: 150,
    targetPrice: 21900,
    badge: "ECO (Microhíbrido)",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hyundai Santa Fe 2.2 CRDi 4x4 7S",
    brand: "Hyundai",
    model: "Santa Fe",
    version: "2.2 CRDi 200 CV Premium 4WD Aut. 7 Plazas",
    year: 2017,
    km: 112000,
    fuel: "Diésel",
    co2: 169, // 9.75% IEDMT
    cvf: 14.1,
    purchasePrice: 17500,
    originCountry: "Alemania",
    originCity: "Baviera",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 250,
    maintCost: 200,
    targetPrice: 24500,
    badge: "C (Verde)",
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "BMW X1 (F48) sDrive18d Automático",
    brand: "BMW",
    model: "X1",
    version: "sDrive18d 150 CV Steptronic xLine",
    year: 2018,
    km: 108000,
    fuel: "Diésel",
    co2: 124,
    cvf: 13.0,
    purchasePrice: 16500,
    originCountry: "Alemania",
    originCity: "Múnich",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 200,
    maintCost: 180,
    targetPrice: 22400,
    badge: "C (Verde)",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Toyota Corolla Hybrid 1.8 HSD (ECO)",
    brand: "Toyota",
    model: "Corolla",
    version: "125H 1.8 Hybrid Active Tech e-CVT",
    year: 2019,
    km: 95000,
    fuel: "Híbrido Gasolina",
    co2: 102,
    cvf: 12.3,
    purchasePrice: 14200,
    originCountry: "Alemania",
    originCity: "Hamburgo",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 180,
    maintCost: 120,
    targetPrice: 18400,
    badge: "ECO (Microhíbrido/Híbrido)",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Cupra Formentor 1.5 TSI DSG",
    brand: "Cupra",
    model: "Formentor",
    version: "1.5 TSI 150 CV DSG 7v",
    year: 2021,
    km: 68000,
    fuel: "Gasolina",
    co2: 128,
    cvf: 11.2,
    purchasePrice: 20500,
    originCountry: "Alemania",
    originCity: "Núremberg",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 200,
    maintCost: 150,
    targetPrice: 26900,
    badge: "C (Verde)",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Volkswagen Caddy 4 2.0 TDI Combi",
    brand: "Volkswagen",
    model: "Caddy",
    version: "2.0 TDI 150 CV DSG Comfortline Combi 5p",
    year: 2018,
    km: 98000,
    fuel: "Diésel",
    co2: 134,
    cvf: 13.2,
    purchasePrice: 15500,
    originCountry: "Alemania",
    originCity: "Hannover",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 220,
    maintCost: 180,
    targetPrice: 22500,
    badge: "C (Verde)",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Mercedes-Benz Clase A 200d AMG",
    brand: "Mercedes-Benz",
    model: "Clase A",
    version: "A 200 d 150 CV 8G-DCT AMG Line (OM654)",
    year: 2020,
    km: 84000,
    fuel: "Diésel",
    co2: 124,
    cvf: 13.1,
    purchasePrice: 19800,
    originCountry: "Alemania",
    originCity: "Stuttgart",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 200,
    maintCost: 180,
    targetPrice: 26500,
    badge: "C (Verde)",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Toyota C-HR 1.8 Hybrid (ECO)",
    brand: "Toyota",
    model: "C-HR",
    version: "125H 1.8 Hybrid Advance e-CVT",
    year: 2020,
    km: 72000,
    fuel: "Híbrido Gasolina",
    co2: 108,
    cvf: 12.3,
    purchasePrice: 16500,
    originCountry: "Alemania",
    originCity: "Düsseldorf",
    sellerType: "dealer",
    transportMethod: "truck",
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    recondCost: 180,
    maintCost: 120,
    targetPrice: 21900,
    badge: "ECO (Microhíbrido/Híbrido)",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function CalculatorView({ onAddVehicleToPipeline, setActiveTab }) {
  // Form State
  const [formData, setFormData] = useState({
    brand: "Hyundai",
    model: "Tucson",
    version: "1.6 CRDi 136 CV 48V N-Line 4x2 DCT",
    year: 2020,
    km: 98000,
    fuel: "Diésel Microhíbrido",
    co2: 122,
    cvf: 11.6,
    originCountry: "Alemania",
    originCity: "Stuttgart",
    sellerType: "dealer", // dealer | private
    purchasePrice: 16200,
    transportMethod: "truck", // truck | road
    transportCost: 750,
    cocOrFichaCost: 90,
    itvCost: 140,
    dgtFee: 99.77,
    platesCost: 28,
    reconditioningCost: 180,
    maintenanceCost: 150,
    targetSalePrice: 22900,
    notes: "",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  });

  const [savedNotification, setSavedNotification] = useState(false);

  // Mechanical Reliability Scanner
  const searchStr = `${formData.brand} ${formData.model} ${formData.version}`.toLowerCase();
  
  let engineWarning = null;
  let engineGold = null;

  if (searchStr.includes("puretech") || searchStr.includes("1.2 pure") || (searchStr.includes("peugeot") && searchStr.includes("1.2")) || (searchStr.includes("citroen") && searchStr.includes("1.2"))) {
    engineWarning = "⚠️ ALERTA MECÁNICA MÁXIMA: Motor Stellantis 1.2 PureTech. Correa húmeda que se degrada en aceite, tapona la bomba y gripa el motor. Prohibido importar para proteger tu reputación.";
  } else if (searchStr.includes("1.2 tce") || searchStr.includes("1.2 dig-t") || (searchStr.includes("qashqai") && searchStr.includes("1.2"))) {
    engineWarning = "⚠️ ALERTA MECÁNICA MÁXIMA: Motor Renault/Nissan 1.2 TCe. Defecto grave de consumo de aceite y rotura de válvulas. Causa directa de demandas por vicios ocultos.";
  } else if (searchStr.includes("bluehdi") || searchStr.includes("1.5 bluehdi")) {
    engineWarning = "⚠️ ATENCIÓN: Motor Stellantis 1.5 BlueHDi. Fallos frecuentes de rotura de cadena de árboles de levas de 7 mm y cristalización del depósito de AdBlue.";
  } else if (searchStr.includes("ingenium") || (searchStr.includes("evoque") && searchStr.includes("diesel")) || (searchStr.includes("discovery") && searchStr.includes("diesel"))) {
    engineWarning = "⚠️ ALERTA MECÁNICA: Motor Jaguar/Land Rover 2.0 Diésel Ingenium. Rotura prematura de cadena de distribución y holgura de eje de turbo. Altísimo riesgo de avería.";
  } else if (searchStr.includes("n47") || (searchStr.includes("bmw") && formData.year < 2015 && (searchStr.includes("320d") || searchStr.includes("118d") || searchStr.includes("120d")))) {
    engineWarning = "⚠️ ATENCIÓN: Posible motor BMW N47 con defecto en cadena de distribución trasera. Asegúrate de que sea bloque B47 (Euro 6, a partir de mediados de 2015).";
  } else if (searchStr.includes("1.6 gdi") && !searchStr.includes("hev") && !searchStr.includes("phev") && !searchStr.includes("tgdi")) {
    engineWarning = "⚠️ ADVERTENCIA COREANA: El motor 1.6 GDI atmosférico (132 CV) de Hyundai/Kia se queda muy corto de fuerza para mover un SUV en Galicia (160 Nm de par) y gasta mucho en autovía. Te recomendamos buscar el 1.6 CRDi diésel (136 CV con cadena) o el 1.6 TGDI Turbo.";
  }

  if (searchStr.includes("2.0 tdi") || searchStr.includes("ea288")) {
    engineGold = "⭐ MOTOR ROCA VAG: 2.0 TDI EA288. Correa de distribución tradicional seca, inyección Bosch y durabilidad legendaria (+400.000 km). El coche más demandado y rápido de vender en Galicia.";
  } else if (searchStr.includes("b47") || (searchStr.includes("bmw") && formData.year >= 2016 && (searchStr.includes("18d") || searchStr.includes("20d")))) {
    engineGold = "⭐ MOTOR ROCA BMW: B47 2.0d acoplado a caja automática ZF 8HP. Distribución reforzada, tacto soberbio y la mejor fiabilidad de su categoría.";
  } else if (searchStr.includes("tucson") && searchStr.includes("1.6 crdi")) {
    engineGold = "⭐ JOYA COREANA: Hyundai Tucson 1.6 CRDi 48V (136 CV). Cadena de distribución robusta, consumo de 5,1 l/100 km, Etiqueta ECO de la DGT y equipamiento N-Line/Tecno brutal. Margen neto muy alto.";
  } else if (searchStr.includes("sportage") && searchStr.includes("1.6 crdi")) {
    engineGold = "⭐ JOYA COREANA: Kia Sportage 1.6 CRDi MHEV 136 CV GT-Line. Distribución por cadena, etiqueta ECO, interior de máxima calidad y reventa rapidísima en A Coruña.";
  } else if (searchStr.includes("santa fe") && searchStr.includes("2.2")) {
    engineGold = "⭐ TITÁN COREANO: Hyundai Santa Fe 2.2 CRDi (200 CV). Bloque R de fundición indestructible, tracción 4x4 y 7 plazas reales. Muy cotizado por familias en Galicia.";
  } else if (searchStr.includes("hybrid") || searchStr.includes("hsd") || searchStr.includes("corolla") || searchStr.includes("yaris")) {
    engineGold = "⭐ MOTOR INDESTRUCTIBLE: Sistema Toyota Hybrid HSD. Sin turbo, sin embrague, sin alternador. Cero averías y Etiqueta ECO oficial para circular sin restricciones.";
  } else if (searchStr.includes("om654") || (searchStr.includes("mercedes") && searchStr.includes("200 d"))) {
    engineGold = "⭐ MOTOR PREMIUM: Mercedes-Benz OM654 2.0d de aluminio con recubrimiento NANOSLIDE. Muy silencioso, refinado y de bajísimo consumo.";
  } else if (searchStr.includes("skyactiv")) {
    engineGold = "⭐ MOTOR JAPONÉS: Mazda 2.0 Skyactiv-G atmosférico con cadena. Fiabilidad extrema de la vieja escuela con Etiqueta ECO.";
  }

  // Dynamic calculations
  const ageYears = Math.max(1, 2026 - Number(formData.year));
  const depreciationFactor = getBoeDepreciation(ageYears);
  
  const estimatedBoeBase = Number(formData.purchasePrice) * depreciationFactor;
  const iedmtRate = getIedmtRate(formData.co2);
  const calculatedIedmt = estimatedBoeBase * iedmtRate;

  // ITP (8% in Galicia) only applies if purchased from a private seller in Europe
  const calculatedItp = formData.sellerType === "private" ? Number(formData.purchasePrice) * 0.08 : 0;

  // IVTM Concello de A Coruña
  const calculatedIvtm = getCorunaIvtm(formData.cvf) * (2 / 4);

  // Aggregated Cost Puesto en Coruña
  const totalCostBeforePurchase = 
    Number(formData.transportCost) +
    Number(formData.cocOrFichaCost) +
    Number(formData.itvCost) +
    Number(formData.dgtFee) +
    calculatedIvtm +
    calculatedIedmt +
    calculatedItp +
    Number(formData.platesCost) +
    Number(formData.reconditioningCost) +
    Number(formData.maintenanceCost);

  const totalCost = Number(formData.purchasePrice) + totalCostBeforePurchase;

  // Profits
  const grossProfit = Number(formData.targetSalePrice) - totalCost;
  const grossRoi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

  // IRPF (Base del ahorro de particular)
  const estimatedIrpf = calculateIrpfOnGain(grossProfit);
  const netProfit = grossProfit - estimatedIrpf;
  const netRoi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Load preset
  const handleApplyPreset = (preset) => {
    setFormData({
      ...formData,
      brand: preset.brand,
      model: preset.model,
      version: preset.version,
      year: preset.year,
      km: preset.km,
      fuel: preset.fuel,
      co2: preset.co2,
      cvf: preset.cvf,
      purchasePrice: preset.purchasePrice,
      originCountry: preset.originCountry,
      originCity: preset.originCity,
      sellerType: preset.sellerType,
      transportMethod: preset.transportMethod,
      transportCost: preset.transportCost,
      cocOrFichaCost: preset.cocOrFichaCost,
      itvCost: preset.itvCost,
      reconditioningCost: preset.recondCost,
      maintenanceCost: preset.maintCost,
      targetSalePrice: preset.targetPrice,
      imageUrl: preset.imageUrl,
      notes: `Preset de alta rotación: ${preset.name}. Comprobado empíricamente en el mercado coruñés.`
    });
  };

  // Add to pipeline
  const handleSaveToPipeline = () => {
    const newCar = {
      id: `car-${Date.now()}`,
      brand: formData.brand,
      model: formData.model,
      version: formData.version,
      year: Number(formData.year),
      km: Number(formData.km),
      fuel: formData.fuel,
      transmission: "Automático",
      co2: Number(formData.co2),
      cvf: Number(formData.cvf),
      originCountry: formData.originCountry,
      originCity: formData.originCity,
      sellerType: formData.sellerType,
      purchasePrice: Number(formData.purchasePrice),
      transportCost: Number(formData.transportCost),
      transportMethod: formData.transportMethod,
      cocOrFichaCost: Number(formData.cocOrFichaCost),
      itvCost: Number(formData.itvCost),
      dgtFee: Number(formData.dgtFee),
      ivtmCost: Math.round(calculatedIvtm),
      iedmtTax: Math.round(calculatedIedmt),
      itpTax: Math.round(calculatedItp),
      platesCost: Number(formData.platesCost),
      reconditioningCost: Number(formData.reconditioningCost),
      maintenanceCost: Number(formData.maintenanceCost),
      targetSalePrice: Number(formData.targetSalePrice),
      actualSalePrice: null,
      status: "prospect",
      purchaseDate: new Date().toISOString().split('T')[0],
      arrivalDate: null,
      registrationDate: null,
      saleDate: null,
      daysToSell: null,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      vin: "PENDIENTE_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      environmentalBadge: formData.co2 <= 110 ? "ECO" : "C (Verde)",
      notes: formData.notes || "Generado desde el Simulador de Importación.",
      docsChecklist: {
        teil1: false,
        teil2: false,
        coc: false,
        invoice: false,
        itvPassed: false,
        dgtRegistered: false,
        contractSigned: false,
        taxesDeclared: false
      }
    };

    onAddVehicleToPipeline(newCar);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      setActiveTab('pipeline');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Simulador Financiero & Fiscal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Calculadora de Importación a A Coruña
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Calcula con precisión milimétrica costes de transporte, homologación, Modelo 576 AEAT, IVTM Concello Coruña y margen neto tras IRPF.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium shrink-0">Modelos Top:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 whitespace-nowrap transition-colors"
            >
              {p.model}
            </button>
          ))}
        </div>
      </div>

      {/* Engine Reliability Guardian Banner */}
      {engineWarning && (
        <div className="p-4 rounded-xl bg-rose-950/40 border-2 border-rose-500 text-xs text-rose-200 flex items-start space-x-3 shadow-xl">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-black text-rose-300 uppercase tracking-wider text-xs block">
              ADVERTENCIA CRÍTICA DE FIABILIDAD MECÁNICA
            </span>
            <p className="leading-relaxed">{engineWarning}</p>
          </div>
        </div>
      )}

      {engineGold && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-start space-x-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-black text-emerald-300 uppercase tracking-wider text-[11px] block">
              MECÁNICA DE MÁXIMA CALIDAD Y ROTACIÓN
            </span>
            <p className="leading-relaxed">{engineGold}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Datos del Vehículo y Compra */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Car className="w-4 h-4 text-amber-400" />
              <span>1. Identificación y Compra en Europa</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Marca</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Modelo y Carrocería</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-medium mb-1">Versión / Motorización</label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Año de Matriculación</label>
                <input
                  type="number"
                  min="2005"
                  max="2026"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Kilómetros Odómetro</label>
                <input
                  type="number"
                  step="5000"
                  value={formData.km}
                  onChange={(e) => setFormData({ ...formData, km: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">País de Compra</label>
                <select
                  value={formData.originCountry}
                  onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                >
                  <option value="Alemania">Alemania (Mobile.de)</option>
                  <option value="Bélgica">Bélgica</option>
                  <option value="Países Bajos">Países Bajos (Holanda)</option>
                  <option value="Francia">Francia</option>
                  <option value="Italia">Italia</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Ciudad / Región Origen</label>
                <input
                  type="text"
                  value={formData.originCity}
                  onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tipo de Vendedor Origen</label>
                <select
                  value={formData.sellerType}
                  onChange={(e) => setFormData({ ...formData, sellerType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                >
                  <option value="dealer">Compraventa / Concesionario (Factura con IVA/REBU)</option>
                  <option value="private">Particular Europeo (Aplica ITP 8% en Galicia)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Precio de Compra (€ en origen)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="250"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-amber-500/50 text-white font-black text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <Euro className="w-4 h-4 text-amber-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Logística y Transporte a Galicia */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>2. Transporte y Desplazamiento hacia A Coruña</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Método de Traslado</label>
                <select
                  value={formData.transportMethod}
                  onChange={(e) => {
                    const method = e.target.value;
                    setFormData({
                      ...formData,
                      transportMethod: method,
                      transportCost: method === 'truck' ? 750 : 690
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                >
                  <option value="truck">Camión Portacoches Compartido (Recomendado)</option>
                  <option value="road">Bajar Rodando (Placas rojas Zoll + Vuelo + Gasolina + Peajes)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Coste Total de Transporte (€)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.transportCost}
                    onChange={(e) => setFormData({ ...formData, transportCost: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                  <Euro className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Homologación e Impuestos en A Coruña */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>3. Homologación, ITV y Tasas en A Coruña</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Emisiones CO2 (WLTP g/km)</label>
                <input
                  type="number"
                  value={formData.co2}
                  onChange={(e) => setFormData({ ...formData, co2: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formData.co2 <= 120 
                    ? "✨ 0% Impuesto Matriculación (Exento)"
                    : `⚠️ Tramo ${(iedmtRate * 100).toFixed(2)}% Modelo 576`}
                </span>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Caballos Fiscales (CVF)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.cvf}
                  onChange={(e) => setFormData({ ...formData, cvf: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Concello Coruña: ~{formatEuro(calculatedIvtm)}
                </span>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">ITV Previa (Espíritu Santo/Sabón)</label>
                <input
                  type="number"
                  value={formData.itvCost}
                  onChange={(e) => setFormData({ ...formData, itvCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Ficha Reducida / COC</label>
                <input
                  type="number"
                  value={formData.cocOrFichaCost}
                  onChange={(e) => setFormData({ ...formData, cocOrFichaCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">0€ si trae COC original</span>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tasa 1.1 DGT A Coruña</label>
                <input
                  type="number"
                  disabled
                  value={formData.dgtFee}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-medium cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Fija estatal DGT</span>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Placas Físicas Metacrilato</label>
                <input
                  type="number"
                  value={formData.platesCost}
                  onChange={(e) => setFormData({ ...formData, platesCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Puesta a Punto y Venta Final */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>4. Puesta a Punto & Precio de Venta en A Coruña</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Limpieza Integral / Pulido</label>
                <input
                  type="number"
                  value={formData.reconditioningCost}
                  onChange={(e) => setFormData({ ...formData, reconditioningCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Mantenimiento Preventivo</label>
                <input
                  type="number"
                  value={formData.maintenanceCost}
                  onChange={(e) => setFormData({ ...formData, maintenanceCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Aceite, filtros, revisión</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">PVP Venta Objetivo Coruña (€)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="250"
                    value={formData.targetSalePrice}
                    onChange={(e) => setFormData({ ...formData, targetSalePrice: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-emerald-500/50 text-emerald-400 font-black text-sm focus:border-emerald-400 focus:outline-none"
                  />
                  <Euro className="w-4 h-4 text-emerald-400 absolute left-2.5 top-2.5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Precio en Wallapop / Coches.net</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Results Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Profit Card */}
          <div className="sticky top-28 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  Rentabilidad Estimada
                </span>
                <h3 className="text-xl font-black text-white">
                  Balance Económico
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">ROI Neto</span>
                <span className={`text-base font-black px-2.5 py-1 rounded-lg border ${
                  netRoi > 12 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {netRoi.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Big Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Coste Puesto en Coruña</span>
                <span className="text-xl font-black text-white block mt-0.5">
                  {formatEuro(totalCost)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Todo incluido y matriculado
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Margen Bruto de Operación</span>
                <span className="text-xl font-black text-amber-400 block mt-0.5">
                  +{formatEuro(grossProfit)}
                </span>
                <span className="text-[10px] text-amber-500/70 block mt-0.5">
                  {grossRoi.toFixed(1)}% sobre inversión
                </span>
              </div>
            </div>

            {/* Net Profit highlight after IRPF */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Beneficio Neto Limpio (Post-IRPF)
                  </span>
                </div>
                <span className="text-2xl font-black text-emerald-400">
                  +{formatEuro(netProfit)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Retención estimada IRPF (19%-21% en Base del Ahorro para particulares): <strong className="text-slate-300">-{formatEuro(estimatedIrpf)}</strong> en la Campaña de la Renta anual.
              </p>
            </div>

            {/* Detailed Itemized Costs */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[11px] pb-1">
                Desglose Detallado de Gastos
              </span>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">1. Precio Compra en Origen</span>
                <span className="font-semibold text-white">{formatEuro(formData.purchasePrice)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">2. Transporte a A Coruña ({formData.transportMethod === 'truck' ? 'Camión' : 'Por carretera'})</span>
                <span className="font-semibold text-white">{formatEuro(formData.transportCost)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">3. Ficha Técnica Reducida / COC</span>
                <span className="font-semibold text-white">{formatEuro(formData.cocOrFichaCost)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">4. ITV de Importación en A Coruña</span>
                <span className="font-semibold text-white">{formatEuro(formData.itvCost)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">5. Tasa 1.1 DGT A Coruña</span>
                <span className="font-semibold text-white">{formatEuro(formData.dgtFee)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">6. IVTM Concello de A Coruña</span>
                <span className="font-semibold text-white">{formatEuro(calculatedIvtm)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">7. Impuesto Matriculación Modelo 576 AEAT</span>
                <span className={`font-semibold ${calculatedIedmt === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {calculatedIedmt === 0 ? '0,00 € (Exento)' : formatEuro(calculatedIedmt)}
                </span>
              </div>

              {formData.sellerType === "private" && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">8. ITP 8% ATRIGA Galicia (Particular)</span>
                  <span className="font-semibold text-amber-400">{formatEuro(calculatedItp)}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">9. Placas Físicas Metacrilato</span>
                <span className="font-semibold text-white">{formatEuro(formData.platesCost)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">10. Reacondicionamiento + Mantenimiento</span>
                <span className="font-semibold text-white">
                  {formatEuro(Number(formData.reconditioningCost) + Number(formData.maintenanceCost))}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSaveToPipeline}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Añadir a mi Pipeline de Vehículos</span>
              </button>

              {savedNotification && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs text-center font-semibold animate-pulse">
                  ✓ Vehículo registrado con éxito en el Pipeline. Redirigiendo...
                </div>
              )}

              <button
                onClick={() => window.print()}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Hoja de Escandallo de Costes</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
