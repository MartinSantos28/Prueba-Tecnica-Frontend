# Arquitectura y cambios desde el fork

Este documento resume qué se implementó sobre el repositorio original de la prueba técnica, cómo quedó organizado el código y **por qué** se tomaron ciertas decisiones. Está pensado para que otro desarrollador pueda retomar el proyecto.

---

## Punto de partida (repositorio original)

El repo base era un **scaffold** de React 19 + Vite + TypeScript con:

- Layout con sidebar y topbar (`AppLayout`)
- Rutas definidas pero páginas incompletas (Dashboard con datos en cero, servicios API sin implementar)
- Estilos globales en `App.css` heredados de una plantilla anterior (presupuestos, modales, formularios)
- README con los requisitos de la prueba: tablas paginadas, búsqueda, PDFs agrupados, estados loading/error/empty
- Componentes documentados en README (`Modal`, `ConfirmDialog`) que **no existían** en el código


---

## Qué se implementó (visión funcional)

| Área | Estado |
|---|---|
| Servicios API (`fetchUsers`, `fetchProducts`, `fetchProduct`, catálogos completos) | ✅ |
| Dashboard con datos reales | ✅ |
| Usuarios: tabla, paginación, búsqueda, filtro por empresa, PDF por empresa | ✅ |
| Productos: tabla, paginación, búsqueda, filtro por categoría, PDF por categoría | ✅ |
| Detalle de producto + PDF por categoría | ✅ |
| PDFs con logo INKO, fuentes Arial y especificaciones del README | ✅ |
| Despliegue GitHub Pages | ✅ |
| Categorías traducidas al español + chips de color | ✅ |
| Sistema de notificaciones (muestra funcional) | ✅ |
| Optimización de peticiones y bundle | ✅ |
| Estados loading / error / empty / not found | ✅ |
| Validación PDF (empresa/categoría) con feedback en UI | ✅ |
| Diseño responsive mobile | ✅ |

---

## Estructura actual del proyecto

```
src/
├── App.tsx                 # Router, lazy loading, provider de notificaciones
├── layouts/
│   └── AppLayout.tsx       # Shell: sidebar, topbar, campana de notificaciones
├── pages/                  # Vistas por ruta (solo UI + reglas de negocio locales)
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Products.tsx
│   └── ProductDetail.tsx
├── components/             # UI reutilizable
│   ├── CategoryChip.tsx
│   ├── NotificationBell.tsx
│   └── Pagination.tsx
├── hooks/                  # Lógica compartida entre páginas
│   ├── usePaginatedList.ts # Paginación híbrida servidor/cliente
│   └── usePdfExport.ts     # Export PDF, validación (reportPdfError), notificaciones
├── context/
│   └── NotificationsContext.tsx
├── services/
│   └── api.ts              # Capa HTTP + caché en memoria
├── utils/
│   ├── pdf.ts              # Generación de PDF (jsPDF)
│   ├── pdfExport.ts        # Dynamic import del módulo PDF
│   ├── categories.ts       # Diccionario ES de categorías
│   ├── arialFont.ts        # Carga de fuentes para PDF
│   └── formatRelativeTime.ts
└── types/
    └── index.ts
```

**Principio general:** las páginas no deberían repetir lógica de paginación, exportación PDF o notificaciones. Eso vive en hooks, contexto y servicios.

---

## Decisiones de arquitectura (y por qué)

### 1. Capa de servicios centralizada (`services/api.ts`)

Toda comunicación con dummyjson pasa por un único módulo. Las páginas no llaman a `fetch` directamente.

**Por qué:** un solo lugar para cambiar la URL base, manejar errores HTTP y aplicar caché. Si mañana la API cambia o se añade autenticación, el impacto es acotado.

**Funciones principales:**

- `fetchUsers` / `fetchProducts` — paginación servidor con `limit` y `skip` (requisito de la prueba).
- `fetchProduct` — detalle por ID.
- `fetchAllUsers` / `fetchAllProducts` — catálogo completo en **una petición** (`?limit=0`).
- `fetchProductCategories` — listado ligero de categorías para el Dashboard y el select de Productos (sin descargar 194 productos solo para poblar el dropdown).
- `HttpError` — clase de error con `status` HTTP; permite distinguir 404 de errores de red en `ProductDetail`.

### 2. Caché en memoria con deduplicación

`fetchAllUsers` y `fetchAllProducts` usan un helper `createCachedFetcher`:

- Guarda el resultado en memoria tras la primera llamada.
- Si varias partes de la app piden el catálogo a la vez, reutiliza la misma promesa en vuelo (evita peticiones duplicadas).

**Por qué:** Usuarios, Productos, Dashboard y PDFs necesitan el dataset completo en distintos momentos. Sin caché, cada navegación o exportación repetiría llamadas innecesarias.

**Limitación consciente:** la caché vive en el módulo JS, no en React Query. Se reinicia al recargar la página. Para este tamaño de app es suficiente; si el proyecto crece, conviene migrar a TanStack Query.

