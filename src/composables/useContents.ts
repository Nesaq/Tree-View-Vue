import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Content, TreeNode, Pages, Page } from '@/types/ApiType'
import { buildTree } from '@/utils/buildTree'

const URL: string = 'https://prolegomenon.s3.amazonaws.com/contents.json'
const MAX_RETRIES = 2
const RETRY_DELAY = 1000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useContents() {
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

  async function fetchContents(retriesLeft = MAX_RETRIES) {
    // Устанавливаем loading и сбрасываем ошибку только при самом первом вызове
    if (retriesLeft === MAX_RETRIES) {
      loading.value = true
      error.value = null
    }
    loading.value = true
    error.value = null
    try {
      const response = await fetch(URL)
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      state.value = data
      error.value = null
      loading.value = false
    } catch (err) {
      console.error(`Попытка загрузки не удалась (осталось ${retriesLeft} повторов):`, err)
      if (retriesLeft > 0) {
        console.log(`Осталось попыток: ${retriesLeft - 1}. Повтор через ${RETRY_DELAY}мс...`)
        await delay(RETRY_DELAY)
        await fetchContents(retriesLeft - 1)
      } else {
        console.error('Все попытки загрузки исчерпаны.')
        error.value = err as Error
        loading.value = false
      }
    }
  }

  return { tree, loading, error, fetchContents, activeNodeKeys, state }
}
