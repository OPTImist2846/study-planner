import { useEffect } from 'react'
import type { ToastMessage } from '../../types/task'
import './Toast.scss'

const TOAST_LIFETIME_MS = 3500

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_LIFETIME_MS)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`toast toast--${toast.variant}`}
      role={toast.variant === 'error' ? 'alert' : 'status'}
    >
      <p className="toast__message">{toast.message}</p>
      <button
        type="button"
        className="toast__close"
        aria-label="Закрити повідомлення"
        onClick={() => onDismiss(toast.id)}
      >
        ×
      </button>
    </div>
  )
}

export default Toast
