<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { DailySummary } from '@/http/dashboard'
import { getEmotionMeta } from '../emotions'

dayjs.extend(utc)

defineProps<{
  day: DailySummary
}>()
</script>

<template>
  <article class="card timeline-day-card">
    <header class="timeline-day-header">
      <div>
        <p class="timeline-day-label">{{ dayjs.utc(day.dayStart).format('DD/MM/YYYY') }}</p>
        <h2>{{ day.dominantFeelings[0]?.label || 'Sem sentimento dominante' }}</h2>
      </div>

      <span
        v-if="day.dominantFeelings[0]"
        class="emotion-badge"
        :style="{ backgroundColor: getEmotionMeta(day.dominantFeelings[0].label).color }"
      >
        {{ Math.round(day.dominantFeelings[0].confidence * 100) }}%
      </span>
    </header>

    <p v-if="day.mainEvents[0]" class="main-event">{{ day.mainEvents[0] }}</p>

    <ul v-if="day.timelinePoints.length" class="timeline-points">
      <li v-for="(point, index) in day.timelinePoints" :key="`${day.dayStart}-${index}`">
        <strong>{{ point.primaryFeeling }}</strong>
        <span>{{ point.supportingEvent || 'Sem evento complementar.' }}</span>
      </li>
    </ul>

    <p v-else class="empty-copy">Sem pontos de timeline neste dia.</p>
  </article>
</template>

<style scoped>
.timeline-day-card {
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.timeline-day-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.timeline-day-label {
  margin: 0 0 0.2rem;
  font-size: 0.8rem;
  opacity: 0.75;
}

.timeline-day-header h2 {
  margin: 0;
  font-size: 1rem;
}

.emotion-badge {
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #111;
}

.main-event {
  margin: 0;
  line-height: 1.45;
}

.timeline-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.timeline-points li {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.empty-copy {
  margin: 0;
  opacity: 0.75;
}
</style>
