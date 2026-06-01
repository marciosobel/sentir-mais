<script lang="ts" setup>
import { RouterView } from 'vue-router'
import HeroPatternBackground from './components/HeroPatternBackground.vue'
import MainSidebar from './components/MainSidebar'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth.store'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
</script>

<template>
  <MainSidebar v-if="isAuthenticated" />
  <RouterView />

  <HeroPatternBackground />
</template>
