<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TreeNode } from '../types/ApiType'

const props = defineProps<{
  node: TreeNode
}>()

const isExpanded = ref<boolean>(false)
const isSelected = ref<boolean>(false)

function toggleExpand() {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
  isSelected.value = true
}

const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

const indentStyle = computed(() => {
  const indentSize = 20
  return {
    paddingLeft: `${props.node.level * indentSize}px`,
  }
})
</script>

<template>
  <li>
    <div
      class="node-content"
      @click="toggleExpand"
      :style="indentStyle"
      :class="{ selected: isSelected }"
    >
      <span class="arrow" :class="{ expanded: isExpanded, visible: hasChildren }"> ▶ </span>
      <span>{{ node.name }}</span>
    </div>
    <ul v-if="isExpanded && hasChildren">
      <TreeNode v-for="child in node.children" :key="child.key" :node="child" />
    </ul>
  </li>
</template>

<style scoped>
ul {
  /* margin-left: 20px; */
  list-style-type: none;
  padding-left: 0;
}
li {
  margin-top: 0px;
  padding: 0;
}

.node-content {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 5px 0;
}

.node-content.selected {
  background-color: #e6f7ff;
  font-weight: bold;
}
.arrow {
  display: inline-block;
  width: 1em;
  margin-right: 5px;
  transition: transform 0.1s ease-in-out;
  text-align: center;
  opacity: 0;
  color: #555;
}

.arrow.visible {
  opacity: 1;
}

.arrow.expanded {
  transform: rotate(90deg);
}
</style>
