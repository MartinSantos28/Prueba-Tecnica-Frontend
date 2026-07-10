import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppNotification, NotificationType } from '../types'

type AddNotificationInput = {
  type: NotificationType
  title: string
  message: string
  link?: string
}

type NotificationsContextValue = {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (input: AddNotificationInput) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAll: () => void
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'demo-1',
    type: 'success',
    title: 'Catálogo sincronizado',
    message: '194 productos disponibles desde dummyjson.',
    createdAt: new Date(Date.now() - 5 * 60_000),
    read: false,
    link: '/products',
  },
  {
    id: 'demo-2',
    type: 'warning',
    title: 'Stock bajo detectado',
    message: 'Varios productos tienen menos de 10 unidades en inventario.',
    createdAt: new Date(Date.now() - 45 * 60_000),
    read: false,
    link: '/products',
  },
  {
    id: 'demo-3',
    type: 'info',
    title: '208 usuarios registrados',
    message: 'El directorio está listo para consulta y exportación PDF.',
    createdAt: new Date(Date.now() - 2 * 3_600_000),
    read: true,
    link: '/users',
  },
]

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

function createId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const addNotification = useCallback((input: AddNotificationInput) => {
    setNotifications((prev) => [
      {
        id: createId(),
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
        createdAt: new Date(),
        read: false,
      },
      ...prev,
    ])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAll,
    ]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider')
  }
  return context
}
