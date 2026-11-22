import type { CSSProperties } from 'react'
import type { PendingDeletion } from '../../types/task'
import './Toast.scss'

interface UndoToastProps {
  entry: PendingDeletion
  message: string
  onUndo: (key: string) => void
}

function UndoToast({ entry, message, onUndo }: UndoToastProps) {
  const duration = entry.expiresAt - entry.startedAt

  return (
    <div className="toast toast--undo" role="status">
      <p className="toast__message">{message}</p>
      <button type="button" className="toast__action" onClick={() => onUndo(entry.key)}>
        Скасувати
      </button>
      <div
        className="toast__progress"
        style={{ '--toast-duration': `${duration}ms` } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  )
}

export default UndoToast
