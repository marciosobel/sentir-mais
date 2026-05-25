<script lang="ts" setup>
defineProps<{
  href?: string
}>()
</script>

<template>
  <a :href="href" class="styled-link">
    <slot />
  </a>
</template>

<style scoped>
.styled-link {
  color: #000;
  background-color: rgba(0, 0, 0, 10%);
  padding: 2px 8px;
  border-radius: 999px;
  transition: background-color 75ms ease;
}

.styled-link:hover {
  background-color: rgba(0, 0, 0, 15%);
  text-decoration: underline;
}
</style>
