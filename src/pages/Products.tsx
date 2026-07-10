import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProducts, fetchProductCategories, getAllProducts } from '../services/api'
import { exportProductsByCategoryPdf } from '../utils/pdfExport'
import { getCategoryLabel, sortCategoriesByLabel } from '../utils/categories'
import { usePaginatedList } from '../hooks/usePaginatedList'
import { usePdfExport } from '../hooks/usePdfExport'
import CategoryChip from '../components/CategoryChip'
import Pagination from '../components/Pagination'
import type { Product } from '../types'

const PAGE_SIZE = 10

export default function Products() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [apiCategories, setApiCategories] = useState<string[]>([])
  const { pdfLoading, pdfError, runExport, clearPdfError, reportPdfError } = usePdfExport()

  useEffect(() => {
    fetchProductCategories()
      .then(setApiCategories)
      .catch(() => {})
  }, [])

  const fetchProductsPage = useCallback(async (page: number, pageSize: number) => {
    const res = await fetchProducts(page, pageSize)
    return { items: res.products, total: res.total }
  }, [])

  const filterProductBySearch = useCallback((product: Product, query: string) => {
    const q = query.toLowerCase()
    return (
      product.title.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      getCategoryLabel(product.category).toLowerCase().includes(q)
    )
  }, [])

  const filterProductByCategory = useCallback(
    (product: Product, category: string) => product.category === category,
    []
  )

  const {
    page,
    setPage,
    items: displayedProducts,
    allItems: allProducts,
    totalPages,
    error,
    tableLoading,
    ensureAllLoaded,
  } = usePaginatedList({
    pageSize: PAGE_SIZE,
    search,
    groupFilter: selectedCategory,
    fetchPage: fetchProductsPage,
    fetchAll: getAllProducts,
    filterByGroup: filterProductByCategory,
    filterBySearch: filterProductBySearch,
    loadErrorMessage: 'Error al cargar productos',
  })

  const categories = useMemo(
    () =>
      sortCategoriesByLabel([
        ...new Set([
          ...apiCategories,
          ...allProducts.map((p) => p.category),
        ]),
      ]),
    [apiCategories, allProducts]
  )

  const handleDownloadPdf = () => {
    if (!selectedCategory) {
      reportPdfError('Selecciona una categoría para generar el PDF')
      return
    }

    void runExport(
      async () => {
        const source = await ensureAllLoaded()
        const filtered = source.filter((p) => p.category === selectedCategory)

        if (!filtered.length) {
          throw new Error(
            `No hay productos en la categoría "${getCategoryLabel(selectedCategory)}"`
          )
        }

        await exportProductsByCategoryPdf(selectedCategory, filtered)
      },
      {
        title: 'PDF por categoría generado',
        message: `Informe de ${getCategoryLabel(selectedCategory)} descargado.`,
        link: '/products',
      }
    )
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
              className={!selectedCategory && pdfError ? 'field-error' : undefined}
              aria-invalid={!selectedCategory && Boolean(pdfError)}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                clearPdfError()
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {getCategoryLabel(c)}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={pdfLoading || tableLoading}
            onClick={handleDownloadPdf}
          >
            {pdfLoading ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

        {pdfError && (
          <div className="error-state" style={{ margin: '0 0 16px' }}>
            {pdfError}
          </div>
        )}

        {tableLoading ? (
          <div className="loading-state">Cargando productos...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : displayedProducts.length === 0 ? (
          <div className="empty-state">
            <h3>Sin resultados</h3>
            <p>
              {selectedCategory
                ? `No hay productos en ${getCategoryLabel(selectedCategory)}`
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
                      <td>
                        <CategoryChip category={product.category} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
