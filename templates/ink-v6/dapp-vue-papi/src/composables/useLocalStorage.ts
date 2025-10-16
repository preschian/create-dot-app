import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const value = ref<T>(initialValue)

  const stored = localStorage.getItem(key)
  if (stored) {
    value.value = JSON.parse(stored) as T
  }

  watch(value, (newValue) => {
    if (newValue === null) {
      localStorage.removeItem(key)
    }
    else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })

  function setItem(newValue: T) {
    value.value = newValue
  }

  function removeItem() {
    value.value = null as unknown as T
  }

  return {
    value,
    setItem,
    removeItem,
  }
}
