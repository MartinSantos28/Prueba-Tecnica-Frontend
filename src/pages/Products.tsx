import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProducts, fetchAllProducts } from '../services/api'
import { generateProductsByCategoryPdf } from '../utils/pdf'
import type { Product } from '../types'

const PAGE_SIZE = 10

export default function Products() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const loadPage = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchProducts(page, PAGE_SIZE)
      setProducts(res.products)
      setTotal(res.total)
    } catch {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  useEffect(() => {
    fetchAllProducts()
      .then(setAllProducts)
      .catch(() => { })
  }, [])

  const categories = useMemo(
    () =>
      [...new Set(allProducts.map((p) => p.category))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [allProducts]
  )

  const displayedProducts = useMemo(() => {
    const base = selectedCategory
      ? allProducts.filter((p) => p.category === selectedCategory)
      : products

    const q = search.trim().toLowerCase()
    if (!q) return base

    return base.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }, [products, allProducts, selectedCategory, search])

  const handleDownloadPdf = async () => {
    if (!selectedCategory) return
    try {
      setPdfLoading(true)
      const source = allProducts.length ? allProducts : await fetchAllProducts()
      const filtered = source.filter((p) => p.category === selectedCategory)
      if (!filtered.length) return
      await generateProductsByCategoryPdf(selectedCategory, filtered)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Listado con paginación, búsqueda y exportación PDF</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="filters">
            <input
              type="text"
              placeholder="Buscar por título o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={!selectedCategory || pdfLoading}
            onClick={handleDownloadPdf}
          >
            {pdfLoading ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Cargando productos...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : displayedProducts.length === 0 ? (
          <div className="empty-state">
            <h3>Sin resultados</h3>
            <p>
              {selectedCategory
                ? 'No hay productos en esta categoría'
                : 'No se encontraron productos'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="row-clickable"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <td>{product.title}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!selectedCategory && (
              <div className="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {page} de {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}