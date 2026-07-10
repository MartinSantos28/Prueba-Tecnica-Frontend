type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        className="btn btn-secondary btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>
      <span className="pagination-info">
        Página {page} de {totalPages}
      </span>
      <button
        className="btn btn-secondary btn-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </button>
    </div>
  )
}
