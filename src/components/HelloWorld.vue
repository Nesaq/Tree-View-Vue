<script setup lang="ts">
import { useFetchData } from '@/composable/useContents'
import { onMounted, watch } from 'vue'

const { contents, loading, error, fetchContents } = useFetchData()

defineProps<{
  msg: string
}>()

onMounted(() => {
  fetchContents()
})

watch(contents, (val) => {
  if (val) {
    console.log('Оглавление загружено:', val)
  }
})
</script>

<template>
  <div>
    <h1>Оглавление</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error.message }}</div>
    <div v-else>data загружены</div>
    {{ msg }}
  </div>
</template>

<style scoped>
h1 {
  color: red;
}
</style>
