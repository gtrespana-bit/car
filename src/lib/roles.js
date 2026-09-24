// ============================================================================
//  ROLES Y PERMISOS
// ----------------------------------------------------------------------------
//  Espejo en el front de las políticas RLS de `supabase/migrations`. Sirve
//  para ocultar/deshabilitar acciones y dar mensajes claros; la barrera real
//  está en la base de datos.
// ============================================================================

export const ROLES = {
  owner: { label: 'Propietario', description: 'Acceso total, gestión del equipo y datos de la empresa' },
  manager: { label: 'Gestor', description: 'Todo el día a día, incluidos ajustes; no gestiona el equipo' },
  sales: { label: 'Comercial', description: 'Flota, clientes, tareas y fotos. Sin gastos, impuestos ni facturas' },
  accountant: { label: 'Gestoría', description: 'Solo lectura de toda la información' },
};

const WRITERS = {
  vehicles: ['owner', 'manager', 'sales'],
  contacts: ['owner', 'manager', 'sales'],
  tasks: ['owner', 'manager', 'sales'],
  activity: ['owner', 'manager', 'sales'],
  photos: ['owner', 'manager', 'sales'],
  expenses: ['owner', 'manager'],
  filings: ['owner', 'manager'],
  invoices: ['owner', 'manager'],
  company: ['owner', 'manager'],
  team: ['owner'],
  data: ['owner'], // importar/borrar todo
};

/** ¿Puede este rol escribir en la colección indicada? (sin rol = modo local = sí) */
export function canWrite(role, collection) {
  if (!role) return true;
  const allowed = WRITERS[collection];
  return allowed ? allowed.includes(role) : role === 'owner';
}

export const roleLabel = (role) => ROLES[role]?.label || role || 'Local';
