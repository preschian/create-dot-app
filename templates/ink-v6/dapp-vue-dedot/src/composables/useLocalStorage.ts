import { ref } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const stored = localStorage.getItem(key)
  const value = ref<T>(stored ? JSON.parse(stored) : initialValue)

  const setItem = (newValue: T) => {
    value.value = newValue
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  const removeItem = () => {
    value.value = initialValue
    localStorage.removeItem(key)
  }

  return { value, setItem, removeItem }
}
