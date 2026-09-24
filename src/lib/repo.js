// ============================================================================
//  REPOSITORIO DE DATOS
// ----------------------------------------------------------------------------
//  Abstrae dónde viven los datos. Dos motores:
//   · supabase → Postgres + Storage en la nube, multiusuario, con RLS por rol.
//   · local    → IndexedDB del navegador (sin credenciales; tests y desarrollo).
//
//  El estado en memoria de la app conserva la misma forma en ambos casos
//  (company, vehicles, contacts, expenses, filings, invoices, tasks, activity),
//  así que las vistas no saben ni les importa qué motor hay debajo.
// ============================================================================
import { dbGet, dbPut, dbClear, getPhotos as localGetPhotos, putPhotos as localPutPhotos, deletePhotos as localDeletePhotos } from './db.js';

export const COLLECTIONS = ['vehicles', 'contacts', 'expenses', 'filings', 'invoices', 'tasks', 'activity'];
const PAGE = 1000;
const BUCKET = 'vehicle-photos';
const SIGNED_TTL = 60 * 60; // segundos
const CACHE_TTL = 50 * 60 * 1000; // ms (renovamos antes de que caduque la firma)

// ---------------------------------------------------------------------------
// Motor local (IndexedDB): guarda el estado completo de una vez.
// ---------------------------------------------------------------------------
export function createLocalRepo() {
  return {
    mode: 'local',
    load: () => dbGet(),
    saveState: (state) => dbPut(state),
    clear: () => dbClear(),
    getPhotos: localGetPhotos,
    putPhotos: localPutPhotos,
    deletePhotos: localDeletePhotos,
  };
}

