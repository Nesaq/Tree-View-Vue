<script setup lang="ts">
import type { TreeNode } from '../types/ApiType'

defineProps<{
  node: TreeNode
}>()
</script>

<template>
  <li>
    <span>{{ node.name }}</span>
    <ul v-if="node.children && node.children.length > 0">
      <TreeNode v-for="child in node.children" :key="child.key" :node="child" />
    </ul>
  </li>
</template>

<style scoped>
ul {
  margin-left: 20px;
  /* list-style-type: none; */
  padding-left: 0;
}
li {
  margin-top: 5px;
}
</style>
