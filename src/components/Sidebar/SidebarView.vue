<script setup lang="ts">
import { computed, toRef, type PropType, ref } from 'vue'
import type { TreeNode } from '@/types/ApiType'
import { provideSidebar } from '@/composables/useSidebar'

import { filterTree } from '@/utils/filterTree'

import SidebarSearch from '@/components/Sidebar/SidebarSearch.vue'
import SidebarTree from '@/components/Sidebar/SidebarTree.vue'

const props = defineProps({
  data: {
    type: Array as PropType<TreeNode[] | undefined | null>,
    default: () => [],
  },
  activeNodeKeys: {
    type: Set as PropType<Set<string>>,
    required: true,
  },
  selectedKey: {
    // Проп для v-model:selectedKey
    type: String as PropType<string | null>,
    default: null,
  },
})

// Определяем Emits
const emit = defineEmits<{
  (e: 'update:selectedKey', key: string | null): void
  (e: 'select', node: TreeNode | null): void
  (e: 'toggle', key: string, isOpen: boolean): void
}>()

const isCollapsed = ref<boolean>(false)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

// Передаем реактивные ссылки на пропсы и emit в provideSidebar
const activeKeysRef = toRef(props, 'activeNodeKeys')
// Ref для пропа selectedKey
const selectedKeyRef = toRef(props, 'selectedKey')

// Получаем состояние фильтра (остальное управляется через emit/props)
const { debouncedFilterText, isFilterActive } = provideSidebar(activeKeysRef, selectedKeyRef, emit)

// Фильтруем дерево на основе props.data и состояния из useSidebar
const filteredTree = computed(() => {
  const treeData = props.data ?? []
  const query = debouncedFilterText.value
  return filterTree(treeData, query)
})

const hasVisibleData = computed(() => filteredTree.value.length > 0)
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <template v-if="!isCollapsed">
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
          <SidebarTree :nodes="filteredTree">
            <template v-slot:node="slotProps">
              <slot name="node" v-bind="slotProps"></slot>
            </template>
          </SidebarTree>
        </template>
        <template v-else>
          <slot name="empty">
            <div class="sidebar-empty">
              {{ isFilterActive ? 'Ничего не найдено' : 'Нет данных' }}
            </div>
          </slot>
        </template>
      </div>
    </template>

    <footer class="sidebar-footer">
      <slot name="footer" :isCollapsed="isCollapsed" :toggleCollapse="toggleCollapse">
        <button @click="toggleCollapse" class="collapse-button">
          <span v-if="isCollapsed">▶</span>
          <span v-else>◀</span>
        </button>
      </slot>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  position: relative;
  transition: width 0.3s ease;
  background-color: var(--sidebar-bg-color);
  flex-direction: column;
  width: var(--sidebar-width, 300px);
  height: 100vh;
  border-right: 1px solid var(--sidebar-border-color);
  background-color: var(--sidebar-bg-color);
  color: var(--sidebar-text-color);
  font-family: sans-serif;
  overflow: hidden;
  font-size: 14px;
}

/* Стили для свернутого состояния */
.sidebar.collapsed {
  width: 50px;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px 16px 8px 16px;
  flex-shrink: 0;
  font-size: 1.1em;
  font-weight: bold;
  color: #000;
}

.sidebar-search-wrapper {
  padding: 8px 16px 16px 16px;
  flex-shrink: 0;
}

.sidebar-content {
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 0 16px 16px 16px;
}

.sidebar-empty {
  text-align: center;
  color: #6c757d;
  padding: 32px 16px;
}
.sidebar-footer {
  padding: 8px 16px;
  border-top: 1px solid var(--sidebar-border-color);
  flex-shrink: 0;
  margin-top: auto;
  background-color: var(--sidebar-bg-color);
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .sidebar-footer {
  padding: 8px;
}

.sidebar.collapsed .collapse-button {
  width: auto;
  padding: 5px;
  margin: 0 auto;
}

.collapse-button {
  display: block;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--sidebar-border-color);
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  line-height: 1;
  color: var(--sidebar-text-color);
  transition: background-color 0.2s ease;
}

.collapse-button:hover {
  background-color: #f0f0f0;
}
</style>
