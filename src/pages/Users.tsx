import { useEffect, useMemo, useState } from 'react'
import { fetchUsers, fetchAllUsers } from '../services/api'
import { generateUsersByCompanyPdf } from '../utils/pdf'
import type { User } from '../types'

const PAGE_SIZE = 10

export default function Users() {
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const res = await fetchUsers(page, PAGE_SIZE)
        if (cancelled) return
        setUsers(res.users)
        setTotal(res.total)
        setError(null)
      } catch {
        if (cancelled) return
        setError('Error al cargar usuarios')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [page])

  const goToPage = (nextPage: number) => {
    setLoading(true)
    setPage(nextPage)
  }

  useEffect(() => {
    fetchAllUsers()
      .then((data) => setAllUsers(data ?? []))
      .catch(() => setAllUsers([]))
  }, [])

  const companies = useMemo(
    () =>
      [...new Set(allUsers.map((u) => u.company.name))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [allUsers]
  )

  const displayedUsers = useMemo(() => {
    const base = selectedCompany
      ? allUsers.filter((u) => u.company.name === selectedCompany)
      : users

    const q = search.trim().toLowerCase()
    if (!q) return base

    return base.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }, [users, allUsers, selectedCompany, search])

  const handleDownloadPdf = async () => {
    if (!selectedCompany) return
    try {
      setPdfLoading(true)
      const source = allUsers.length ? allUsers : await fetchAllUsers()
      const filtered = source.filter((u) => u.company.name === selectedCompany)
      if (!filtered.length) return
      await generateUsersByCompanyPdf(selectedCompany, filtered)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Listado con paginación, búsqueda y exportación PDF</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="filters">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">Todas las empresas</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={!selectedCompany || pdfLoading}
            onClick={handleDownloadPdf}
          >
            {pdfLoading ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Cargando usuarios...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : displayedUsers.length === 0 ? (
          <div className="empty-state">
            <h3>Sin resultados</h3>
            <p>
              {selectedCompany
                ? 'No hay usuarios para esta empresa'
                : 'No se encontraron usuarios'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nombre completo</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Empresa</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.company.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!selectedCompany && (
              <div className="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {page} de {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
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