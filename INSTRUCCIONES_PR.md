# Instrucciones para abrir y mergear los Pull Requests

Abrí los PRs **en este orden exacto**. Mergeá cada uno antes de abrir el siguiente.

---

## PR 1 — Supabase Client

- **Título**: `feat: integrar cliente de supabase`
- **Base**: `develop`
- **Compare**: `feature/tomi-supabase-client`
- **Descripción**:
  - Instala `@supabase/supabase-js`
  - Crea `src/lib/supabase.js` con el cliente inicializado desde variables de entorno
  - Actualiza `.env.example` con las variables necesarias

---

## PR 2 — Schema SQL

- **Título**: `feat: schema sql con tablas y RLS`
- **Base**: `develop`
- **Compare**: `feature/companero-schema-sql`
- **Descripción**:
  - Crea `supabase/schema.sql` con las tablas `gastos`, `habitos` y `habitos_log`
  - Agrega policies de Row Level Security para todas las tablas (`auth.uid() = user_id`)
  - Documenta el schema en el README

> ⚠️ Antes de mergear este PR, ejecutá el SQL en el SQL Editor de tu proyecto de Supabase.

---

## PR 3 — Auth

- **Título**: `feat: autenticación completa con Supabase`
- **Base**: `feature/tomi-supabase-client`
- **Compare**: `feature/tomi-auth`
- **Descripción**:
  - `AuthContext` con `signUp`, `signIn`, `signOut` y estado de sesión reactivo
  - Página de registro (`/register`)
  - Página de login (`/login`)
  - `PrivateRoute` para proteger rutas
  - Instala `react-router-dom`

---

## PR 4 — Layout

- **Título**: `feat: layout principal con navbar responsive`
- **Base**: `feature/tomi-auth`
- **Compare**: `feature/tomi-layout`
- **Descripción**:
  - `MainLayout` con `<Outlet />` para rutas anidadas
  - `Navbar` con links a Dashboard, Gastos y Hábitos, y botón de logout
  - `MobileMenu` con hamburguesa para pantallas pequeñas
  - Actualiza `App.jsx` para usar el layout en rutas privadas

---

## PR 5 — Hábitos CRUD

- **Título**: `feat: CRUD completo de hábitos con completado diario`
- **Base**: `feature/tomi-layout`
- **Compare**: `feature/companero-habitos-crud`
- **Descripción**:
  - `useHabitos` — hook para operaciones CRUD contra Supabase
  - `useHabitosLog` — hook para marcar/desmarcar hábito como completado en el día
  - `HabitosPage` — listado con botón de nuevo hábito
  - `HabitoForm` — formulario de creación/edición con selector de color
  - `HabitoCard` — tarjeta con estado de completado del día, editar y eliminar
  - Conecta `/habitos` en `App.jsx`

---

## PR 6 — Gastos CRUD

- **Título**: `feat: CRUD completo de gastos con filtro por categoría`
- **Base**: `feature/companero-habitos-crud`
- **Compare**: `feature/tomi-gastos-crud`
- **Descripción**:
  - `useGastos` — hook para CRUD de gastos del mes actual
  - `GastosPage` — listado con total del mes y filtro por categoría
  - `GastoForm` — formulario con monto, categoría, descripción y fecha
  - `GastoItem` — item de lista con colores por categoría, editar y eliminar
  - Conecta `/gastos` en `App.jsx`

---

## PR 7 — Dashboard

- **Título**: `feat: dashboard con resumen de hábitos y gastos`
- **Base**: `feature/tomi-gastos-crud`
- **Compare**: `feature/companero-dashboard`
- **Descripción**:
  - `DashboardPage` — muestra hábitos completados hoy vs total, gasto total del mes y último gasto
  - `StatCard` — componente reutilizable para tarjetas de estadísticas
  - Conecta `/dashboard` en `App.jsx`

---

## PR 8 — Release Prep

- **Título**: `chore: preparación para release v0.2.0`
- **Base**: `feature/companero-dashboard`
- **Compare**: `feature/tomi-release-prep`
- **Descripción**:
  - Completa el README con instrucciones detalladas de deploy en Vercel y configuración de Supabase
  - Actualiza `package.json`: nombre → `tp2-garcia-abkiewicz`, versión → `0.2.0`

---

## PR 9 — Merge final: develop → main

Una vez mergeados los 8 PRs anteriores (todos ya habrán ido a develop en cadena), abrí este PR:

- **Título**: `release: v0.2.0 — primera entrega funcional`
- **Base**: `main`
- **Compare**: `feature/tomi-release-prep` *(o `develop` si ya hiciste todos los merges anteriores a develop)*
- **Descripción**:
  - Auth completo (registro, login, logout) contra Supabase
  - CRUD de Gastos con filtro por categoría
  - CRUD de Hábitos con completado diario
  - Dashboard con resumen
  - RLS configurado en Supabase
  - Deploy en Vercel

### Después del merge a main, crear el tag:

```bash
git checkout main
git pull origin main
git tag -a v0.2.0 -m "release: primera entrega funcional"
git push origin v0.2.0
```

---

## Limpieza de ramas (opcional, después de todos los merges)

```bash
# Borrar ramas locales
git branch -d feature/tomi-supabase-client
git branch -d feature/companero-schema-sql
git branch -d feature/tomi-auth
git branch -d feature/tomi-layout
git branch -d feature/companero-habitos-crud
git branch -d feature/tomi-gastos-crud
git branch -d feature/companero-dashboard
git branch -d feature/tomi-release-prep

# Borrar ramas remotas
git push origin --delete feature/tomi-supabase-client
git push origin --delete feature/companero-schema-sql
git push origin --delete feature/tomi-auth
git push origin --delete feature/tomi-layout
git push origin --delete feature/companero-habitos-crud
git push origin --delete feature/tomi-gastos-crud
git push origin --delete feature/companero-dashboard
git push origin --delete feature/tomi-release-prep
```

---

## Orden de merge resumido

```
PR1 (tomi-supabase-client → develop)
PR2 (companero-schema-sql → develop)
PR3 (tomi-auth → tomi-supabase-client)
PR4 (tomi-layout → tomi-auth)
PR5 (companero-habitos-crud → tomi-layout)
PR6 (tomi-gastos-crud → companero-habitos-crud)
PR7 (companero-dashboard → tomi-gastos-crud)
PR8 (tomi-release-prep → companero-dashboard)
PR9 (tomi-release-prep o develop → main) + tag v0.2.0
```
