<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { computed } from 'vue'
import { BarChart, LineChart } from 'vue-chrts'
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
    const label = dayjs.utc(day.dayStart).format('DD/MM')
    const row: TimelineChartRow = { label }
    const emotionCounts = new Map<string, number>()

    for (const point of day.timelinePoints) {
      const key = emotionKey(point.primaryFeeling)
      emotionCounts.set(key, (emotionCounts.get(key) ?? 0) + 1)
    }

    for (const feeling of day.dominantFeelings) {
      const key = emotionKey(feeling.label)
      if (!emotionCounts.has(key)) {
        emotionCounts.set(key, 0)
      }
    }

    for (const [key, value] of emotionCounts.entries()) {
      row[key] = value
    }

    return row
  })
})

const emotionKeys = computed(() => {
  const keys = new Set<string>()
  for (const day of props.days) {
    for (const point of day.timelinePoints) {
      keys.add(emotionKey(point.primaryFeeling))
    }
    for (const feeling of day.dominantFeelings) {
      keys.add(emotionKey(feeling.label))
    }
  }

  return Array.from(keys)
})

const categories = computed<Record<string, BulletLegendItemInterface>>(() => {
  return Object.fromEntries(
    emotionKeys.value.map((key) => [
      key,
      {
        name: getEmotionLabel(key),
        color: getEmotionMeta(key).color,
      },
    ]),
  )
})

const isSingleDay = computed(() => chartData.value.length === 1)

const yFormatter = (tick: number | Date) => String(tick)
</script>

<template>
  <section class="card overview-card">
    <div class="overview-header">
      <div>
        <p class="overview-kicker">Leitura rápida</p>
        <h2>Como seus sentimentos variaram ao longo dos dias</h2>
      </div>
      <p class="overview-copy">
        {{ isSingleDay
          ? 'Como há apenas um dia no período, o gráfico mostra quantas vezes cada emoção apareceu nesse dia.'
          : 'Cada linha acompanha quantas vezes uma emoção apareceu em cada dia do período.' }}
      </p>
    </div>

    <div v-if="chartData.length" class="chart-shell">
      <BarChart
        v-if="isSingleDay"
        class="chart-shell"
        :data="chartData"
        :categories="categories"
        :y-axis="emotionKeys"
        x-axis="label"
        :stacked="false"
        :height="260"
        :hide-legend="false"
        :hide-tooltip="false"
        :hide-x-axis="false"
        :hide-y-axis="false"
        :padding="{ top: 12, right: 12, bottom: 0, left: 12 }"
        :radius="8"
        :bar-padding="0.3"
        :group-padding="0.15"
        :x-domain-line="true"
        :y-domain-line="true"
        :x-grid-line="false"
        :y-grid-line="true"
        :y-formatter="yFormatter"
      />
      <LineChart
        v-else
        class="chart-shell"
        :data="chartData"
        :categories="categories"
        :y-axis="emotionKeys"
        x-axis="label"
        :height="260"
        :hide-legend="false"
        :hide-tooltip="false"
        :hide-x-axis="false"
        :hide-y-axis="false"
        :padding="{ top: 12, right: 12, bottom: 0, left: 12 }"
        :x-domain-line="true"
        :y-domain-line="true"
        :line-width="3"
        :x-grid-line="false"
        :y-grid-line="true"
        :y-formatter="yFormatter"
      />
    </div>

    <p v-else class="empty-state">Ainda não há eventos suficientes para montar o gráfico.</p>
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

.chart-shell ::v-deep(.grid-line),
.chart-shell ::v-deep(line.grid-line) {
  stroke: rgba(0, 0, 0, 0.14) !important;
}

.empty-state {
  margin: 0;
  opacity: 0.75;
}
</style>
