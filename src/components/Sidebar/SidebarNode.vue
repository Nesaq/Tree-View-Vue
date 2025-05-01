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
    <Transition name="slide-fade">
      <ul v-if="slotProps.isExpanded && slotProps.hasChildren">
        <SidebarNode v-for="child in slotProps.node.children" :key="child.key" :node="child">
          <template v-slot:node="childSlotProps">
            <slot name="node" v-bind="childSlotProps"></slot>
          </template>
        </SidebarNode>
      </ul>
    </Transition>
  </li>
</template>
<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}
li {
  margin-top: 0;
  padding: 0;
}
.node-content {
  display: flex;
  align-items: center;
  user-select: none;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 4px;
  border-radius: 4px;
  transition: background-color 0.1s ease;
}

.node-content.selected .node-link {
  color: var(--node-selected-text-color);
  font-weight: bold;
  text-decoration: none;
}

.node-link {
  text-decoration: none;
  color: var(--node-text-color);
  flex-grow: 1;
  cursor: pointer;
  padding: 2px 5px;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Ограничиваем количество строк до 2 */
  -webkit-box-orient: vertical; /* Ориентируем бокс вертикально */
  line-clamp: 2;
  overflow: hidden;
}

.node-link:hover {
  text-decoration: none;
}
.node-content:hover .node-link {
  color: var(--node-selected-text-color);
}

.arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  margin-right: 4px;
  transition: transform 0.1s ease-in-out;
  text-align: center;
  opacity: 0;
  color: var(--arrow-color);
  cursor: pointer;
  border-radius: 10px;
}
.arrow:hover {
  color: var(--arrow-hover-color);
}
.arrow.visible {
  opacity: 1;
}
.arrow.expanded {
  transform: rotate(90deg);
}
/* Стили для Transition slide-fade */
.slide-fade-enter-active {
  transition: all 0.2s ease-out; /* Время и функция анимации появления */
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-5px); /* Легкий сдвиг вверх при появлении/исчезновении */
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

/* Конечное состояние для enter (начальное для leave уже есть у ul) */
.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}
</style>
