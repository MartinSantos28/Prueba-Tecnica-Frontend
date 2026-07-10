import { useCallback, useMemo, useState } from 'react'
import { fetchUsers, fetchAllUsers } from '../services/api'
import { exportUsersByCompanyPdf } from '../utils/pdfExport'
import { usePaginatedList } from '../hooks/usePaginatedList'
import { usePdfExport } from '../hooks/usePdfExport'
import Pagination from '../components/Pagination'
import type { User } from '../types'

const PAGE_SIZE = 10

export default function Users() {
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const { pdfLoading, pdfError, runExport, clearPdfError, reportPdfError } = usePdfExport()

  const fetchUsersPage = useCallback(async (page: number, pageSize: number) => {
    const res = await fetchUsers(page, pageSize)
    return { items: res.users, total: res.total }
  }, [])

  const filterUserBySearch = useCallback((user: User, query: string) => {
    const q = query.toLowerCase()
    return (
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    )
  }, [])

  const filterUserByCompany = useCallback(
    (user: User, company: string) => user.company.name === company,
    []
  )

  const {
    page,
    setPage,
    items: displayedUsers,
    allItems: allUsers,
    totalPages,
    error,
    tableLoading,
    ensureAllLoaded,
  } = usePaginatedList({
    pageSize: PAGE_SIZE,
    search,
    groupFilter: selectedCompany,
    fetchPage: fetchUsersPage,
    fetchAll: fetchAllUsers,
    filterByGroup: filterUserByCompany,
    filterBySearch: filterUserBySearch,
    loadErrorMessage: 'Error al cargar usuarios',
  })

  const companies = useMemo(
    () =>
      [...new Set(allUsers.map((u) => u.company.name))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [allUsers]
  )

  const handleDownloadPdf = () => {
    if (!selectedCompany) {
      reportPdfError('Selecciona una empresa para generar el PDF')
      return
    }

    void runExport(
      async () => {
        const source = await ensureAllLoaded()
        const filtered = source.filter((u) => u.company.name === selectedCompany)

        if (!filtered.length) {
          throw new Error(`No hay usuarios en la empresa "${selectedCompany}"`)
        }

        await exportUsersByCompanyPdf(selectedCompany, filtered)
      },
      {
        title: 'PDF de empresa generado',
        message: `Informe de ${selectedCompany} descargado correctamente.`,
        link: '/users',
      }
    )
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
              className={!selectedCompany && pdfError ? 'field-error' : undefined}
              aria-invalid={!selectedCompany && Boolean(pdfError)}
              onChange={(e) => {
                setSelectedCompany(e.target.value)
                clearPdfError()
              }}
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
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.company.name}</td>
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
