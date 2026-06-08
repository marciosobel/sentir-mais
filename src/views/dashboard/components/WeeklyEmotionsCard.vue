<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { WeeklySummary } from '@/http/dashboard'
import { BarChart } from 'vue-chrts'
import type { BulletLegendItemInterface } from 'vue-chrts'
import { computed } from 'vue'
import { emotionKey, getEmotionMeta } from '../emotions'

dayjs.extend(utc)

const props = defineProps<{
  summary: WeeklySummary
}>()

type EmotionChartRow = {
  label: string
  [key: string]: string | number
}

const emotions = computed(() => props.summary.dominantFeelings)

// Build categories keys: include dominant feelings + any primaryFeeling from timelinePoints
const categoryKeys = computed(() => {
  const set = new Set<string>()
  for (const e of emotions.value) {
    set.add(emotionKey(e.label))
  }
  for (const p of props.summary.timelinePoints || []) {
    set.add(emotionKey(p.primaryFeeling))
  }
  return Array.from(set)
})

// Build chart data per day of the week (7 days), use timelinePoints.primaryFeeling to mark single stack per day
const chartData = computed<EmotionChartRow[]>(() => {
  const weekStart = dayjs.utc(props.summary.weekStart)
  const rows: EmotionChartRow[] = []

  // create map date -> primaryFeeling (normalized key)
  const dateMap = new Map<string, string>()
  for (const tp of props.summary.timelinePoints || []) {
    const key = emotionKey(tp.primaryFeeling)
    const d = dayjs.utc(tp.date).startOf('day').toISOString()
    dateMap.set(d, key)
  }

  for (let i = 0; i < 7; i++) {
    const d = weekStart.add(i, 'day')
    const iso = d.startOf('day').toISOString()
    const label = d.format('DD/MM')
    const row: EmotionChartRow = { label }
    for (const key of categoryKeys.value) {
      row[key] = dateMap.get(iso) === key ? 1 : 0
    }
    rows.push(row)
  }

  return rows
})

const emotionKeys = computed(() => categoryKeys.value as string[])

const categories = computed<Record<string, BulletLegendItemInterface>>(() => {
  return Object.fromEntries(
    emotionKeys.value.map((key) => {
      // try to find matching emotion label from dominant feelings first
      const found = emotions.value.find((e) => emotionKey(e.label) === key)
      const label = found ? found.label : key
      const meta = getEmotionMeta(label)

      return [
        key,
        {
          name: label,
          color: meta.color,
        },
      ]
    }),
  )
})

const visibleLegendEmotions = computed(() =>
  emotions.value.filter((emotion) => emotion.confidence > 0.4),
)

const xFormatter = (tick: string | number | Date | undefined | null) => {
  if (tick === null || typeof tick === 'undefined') return ''

  // Unovis passes numeric x tick indexes (0..n-1). Map to our chartData labels.
  if (typeof tick === 'number') {
    const row = chartData.value?.[tick]
    if (row && typeof row.label === 'string') return row.label
    return String(tick)
  }

  if (typeof tick === 'string') return tick

  try {
    return dayjs.utc(tick).format('DD/MM')
  } catch {
    return String(tick as unknown)
  }
}
</script>

<template>
  <section class="card emotions-card">
    <h2>Esta semana você esteve:</h2>

    <div class="content-row">
      <aside class="legend-column" v-if="visibleLegendEmotions.length">
        <ul class="emotion-legend">
          <li
            v-for="emotion in visibleLegendEmotions"
            :key="emotion.label"
            class="emotion-legend-item"
            :style="{ backgroundColor: getEmotionMeta(emotion.label).color }"
          >
            <component
              :is="getEmotionMeta(emotion.label).icon"
              :size="18"
              :style="{ color: '#000' }"
            />
            <span class="legend-label">{{ emotion.label }}</span>
          </li>
        </ul>
      </aside>

      <div class="chart-column">
        <div class="chart-shell" v-if="chartData.length">
          <BarChart
            class="chart-shell"
            :data="chartData"
            :categories="categories"
            :y-axis="emotionKeys"
            x-axis="label"
            :stacked="true"
            :height="220"
            :hide-legend="true"
            :hide-tooltip="false"
            :hide-x-axis="false"
            :hide-y-axis="true"
            :padding="{ top: 12, right: 12, bottom: 0, left: 12 }"
            :radius="8"
            :bar-padding="0.8"
            :group-padding="0.5"
            :x-formatter="xFormatter"
            :x-domain-line="true"
          />
        </div>

        <p v-else class="empty-state">Sem emoções reportadas nesta semana.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.emotions-card {
  padding: 1.25rem;
}

.emotions-card h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

.chart-shell {
  width: 100%;
  overflow: hidden;
}

.emotion-legend {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
}

.emotion-legend-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #000;
}

.emotion-legend-item svg {
  flex-shrink: 0;
}

.legend-label {
  display: inline-block;
}

.content-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.legend-column {
  min-width: 160px;
  display: flex;
  align-items: flex-start;
}

.chart-column {
  flex: 1 1 auto;
}

.empty-state {
  margin: 0;
  opacity: 0.75;
}

.chart-shell {
  /* host element for chart. keep overflow so chart remains inside card */
  position: relative;
  color: #000 !important; /* ensure currentColor resolves to black */
}

/* Target internal SVG elements rendered by BarChart using deep selector so scoped CSS applies */
.chart-shell ::v-deep(.domain),
.chart-shell ::v-deep(path.domain),
.chart-shell ::v-deep(line.domain) {
  stroke: #000 !important;
  stroke-width: 1px !important;
}

/* axis tick labels and other text using currentColor */
.chart-shell ::v-deep(text) {
  fill: #000 !important;
  color: #000 !important;
}

/* In case elements use stroke/fill=currentColor attributes */
.chart-shell ::v-deep([stroke='currentColor']),
.chart-shell ::v-deep([fill='currentColor']) {
  stroke: #000 !important;
  fill: #000 !important;
}

/* ensure bars have only top corners rounded - rely on 'radius' prop from BarChart */
</style>
