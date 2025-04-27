import { ref } from 'vue'

const URL = 'https://prolegomenon.s3.amazonaws.com/contents.json'

export function useFetchData() {
  const contents = ref<string[]>([])
  // console.log('contents.value:', contents.value)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchContents() {
    loading.value = true
    error.value = null
    try {
      // const response = await fetch('https://example.com/404.json');
      const response = await fetch(URL)
      const data = await response.json()
      contents.value = data
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  return { contents, loading, error, fetchContents }
}
