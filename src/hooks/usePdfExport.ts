import { useCallback, useState } from 'react'
import { useNotifications } from '../context/NotificationsContext'
import type { NotificationType } from '../types'

type ExportSuccess = {
  type?: NotificationType
  title: string
  message: string
  link?: string
}

export function usePdfExport() {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const { addNotification } = useNotifications()

  const runExport = useCallback(
    async (
      exporter: () => Promise<void>,
      onSuccess?: ExportSuccess
    ) => {
      try {
        setPdfLoading(true)
        setPdfError(null)
        await exporter()

        if (onSuccess) {
          addNotification({
            type: onSuccess.type ?? 'success',
            title: onSuccess.title,
            message: onSuccess.message,
            link: onSuccess.link,
          })
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al generar el PDF'
        setPdfError(message)
        addNotification({
          type: 'error',
          title: 'Error al generar PDF',
          message,
        })
        console.error('Error al generar PDF:', err)
      } finally {
        setPdfLoading(false)
      }
    },
    [addNotification]
  )

  const clearPdfError = useCallback(() => setPdfError(null), [])

  const reportPdfError = useCallback(
    (message: string) => {
      setPdfError(message)
      addNotification({
        type: 'error',
        title: 'Error al generar PDF',
        message,
      })
    },
    [addNotification]
  )

  return { pdfLoading, pdfError, runExport, clearPdfError, reportPdfError }
}
