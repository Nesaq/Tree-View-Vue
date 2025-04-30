<script setup lang="ts">
import { computed, watch, toRef } from 'vue'
import type { TreeNode } from '@/types/ApiType'
import { provideSidebar } from '@/composables/useSidebar'

import { filterTree } from '@/utils/filterTree'

import SidebarSearch from '@/components/Sidebar/SidebarSearch.vue'
import SidebarTree from '@/components/Sidebar/SidebarTree.vue'

const props = defineProps<{
  data: TreeNode[] | undefined | null
  activeNodeKeys: Set<string>
}>()

const activeKeysRef = toRef(props, 'activeNodeKeys')

// Получаем состояние фильтра из useSidebar
const { debouncedFilterText, isFilterActive, setOpenKeys, selectNode } = provideSidebar()

// Синхронизация состояния useSidebar с URL (через activeNodeKeys)
watch(
  activeKeysRef,
  (newActiveKeys) => {
    setOpenKeys(newActiveKeys)

    let activeNodeKey: string | null = null
    if (newActiveKeys.size > 0) {
      activeNodeKey = Array.from(newActiveKeys)[0] ?? null
    }
    selectNode(activeNodeKey)
  },
  { immediate: true },
)

// Фильтруем дерево на основе props.data и состояния из useSidebar
const filteredTree = computed(() => {
  const treeData = props.data ?? []
  const query = debouncedFilterText.value
  return filterTree(treeData, query)
})

const hasVisibleData = computed(() => filteredTree.value.length > 0)
</script>

<template>
  <aside class="sidebar">
    <header class="sidebar-header" v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <div class="sidebar-search-wrapper">
      <slot name="search">
        <SidebarSearch />
      </slot>
    </div>

    <div class="sidebar-content">
      <template v-if="hasVisibleData">
        <slot>
          <SidebarTree :nodes="filteredTree" />
        </slot>
      </template>
      <template v-else>
        <slot name="empty">
          <div class="sidebar-empty">
            {{ isFilterActive ? 'Ничего не найдено' : 'Нет данных' }}
          </div>
        </slot>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100vh;
  border-right: 1px solid #eee;
  background-color: #f9f9f9;
  font-family: sans-serif;
  overflow: hidden;
}

.sidebar-header {
  padding: 1rem 1rem 0.5rem 1rem;
  flex-shrink: 0;
  font-size: 1.2em;
  font-weight: bold;
}

.sidebar-search-wrapper {
  padding: 0.5rem 1rem 1rem 1rem;
  flex-shrink: 0;
}

.sidebar-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 1rem 1rem 1rem;
}

.sidebar-empty {
  text-align: center;
  color: #777;
  padding-top: 2rem;
}
</style>
