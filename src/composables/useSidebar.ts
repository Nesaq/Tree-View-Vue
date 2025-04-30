import { ref, provide, inject, type Ref, computed } from 'vue'
import type { InjectionKey } from 'vue'
import { useDebouncedRef } from './useDebounce'

interface SidebarContext {
  openKeys: Ref<Set<string>>
  selectedKey: Ref<string | null>
  toggleNode: (key: string) => void
  selectNode: (key: string | null) => void
  filterInputText: Ref<string> // Для v-model в SidebarSearch
  debouncedFilterText: Ref<string> // Для debounce в SidebarSearch
  clearFilter: () => void // Функция сброса из useDebouncedRef
  isFilterActive: Ref<boolean> // Флаг активности фильтра
  setOpenKeys: (keys: Set<string>) => void
}

const SidebarKey: InjectionKey<SidebarContext> = Symbol('SidebarContext')

// Функция для предоставления контекста (вызывается в Sidebar.vue)
export function provideSidebar() {
  const openKeys = ref<Set<string>>(new Set())
  const selectedKey = ref<string | null>(null)

  const { inputRef: filterInputText, debouncedRef, clear: clearFilter } = useDebouncedRef('', 600)
  const debouncedFilterText = computed(() => debouncedRef.value.trim().toLowerCase())
  const isFilterActive = computed(() => !!debouncedFilterText.value)

  // Метод для раскрытия/сворачивания ноды по ключу
  const toggleNode = (key: string) => {
    const currentOpenKeys = openKeys.value
    if (currentOpenKeys.has(key)) {
      currentOpenKeys.delete(key)
    } else {
      currentOpenKeys.add(key)
    }
    openKeys.value = new Set(currentOpenKeys)
  }

  // Метод для установки выбранного ключа
  const selectNode = (key: string | null) => {
    selectedKey.value = key
    // Раскрываем ноду при выборе кликом, если она не раскрыта и имеет детей
    if (key && !openKeys.value.has(key)) {
      openKeys.value.add(key)
      openKeys.value = new Set(openKeys.value)
    }
  }

  // Метод для принудительной установки раскрытых ключей извне
  const setOpenKeys = (keys: Set<string>) => {
    openKeys.value = new Set(keys)
  }

  // контекст
  const context: SidebarContext = {
    openKeys,
    selectedKey,
    toggleNode,
    selectNode,
    filterInputText,
    debouncedFilterText,
    clearFilter,
    isFilterActive,
    setOpenKeys,
  }
  provide(SidebarKey, context)
  return context
}

// Функция для получения контекста (вызывается в SidebarNode.vue, SidebarSearch)
export function useSidebar() {
  const context = inject(SidebarKey)
  if (!context) {
    throw new Error(
      'useSidebar должен быть использован в компоненте, предоставленном provideSidebar',
    )
  }
  return context
}
