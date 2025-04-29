<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { TreeNode } from '../types/ApiType'

const props = defineProps<{
  node: TreeNode
  parentKeys: Set<string>
}>()

const route = useRoute()

const isInitiallyExpanded = computed(() => {
  return props.parentKeys.has(props.node?.key)
})
const isExpanded = ref<boolean>(isInitiallyExpanded.value)

watch(isInitiallyExpanded, (newValue) => {
  isExpanded.value = newValue
})

function toggleExpand() {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

// активна ли ссылка
const isActive = computed(() => {
  if (!props.node.link) return false
  return route.path === `/${props.node.link}`
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
    <div class="node-content" :class="{ selected: isActive }" :style="indentStyle">
      <span
        class="arrow"
        :class="{ expanded: isExpanded, visible: hasChildren }"
        @click.stop="toggleExpand"
      >
        ▶
      </span>
      <router-link v-if="node.link" :to="`/${node.link}`" class="node-link">
        {{ node.name }}
      </router-link>
      <!-- <span v-else>{{ node.name }}</span> -->
      <span v-else @click="toggleExpand" class="node-link">{{ node.name }}</span>
    </div>

    <ul v-if="isExpanded && hasChildren">
      <TreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :parent-keys="parentKeys"
      />
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
