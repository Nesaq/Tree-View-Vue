<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'

// Получаем состояние фильтра и метод очистки из контекста
const { filterInputText, clearFilter } = useSidebar()
</script>

<template>
  <div class="sidebar-search">
    <input
      type="text"
      class="sidebar-search-input"
      placeholder="Фильтр..."
      v-model="filterInputText"
    />
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
.sidebar-search-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--search-border-color);
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  line-height: 1.5;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

/* Стиль при фокусе */
.sidebar-search-input:focus {
  border-color: var(--search-focus-border-color);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.sidebar-search-input::placeholder {
  color: #6c757d;
  opacity: 1;
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
