<script lang="ts" setup>
import { RouterView } from 'vue-router'
import HeroPatternBackground from './components/HeroPatternBackground.vue'
import MainSidebar from './components/MainSidebar'
</script>

<template>
  <MainSidebar />
  <RouterView />

  <HeroPatternBackground />
</template>
