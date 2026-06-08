<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { computed, onMounted, ref } from 'vue'
import { useDashboard } from '@/http'
import type { WeeklySummary } from '@/http/dashboard'
import WeeklyEmotionsCard from './components/WeeklyEmotionsCard.vue'
import WeeklyEventsSection from './components/WeeklyEventsSection.vue'

dayjs.extend(utc)

const dashboard = useDashboard()
const summary = ref<WeeklySummary | null>(null)
const loading = ref(true)
const errorMessage = ref('')

const weekRangeLabel = computed(() => {
  if (!summary.value) {
    return ''
  }

  const weekStart = dayjs.utc(summary.value.weekStart)
  const weekEnd = weekStart.add(6, 'day')

  return `${weekStart.format('DD/MM')} até ${weekEnd.format('DD/MM')}`
})

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    summary.value = await dashboard.getWeeklyDashboard()
  } catch (error) {
    console.error('Failed to load weekly dashboard:', error)
    errorMessage.value = 'Não foi possível carregar resumo da semana.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="dashboard-week-view">
    <h1 v-if="summary" class="week-range-title">{{ weekRangeLabel }}</h1>

    <div v-if="loading" class="card state-card">Carregando resumo da semana...</div>
    <div v-else-if="errorMessage" class="card state-card">{{ errorMessage }}</div>

    <template v-else-if="summary">
      <WeeklyEmotionsCard :summary="summary" />
      <WeeklyEventsSection :events="summary.mainEvents" />
    </template>
  </main>
</template>

<style scoped>
.dashboard-week-view {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.week-range-title {
  margin: 0;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 800;
}

.state-card {
  padding: 1rem 1.25rem;
  text-align: center;
}
</style>
