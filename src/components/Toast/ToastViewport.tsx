import { useTaskContext } from '../../hooks/useTaskContext'
import type { PendingDeletion, Task } from '../../types/task'
import Toast from './Toast'
import UndoToast from './UndoToast'
import './ToastViewport.scss'

function undoMessage(entry: PendingDeletion, tasks: readonly Task[]): string {
  if (entry.kind === 'completed') {
    return `Виконані завдання (${entry.taskIds.length}) буде видалено`
  }
  const task = tasks.find((item) => item.id === entry.taskIds[0])
  return task ? `Завдання «${task.title}» буде видалено` : 'Завдання буде видалено'
}

function ToastViewport() {
  const { tasks, pending, undoDelete, toasts, dismissToast } = useTaskContext()

  return (
    <div className="toast-viewport" aria-live="polite">
      {pending.map((entry) => (
        <UndoToast
          key={entry.key}
          entry={entry}
          message={undoMessage(entry, tasks)}
          onUndo={undoDelete}
        />
      ))}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

export default ToastViewport
