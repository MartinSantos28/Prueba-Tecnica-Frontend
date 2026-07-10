import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct, getAllProducts, HttpError } from '../services/api'
import { exportProductsByCategoryPdf } from '../utils/pdfExport'
import { getCategoryLabel } from '../utils/categories'
import { usePdfExport } from '../hooks/usePdfExport'
import CategoryChip from '../components/CategoryChip'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { pdfLoading, pdfError, runExport } = usePdfExport()

  useEffect(() => {
    const productId = Number(id)
    if (!id || Number.isNaN(productId)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    let cancelled = false

    void (async () => {
      try {
        setLoading(true)
        setNotFound(false)
        setError(null)
        const data = await fetchProduct(productId)
        if (cancelled) return
        setProduct(data)
      } catch (err) {
        if (cancelled) return
        if (err instanceof HttpError && err.status === 404) {
          setNotFound(true)
        } else {
          setError('Error al cargar el producto')
        }
        setProduct(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleDownloadPdf = () => {
    if (!product) return

    void runExport(
      async () => {
        const all = await getAllProducts()
        const sameCategory = all.filter((p) => p.category === product.category)

        if (!sameCategory.length) {
          throw new Error(
            `No hay productos en la categoría "${getCategoryLabel(product.category)}"`
          )
        }

        await exportProductsByCategoryPdf(product.category, sameCategory)
      },
      {
        title: 'PDF por categoría generado',
        message: `Informe de ${getCategoryLabel(product.category)} descargado.`,
        link: '/products',
      }
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">Cargando producto...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-state">{error}</div>
        <Link to="/products" className="btn btn-secondary" style={{ marginTop: 16 }}>
          Volver a productos
        </Link>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Producto no encontrado</h3>
          <p>El ID solicitado no existe</p>
          <Link to="/products" className="btn btn-secondary" style={{ marginTop: 16 }}>
            Volver a productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Detalle del producto</h1>
          <p>{product.title}</p>
        </div>
      </div>

      <div className="detail-actions">
        <Link to="/products" className="btn btn-secondary">
          Volver
        </Link>
        <button
          className="btn btn-primary"
          disabled={pdfLoading}
          onClick={handleDownloadPdf}
        >
          {pdfLoading ? 'Generando PDF...' : 'Descargar PDF por categoría'}
        </button>
      </div>

      {pdfError && (
        <div className="error-state" style={{ marginBottom: 16 }}>
          {pdfError}
        </div>
      )}

      <div className="detail-card product-detail-card">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-detail-image"
        />

        <div className="detail-header">
          <div>
            <div className="detail-title">{product.title}</div>
            <div className="detail-meta">ID: {product.id}</div>
          </div>
          <CategoryChip category={product.category} />
        </div>

        <div className="detail-field">
          <span className="field-label">Descripción</span>
          <span className="field-value">{product.description}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Precio</span>
          <span className="field-value">${product.price.toFixed(2)}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Stock</span>
          <span className="field-value">{product.stock}</span>
        </div>
        <div className="detail-field">
          <span className="field-label">Categoría</span>
          <span className="field-value">
            <CategoryChip category={product.category} />
          </span>
        </div>
      </div>
    </div>
  )
}
