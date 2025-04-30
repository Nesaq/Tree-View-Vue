import { ref, watch, type Ref } from 'vue'

// Создает пару реактивных переменных: одна для немедленного ввода,
// другая - обновляемая с задержкой (debounce).
export function useDebouncedRef<T>(initialValue: T, delay: number) {
  const inputRef: Ref<T> = ref(initialValue) as Ref<T>
  const debouncedRef: Ref<T> = ref(initialValue) as Ref<T>

  let debounceTimer: number | undefined

  watch(inputRef, (newValue) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedRef.value = newValue
    }, delay)
  })

  const clear = (resetValue: T = initialValue) => {
    clearTimeout(debounceTimer)
    inputRef.value = resetValue
    debouncedRef.value = resetValue
  }

  return {
    inputRef,
    debouncedRef,
    clear,
  }
}
