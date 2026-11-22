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

  return [value, setValue]
}
