// ============================================================================
//  ESTADO GLOBAL DE LA EMPRESA
// ----------------------------------------------------------------------------
//  Colecciones:
//   company   → datos fiscales, régimen, tarifas y valores por defecto
//   vehicles  → flota / stock con su coste real, estado y venta
//   contacts  → clientes, leads y proveedores (CRM)
//   expenses  → gastos de estructura (nave, luz, gestoría, cuotas…)
//   filings   → modelos tributarios con su importe calculado y su estado
//   tasks     → avisos y vencimientos (ITV, seguro, garantía, cobros…)
//   activity  → registro de auditoría de la última actividad
// ============================================================================
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { dbGet, dbPut, dbClear, readFallback, readLegacyVehicles, getPhotos, putPhotos, deletePhotos } from './db.js';
import { uid, todayISO, num } from './format.js';
import { DEFAULT_TARIFFS } from '../domain/rates.js';
import { invoiceNumber, invoiceLines } from './templates.js';
import { STATUS_FLOW } from '../domain/finance.js';
import { demoState } from '../data/demoState.js';

const SCHEMA_VERSION = 2;

const LEGACY_STATUS = {
  prospect: 'prospeccion',
  bought: 'comprado',
  transit: 'transito',
  paperwork: 'tramites',
  available: 'disponible',
  sold: 'vendido',
};

export const emptyCompany = () => ({
  name: '',
  nif: '',
  address: '',
  postalCode: '15001',
  city: 'A Coruña',
  province: 'A Coruña',
  phone: '',
  email: '',
  web: '',
  bankIban: '',
  // 'particular' | 'autonomo' | 'sl'
  legalForm: 'particular',
  // 'rebu' | 'general' | 'mixto'
  vatRegime: 'rebu',
  turnover: 0,
  buyerIsBusiness: false,
  warrantyMonths: 12,
  targetMarginPct: 12,
  invoicePrefix: `F${new Date().getFullYear()}-`,
  nextInvoiceNumber: 1,
  tariffs: {},
  fiscal: {
    irpfBrackets: null,
    retaData: new Date().toISOString().slice(0, 10),
    tarifaPlana: false,
    monthlyQuota: 0,
    fixedCosts: 0,
  },
  notes: '',
});

export const defaultState = () => ({
  schema: SCHEMA_VERSION,
  company: emptyCompany(),
  vehicles: [],
  contacts: [],
  expenses: [],
  filings: [],
  invoices: [],
  tasks: [],
  activity: [],
  meta: { createdAt: new Date().toISOString(), savedAt: null },
});

export const n2 = (v) => Math.round((Number(v) || 0) * 100) / 100;

/** Convierte un vehículo antiguo (campos planos) al esquema con `costs`. */
export function normalizeVehicle(raw = {}) {
  const v = { ...raw };
  const costs = {
    purchase: n2(v.costs?.purchase ?? v.purchasePrice ?? 0),
    transport: n2(v.costs?.transport ?? v.transportCost ?? 0),
    travel: n2(v.costs?.travel ?? 0),
    cocFicha: n2(v.costs?.cocFicha ?? v.cocOrFichaCost ?? 0),
    itv: n2(v.costs?.itv ?? v.itvCost ?? 0),
    dgt: n2(v.costs?.dgt ?? v.dgtFee ?? 99.77),
    placas: n2(v.costs?.placas ?? v.platesCost ?? 28),
    gestoria: n2(v.costs?.gestoria ?? 0),
    iedmt: n2(v.costs?.iedmt ?? v.iedmtTax ?? 0),
    itp: n2(v.costs?.itp ?? v.itpTax ?? 0),
    vatPurchase: n2(v.costs?.vatPurchase ?? 0),
    ivtm: n2(v.costs?.ivtm ?? v.ivtmCost ?? 0),
    recond: n2(v.costs?.recond ?? v.reconditioningCost ?? 0),
    maintenance: n2(v.costs?.maintenance ?? v.maintenanceCost ?? 0),
    guarantee: n2(v.costs?.guarantee ?? 0),
    advertising: n2(v.costs?.advertising ?? 0),
    insurance: n2(v.costs?.insurance ?? 0),
    other: n2(v.costs?.other ?? 0),
  };
  const status = STATUS_FLOW.some((s) => s.id === v.status) ? v.status : LEGACY_STATUS[v.status] || 'prospeccion';
  return {
    ...v,
    id: v.id || uid('veh'),
    costs,
    status,
    firstRegDate: v.firstRegDate || (v.year ? `${v.year}-06-01` : null),
    sellerType: v.sellerType || 'dealer_vat',
    taxMethod: v.taxMethod || 'tablas',
    documents: v.documents || v.docsChecklist || {},
    notes: v.notes || '',
    createdAt: v.createdAt || todayISO(),
    updatedAt: v.updatedAt || todayISO(),
  };
}

