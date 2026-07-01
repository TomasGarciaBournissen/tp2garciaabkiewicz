# Calidad — TP3 DevOps

Este documento explica, con nuestras propias palabras, las decisiones que tomamos para asegurar la calidad de la aplicación (dashboard de hábitos y gastos) y cómo se refleja eso en el pipeline de CI/CD.

## Estrategia general

La app es un CRUD sobre Supabase con bastante lógica de UI y poca lógica de negocio "pura": la mayoría del código son componentes de React que llaman directo a la base. Eso hace que testear todo con tests de integración contra una base real sea caro y lento para un proyecto de este tamaño, así que elegimos una estrategia de dos capas:

1. **Tests unitarios rápidos** sobre la lógica que sí es pura (cálculos, formateo, filtrado) — no dependen de red ni de React, así que corren en milisegundos y no son frágiles.
2. **Un test E2E** que verifica que el camino crítico (autenticación → uso real de la app) funciona de punta a punta, pero contra un backend de Supabase **mockeado a nivel de red**, no uno real.

La razón de mockear Supabase en el E2E en vez de apuntar a un proyecto real: un test E2E contra una base real de Supabase en CI implicaría (a) guardar credenciales de un proyecto de test como secret, (b) resetear datos entre corridas para que el test sea determinístico, y (c) aceptar que el pipeline se rompa si Supabase tiene un mal momento. Mockear la capa HTTP de Auth y REST nos da un test determinístico, rápido y que corre en cualquier lado sin configuración extra, a costa de no probar la integración real con Postgres/RLS (ver Limitaciones).

No apuntamos a "testear todo": priorizamos que **lint → tests → build** sea una compuerta real antes de tocar producción, no una casilla marcada de forma automática.

## Herramientas seleccionadas

| Necesidad | Elegimos | Por qué / alternativas descartadas |
|---|---|---|
| Tests unitarios | **Vitest** | Ya usamos Vite; Vitest comparte config y transformador con el build, no hay que mantener un segundo pipeline de transpilación como pasaría con Jest (que además necesita config extra para ESM/JSX con Vite). Corre en milisegundos. |
| Tests E2E | **Playwright** | Cypress fue la alternativa considerada, pero Playwright corre en CI sin necesitar un display virtual tan pesado, tiene mejor soporte para interceptar red (`page.route`, clave para mockear Supabase) y el reporter `github` integra los resultados directo en el PR. |
| Lint | **ESLint** (ya estaba) | Es el estándar del ecosistema React/Vite; no evaluamos alternativas porque no había motivo para cambiarlo. |
| CI/CD | **GitHub Actions** | El código ya vive en GitHub; usar un CI externo (CircleCI, Travis) solo agrega una cuenta más que administrar sin beneficio para un proyecto de este tamaño. |
| Deploy | **Vercel CLI dentro del workflow** | Vercel ya se usaba para el hosting desde el TP2. Usar la integración nativa de Vercel con GitHub (deploy automático en cada push) es más simple, pero no nos deja controlar el orden "solo deployar si lint+tests+build pasaron" — por eso deployamos explícitamente desde el job de GitHub Actions y no dejamos que Vercel escuche los pushes por su cuenta. |

## Tests desarrollados

### Unitarios (Vitest) — `src/lib/*.test.js`

| Test | Qué cubre |
|---|---|
| `formatARS` formatea un monto positivo | Que el helper de formato de moneda devuelva el signo `$` y separador de miles correcto para ARS. |
| `formatARS` formatea 0 correctamente | Caso borde: monto cero no debe romper el formateo ni mostrar `NaN`. |
| `formatARS` redondea montos con decimales | Los montos se guardan con decimales pero se muestran redondeados; verifica que el redondeo sea el esperado (no truncado). |
| `mesLabel` devuelve mes y año en mayúsculas | Usado en los headers de Dashboard/Gastos; verifica el formato exacto que se muestra al usuario. |
| `calcularTotalGastos` suma montos | Lógica central de "cuánto gasté este mes"; falla si alguien rompe la suma al refactorizar. |
| `calcularTotalGastos` devuelve 0 en lista vacía | Caso borde: usuario sin gastos no debe ver `NaN` ni un error. |
| `calcularTotalGastos` convierte montos string a número | Supabase puede devolver `numeric` como string; si se rompe esta coerción, el total se calcula mal silenciosamente (bug real que puede pasar desapercibido en desarrollo). |
| `filtrarPorCategoria` devuelve todos con "Todas"' | El filtro por categoría no debe filtrar nada cuando el usuario elige "ver todo". |
| `filtrarPorCategoria` filtra por categoría específica | Comportamiento principal del filtro. |
| `filtrarPorCategoria` devuelve vacío si no hay matches | Caso borde: categoría sin gastos no debe mostrar gastos de otra categoría. |
| `calcularProgreso` calcula porcentaje | Barra de progreso de hábitos del día; valida el cálculo que ve el usuario en el Dashboard. |
| `calcularProgreso` devuelve 100 si se completó todo | Caso límite superior, dispara el mensaje motivacional distinto en el Dashboard. |
| `calcularProgreso` devuelve 0 sin dividir por cero | Caso borde crítico: usuario sin hábitos registrados no debe generar `NaN`/`Infinity` en el cálculo. |

