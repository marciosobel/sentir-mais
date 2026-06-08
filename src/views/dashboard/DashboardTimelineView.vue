<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { computed, onMounted, ref } from 'vue'
import { useDashboard } from '@/http'
import type { DashboardTimeline } from '@/http/dashboard'
import TimelineDayCard from './components/TimelineDayCard.vue'
import TimelineOverviewCard from './components/TimelineOverviewCard.vue'

dayjs.extend(utc)

const dashboard = useDashboard()
const timeline = ref<DashboardTimeline | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const selectedFrom = ref('')
const selectedTo = ref('')

const rangeLabel = computed(() => {
  if (!timeline.value) {
    return ''
  }

  return `${dayjs.utc(timeline.value.from).format('DD/MM')} até ${dayjs.utc(timeline.value.to).format('DD/MM')}`
})

async function loadTimeline(from?: string, to?: string) {
  loading.value = true
  errorMessage.value = ''

  try {
    timeline.value = await dashboard.getTimeline(from, to)
    if (!selectedFrom.value && !selectedTo.value && timeline.value) {
      selectedFrom.value = timeline.value.from
      selectedTo.value = timeline.value.to
    }
  } catch (error) {
    console.error('Failed to load dashboard timeline:', error)
    errorMessage.value = 'Não foi possível carregar sua linha do tempo.'
  } finally {
    loading.value = false
  }
}

async function applyRange() {
  await loadTimeline(selectedFrom.value, selectedTo.value)
}

onMounted(async () => {
  await loadTimeline()
})
</script>

<template>
  <main class="dashboard-timeline-view">
    <header class="timeline-header">
      <div>
        <p class="eyebrow">Linha do tempo</p>
        <h1 v-if="timeline">{{ rangeLabel }}</h1>
        <h1 v-else>Sua linha do tempo</h1>
        <p class="intro-copy">
          Um resumo diário para te ajudar a perceber padrões de sentimento e os eventos que mais pesaram.
        </p>
      </div>

      <form class="filter-form" @submit.prevent="applyRange">
        <label>
          De
          <input v-model="selectedFrom" type="date" />
        </label>
        <label>
          Até
          <input v-model="selectedTo" type="date" />
        </label>
        <button class="card filter-button" type="submit">Aplicar</button>
      </form>
    </header>

    <div v-if="loading" class="card state-card">Carregando linha do tempo...</div>
    <div v-else-if="errorMessage" class="card state-card">{{ errorMessage }}</div>
    <div v-else-if="timeline && timeline.days.length === 0" class="card state-card">
      Nenhum registro encontrado neste período.
    </div>

    <template v-else-if="timeline">
      <TimelineOverviewCard :days="timeline.days" />
      <section class="timeline-grid">
        <TimelineDayCard v-for="day in timeline.days" :key="day.dayStart" :day="day" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.dashboard-timeline-view {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timeline-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  opacity: 0.75;
}

.timeline-header h1 {
  margin: 0;
  font-size: 1.35rem;
}

.intro-copy {
  margin: 0.45rem 0 0;
  max-width: 560px;
  line-height: 1.5;
  opacity: 0.8;
}

.filter-form {
  display: flex;
  align-items: end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-form label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.filter-form input {
  min-width: 150px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.75);
}

.filter-button {
  border: none;
  padding: 0.7rem 1rem;
  font-weight: 700;
}

.filter-button:hover {
  cursor: pointer;
}

.state-card {
  padding: 1rem 1.25rem;
  text-align: center;
}

.timeline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
</style>
