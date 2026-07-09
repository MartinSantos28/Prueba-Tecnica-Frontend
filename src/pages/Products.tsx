/*
  Vista Productos - Listado con paginación y búsqueda
  ----------------------------------------------------

  Pendiente de implementar por el candidato:

  1. Implementar en src/services/api.ts:
     - fetchProducts(page?, limit?): Promise<ProductsResponse>
     GET /products?limit=N&skip=N  →  { products: Product[], total, skip, limit }

  2. Tabla responsiva con columnas:
     - Título
     - Precio
     - Stock
     - Categoría

  3. Input de búsqueda que filtre localmente por título o categoría

  4. Paginación:
     - Mostrar 10 productos por página
     - Controles de paginación (anterior/siguiente o números)
     - Usar skip = (page - 1) * limit
     - Mostrar "Página X de Y"

  5. Al hacer clic en una fila → navegar a /products/:id

  6. PDF por categoría:
     - Selector para filtrar por categoría
     - Las categorías disponibles se obtienen de los productos cargados
     - Al seleccionar una categoría, mostrar los productos de esa
       categoría en pantalla (filtrados)
     - Botón "Descargar PDF" que genera un informe con TODOS los
       productos pertenecientes a ESA categoría

     Especificación del PDF (informe por categoría):

     TAMAÑO: A4 (210mm x 297mm)
     Márgenes: 25mm superior, 20mm laterales, 20mm inferior
     Orientación: vertical (horizontal si hay muchas columnas)

     ESTRUCTURA VISUAL:
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
     ║  | Título   | Precio | Stock | Categ. |      ║  ← Encabezados: Bold 11px, #555
     ║  +──────────┼────────┼───────┼────────+      ║     fondo: #f5f5f5
     ║  | iPhone   | $999   | 150   | Elect. |      ║  ← Filas: Normal 10px, #333
     ║  | Samsung  | $899   | 200   | Elect. |      ║     intercalado: blanco/gris claro
     ║  +──────────┴────────┴───────┴────────+      ║
     ║                                              ║
     ║  ────────────────────────────────────────    ║
     ║  Generado el: 09/07/2026                     ║  ← Arial Normal 9px, #888
     ╚══════════════════════════════════════════════╝

     El logo debe cargarse desde src/assets/INKO_logo.png.
     Puedes usar cualquier librería para generar el PDF.

  7. Estados: loading, error, empty, sin resultados de categoría

  Tipos: Product, ProductsResponse
  Componentes: Modal, ConfirmDialog
*/

export default function Products() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Listado de productos con paginación — pendiente de implementar</p>
        </div>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3>Vista no implementada</h3>
        <p>Implementa el servicio API y la vista con tabla, paginación, búsqueda y PDF por categoría</p>
      </div>
    </div>
  )
}
