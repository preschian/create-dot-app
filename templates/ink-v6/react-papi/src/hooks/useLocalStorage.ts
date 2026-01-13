import { useCallback, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  const setItem = useCallback((newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }, [key])

  const removeItem = useCallback(() => {
    setValue(initialValue)
    localStorage.removeItem(key)
  }, [key, initialValue])

  return { value, setItem, removeItem }
}
