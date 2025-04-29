import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Content, TreeNode, Pages, Page } from '../types/ApiType.ts'
import { buildTree } from '../utyls/buildTree.ts'

const URL: string = 'https://prolegomenon.s3.amazonaws.com/contents.json'

export function useFetchData() {
  const route = useRoute()
  const state = ref<Content | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // дерево страниц
  const tree = computed((): TreeNode[] => {
    return state.value ? buildTree(state.value) : []
  })

  // набор ключей родителей активной ноды
  const activeNodeKeys = computed(() => {
    const keys = new Set<string>()
    if (!state.value || !state.value.pages) {
      return keys
    }

    const pagesMap = state.value.pages as Pages
    const currentPath = route.path

    // Ищем ключ ноды, соответствующий текущему пути
    let activeKey: string | null = null
    for (const key in pagesMap) {
      const page = pagesMap[key]
      if (page.link && `/${page.link}` === currentPath) {
        activeKey = key
        break
      }
    }
    // Если нашли активную ноду, собираем ключи ее родителей
    if (activeKey) {
      let currentKey: string | null = activeKey
      while (currentKey) {
        keys.add(currentKey)
        const currentPage = pagesMap[currentKey] as Page
        currentKey = currentPage?.parentKey || null // Переходим к родителю
      }
    }

    return keys
  })

  async function fetchContents() {
    if (state.value || loading.value) {
      return
    }
    loading.value = true
    error.value = null
    try {
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

  return { tree, loading, error, fetchContents, activeNodeKeys }
}
