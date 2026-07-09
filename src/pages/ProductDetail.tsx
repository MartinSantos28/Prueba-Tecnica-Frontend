import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct, fetchAllProducts } from '../services/api'
import { generateProductsByCategoryPdf } from '../utils/pdf'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    const productId = Number(id)
    if (!id || Number.isNaN(productId)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProduct(productId)
        setProduct(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const handleDownloadPdf = async () => {
    if (!product) return
    try {
      setPdfLoading(true)
      const all = await fetchAllProducts()
      const sameCategory = all.filter((p) => p.category === product.category)
      await generateProductsByCategoryPdf(product.category, sameCategory)
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">Cargando producto...</div>
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

      <div className="detail-card product-detail-card">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-detail-image"
        />

        <div className="detail-header">
          <div>
            <div className="budget-id">{product.title}</div>
            <div className="budget-date">ID: {product.id}</div>
          </div>
          <span className="badge badge-sent">{product.category}</span>
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
          <span className="field-value">{product.category}</span>
        </div>
      </div>
    </div>
  )
}