function normalizeContact(c = {}) {
  return {
    ...c,
    id: c.id || uid('ct'),
    kind: c.kind || 'lead',
    name: c.name || '',
    nif: c.nif || '',
    phone: c.phone || '',
    email: c.email || '',
    city: c.city || '',
    source: c.source || '',
    status: c.status || 'activo',
    stage: c.stage || 'lead',
    interestedIn: c.interestedIn || '',
    budget: num(c.budget),
    notes: c.notes || '',
    interactions: c.interactions || [],
    createdAt: c.createdAt || todayISO(),
  };
}

export function normalizeState(raw = {}) {
  const base = defaultState();
  return {
    ...base,
    ...raw,
    schema: SCHEMA_VERSION,
    company: { ...base.company, ...(raw.company || {}), tariffs: { ...(raw.company?.tariffs || {}) } },
    vehicles: (raw.vehicles || []).map(normalizeVehicle),
    contacts: (raw.contacts || []).map(normalizeContact),
    expenses: raw.expenses || [],
    filings: raw.filings || [],
    invoices: raw.invoices || [],
    tasks: raw.tasks || [],
    activity: raw.activity || [],
    meta: { ...base.meta, ...(raw.meta || {}) },
  };
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => readFallback() ? normalizeState(readFallback()) : defaultState());
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const saveTimer = useRef(null);

  // Carga inicial desde IndexedDB (+ migración de la versión anterior)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await dbGet();
      if (cancelled) return;
      if (stored) {
        setState(normalizeState(stored));
      } else {
        const legacy = readLegacyVehicles();
        if (legacy && legacy.length) {
          setState((prev) => ({ ...prev, vehicles: legacy.map(normalizeVehicle) }));
        }
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Guardado con retardo (evita escribir en cada pulsación)
  useEffect(() => {
    if (!ready) return undefined;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      dbPut(state);
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [state, ready]);

  const toast = useCallback((message, tone = 'ok') => {
    const id = uid('t');
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const log = useCallback((text) => {
    setState((prev) => ({
      ...prev,
      activity: [{ id: uid('log'), at: new Date().toISOString(), text }, ...(prev.activity || [])].slice(0, 200),
    }));
  }, []);

  const setCompany = useCallback((patch) => {
    setState((prev) => ({ ...prev, company: { ...prev.company, ...(typeof patch === 'function' ? patch(prev.company) : patch) } }));
  }, []);

  const updateCollection = useCallback((key, fn) => {
    setState((prev) => ({ ...prev, [key]: fn(prev[key] || []) }));
  }, []);

  const upsert = useCallback((key, item) => {
    setState((prev) => {
      const list = prev[key] || [];
      const idx = list.findIndex((x) => x.id === item.id);
      const next = idx >= 0 ? list.map((x, i) => (i === idx ? { ...x, ...item, updatedAt: todayISO() } : x)) : [item, ...list];
      return { ...prev, [key]: next };
    });
  }, []);

  const remove = useCallback((key, id) => {
    setState((prev) => ({ ...prev, [key]: (prev[key] || []).filter((x) => x.id !== id) }));
  }, []);

  const replaceAll = useCallback((next) => {
    setState(normalizeState(next));
  }, []);

  const resetData = useCallback(async ({ keepCompany = false } = {}) => {
    await dbClear();
    setState((prev) => ({
      ...defaultState(),
      company: keepCompany ? prev.company : defaultState().company,
      meta: { createdAt: new Date().toISOString(), savedAt: null },
    }));
    try {
      localStorage.removeItem('importauto_completed_steps');
    } catch {
      /* noop */
    }
  }, []);

  const loadDemo = useCallback(() => {
    replaceAll(demoState());
  }, [replaceAll]);

  /** Siguiente número de factura disponible. */
  const nextInvoiceNumber = useCallback(() => {
    const issued = (state.invoices || []).length;
    const manual = Number(state.company.nextInvoiceNumber) || 1;
    return Math.max(manual, issued + 1);
  }, [state.invoices, state.company.nextInvoiceNumber]);

  /**
   * Genera la factura de una venta: numera, calcula el desglose según el
   * régimen y la guarda en la colección `invoices`.
   */
  const issueInvoice = useCallback((vehicle, overrides = {}) => {
    const company = state.company;
    const sale = vehicle.sale || {};
    const price = Number(sale.price ?? vehicle.targetSalePrice ?? 0);
    const regime = sale.vatRegime || (company.vatRegime === 'general' ? 'general' : 'rebu');
    const number = overrides.number || invoiceNumber(company, nextInvoiceNumber());
    const contact = state.contacts.find((c) => c.id === sale.contactId) || {};
    const lines = invoiceLines({
      price,
      regime,
      purchaseCost: Number(vehicle.costs?.purchase ?? 0),
    });
    const invoice = {
      id: uid('inv'),
      number,
      date: overrides.date || sale.date || todayISO(),
      vehicleId: vehicle.id,
      vehicleLabel: `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''}`.trim(),
      plate: vehicle.plate || '',
      vin: vehicle.vin || '',
      km: Number(sale.kmAtSale ?? vehicle.km ?? 0),
      contactId: sale.contactId || null,
      buyerName: overrides.buyerName || contact.name || '',
      buyerNif: overrides.buyerNif || contact.nif || '',
      buyerAddress: overrides.buyerAddress || contact.address || '',
      regime,
      total: lines.total,
      base: lines.base,
      vat: lines.vat,
      legalNote: lines.legalNote,
      warrantyMonths: sale.warrantyMonths ?? company.warrantyMonths ?? 12,
      payment: sale.payment || 'Transferencia bancaria',
      notes: overrides.notes || '',
      createdAt: new Date().toISOString(),
    };
    upsert('invoices', invoice);
    setCompany({ nextInvoiceNumber: Number(String(number).replace(/\D/g, '')) + 1 || nextInvoiceNumber() + 1 });
    return invoice;
  }, [state.company, state.contacts, state.invoices, nextInvoiceNumber, upsert, setCompany]);

  const saveVehicle = useCallback((vehicle) => {
    const normalized = normalizeVehicle(vehicle);
    upsert('vehicles', normalized);
    return normalized;
  }, [upsert]);

  const tariffs = useMemo(() => ({ ...DEFAULT_TARIFFS, ...(state.company.tariffs || {}) }), [state.company.tariffs]);

  const value = useMemo(
    () => ({
      state,
      setState,
      ready,
      tariffs,
      toast,
      log,
      setCompany,
      upsert,
      remove,
      updateCollection,
      replaceAll,
      loadDemo,
      resetData,
      saveVehicle,
      issueInvoice,
      nextInvoiceNumber,
      deleteVehicle: (id) => {
        remove('vehicles', id);
        deletePhotos(id);
      },
      getPhotos,
      putPhotos,
      toasts,
    }),
    [state, ready, tariffs, toast, log, setCompany, upsert, remove, updateCollection, replaceAll, loadDemo, resetData, saveVehicle, issueInvoice, nextInvoiceNumber, toasts],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return ctx;
}
