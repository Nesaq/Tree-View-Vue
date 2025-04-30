<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'

// Получаем состояние фильтра и метод очистки из контекста
const { filterInputText, clearFilter } = useSidebar()
</script>

<template>
  <div class="sidebar-search">
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
</template>

<style scoped>
.sidebar-search {
  position: relative;
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
</style>
