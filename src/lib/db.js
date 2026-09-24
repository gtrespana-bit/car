// ============================================================================
//  PERSISTENCIA — IndexedDB (con respaldo automático en localStorage)
// ----------------------------------------------------------------------------
//  Todo el estado de la empresa vive en un único registro atómico. Se guarda
//  en el navegador (los datos nunca salen de tu equipo) y se puede exportar a
//  un fichero JSON de respaldo o importar de nuevo en otro navegador.
// ============================================================================

const DB_NAME = 'coruna_autoimport_erp';
const DB_VERSION = 2;
const STORE = 'app';
const PHOTOS = 'photos';
const KEY = 'state';
const LS_FALLBACK = 'coruna_autoimport_erp_state_v1';
export const LEGACY_VEHICLES_KEY = 'coruna_autoimport_vehicles_v1';

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no disponible'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      // Las fotos van en un almacén aparte: son voluminosas y no deben
      // inflar el registro de estado que se escribe en cada cambio.
      if (!db.objectStoreNames.contains(PHOTOS)) db.createObjectStore(PHOTOS);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGet() {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[db] IndexedDB no disponible, usando localStorage:', err.message);
    try {
      const raw = localStorage.getItem(LS_FALLBACK);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

export async function dbPut(state) {
  const payload = { ...state, meta: { ...state.meta, savedAt: new Date().toISOString() } };
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(payload, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[db] fallo en IndexedDB, guardando en localStorage:', err.message);
    try {
      localStorage.setItem(LS_FALLBACK, JSON.stringify(payload));
    } catch (e) {
      console.error('[db] no se ha podido guardar el estado:', e);
    }
  }
  return payload;
}

export async function dbClear() {
  try {
    const db = await openDb();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* noop */
  }
  try {
    localStorage.removeItem(LS_FALLBACK);
  } catch {
    /* noop */
  }
}

/** Lectura síncrona del respaldo en localStorage (para la primera pintura). */
export function readFallback() {
  try {
    const raw = localStorage.getItem(LS_FALLBACK);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Lee los vehículos de la versión anterior de la app (localStorage). */
export function readLegacyVehicles() {
  try {
    const raw = localStorage.getItem(LEGACY_VEHICLES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function pickFile(accept = '.json') {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] || null);
    input.click();
  });
}

// ---------------------------------------------------------------------------
// FOTOS DE CADA VEHÍCULO
//   Se guardan como data-URL ya redimensionadas (máx. 1.600 px, JPEG ~0,82)
//   en el almacén `photos`, con clave = id del vehículo.
// ---------------------------------------------------------------------------

export async function getPhotos(vehicleId) {
  if (!vehicleId) return [];
  try {
    const db = await openDb();
    const list = await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTOS, 'readonly');
      const req = tx.objectStore(PHOTOS).get(vehicleId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function putPhotos(vehicleId, list) {
  if (!vehicleId) return;
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTOS, 'readwrite');
      tx.objectStore(PHOTOS).put(list, vehicleId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[db] no se han podido guardar las fotos:', err.message);
  }
}

export async function deletePhotos(vehicleId) {
  try {
    const db = await openDb();
    await new Promise((resolve) => {
      const tx = db.transaction(PHOTOS, 'readwrite');
      tx.objectStore(PHOTOS).delete(vehicleId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* noop */
  }
}

/**
 * Redimensiona un fichero de imagen y lo devuelve como data-URL.
 * Necesita navegador (canvas); devuelve null si no está disponible.
 */
export function fileToDataUrl(file, { maxSize = 1600, quality = 0.82 } = {}) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined' || typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(null);
      img.src = reader.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
