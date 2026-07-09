# Prueba Técnica - Desarrollador Frontend

App de visualización de **usuarios** y **productos** desde [dummyjson](https://dummyjson.com/) con paginación, búsqueda y exportación a PDF agrupado por empresa y por categoría.

## Stack

- React 19 + TypeScript
- Vite
- React Router DOM
- Sin librerías UI (CSS propio)

## Lo que ya está implementado

| Archivo | Estado |
|---|---|
| `src/types/index.ts` | Tipos (User, Product, UsersResponse, ProductsResponse) |
| `src/services/api.ts` | Solo `BASE_URL` — el candidato implementa los servicios |
| `src/layouts/AppLayout.tsx` | Layout sidebar + topbar responsivo con navegación |
| `src/components/Modal.tsx` | Modal reutilizable |
| `src/components/ConfirmDialog.tsx` | Confirmación reutilizable |
| `src/App.css` | Estilos completos (cards, tabla, forms, responsive) |
| `src/pages/Dashboard.tsx` | Estructura base (cards con valores 0, pending) |
| `src/assets/INKO_logo.png` | Logo corporativo para los PDFs |

## Lo que debe implementar el candidato

### 0. Capa de servicios — `src/services/api.ts`

Crear los servicios que consumen la API de dummyjson:

- `fetchUsers(page?, limit?)` → `GET /users?limit=N&skip=N` → `UsersResponse`
- `fetchProducts(page?, limit?)` → `GET /products?limit=N&skip=N` → `ProductsResponse`
- `fetchProduct(id)` → `GET /products/:id` → `Product`

**Paginación obligatoria** con `limit` y `skip`. dummyjson responde con `{ datos[], total, skip, limit }`.

### 1. Usuarios — `/users`

Tabla responsiva con:
- Columnas: Nombre completo, Email, Teléfono, Empresa
- Paginación: 10 por página con controles (anterior/siguiente o numérica)
- Input de búsqueda local por nombre o email
- **PDF por empresa**: select/input para seleccionar empresa y botón que genera PDF con todos los usuarios de esa empresa

Especificación del PDF (informe por empresa):

| Propiedad | Valor |
|---|---|
| Tamaño hoja | A4 (210mm × 297mm) |
| Orientación | Vertical |
| Márgenes | 25mm sup, 20mm izq/der, 20mm inf |
| Logo | `INKO_logo.png` izquierda, 120×40px |
| Título | Arial Bold 18px, color #333 |
| Encabezados tabla | Arial Bold 11px, color #555, fondo #f5f5f5 |
| Filas tabla | Arial Normal 10px, color #333, intercalado blanco/gris |
| Pie de página | Arial Normal 9px, color #888, centrado |

Estructura visual del PDF (usuarios por empresa):
```
╔══════════════════════════════════════════════╗
║  +-----------+  +-------------------------+  ║
║  |           |  | INFORME DE USUARIOS     |  ║
║  |   LOGO    |  | POR EMPRESA             |  ║
║  | 120x40px  |  | Fecha: 09/07/2026       |  ║
║  |           |  |                         |  ║
║  +-----------+  +-------------------------+  ║
║  Izquierda          Derecha (alineado der)   ║
║                                              ║
║  ────────────────────────────────────────    ║
║                                              ║
║  Empresa: Acme Inc.                          ║
║  Total de usuarios: 5                        ║
║                                              ║
║  ────────────────────────────────────────    ║
║                                              ║
║  +──────────┬──────────────┬──────────+      ║
║  | Nombre   | Email        | Teléfono |      ║
║  +──────────┼──────────────┼──────────+      ║
║  | Juan     | juan@...     | 123      |      ║
║  | María    | maria@...    | 456      |      ║
║  | Pedro    | pedro@...    | 789      |      ║
║  +──────────┴──────────────┴──────────+      ║
║                                              ║
║  ────────────────────────────────────────    ║
║  Generado el: 09/07/2026                     ║
╚══════════════════════════════════════════════╝
```

### 2. Productos — `/products`

Tabla responsiva con:
- Columnas: Título, Precio, Stock, Categoría
- Paginación: 10 por página con controles
- Input de búsqueda local por título o categoría
- Click en una fila → navega a `/products/:id`
- **PDF por categoría**: select/input para seleccionar categoría y botón que genera PDF con todos los productos de esa categoría

Estructura visual del PDF (productos por categoría):
```
╔══════════════════════════════════════════════╗
║  +-----------+  +-------------------------+  ║
║  |           |  | INFORME DE PRODUCTOS    |  ║
║  |   LOGO    |  | POR CATEGORÍA           |  ║
║  | 120x40px  |  | Fecha: 09/07/2026       |  ║
║  |           |  |                         |  ║
║  +-----------+  +-------------------------+  ║
║  Izquierda          Derecha (alineado der)   ║
║                                              ║
║  ────────────────────────────────────────    ║
║                                              ║
║  Categoría: Electronics                      ║
║  Total de productos: 12                      ║
║                                              ║
║  ────────────────────────────────────────    ║
║                                              ║
║  +──────────┬────────┬───────┬────────+      ║
║  | Título   | Precio | Stock | Categ. |      ║
║  +──────────┼────────┼───────┼────────+      ║
║  | iPhone   | $999   | 150   | Elect. |      ║
║  | Samsung  | $899   | 200   | Elect. |      ║
║  +──────────┴────────┴───────┴────────+      ║
║                                              ║
║  ────────────────────────────────────────    ║
║  Generado el: 09/07/2026                     ║
╚══════════════════════════════════════════════╝
```

### 3. Detalle de Producto — `/products/:id`

- Ficha completa del producto (imagen, título, descripción, precio, stock, categoría)
- Botón "Volver" a `/products`
- **Botón "Descargar PDF por categoría"**: genera PDF con todos los productos de la misma categoría (misma estructura que el PDF de productos por categoría)

### PDF

- **No hay librería obligatoria.** Usa la que prefieras (jspdf, html2pdf, impresión nativa, etc.)
- El logo `INKO_logo.png` está en `src/assets/`
- Los PDFs son **agrupados** por empresa (usuarios) o categoría (productos), NO individuales por registro
- El informe debe incluir tabla con todos los registros del grupo seleccionado

## Evaluación

| Aspecto | Puntos |
|---|---|
| Servicios API con paginación (limit/skip) | 20 |
| Tablas con paginación y búsqueda | 20 |
| PDF agrupado por empresa/categoría con tabla y logo | 15 |
| TypeScript (tipado correcto) | 15 |
| Dashboard con datos reales | 10 |
| Manejo de estados (loading, error, empty, not found) | 10 |
| Diseño responsive mobile | 5 |
| Calidad del código | 5 |

## Instrucciones de entrega

1. Hacer **fork** del repositorio
2. Clonar tu fork
3. Implementar las vistas
4. Commit + push a tu fork
5. Enviar correo a **[correo@empresa.com]** con:
   - Asunto: "Prueba Técnica Frontend - [Tu Nombre]"
   - Enlace al repositorio fork