### 3. Paginación híbrida (`usePaginatedList`)

El hook unifica el comportamiento de **Usuarios** y **Productos**:

| Modo | Comportamiento |
|---|---|
| Sin filtros ni búsqueda | Paginación en servidor (`fetchUsers` / `fetchProducts`, 10 por página) |
| Con filtro de grupo o búsqueda | Filtrado en cliente sobre el catálogo completo + paginación local |

**Por qué:**

- La prueba técnica exige paginación con `limit/skip` en la API.
- Los filtros (empresa, categoría) y la búsqueda necesitan ver **todos** los registros para no devolver resultados incompletos (bug común si solo se busca en la página actual).
- Usuarios y Productos compartían ~80% de la misma lógica; extraerla evita divergencias.

El catálogo completo se precarga en background al montar la página, sin bloquear la primera pintura de la tabla paginada.

**Estados de carga del catálogo:** el hook rastrea `catalogReady` y `catalogError`. Si la precarga falla y el usuario activa búsqueda o filtro, se muestra error en lugar de quedarse en loading infinito (bug corregido en la auditoría de cumplimiento).

### 4. PDFs con carga diferida (`utils/pdfExport.ts`)

`jspdf` y `jspdf-autotable` pesan ~430 KB. No se importan en el bundle inicial.

```ts
// Solo se descarga cuando el usuario exporta un PDF
const { generateProductsByCategoryPdf } = await import('./pdf')
```

**Por qué:** la mayoría de visitas son consultas de tablas. Cargar jsPDF al inicio penalizaba el First Contentful Paint sin beneficio.

Los PDFs incluyen:

- Logo INKO desde `src/assets/INKO_logo.png` (120×40 px en el documento)
- Fuentes Arial en `public/fonts/` (servidas en runtime para jsPDF)
- Informe **agrupado por empresa** (usuarios) o **por categoría** (productos), nunca individual por registro

**Regla de negocio (README):** al pulsar "Descargar PDF" sin empresa o categoría seleccionada, se muestra error en la UI (`pdfError` + borde rojo en el select + notificación en la campana). El botón permanece habilitado para que el usuario reciba ese feedback.

### 4b. Exportación PDF unificada (`hooks/usePdfExport.ts`)

Hook compartido por **Usuarios**, **Productos** y **Detalle de producto**. Centraliza loading, errores y notificaciones de exportación.

| Función | Uso |
|---|---|
| `runExport(exporter, onSuccess?)` | Ejecuta la generación async; en éxito → notificación verde; en fallo → `pdfError` + notificación roja |
| `reportPdfError(message)` | Validación síncrona (sin spinner): muestra mensaje bajo la toolbar y notificación de error |
| `clearPdfError()` | Limpia el error al cambiar el select de empresa/categoría |
| `pdfLoading` / `pdfError` | Estado local para la UI de cada página |

**Flujo de validación en Users / Products:**

```
Click "Descargar PDF"
    │
    ├─ Sin empresa/categoría → reportPdfError("Selecciona…")
    │       ├─ div.error-state con mensaje
    │       ├─ select.field-error (borde rojo, aria-invalid)
    │       └─ notificación en campana
    │
    └─ Con selección → runExport()
            ├─ ensureAllLoaded() → catálogo cacheado
            ├─ filtrar por grupo
            └─ pdfExport (dynamic) → pdf.ts → descarga
```

**Por qué `reportPdfError` separado de `runExport`:** la validación de campos obligatorios no debe activar el estado "Generando…" ni disparar una petición a la API. Es feedback instantáneo antes de cualquier trabajo async.

### 5. Rutas con lazy loading (`App.tsx`)

Cada página se carga con `React.lazy()` + `Suspense`.

**Por qué:** el usuario solo visita una sección a la vez. Dividir el JS por ruta reduce el bundle inicial (~235 KB vs ~680 KB antes de esta optimización).

### 6. Diccionario de categorías + chips (`utils/categories.ts`, `CategoryChip`)

dummyjson devuelve categorías en inglés (`smartphones`, `womens-dresses`, etc.). Se añadió:

- `CATEGORY_LABELS` — traducción al español para UI y PDFs.
- `CategoryChip` — componente visual con color por categoría (clases BEM en CSS).

**Por qué:** mejor UX para usuarios hispanohablados y PDFs más legibles en entregables. Los slugs originales se conservan internamente para filtrar y llamar a la API; solo cambia la capa de presentación.

### 7. Sistema de notificaciones (muestra)

`NotificationsContext` + `NotificationBell` en el topbar.

- Notificaciones demo al cargar (catálogo, stock, usuarios).
- Al exportar PDF con éxito o error → nueva notificación.
- Marcar leídas, descartar, limpiar, navegar al hacer click.

**Por qué:** el botón de campana del layout original no hacía nada. Esta implementación es una **demostración de patrón** (Context + componente desacoplado), no un backend real. En producción se conectaría a WebSockets, polling o push.

