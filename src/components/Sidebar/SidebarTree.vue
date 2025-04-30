<script setup lang="ts">
import type { TreeNode } from '@/types/ApiType'
import SidebarNode from '@/components/Sidebar/SidebarNode.vue'

const props = defineProps<{
  nodes: TreeNode[]
}>()
</script>

<template>
  <ul class="sidebar-tree">
    <SidebarNode v-for="node in props.nodes" :key="node.key" :node="node" />
  </ul>
</template>

<style scoped>
.sidebar-tree {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}
</style>
