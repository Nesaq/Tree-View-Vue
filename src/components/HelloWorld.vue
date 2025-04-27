<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div>
    <h1>Hello World</h1>
    <h2>Hello World</h2>
    {{ msg }}
  </div>
</template>

<style scoped>
h1 {
  color: red;
}
</style>
