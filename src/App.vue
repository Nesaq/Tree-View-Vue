<script setup lang="ts">
import { onMounted, ref } from 'vue'

import SidebarView from './components/Sidebar/SidebarView.vue'
import { useContents } from './composables/useContents'

const { tree, activeNodeKeys, loading, error, fetchContents } = useContents()
// ref для v-model
const selectedSidebarKey = ref<string | null>(null)

onMounted(() => {
  fetchContents()
})
</script>

<template>
  <div class="app-layout">
    <div v-if="loading" class="sidebar-placeholder">Загрузка оглавления...</div>
    <div v-else-if="error" class="sidebar-placeholder">Ошибка: {{ error.message }}</div>
    <SidebarView
      v-else
      :data="tree"
      :active-node-keys="activeNodeKeys"
      v-model:selectedKey="selectedSidebarKey"
      @select="
        (node) => {
          console.log('Событие select:', node)
        }
      "
      @toggle="
        (key, isOpen) => {
          console.log('Событие toggle:', key, isOpen)
        }
      "
    >
      <template v-slot:header>
        <h1>Оглавление</h1>
      </template>
    </SidebarView>

    <main class="content-area"><router-view /></main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.content-area {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

.sidebar-placeholder {
  width: 300px;
  padding: 1rem;
  border-right: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  background-color: #f9f9f9;
}
</style>
