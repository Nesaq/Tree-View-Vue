<script setup lang="ts">
import TableOfContents from './components/TableOfContents.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <TableOfContents />
    </div>
  </header>

  <main><router-view /></main>
</template>

<style scoped></style>
