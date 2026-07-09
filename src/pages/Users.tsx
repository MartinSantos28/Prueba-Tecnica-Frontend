/*
  Vista Usuarios - Listado con paginación
  ----------------------------------------

  Pendiente de implementar por el candidato:

  1. Implementar en src/services/api.ts:
     - fetchUsers(page?, limit?): Promise<UsersResponse>
     GET /users?limit=N&skip=N  →  { users: User[], total, skip, limit }

  2. Tabla responsiva con columnas:
     - Nombre completo (firstName + lastName)
     - Email
     - Teléfono
     - Empresa (company.name)

  3. Paginación:
     - Mostrar 10 usuarios por página
     - Controles: Anterior / Siguiente (o números de página)
     - Usar skip = (page - 1) * limit
     - Total de páginas = Math.ceil(total / limit)

  4. Input de búsqueda que filtre localmente por nombre o email

  5. PDF por empresa:
     - Selector o input para filtrar por nombre de empresa
     - Las empresas disponibles se obtienen de los usuarios cargados
     - Al seleccionar una empresa, mostrar los usuarios de esa empresa
       en pantalla (filtrados)
     - Botón "Descargar PDF" que genera un informe con TODOS los
       usuarios pertenecientes a ESA empresa

     Especificación del PDF (informe por empresa):

     TAMAÑO: A4 (210mm x 297mm)
     Márgenes: 25mm superior, 20mm laterales, 20mm inferior
     Orientación: vertical (horizontal si hay muchas columnas)

     ESTRUCTURA VISUAL:
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
     ║  | Nombre   | Email        | Teléfono |      ║  ← Encabezados: Bold 11px, #555
     ║  +──────────┼──────────────┼──────────+      ║     fondo: #f5f5f5
     ║  | Juan     | juan@...     | 123      |      ║  ← Filas: Normal 10px, #333
     ║  | María    | maria@...    | 456      |      ║     intercalado: fondo blanco/gris
     ║  | Pedro    | pedro@...    | 789      |      ║
     ║  +──────────┴──────────────┴──────────+      ║
     ║                                              ║
     ║  ────────────────────────────────────────    ║
     ║  Generado el: 09/07/2026                     ║  ← Arial Normal 9px, #888
     ╚══════════════════════════════════════════════╝

     El logo debe cargarse desde src/assets/INKO_logo.png.
     Puedes usar cualquier librería para generar el PDF.

  6. Estados: loading, error, empty, sin resultados de empresa

  Tipos: User, UsersResponse
  Componentes: Modal, ConfirmDialog
*/

export default function Users() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Listado de usuarios con paginación — pendiente de implementar</p>
        </div>
      </div>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3>Vista no implementada</h3>
        <p>Implementa el servicio API y la vista con tabla, paginación y PDF por empresa</p>
      </div>
    </div>
  )
}
