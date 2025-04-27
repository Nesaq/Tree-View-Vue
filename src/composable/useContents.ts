import { ref, computed } from 'vue'
import type { Content, TreeNode } from '../types/ApiType.ts'
import { buildTree } from '../utyls/buildTree.ts'

const URL: string = 'https://prolegomenon.s3.amazonaws.com/contents.json'

export function useFetchData() {
  const state = ref<Content | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Вычисляемое свойство для дерева
  const tree = computed((): TreeNode[] => {
    return state.value ? buildTree(state.value) : []
  })

  async function fetchContents() {
    if (state.value || loading.value) {
      return
    }
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

  return { tree, loading, error, fetchContents }
}
