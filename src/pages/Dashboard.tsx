import { useEffect, useState } from 'react'
import { fetchUsers, fetchProducts, fetchProductCategories } from '../services/api'
import CategoryChip from '../components/CategoryChip'
import type { Product } from '../types'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [categoriesCount, setCategoriesCount] = useState(0)
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        setLoading(true)
        setError(null)

        const [usersRes, productsRes, categories] = await Promise.all([
          fetchUsers(1, 1),
          fetchProducts(1, 5),
          fetchProductCategories(),
        ])

        if (cancelled) return

        setTotalUsers(usersRes.total)
        setTotalProducts(productsRes.total)
        setRecentProducts(productsRes.products)
        setCategoriesCount(categories.length)
      } catch {
        if (cancelled) return
        setError('No se pudo cargar el resumen')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">Cargando dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-state">{error}</div>
      </div>
    )
  }

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
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-sub">Total registrados</div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <div className="stat-card accent-green">
          <div className="stat-label">Productos</div>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-sub">Total en catálogo</div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="stat-card accent-orange">
          <div className="stat-label">Categorías</div>
          <div className="stat-value">{categoriesCount}</div>
          <div className="stat-sub">En catálogo completo</div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="section-title">Últimos productos</h2>

      {recentProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No hay productos</h3>
          <p>No se encontraron productos recientes</p>
        </div>
      ) : (
        <div className="recent-products">
          {recentProducts.map((product) => (
            <div key={product.id} className="recent-product-item">
              <div>
                <div className="recent-product-title">{product.title}</div>
                <CategoryChip category={product.category} />
              </div>
              <div className="recent-product-price">${product.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
