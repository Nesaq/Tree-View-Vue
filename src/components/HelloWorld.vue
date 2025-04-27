<script setup lang="ts">
import { onMounted } from 'vue'
import { useFetchData } from '../composable/useContents'
import TreeNode from './TreeNode.vue'

const { loading, error, fetchContents, tree } = useFetchData()

defineProps<{
  msg: string
}>()

onMounted(() => {
  fetchContents()
})
</script>

<template>
  <div class="table-of-contents">
    <h1>Оглавление</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error.message }}</div>
    <ul v-else-if="tree.length > 0">
      <TreeNode v-for="rootNode in tree" :key="rootNode.key" :node="rootNode" />
    </ul>
    <div v-else>Нет данных</div>
  </div>
</template>

<style scoped>
.table-of-contents {
  max-width: 300px;
  padding: 1rem;
  border-right: 1px solid #eee;
  font-family: sans-serif;
  height: 100vh;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding-left: 0px;
}
</style>