**Detalle de UI:** la campana usa `margin-left: auto` en el topbar para alinearse a la derecha (sin el hamburger visible en desktop, flexbox la dejaba a la izquierda y el panel se cortaba con el sidebar).

### 8. GitHub Pages

Configuración en tres piezas:

1. `vite.config.ts` → `base: '/Prueba-Tecnica-Frontend/'`
2. `App.tsx` → `BrowserRouter` con `basename` de `import.meta.env.BASE_URL`
3. `.github/workflows/deploy.yml` → build + copia de `404.html` para SPA routing

**Por qué:** GitHub Pages sirve la app bajo un subpath (`usuario.github.io/nombre-repo/`). Sin `base` y `basename`, los assets y rutas de React Router fallan en producción.

### 9. Limpieza de CSS

Se eliminó CSS heredado de la plantilla (modales, formularios, line-items, badges de estado) que no se usaban. Se renombraron clases `budget-*` a nombres semánticos (`detail-title`, `recent-products`, etc.).

**Por qué:** menos ruido para quien mantenga estilos, menor CSS gzip (~3.5 KB vs ~4.5 KB) y nombres que reflejan el dominio actual (productos, no presupuestos).

**Responsive mobile:** en `@media (max-width: 768px)` las tablas usan `overflow-x: auto` con `min-width: 560px` para scroll horizontal; la ficha de detalle apila campos en columna y los botones de acción hacen wrap.

**Validación de formularios:** clase `.field-error` en selects de empresa/categoría (borde rojo, fondo `#fef2f2`, `aria-invalid`) cuando hay error de PDF por falta de selección.

---
### Separación por capas

| Capa | Responsabilidad | Archivos clave | Regla |
|---|---|---|---|
| **Vista** | UI, eventos de usuario, composición | `pages/*`, `components/*`, `layouts/*` | No llama a `fetch` directamente |
| **Hooks** | Lógica reutilizable de listas y PDF | `usePaginatedList`, `usePdfExport` | Sin JSX; reciben callbacks de servicios |
| **Contexto** | Estado global de notificaciones | `NotificationsContext` | Un provider en `App.tsx` |
| **Servicios** | HTTP, errores tipados, caché | `services/api.ts` | Único punto de contacto con dummyjson |
| **Utilidades** | PDF, categorías, fuentes | `utils/pdf.ts`, `pdfExport.ts`, `categories.ts` | Sin estado React |


### Métricas de bundle (build actual)

| Chunk | Tamaño | gzip |
|---|---|---|
| `index` (app principal) | ~241 KB | ~77 KB |
| `pdf` (jsPDF, bajo demanda) | ~433 KB | ~140 KB |
| Páginas lazy (Users, Products, etc.) | 3–4 KB c/u | ~1.5 KB c/u |
| CSS | ~17 KB | ~4 KB |


### Mapa de dependencias entre módulos

```
App.tsx
 ├── NotificationsProvider
 ├── AppLayout → NotificationBell → NotificationsContext
 └── Routes (lazy)
      ├── Dashboard → api.ts (fetchUsers, fetchProducts, fetchProductCategories)
      ├── Users → usePaginatedList + usePdfExport → api.ts + pdfExport.ts
      ├── Products → usePaginatedList + usePdfExport → api.ts + pdfExport.ts
      └── ProductDetail → usePdfExport → api.ts + pdfExport.ts

api.ts ──────────────────────────► dummyjson.com
usePaginatedList ──fetchPage──────► api.ts (paginado)
                 ──fetchAll───────► api.ts (catálogo cacheado)
usePdfExport ──runExport──────────► pdfExport.ts ──dynamic──► pdf.ts
             ──reportPdfError────► NotificationsContext
```

---

## Flujo de datos simplificado

```
┌─────────────┐     paginado      ┌──────────────┐
│   Página    │ ────────────────► │   api.ts     │ ──► dummyjson.com
│ (Users/     │                   │              │
│  Products)  │ ── catálogo ────► │  + caché     │
└─────────────┘     completo      └──────────────┘
       │
       │ usePaginatedList
       ▼
  Tabla + filtros + paginación

       │ usePdfExport
       ▼
  ¿Selección válida? ──no──► reportPdfError → UI + campana
       │
      sí
       │
       │ runExport → pdfExport (dynamic) → pdf.ts
       ▼
  Descarga PDF + notificación éxito
```

---

## Archivos que conviene conocer primero

Si vas a retomar el proyecto, empieza por estos archivos en este orden:

1. `src/services/api.ts` — contrato con la API y caché.
2. `src/hooks/usePaginatedList.ts` — corazón de las listas.
3. `src/hooks/usePdfExport.ts` — exportación PDF y validación.
4. `src/pages/Products.tsx` o `Users.tsx` — ejemplo de uso de ambos hooks.
5. `src/utils/pdf.ts` — lógica de informes.
6. `src/context/NotificationsContext.tsx` — estado global de notificaciones.

---

