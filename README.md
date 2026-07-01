# TP2 — Dashboard de Hábitos y Gastos

Aplicación web serverless para registrar y visualizar hábitos personales y gastos en ARS.

🔗 **Deploy**: [tp2-garcia-abkiewicz.vercel.app](https://tp2-garcia-abkiewicz.vercel.app) _(configurar en Vercel luego del primer merge a main)_

---

## Stack

| Tecnología | Rol | Justificación |
|---|---|---|
| React + Vite | Frontend | Rápido, ecosystem amplio, HMR eficiente |
| Tailwind CSS | Estilos | Utility-first, sin overhead de CSS custom |
| React Router | Navegación | Estándar de facto para SPAs en React |
| Supabase | Auth + DB + RLS | Backend serverless completo, PostgreSQL real, Auth integrado |
| Vercel | Deploy | CI/CD automático desde GitHub, free tier generoso |

---

## Correr localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/TomasGarciaBournissen/tp2-garcia-abkiewicz.git
cd tp2-garcia-abkiewicz

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu URL y anon key de Supabase

# 4. Correr en modo desarrollo
npm run dev
```

---

## Deploy en Vercel

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**.
2. Conectar el repo `TomasGarciaBournissen/tp2-garcia-abkiewicz`.
3. Framework preset: **Vite** (se detecta automáticamente).
4. En **Environment Variables**, agregar:
   - `VITE_SUPABASE_URL` → tu Project URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → tu anon key de Supabase
5. Click en **Deploy**.
6. Vercel asigna una URL automáticamente. Actualizar el link del README con esa URL.
7. Cada push a `main` dispara un redeploy automático.

### Configurar Supabase (primera vez)

1. Ir a [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor**.
2. Pegar el contenido de `supabase/schema.sql` y ejecutar.
3. Verificar que las tablas y policies se crearon correctamente en **Table Editor**.

---

## Convenciones de desarrollo

### Branching

```
main            → siempre funcional, deployado a producción
feature/<nombre-feature>  → nueva funcionalidad (ej. feature/ci-cd-pipeline)
fix/<nombre-bug>          → corrección de un bug (ej. fix/total-gastos-negativo)
```

Cada rama se abre desde un issue existente y se mergea a `main` vía Pull Request (ver [Flujo de trabajo](#flujo-de-trabajo)). Ninguna rama se mergea directo sin PR.

### Conventional Commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
chore:    tareas de mantenimiento/configuración
docs:     cambios en documentación
refactor: refactorización sin cambio de comportamiento
style:    cambios visuales / formato
test:     tests
```

### Versionado (SemVer)

- `0.1.0` → versión inicial de desarrollo
- `0.2.0` → primera entrega funcional completa

### Flujo de trabajo

1. Cada funcionalidad o bug a resolver tiene un **issue** en GitHub con título descriptivo y descripción breve antes de empezar a trabajar.
2. Se crea una rama `feature/*` o `fix/*` desde `main` para resolver ese issue.
3. Se abre un **Pull Request** contra `main` que referencia el issue (`Closes #N`).
4. El PR pasa por revisión (al menos un comentario real, no una aprobación vacía) antes de mergear.
5. El pipeline de CI (lint → tests → build) corre automáticamente en el PR; si falla, no se mergea.
6. Al mergear a `main`, el pipeline vuelve a correr y, si todo pasa, deploya automáticamente a producción.

---

## CI/CD

El pipeline (`.github/workflows/ci.yml`) corre en cada push y PR a `main`:

```
lint ─┐
unit-tests ─┼─► build ─► deploy (solo en push a main)
e2e-tests ─┘
```

- **lint** — `npm run lint` (ESLint).
- **unit-tests** — `npm run test` (Vitest) sobre la lógica de negocio en `src/lib/`.
- **e2e-tests** — `npm run test:e2e` (Playwright) sobre el flujo principal, con Supabase mockeado a nivel de red.
- **build** — `npm run build`, solo corre si los tres jobs anteriores pasaron.
- **deploy** — deploy a producción en Vercel vía Vercel CLI, solo corre si `build` pasó **y** el evento es un push a `main` (nunca en un PR).

El razonamiento completo de cada decisión de diseño del pipeline está en [`CALIDAD.md`](CALIDAD.md).

### Secrets necesarios en GitHub

Para que el job de `deploy` funcione, el repo necesita estos secrets (Settings → Secrets and variables → Actions):

| Secret | De dónde sale |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` tras `vercel link`, o Vercel → Project Settings → General |
| `VERCEL_PROJECT_ID` | idem |

---

## Roadmap

### Entrega 1 (30/4) — MVP
- [x] Auth completo (registro, login, logout)
- [x] CRUD de Gastos con filtro por categoría
- [x] CRUD de Hábitos con completado diario
- [x] Dashboard con resumen
- [x] RLS configurado en Supabase
- [x] Deploy en Vercel

### Entrega 2 (semanas 3-6)
- [ ] Rachas de hábitos (días consecutivos)
- [ ] Gráficos de gastos por categoría
- [ ] Exportar gastos a CSV
- [ ] Notificaciones de hábitos pendientes

### Entrega 3 — TP3 DevOps (CI/CD)
- [x] Tests unitarios con Vitest sobre lógica de negocio
- [x] Test E2E con Playwright del flujo principal
- [x] Pipeline de CI/CD con GitHub Actions (lint → tests → build → deploy)
- [x] Documentación de calidad (`CALIDAD.md`)
- [x] PR template con checklist de revisión

---

## Testing

```bash
npm run test         # unitarios (Vitest)
npm run test:watch   # unitarios en modo watch
npm run test:e2e     # E2E (Playwright, con Supabase mockeado)
```

Ambos corren dentro del pipeline de CI en cada push/PR a `main`. El detalle de qué cubre cada test está en [`CALIDAD.md`](CALIDAD.md).

---

## Esquema de base de datos

El schema completo se encuentra en [`supabase/schema.sql`](supabase/schema.sql). Para aplicarlo, pegarlo en el SQL Editor de tu proyecto de Supabase.

### Tablas

| Tabla | Descripción |
|---|---|
| `gastos` | Gastos del usuario: monto (ARS), categoría, descripción, fecha |
| `habitos` | Hábitos del usuario: nombre, descripción, frecuencia (diaria/semanal), color |
| `habitos_log` | Registro de completado diario de hábitos |

### RLS (Row Level Security)

Todas las tablas tienen RLS activado. Las policies aplican `auth.uid() = user_id` en todas las operaciones (SELECT, INSERT, UPDATE, DELETE), garantizando que cada usuario solo accede a sus propios datos.

---

## Integrantes

| Nombre | GitHub | Rol |
|---|---|---|
| Tomas Garcia | [@TomasGarciaBournissen](https://github.com/TomasGarciaBournissen) | Dev 1 — Auth + Gastos + Setup |
| Tomas Abkiewicz | tomas.abkiewicz1 | Dev 2 — Hábitos + Dashboard + Schema |

> El TP3 (CI/CD, testing y `CALIDAD.md`) fue realizado en solitario por Tomas Garcia.
