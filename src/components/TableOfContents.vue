<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useContents } from '../composables/useContents'
import TreeNode from './TreeNode.vue'
import { filterTree } from '@/utils/filterTree'
import { useDebouncedRef } from '@/composables/useDebounce'

const { loading, error, fetchContents, tree, activeNodeKeys } = useContents()

const {
  inputRef: filterInputText,
  debouncedRef: debouncedFilterText,
  clear: clearFilter,
} = useDebouncedRef('', 600)

const filteredTree = computed(() => {
  const query = debouncedFilterText.value.trim().toLowerCase()
  if (!query) {
    return tree.value
  }
  return filterTree(tree.value, query)
})

const isFilterActive = computed(() => !!debouncedFilterText.value.trim())

onMounted(() => {
  fetchContents()
})
</script>

<template>
  <div class="table-of-contents">
    <div class="filter-input-wrapper">
      <input type="text" v-model="filterInputText" placeholder="Фильтр..." class="filter-input" />
      <button
        v-if="filterInputText"
        @click="clearFilter()"
        class="clear-button"
        aria-label="Очистить фильтр"
      >
        &times;
      </button>
    </div>

    <h1>Оглавление</h1>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error.message }}</div>

    <ul v-else-if="filteredTree.length > 0">
      <TreeNode
        v-for="rootNode in filteredTree"
        :key="rootNode.key"
        :node="rootNode"
        :parent-keys="activeNodeKeys"
        :filter-active="isFilterActive"
      />
    </ul>
    <div v-else-if="isFilterActive">Ничего не найдено.</div>
    <div v-else>Нет данных</div>
  </div>
</template>

<style scoped>
.table-of-contents {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 1rem;
  border-right: 1px solid #eee;
  font-family: sans-serif;
  height: 100vh;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.filter-input-wrapper {
  position: relative;
  margin-bottom: 1rem;
  flex-shrink: 0;
}
.filter-input {
  width: 100%;
  padding: 8px 25px 8px 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.clear-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2em;
  color: #aaa;
  cursor: pointer;
  padding: 0 5px;
}
.clear-button:hover {
  color: #333;
}

ul {
  list-style-type: none;
  padding-left: 0px;
  overflow-y: auto;
  flex-grow: 1;
}
</style>
