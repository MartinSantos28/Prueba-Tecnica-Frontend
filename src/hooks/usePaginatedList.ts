import { useCallback, useEffect, useMemo, useState } from 'react'

export type PaginatedListOptions<T> = {
  pageSize?: number
  search: string
  groupFilter: string
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>
  fetchAll: () => Promise<T[]>
  filterByGroup?: (item: T, groupFilter: string) => boolean
  filterBySearch: (item: T, query: string) => boolean
  loadErrorMessage: string
}

export function usePaginatedList<T>({
  pageSize = 10,
  search,
  groupFilter,
  fetchPage,
  fetchAll,
  filterByGroup,
  filterBySearch,
  loadErrorMessage,
}: PaginatedListOptions<T>) {
  const [page, setPage] = useState(1)
  const [pageItems, setPageItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [allItems, setAllItems] = useState<T[]>([])
  const [catalogReady, setCatalogReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const isFiltering = Boolean(groupFilter || search.trim())

  useEffect(() => {
    setCatalogReady(false)
    setCatalogError(null)

    fetchAll()
      .then((data) => {
        setAllItems(data)
      })
      .catch((err) => {
        console.error('Error al precargar catálogo:', err)
        setCatalogError(loadErrorMessage)
      })
      .finally(() => {
        setCatalogReady(true)
      })
  }, [fetchAll, loadErrorMessage])

  useEffect(() => {
    let cancelled = false

    if (isFiltering) {
      setLoading(false)
      return
    }

    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchPage(page, pageSize)
        if (cancelled) return
        setPageItems(res.items)
        setTotal(res.total)
      } catch {
        if (cancelled) return
        setError(loadErrorMessage)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [page, pageSize, isFiltering, fetchPage, loadErrorMessage])

  const filteredItems = useMemo(() => {
    if (!isFiltering) return pageItems

    const base =
      groupFilter && filterByGroup
        ? allItems.filter((item) => filterByGroup(item, groupFilter))
        : allItems

    const q = search.trim()
    if (!q) return base

    return base.filter((item) => filterBySearch(item, q))
  }, [
    pageItems,
    allItems,
    groupFilter,
    search,
    isFiltering,
    filterByGroup,
    filterBySearch,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil((isFiltering ? filteredItems.length : total) / pageSize)
  )

  const items = useMemo(() => {
    if (!isFiltering) return pageItems

    const start = (page - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [pageItems, filteredItems, isFiltering, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [groupFilter, search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const ensureAllLoaded = useCallback(async () => {
    if (allItems.length) return allItems

    const data = await fetchAll()
    setAllItems(data)
    return data
  }, [allItems, fetchAll])

  const tableLoading = loading || (isFiltering && !catalogReady)
  const displayError = error ?? (isFiltering ? catalogError : null)

  return {
    page,
    setPage,
    items,
    allItems,
    totalPages,
    loading,
    error: displayError,
    isFiltering,
    tableLoading,
    ensureAllLoaded,
  }
}
