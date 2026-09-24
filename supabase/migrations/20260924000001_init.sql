-- ============================================================================
--  Coruña AutoImport · Esquema inicial de Supabase
-- ----------------------------------------------------------------------------
--  Diseño multi-tenant desde el primer día:
--   · organizations  → una empresa (tenant). Sus ajustes fiscales van en `settings`.
--   · memberships    → qué usuarios pertenecen a qué empresa y con qué rol.
--   · invitations    → correos invitados a una empresa (se aplican al registrarse).
--   · profiles       → nombre y correo de cada usuario (para mostrar "quién hizo qué").
--   · vehicles, contacts, expenses, filings, invoices, tasks, activity, photos
--                    → colecciones de negocio. Cada fila guarda el registro completo
--                      en `data` (jsonb) y expone columnas generadas para consultar
--                      e indexar sin acoplar el esquema SQL al detalle del front.
--                      (Las fechas se exponen como texto ISO: un cast a date no es
--                      inmutable y Postgres no lo admite en columnas generadas.)
--
--  Roles (enum app_role):
--   owner      → todo, incluida la gestión del equipo y los datos de la empresa
--   manager    → todo el día a día, incluidos ajustes de empresa; no gestiona equipo
--   sales      → flota, clientes, tareas y fotos; NO gastos, impuestos ni facturas
--   accountant → solo lectura de todo (gestoría)
--
--  Ejecutar en: Supabase → SQL Editor → New query → pegar → Run.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Tipos y utilidades
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('owner', 'manager', 'sales', 'accountant');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if to_jsonb(new) ? 'updated_by' then
    new.updated_by := auth.uid();
  end if;
  return new;
end $$;

-- ----------------------------------------------------------------------------
-- 2. Tenancy
-- ----------------------------------------------------------------------------
create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Mi empresa',
  settings    jsonb not null default '{}'::jsonb,   -- = state.company del front
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.memberships (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        public.app_role not null default 'sales',
  created_at  timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index if not exists memberships_user_idx on public.memberships(user_id);

create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  email       text not null,
  role        public.app_role not null default 'sales',
  invited_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  accepted_at timestamptz,
  unique (org_id, email)
);

-- Rol del usuario actual en una empresa (null si no pertenece).
-- SECURITY DEFINER para poder leer memberships desde las propias políticas RLS
-- sin recursión.
create or replace function public.org_role(p_org uuid)
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.memberships where org_id = p_org and user_id = auth.uid();
$$;

create or replace function public.is_member(p_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.memberships where org_id = p_org and user_id = auth.uid());
$$;

create or replace function public.has_role(p_org uuid, p_roles public.app_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where org_id = p_org and user_id = auth.uid() and role = any (p_roles)
  );
$$;

-- Empresas del usuario actual con su rol (la app la llama al iniciar sesión).
create or replace function public.my_memberships()
returns table (org_id uuid, org_name text, role public.app_role, settings jsonb)
language sql stable security definer set search_path = public as $$
  select o.id, o.name, m.role, o.settings
  from public.memberships m
  join public.organizations o on o.id = m.org_id
  where m.user_id = auth.uid()
  order by m.created_at;
$$;