### E2E (Playwright) — `e2e/login-crear-gasto.spec.js`

| Test | Qué cubre |
|---|---|
| Usuario no autenticado es redirigido al login al intentar acceder a `/dashboard` | Que `PrivateRoute` efectivamente bloquee rutas privadas sin sesión — es la primera línea de defensa de toda la app. |
| Login exitoso → crear un gasto → verlo en el listado | El flujo de negocio principal end-to-end: autenticarse, crear una entidad y confirmar que se refleja en la UI. Es el camino que un usuario nuevo recorre siempre. |

## Casos de uso críticos

Priorizamos proteger, en este orden:

1. **Que no se pueda entrar a la app sin autenticarse.** Es la superficie de seguridad más básica; si se rompe, cualquier otro test pasa a ser irrelevante.
2. **Que crear una entidad (gasto) se refleje correctamente en la UI.** Es el patrón que se repite en gastos y hábitos (crear → ver → listar), así que probarlo una vez con gastos da confianza razonable sobre el mismo patrón en hábitos sin duplicar el mismo test dos veces.
3. **Los cálculos que el usuario ve como número final** (total del mes, progreso de hábitos): son los que, si están mal, el usuario nota inmediatamente y pierde confianza en la app aunque el resto funcione perfecto.

Lo que decidimos **no** priorizar todavía: ediciones y eliminaciones (`actualizarGasto`, `eliminarHabito`, etc.) y el flujo de hábitos completo en E2E — están cubiertos manualmente pero no automatizados (ver Limitaciones).

## Pipeline de CI/CD

Workflow en `.github/workflows/ci.yml`, disparado en cada `push` y `pull_request` a `main`:

```
lint ─┐
unit-tests ─┼─► build ─► deploy (solo push a main)
e2e-tests ─┘
```

- **lint, unit-tests, e2e-tests** corren en paralelo porque son independientes entre sí — no hay razón para esperar a que termine el lint para empezar los tests, eso solo alarga el pipeline.
- **build** depende de los tres anteriores (`needs: [lint, unit-tests, e2e-tests]`): no tiene sentido gastar minutos de CI compilando código que ni siquiera pasó lint o tests.
- **deploy** depende de `build` y además tiene una condición explícita `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`: así un PR corre todo el pipeline de verificación (para que se vea el resultado antes de mergear) pero **nunca** deploya a producción; solo un push a `main` (es decir, un PR ya mergeado) dispara el deploy.
- Si el lint falla, ni los tests ni el build ni el deploy corren — es la señal de que preferimos gastar 30 segundos fallando rápido en lint antes que 3 minutos fallando en build por el mismo motivo.
- El deploy usa la Vercel CLI (`vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`) en vez de la integración automática de Vercel con GitHub, justamente para que el deploy quede subordinado a que el resto del pipeline haya pasado en GitHub Actions, y no sea un proceso paralelo e independiente que Vercel dispara por su cuenta en cada push.

## Limitaciones y deuda técnica

- **Fetch-on-mount en los hooks de datos** (`useGastos`, `useHabitos`, `useHabitosLog`): estos hooks llaman a `fetch...()` directo dentro de un `useEffect`, lo que dispara un warning de `eslint-plugin-react-hooks` (`set-state-in-effect`) que silenciamos explícitamente con comentarios `eslint-disable-next-line` en cada caso. Migrar a algo como TanStack Query resolvería esto de raíz (cache, invalidación, estados de loading/error consistentes) pero es un cambio de arquitectura que decidimos no meter en este TP para no arriesgar romper funcionalidad que ya estaba probada manualmente. Lo aceptamos como riesgo consciente.
- **El E2E mockea Supabase en vez de usar un proyecto real de test.** Ganamos determinismo y velocidad, perdemos cobertura real sobre las policies de RLS y sobre errores reales de la API de Supabase (rate limits, cambios de esquema, etc.). Si el schema de la tabla `gastos` cambia y el código no se actualiza, el mock seguiría "pasando" aunque la app real esté rota.
- **Solo hay E2E del flujo de gastos, no de hábitos.** Ambos flujos comparten el mismo patrón de CRUD, así que el riesgo de que hábitos tenga un bug que gastos no tendría es bajo, pero no es cero.
- **No hay tests de edición ni eliminación**, solo de creación y lectura.
- **No se implementó ninguno de los extras opcionales** (Sentry, coverage con umbral, uso documentado de agente de IA para generar tests, GitHub Projects, PR template) salvo el PR template. Quedan como mejora futura si el tiempo lo permite.
- **No hay ambiente de staging separado**: el pipeline deploya directo a producción en cada push a `main`. Para un equipo más grande valdría la pena un ambiente de preview persistente antes de producción, pero para el tamaño de este proyecto lo consideramos sobre-ingeniería.
