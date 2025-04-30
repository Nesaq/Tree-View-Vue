import { ref, provide, inject, type Ref, computed, watch } from 'vue'
import type { InjectionKey } from 'vue'
import { useDebouncedRef } from '@/composables/useDebounce'
import type { TreeNode } from '@/types/ApiType'

// Типы событий
type SidebarEmit = {
  (e: 'update:selectedKey', key: string | null): void
  (e: 'select', node: TreeNode | null): void
  (e: 'toggle', key: string, isOpen: boolean): void
}

interface SidebarContext {
  openKeys: Ref<Set<string>>
  _selectedKeyInternal: Ref<string | null> // Внутреннее состояние
  selectedKey: Ref<string | null> // Проп из SidebarView
  isNodeSelected: (key: string) => boolean

  toggleNode: (key: string) => void // Метод для раскрытия/сворачивания ноды по ключу
  selectNode: (key: string | null, node: TreeNode | null) => void // Метод для установки выбранного ключа

  // Фильтр
  filterInputText: Ref<string> // Для v-model в SidebarSearch
  debouncedFilterText: Ref<string> // Для debounce в SidebarSearch
  clearFilter: () => void // Функция сброса из useDebouncedRef
  isFilterActive: Ref<boolean> // Флаг активности фильтра
  setOpenKeys: (keys: Set<string>) => void
}

const SidebarKey: InjectionKey<SidebarContext> = Symbol('SidebarContext')

// Функция для предоставления контекста (вызывается в SidebarView.vue)
export function provideSidebar(
  initialActiveKeys: Ref<Set<string>>,
  selectedKeyProp: Ref<string | null>,
  emit: SidebarEmit,
) {
  const openKeys = ref<Set<string>>(new Set(initialActiveKeys.value))
  const _selectedKeyInternal = ref<string | null>(selectedKeyProp.value)

  const { inputRef: filterInputText, debouncedRef, clear: clearFilter } = useDebouncedRef('', 600)
  const debouncedFilterText = computed(() => debouncedRef.value.trim().toLowerCase())
  const isFilterActive = computed(() => !!debouncedFilterText.value)

  // Метод для принудительной установки раскрытых ключей
  const setOpenKeys = (keys: Set<string>) => {
    openKeys.value = new Set(keys)
  }

  // Синхронизация с URL и пропами
  watch(
    initialActiveKeys,
    (newActiveKeys) => {
      setOpenKeys(newActiveKeys)
      let activeNodeKeyFromUrl: string | null = null
      if (newActiveKeys.size > 0) {
        activeNodeKeyFromUrl = Array.from(newActiveKeys)[0] ?? null
      }
      if (selectedKeyProp.value === null && activeNodeKeyFromUrl !== null) {
        _selectedKeyInternal.value = activeNodeKeyFromUrl
        emit('update:selectedKey', activeNodeKeyFromUrl)
      } else if (newActiveKeys.size === 0 && selectedKeyProp.value === null) {
        _selectedKeyInternal.value = null
        emit('update:selectedKey', null)
      }
    },
    { immediate: true },
  )

  watch(selectedKeyProp, (newSelectedKey) => {
    _selectedKeyInternal.value = newSelectedKey
  })

  // Функция для проверки выбранности (используется в SidebarNode)
  const isNodeSelected = (key: string): boolean => {
    return _selectedKeyInternal.value === key
  }

  // Метод для раскрытия/сворачивания ноды по ключу
  const toggleNode = (key: string) => {
    const isOpen = openKeys.value.has(key)
    const currentOpenKeys = openKeys.value
    if (isOpen) {
      currentOpenKeys.delete(key)
    } else {
      currentOpenKeys.add(key)
    }
    openKeys.value = new Set(currentOpenKeys)
    emit('toggle', key, !isOpen)
  }

  // Метод для установки выбранного ключа
  const selectNode = (key: string | null, node: TreeNode | null) => {
    _selectedKeyInternal.value = key
    emit('update:selectedKey', key)
    emit('select', node)

    if (key && node?.children && node.children.length > 0 && !openKeys.value.has(key)) {
      const currentOpenKeys = openKeys.value
      currentOpenKeys.add(key)
      openKeys.value = new Set(currentOpenKeys)
      emit('toggle', key, true)
    }
  }

  // контекст
  const context: SidebarContext = {
    openKeys,
    _selectedKeyInternal, // Предоставляем внутренний ключ
    selectedKey: selectedKeyProp, // Предоставляем проп для чтения (если нужно)
    isNodeSelected, // Предоставляем функцию проверки
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
