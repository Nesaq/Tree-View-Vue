<script setup lang="ts">
import { computed } from 'vue'
import type { TreeNode } from '@/types/ApiType'
import { useSidebar } from '@/composables/useSidebar'

const props = defineProps<{
  node: TreeNode
}>()

// Cлоты и их пропсы
defineSlots<{
  node(props: {
    node: TreeNode
    isExpanded: boolean
    isActive: boolean
    hasChildren: boolean
    level: number
    handleToggleExpand: () => void
    handleSelect: () => void
    indentStyle: { paddingLeft: string }
  }): void
}>()

// Cостояние и методы из контекста
const { openKeys, isNodeSelected, toggleNode, selectNode, isFilterActive } = useSidebar()

// Определяем, раскрыта ли нода, на основе состояния из useSidebar
const isExpanded = computed(() => {
  // Раскрыта, если ее ключ есть в openKeys
  const isOpen = openKeys.value.has(props.node.key)
  // или если фильтр активен и у ноды есть дети (автораскрытие при фильтре)
  const autoOpen = isFilterActive.value && hasChildren.value
  return isOpen || autoOpen
})

// Определяем, есть ли у ноды дети (для стрелки и рендера ul)
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

// Определяем, активна ли нода (выбрана)
const isActive = computed(() => {
  // Используем функцию isNodeSelected из useSidebar
  return isNodeSelected(props.node.key)
})

// Функция для клика по стрелке или тексту (если нет ссылки)
function handleToggleExpand() {
  if (hasChildren.value) {
    toggleNode(props.node.key)
  }
}

// Функция для клика по ссылке
function handleSelect() {
  selectNode(props.node.key, props.node)
}

// Отступ
const indentStyle = computed(() => {
  const indentSize = 20
  return { paddingLeft: `${props.node.level * indentSize}px` }
})

// Данные для слота
const slotProps = computed(() => ({
  node: props.node,
  isExpanded: isExpanded.value,
  isActive: isActive.value,
  hasChildren: hasChildren.value,
  level: props.node.level,
  handleToggleExpand: handleToggleExpand,
  handleSelect: handleSelect,
  indentStyle: indentStyle.value,
}))
</script>

<template>
  <li>
    <slot name="node" v-bind="slotProps">
      <div
        class="node-content"
        :class="{ selected: slotProps.isActive }"
        :style="slotProps.indentStyle"
      >
        <!-- Стрелка для раскрытия/сворачивания -->
        <span
          class="arrow"
          :class="{ expanded: slotProps.isExpanded, visible: slotProps.hasChildren }"
          @click.stop="slotProps.handleToggleExpand"
        >
          ▶
        </span>

        <!-- Ссылка (если есть link) -->
        <router-link
          v-if="slotProps.node.link"
          :to="`/${slotProps.node.link}`"
          class="node-link"
          @click="slotProps.handleSelect"
        >
          {{ slotProps.node.name }}
        </router-link>

        <!-- Обычный текст (если нет link) -->
        <span
          v-else
          @click="
            () => {
              slotProps.handleSelect()
              slotProps.handleToggleExpand()
            }
          "
          class="node-link"
        >
          {{ slotProps.node.name }}
        </span>
      </div>
    </slot>
    <ul v-if="slotProps.isExpanded && slotProps.hasChildren">
      <SidebarNode v-for="child in slotProps.node.children" :key="child.key" :node="child">
        <template v-slot:node="childSlotProps">
          <slot name="node" v-bind="childSlotProps"></slot>
        </template>
      </SidebarNode>
    </ul>
  </li>
</template>
<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}
li {
  margin-top: 0;
  padding: 0;
}
.node-content {
  display: flex;
  align-items: center;
  /* cursor: pointer; */
  user-select: none;
  padding: 4px 0;
}
.node-content.selected .node-link {
  font-weight: bold;
  color: #1890ff;
}

.node-link {
  text-decoration: none;
  color: inherit;
  flex-grow: 1;
  cursor: pointer;
  padding: 2px 5px;
}

.arrow {
  display: inline-block;
  width: 1em;
  height: 1.5em;
  line-height: 1.5em;
  margin-right: 5px;
  transition: transform 0.1s ease-in-out;
  text-align: center;
  opacity: 0;
  color: #555;
  cursor: pointer;
  border-radius: 10px;
}
.arrow:hover {
  color: #1890ff;
}
.arrow.visible {
  opacity: 1;
}
.arrow.expanded {
  transform: rotate(90deg);
}
</style>