-- Alta automática: al crear un usuario, si tiene invitaciones pendientes se le
-- une a esas empresas con el rol indicado; si no, se le crea su propia empresa
-- como propietario.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(coalesce(new.email, ''));
  v_org   uuid;
  v_inv   record;
  v_found boolean := false;
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (user_id) do nothing;

  for v_inv in
    select * from public.invitations where lower(email) = v_email and accepted_at is null
  loop
    insert into public.memberships (org_id, user_id, role)
    values (v_inv.org_id, new.id, v_inv.role)
    on conflict do nothing;
    update public.invitations set accepted_at = now() where id = v_inv.id;
    v_found := true;
  end loop;

  if not v_found then
    insert into public.organizations (name)
    values (coalesce(nullif(new.raw_user_meta_data->>'company', ''), 'Mi empresa'))
    returning id into v_org;
    insert into public.memberships (org_id, user_id, role) values (v_org, new.id, 'owner');
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists organizations_updated_at on public.organizations;
create trigger organizations_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Colecciones de negocio
--    Patrón común: (org_id, id) como clave, `data` con el registro completo y
--    columnas generadas para lo que se consulta/indexa/valida.
-- ----------------------------------------------------------------------------
create table if not exists public.vehicles (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  status      text generated always as (data->>'status') stored,
  brand       text generated always as (data->>'brand') stored,
  model       text generated always as (data->>'model') stored,
  plate       text generated always as (data->>'plate') stored,
  vin         text generated always as (data->>'vin') stored,
  sale_date   text generated always as (data->'sale'->>'date') stored,           -- ISO yyyy-mm-dd
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);
create index if not exists vehicles_org_status_idx on public.vehicles(org_id, status);

create table if not exists public.contacts (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  kind        text generated always as (data->>'kind') stored,
  stage       text generated always as (data->>'stage') stored,
  name        text generated always as (data->>'name') stored,
  phone       text generated always as (data->>'phone') stored,
  email       text generated always as (data->>'email') stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);
create index if not exists contacts_org_stage_idx on public.contacts(org_id, stage);

create table if not exists public.expenses (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  date        text generated always as (data->>'date') stored,                    -- ISO yyyy-mm-dd
  amount      numeric generated always as (nullif(data->>'amount', '')::numeric) stored,
  category    text generated always as (data->>'category') stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);
create index if not exists expenses_org_date_idx on public.expenses(org_id, date);

create table if not exists public.filings (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  model       text generated always as (data->>'model') stored,
  status      text generated always as (data->>'status') stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);

create table if not exists public.invoices (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  number      text generated always as (data->>'number') stored,
  date        text generated always as (data->>'date') stored,                    -- ISO yyyy-mm-dd
  vehicle_id  text generated always as (data->>'vehicleId') stored,
  total       numeric generated always as (nullif(data->>'total', '')::numeric) stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id),
  -- La numeración de facturas debe ser correlativa y única: lo garantiza la BD.
  unique (org_id, number)
);

create table if not exists public.tasks (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  due_date    text generated always as (data->>'dueDate') stored,                 -- ISO yyyy-mm-dd
  done        boolean generated always as (coalesce(data->>'status', '') = 'done') stored,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);
create index if not exists tasks_org_due_idx on public.tasks(org_id, done, due_date);

create table if not exists public.activity (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  data        jsonb not null,
  at          text generated always as (data->>'at') stored,                      -- ISO 8601
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);
create index if not exists activity_org_at_idx on public.activity(org_id, at desc);

-- Fotos: el binario vive en Storage (bucket `vehicle-photos`); aquí el índice.
create table if not exists public.photos (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  id          text not null,
  vehicle_id  text not null,
  path        text not null,
  cover       boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (org_id, id)
);
create index if not exists photos_org_vehicle_idx on public.photos(org_id, vehicle_id, position);

do $$ declare t text; begin
  foreach t in array array['vehicles','contacts','expenses','filings','invoices','tasks','activity','photos'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 4. Seguridad por filas (RLS)
-- ----------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.profiles      enable row level security;
alter table public.memberships   enable row level security;
alter table public.invitations   enable row level security;
alter table public.vehicles      enable row level security;
alter table public.contacts      enable row level security;
alter table public.expenses      enable row level security;
alter table public.filings       enable row level security;
alter table public.invoices      enable row level security;
alter table public.tasks         enable row level security;
alter table public.activity      enable row level security;
alter table public.photos        enable row level security;

-- organizations
drop policy if exists org_select on public.organizations;
create policy org_select on public.organizations for select
  using (public.is_member(id));
drop policy if exists org_update on public.organizations;
create policy org_update on public.organizations for update
  using (public.has_role(id, array['owner','manager']::public.app_role[]))
  with check (public.has_role(id, array['owner','manager']::public.app_role[]));
drop policy if exists org_delete on public.organizations;
create policy org_delete on public.organizations for delete
  using (public.has_role(id, array['owner']::public.app_role[]));

-- profiles: cada uno ve el suyo y los de sus compañeros de empresa
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.memberships a
      join public.memberships b on a.org_id = b.org_id
      where a.user_id = auth.uid() and b.user_id = profiles.user_id
    )
  );
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- memberships: los miembros ven el equipo; solo owner lo gestiona
drop policy if exists memberships_select on public.memberships;
create policy memberships_select on public.memberships for select
  using (public.is_member(org_id));
