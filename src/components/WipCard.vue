<script setup lang="ts">
import { Hammer } from '@lucide/vue'
</script>

<template>
  <div class="card">
    <Hammer :size="48" :strokeWidth="2.5" />
    <h1>Em construção</h1>
    <p>Esta seção ainda não está pronta.</p>
  </div>
</template>

<style scoped>
.card {
  margin: auto;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px;
}

.card h1 {
  font-weight: bold;
}
</style>
