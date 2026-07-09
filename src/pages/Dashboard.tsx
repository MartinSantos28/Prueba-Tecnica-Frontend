/*
  Vista Dashboard - Resumen
  --------------------------
  Pendiente de implementar por el candidato:

  1. Implementar en src/services/api.ts:
     - fetchUsers(page?, limit?): Promise<UsersResponse>
     - fetchProducts(page?, limit?): Promise<ProductsResponse>

  2. Cargar usuarios y productos con paginación (limit=5 para el dashboard)
  3. Mostrar cards con:
     - Total de usuarios (usando total de la respuesta paginada)
     - Total de productos
     - Categorías únicas entre los productos
  4. Mostrar los últimos productos cargados en una lista
  5. Estados: loading, error
*/

export default function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen de usuarios y productos</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card accent-purple">
          <div className="stat-label">Usuarios</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">Pendiente de implementar</div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div className="stat-card accent-green">
          <div className="stat-label">Productos</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">Pendiente de implementar</div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div className="stat-card accent-orange">
          <div className="stat-label">Categorías</div>
          <div className="stat-value">-</div>
          <div className="stat-sub">Pendiente de implementar</div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="section-title">Últimos productos</h2>
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3>No hay datos</h3>
        <p>Implementa el servicio API para ver el resumen aquí</p>
      </div>
    </div>
  )
}
