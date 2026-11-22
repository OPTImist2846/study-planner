import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStorage(key, isValid) ?? initialValue)

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== key || event.newValue === null) return
      const next = readStorage(key, isValid)
      if (next !== null) setValue(next)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, isValid])

  return [value, setValue]
}
