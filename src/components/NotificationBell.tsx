import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationsContext'
import { formatRelativeTime } from '../utils/formatRelativeTime'
import type { AppNotification, NotificationType } from '../types'

const TYPE_LABELS: Record<NotificationType, string> = {
  info: 'Info',
  success: 'Éxito',
  warning: 'Aviso',
  error: 'Error',
}

function NotificationIcon({ type }: { type: NotificationType }) {
  return (
    <span className={`notification-item-icon notification-item-icon--${type}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {type === 'success' && (
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {type === 'warning' && (
          <>
            <path d="M12 9v4" strokeLinecap="round" />
            <path d="M12 17h.01" strokeLinecap="round" />
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </>
        )}
        {type === 'error' && (
          <>
            <path d="M18 6L6 18" strokeLinecap="round" />
            <path d="M6 6l12 12" strokeLinecap="round" />
          </>
        )}
        {type === 'info' && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v6" strokeLinecap="round" />
            <path d="M12 7h.01" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  )
}

function NotificationItem({
  notification,
  onRead,
  onDismiss,
  onNavigate,
}: {
  notification: AppNotification
  onRead: (id: string) => void
  onDismiss: (id: string) => void
  onNavigate: () => void
}) {
  const content = (
    <>
      <NotificationIcon type={notification.type} />
      <div className="notification-item-body">
        <div className="notification-item-header">
          <span className="notification-item-title">{notification.title}</span>
          <span className="notification-item-time">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="notification-item-message">{notification.message}</p>
        <span className="notification-item-type">{TYPE_LABELS[notification.type]}</span>
      </div>
      <button
        type="button"
        className="notification-item-dismiss"
        aria-label="Descartar notificación"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDismiss(notification.id)
        }}
      >
        ×
      </button>
    </>
  )

  const className = `notification-item${notification.read ? '' : ' unread'}`

  if (notification.link) {
    return (
      <Link
        to={notification.link}
        className={className}
        onClick={() => {
          onRead(notification.id)
          onNavigate()
        }}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => onRead(notification.id)}
    >
      {content}
    </button>
  )
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  } = useNotifications()

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div className="notification-center" ref={containerRef}>
      <button
        type="button"
        className={`btn-notification${open ? ' active' : ''}`}
        title="Notificaciones"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge" aria-label={`${unreadCount} sin leer`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notifications-panel" role="dialog" aria-label="Notificaciones">
          <div className="notifications-panel-header">
            <div>
              <h2>Notificaciones</h2>
              {unreadCount > 0 && <p>{unreadCount} sin leer</p>}
            </div>
            {notifications.length > 0 && (
              <div className="notifications-panel-actions">
                {unreadCount > 0 && (
                  <button type="button" className="btn-link" onClick={markAllAsRead}>
                    Marcar todas
                  </button>
                )}
                <button type="button" className="btn-link btn-link-muted" onClick={clearAll}>
                  Limpiar
                </button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onDismiss={dismissNotification}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
