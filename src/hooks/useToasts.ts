import { useCallback, useRef, useState } from 'react'
import type { ToastMessage, ToastVariant } from '../types/task'

export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextId = useRef(1)

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = nextId.current
    nextId.current += 1
    setToasts((previous) => [...previous, { id, message, variant }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  return { toasts, showToast, dismissToast }
}
