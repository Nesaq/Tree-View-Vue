import { ref } from 'vue'
import type { Content } from '../types/ApiType.ts'

const URL: string = 'https://prolegomenon.s3.amazonaws.com/contents.json'

export function useFetchData() {
  const state = ref<Content>()

  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchContents() {
    loading.value = true
    error.value = null
    try {
      // const response = await fetch('https://example.com/404.json');
      const response = await fetch(URL)
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных')
      }
      const data = await response.json()
      state.value = data
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  return { state, loading, error, fetchContents }
}