drop policy if exists memberships_write on public.memberships;
create policy memberships_write on public.memberships for all
  using (public.has_role(org_id, array['owner']::public.app_role[]))
  with check (public.has_role(org_id, array['owner']::public.app_role[]));

-- invitations: solo owner
drop policy if exists invitations_all on public.invitations;
create policy invitations_all on public.invitations for all
  using (public.has_role(org_id, array['owner']::public.app_role[]))
  with check (public.has_role(org_id, array['owner']::public.app_role[]));

-- Colecciones: lectura para cualquier miembro; escritura según rol.
do $body$
declare
  t text;
  writers text;
begin
  foreach t in array array['vehicles','contacts','expenses','filings','invoices','tasks','activity','photos'] loop
    -- Quién puede escribir en cada tabla
    writers := case
      when t in ('vehicles','contacts','tasks','activity','photos') then 'array[''owner'',''manager'',''sales'']'
      else 'array[''owner'',''manager'']'
    end;

    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format('create policy %I on public.%I for select using (public.is_member(org_id))', t || '_select', t);

    execute format('drop policy if exists %I on public.%I', t || '_insert', t);
    execute format('create policy %I on public.%I for insert with check (public.has_role(org_id, %s::public.app_role[]))', t || '_insert', t, writers);

    execute format('drop policy if exists %I on public.%I', t || '_update', t);
    execute format('create policy %I on public.%I for update using (public.has_role(org_id, %s::public.app_role[])) with check (public.has_role(org_id, %s::public.app_role[]))', t || '_update', t, writers, writers);

    execute format('drop policy if exists %I on public.%I', t || '_delete', t);
    execute format('create policy %I on public.%I for delete using (public.has_role(org_id, %s::public.app_role[]))', t || '_delete', t, writers);
  end loop;
end $body$;

-- ----------------------------------------------------------------------------
-- 5. Storage: bucket privado de fotos. Ruta: {org_id}/{vehicle_id}/{photo_id}.jpg
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-photos', 'vehicle-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists photos_storage_select on storage.objects;
create policy photos_storage_select on storage.objects for select
  using (bucket_id = 'vehicle-photos' and public.is_member(((storage.foldername(name))[1])::uuid));

drop policy if exists photos_storage_insert on storage.objects;
create policy photos_storage_insert on storage.objects for insert
  with check (bucket_id = 'vehicle-photos'
    and public.has_role(((storage.foldername(name))[1])::uuid, array['owner','manager','sales']::public.app_role[]));

drop policy if exists photos_storage_update on storage.objects;
create policy photos_storage_update on storage.objects for update
  using (bucket_id = 'vehicle-photos'
    and public.has_role(((storage.foldername(name))[1])::uuid, array['owner','manager','sales']::public.app_role[]));

drop policy if exists photos_storage_delete on storage.objects;
create policy photos_storage_delete on storage.objects for delete
  using (bucket_id = 'vehicle-photos'
    and public.has_role(((storage.foldername(name))[1])::uuid, array['owner','manager','sales']::public.app_role[]));

-- ----------------------------------------------------------------------------
-- 6. Permisos de esquema (la API usa los roles anon/authenticated)
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
revoke all on all tables in schema public from anon;
