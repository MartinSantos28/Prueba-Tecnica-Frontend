/*
  Vista Detalle de Producto
  --------------------------

  Pendiente de implementar por el candidato:

  1. Implementar en src/services/api.ts:
     - fetchProduct(id: number): Promise<Product>
     GET /products/:id

  2. Obtener el id desde useParams()

  3. Cargar el producto con fetchProduct(id)
     Si no existe (id inválido), mostrar "Producto no encontrado"

  4. Mostrar ficha en pantalla con:
     - Imagen (thumbnail)
     - Título
     - Descripción
     - Precio
     - Stock
     - Categoría

  5. Botón "Volver" a /products

  6. Botón "Descargar PDF por categoría":
     - Al hacer clic, debe generar un PDF con TODOS los productos
       de la MISMA categoría a la que pertenece este producto
     - Para obtener los productos de esa categoría, puedes:
       a) Usar fetchProducts() y filtrar localmente por categoría
       b) Consultar GET /products?limit=0 (si aplica) y filtrar
     - El PDF sigue la misma estructura que el de Products.tsx
       (INFORME DE PRODUCTOS POR CATEGORÍA)

     Especificación del PDF:

     TAMAÑO: A4 (210mm x 297mm)
     Márgenes: 25mm superior, 20mm laterales, 20mm inferior

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

  7. Estados: loading, error, not found

  Tipos: Product
  API base: BASE_URL = 'https://dummyjson.com'
*/

export default function ProductDetail() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Detalle del producto</h1>
          <p>Detalle — pendiente de implementar</p>
        </div>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3>Vista no implementada</h3>
        <p>Implementa el servicio API y la vista de detalle con PDF por categoría</p>
      </div>
    </div>
  )
}
