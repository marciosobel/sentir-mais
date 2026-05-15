<script lang="ts" setup>
import { Plus } from '@lucide/vue'
</script>

<template>
  <div class="logo-container">
    <img src="@/assets/logo.svg" />
    <div class="logo-text-container">
      sentir<Plus class="logo-text-icon" :size="24" :strokeWidth="4" />
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.logo-container img {
  min-width: 64px;
  pointer-events: none;
  user-select: none;
}

.logo-text-container {
  display: flex;
  align-items: center;
  font-size: 48px;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1;
  user-select: none;
}

.logo-text-container svg {
  align-self: start;
}
</style>