// ---------------------------------------------------------------------------
// Motor Supabase: una fila por registro, fotos en Storage.
// ---------------------------------------------------------------------------
export function createSupabaseRepo(sb, orgId) {
  if (!sb || !orgId) throw new Error('createSupabaseRepo necesita cliente y empresa');
  const photoCache = new Map(); // vehicleId → { at, list }

  const fail = (error) => {
    if (error) throw error;
  };

  async function fetchAll(table) {
    const out = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await sb
        .from(table)
        .select('data')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE - 1);
      fail(error);
      out.push(...(data || []).map((r) => r.data));
      if (!data || data.length < PAGE) break;
    }
    return out;
  }

  async function load() {
    const [org, ...lists] = await Promise.all([
      sb.from('organizations').select('id, name, settings').eq('id', orgId).single(),
      ...COLLECTIONS.map(fetchAll),
    ]);
    fail(org.error);
    const state = { company: org.data?.settings || {} };
    COLLECTIONS.forEach((key, i) => {
      state[key] = lists[i];
    });
    // El registro de actividad se ordena por fecha del evento y se limita
    if (state.activity) state.activity = state.activity.sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 200);
    return state;
  }

  async function saveCompany(company) {
    const { error } = await sb
      .from('organizations')
      .update({ settings: company, name: company?.name?.trim() || 'Mi empresa' })
      .eq('id', orgId);
    fail(error);
  }

  async function upsert(key, item) {
    const { error } = await sb.from(key).upsert({ org_id: orgId, id: item.id, data: item }, { onConflict: 'org_id,id' });
    fail(error);
  }

  async function remove(key, id) {
    const { error } = await sb.from(key).delete().eq('org_id', orgId).eq('id', id);
    fail(error);
  }

  async function clearTable(key) {
    const { error } = await sb.from(key).delete().eq('org_id', orgId);
    fail(error);
  }

  async function insertMany(key, items) {
    for (let i = 0; i < items.length; i += 200) {
      const chunk = items.slice(i, i + 200).map((item) => ({ org_id: orgId, id: item.id, data: item }));
      const { error } = await sb.from(key).upsert(chunk, { onConflict: 'org_id,id' });
      fail(error);
    }
  }

  /** Sustituye todo el contenido de la empresa (importar respaldo / demo). */
  async function replaceAll(state) {
    for (const key of COLLECTIONS) {
      await clearTable(key);
      const items = (state[key] || []).filter((x) => x && x.id);
      if (items.length) await insertMany(key, items);
    }
    await saveCompany(state.company || {});
  }

  async function deleteAllPhotos() {
    const { data, error } = await sb.from('photos').select('id, path').eq('org_id', orgId);
    fail(error);
    const paths = (data || []).map((p) => p.path);
    for (let i = 0; i < paths.length; i += 100) {
      await sb.storage.from(BUCKET).remove(paths.slice(i, i + 100));
    }
    if (data?.length) fail((await sb.from('photos').delete().eq('org_id', orgId)).error);
    photoCache.clear();
  }

  async function clear({ keepCompany = true } = {}) {
    for (const key of COLLECTIONS) await clearTable(key);
    await deleteAllPhotos();
    if (!keepCompany) await saveCompany({});
  }

  // --- Fotos ---------------------------------------------------------------
  const photoPath = (vehicleId, id) => `${orgId}/${vehicleId}/${id}.jpg`;

  async function fetchPhotoRows(vehicleId) {
    const { data, error } = await sb
      .from('photos')
      .select('id, vehicle_id, path, cover, position, created_at')
      .eq('org_id', orgId)
      .eq('vehicle_id', vehicleId)
      .order('position', { ascending: true });
    fail(error);
    return data || [];
  }

  async function getPhotos(vehicleId) {
    if (!vehicleId) return [];
    const cached = photoCache.get(vehicleId);
    if (cached && Date.now() - cached.at < CACHE_TTL) return cached.list;
    try {
      const rows = await fetchPhotoRows(vehicleId);
      if (!rows.length) {
        photoCache.set(vehicleId, { at: Date.now(), list: [] });
        return [];
      }
      const { data: signed, error } = await sb.storage.from(BUCKET).createSignedUrls(rows.map((r) => r.path), SIGNED_TTL);
      fail(error);
      const urlByPath = new Map((signed || []).map((s) => [s.path, s.signedUrl]));
      const list = rows.map((r) => ({
        id: r.id,
        path: r.path,
        dataUrl: urlByPath.get(r.path) || '',
        cover: !!r.cover,
        addedAt: r.created_at,
      }));
      photoCache.set(vehicleId, { at: Date.now(), list });
      return list;
    } catch (err) {
      console.error('[repo] fotos:', err);
      return cached?.list || [];
    }
  }

  async function dataUrlToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return res.blob();
  }

  /**
   * Recibe la lista completa deseada (misma forma que el motor local) y aplica
   * la diferencia: sube las nuevas, borra las que faltan y actualiza orden/portada.
   */
  async function putPhotos(vehicleId, list) {
    if (!vehicleId) return;
    const existing = await fetchPhotoRows(vehicleId);
    const wanted = new Map(list.map((p, i) => [p.id, { ...p, position: i }]));

    const gone = existing.filter((r) => !wanted.has(r.id));
    if (gone.length) {
      await sb.storage.from(BUCKET).remove(gone.map((r) => r.path));
      fail((await sb.from('photos').delete().eq('org_id', orgId).in('id', gone.map((r) => r.id))).error);
    }

    const rows = [];
    for (const [id, p] of wanted) {
      let path = p.path;
      if (!path) {
        if (!p.dataUrl || !p.dataUrl.startsWith('data:')) continue;
        path = photoPath(vehicleId, id);
        const blob = await dataUrlToBlob(p.dataUrl);
        const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: true });
        fail(error);
      }
      rows.push({ org_id: orgId, id, vehicle_id: vehicleId, path, cover: !!p.cover, position: p.position });
    }
    if (rows.length) fail((await sb.from('photos').upsert(rows, { onConflict: 'org_id,id' })).error);
    photoCache.delete(vehicleId);
  }

  async function deletePhotos(vehicleId) {
    const rows = await fetchPhotoRows(vehicleId);
    if (rows.length) {
      await sb.storage.from(BUCKET).remove(rows.map((r) => r.path));
      fail((await sb.from('photos').delete().eq('org_id', orgId).eq('vehicle_id', vehicleId)).error);
    }
    photoCache.delete(vehicleId);
  }

  return {
    mode: 'supabase',
    orgId,
    load,
    saveCompany,
    upsert,
    remove,
    replaceAll,
    clear,
    getPhotos,
    putPhotos,
    deletePhotos,
  };
}
