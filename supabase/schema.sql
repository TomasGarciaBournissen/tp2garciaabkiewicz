-- ============================================================
-- SCHEMA TP2 — Dashboard de Hábitos y Gastos
-- ============================================================

-- Habilitar la extensión UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLA: gastos
-- ============================================================
create table if not exists public.gastos (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  monto       numeric(12, 2) not null check (monto > 0),
  categoria   text not null,
  descripcion text,
  fecha       date not null default current_date,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLA: habitos
-- ============================================================
create table if not exists public.habitos (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  nombre      text not null,
  descripcion text,
  frecuencia  text not null check (frecuencia in ('diaria', 'semanal')),
  color       text not null default '#6366f1',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLA: habitos_log
-- Registra cada vez que el usuario marca un hábito como completado
-- ============================================================
create table if not exists public.habitos_log (
  id         uuid primary key default uuid_generate_v4(),
  habito_id  uuid not null references public.habitos(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  fecha      date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habito_id, fecha)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.gastos enable row level security;
alter table public.habitos enable row level security;
alter table public.habitos_log enable row level security;

-- ============================================================
-- POLICIES: gastos
-- Solo el dueño puede ver, insertar, actualizar y borrar sus gastos
-- ============================================================
create policy "gastos: select propio" on public.gastos
  for select using (auth.uid() = user_id);

create policy "gastos: insert propio" on public.gastos
  for insert with check (auth.uid() = user_id);

create policy "gastos: update propio" on public.gastos
  for update using (auth.uid() = user_id);

create policy "gastos: delete propio" on public.gastos
  for delete using (auth.uid() = user_id);

-- ============================================================
-- POLICIES: habitos
-- Solo el dueño puede ver, insertar, actualizar y borrar sus hábitos
-- ============================================================
create policy "habitos: select propio" on public.habitos
  for select using (auth.uid() = user_id);

create policy "habitos: insert propio" on public.habitos
  for insert with check (auth.uid() = user_id);

create policy "habitos: update propio" on public.habitos
  for update using (auth.uid() = user_id);

create policy "habitos: delete propio" on public.habitos
  for delete using (auth.uid() = user_id);

-- ============================================================
-- POLICIES: habitos_log
-- Solo el dueño puede ver, insertar y borrar sus registros de log
-- ============================================================
create policy "habitos_log: select propio" on public.habitos_log
  for select using (auth.uid() = user_id);

create policy "habitos_log: insert propio" on public.habitos_log
  for insert with check (auth.uid() = user_id);

create policy "habitos_log: delete propio" on public.habitos_log
  for delete using (auth.uid() = user_id);
