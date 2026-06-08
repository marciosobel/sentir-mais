<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { computed } from 'vue'
import { BarChart } from 'vue-chrts'
import type { BulletLegendItemInterface } from 'vue-chrts'
import type { DailySummary } from '@/http/dashboard'
import { emotionKey, getEmotionLabel, getEmotionMeta } from '../emotions'

dayjs.extend(utc)

const props = defineProps<{
  days: DailySummary[]
}>()

type TimelineChartRow = {
  label: string
  [key: string]: string | number
}

const chartData = computed<TimelineChartRow[]>(() => {
  return props.days.map((day) => {
    const dominant = day.dominantFeelings[0]
    const label = dayjs.utc(day.dayStart).format('DD/MM')
    const row: TimelineChartRow = { label }

    if (dominant) {
      row[emotionKey(dominant.label)] = dominant.confidence
    }

    return row
  })
})

const emotionKeys = computed(() => {
  const keys = new Set<string>()
  for (const day of props.days) {
    const dominant = day.dominantFeelings[0]
    if (dominant) {
      keys.add(emotionKey(dominant.label))
    }
  }

  return Array.from(keys)
})

const categories = computed<Record<string, BulletLegendItemInterface>>(() => {
  return Object.fromEntries(
    props.days
      .map((day) => day.dominantFeelings[0]?.label)
      .filter((label): label is string => !!label)
      .filter((label, index, labels) => labels.indexOf(label) === index)
      .map((label) => [
        emotionKey(label),
        {
          name: getEmotionLabel(label),
          color: getEmotionMeta(label).color,
        },
      ]),
  )
})
</script>

<template>
  <section class="card overview-card">
    <div class="overview-header">
      <div>
        <p class="overview-kicker">Leitura rápida</p>
        <h2>Como seus sentimentos variaram ao longo dos dias</h2>
      </div>
      <p class="overview-copy">
        Cada coluna mostra o sentimento dominante do dia e a intensidade estimada.
      </p>
    </div>

    <div v-if="chartData.length" class="chart-shell">
      <BarChart
        class="chart-shell"
        :data="chartData"
        :categories="categories"
        :y-axis="emotionKeys"
        x-axis="label"
        :stacked="true"
        :height="260"
        :hide-legend="false"
        :hide-tooltip="false"
        :hide-x-axis="false"
        :hide-y-axis="true"
        :padding="{ top: 12, right: 12, bottom: 0, left: 12 }"
        :radius="8"
        :bar-padding="0.45"
        :group-padding="0.25"
        :x-domain-line="true"
      />
    </div>

    <p v-else class="empty-state">Ainda não há dias suficientes para montar o gráfico.</p>
  </section>
</template>

<style scoped>
.overview-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.overview-kicker {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.overview-header h2 {
  margin: 0;
  font-size: 1.125rem;
}

.overview-copy {
  margin: 0;
  max-width: 320px;
  line-height: 1.45;
  opacity: 0.78;
}

.chart-shell {
  width: 100%;
  overflow: hidden;
  position: relative;
  color: #000 !important;
}

.chart-shell ::v-deep(.domain),
.chart-shell ::v-deep(path.domain),
.chart-shell ::v-deep(line.domain) {
  stroke: #000 !important;
  stroke-width: 1px !important;
}

.chart-shell ::v-deep(text) {
  fill: #000 !important;
  color: #000 !important;
}

.chart-shell ::v-deep([stroke='currentColor']),
.chart-shell ::v-deep([fill='currentColor']) {
  stroke: #000 !important;
  fill: #000 !important;
}

.empty-state {
  margin: 0;
  opacity: 0.75;
}
</style>
