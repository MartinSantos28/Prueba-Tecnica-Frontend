export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return 'Justo ahora'
  if (diffMin < 60) return `Hace ${diffMin} min`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}
