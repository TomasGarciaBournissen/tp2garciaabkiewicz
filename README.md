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
main          → siempre funcional, deployado
develop       → integración
feature/tomi-*      → features de Tomas Garcia
feature/companero-* → features de Tomas Abkiewicz
```

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

### Flujo de PRs

Cada feature branch se abre como PR contra su rama base (ver `INSTRUCCIONES_PR.md`). Los merges se hacen desde la UI de GitHub manteniendo el historial de commits.

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

---

## Integrantes

| Nombre | GitHub | Rol |
|---|---|---|
| Tomas Garcia | [@TomasGarciaBournissen](https://github.com/TomasGarciaBournissen) | Dev 1 — Auth + Gastos + Setup |
| Tomas Abkiewicz | tomas.abkiewicz1 | Dev 2 — Hábitos + Dashboard + Schema |
