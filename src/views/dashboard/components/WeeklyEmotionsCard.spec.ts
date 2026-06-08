import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import WeeklyEmotionsCard from './WeeklyEmotionsCard.vue'

function hexToRgbString(hex: string) {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)

  return `rgb(${red}, ${green}, ${blue})`
}

const barChartProps = vi.hoisted(() => ({
  latest: null as null | Record<string, unknown>,
}))

vi.mock('vue-chrts', () => ({
  BarChart: {
    props: ['data', 'categories', 'yAxis', 'xAxis', 'stacked'],
    template: '<div class="bar-chart-stub"></div>',
    created(this: { data: unknown; categories: unknown; yAxis: unknown; xAxis: unknown; stacked: unknown }) {
      barChartProps.latest = {
        data: this.data,
        categories: this.categories,
        yAxis: this.yAxis,
        xAxis: this.xAxis,
        stacked: this.stacked,
      }
    },
    updated(this: { data: unknown; categories: unknown; yAxis: unknown; xAxis: unknown; stacked: unknown }) {
      barChartProps.latest = {
        data: this.data,
        categories: this.categories,
        yAxis: this.yAxis,
        xAxis: this.xAxis,
        stacked: this.stacked,
      }
    },
  },
}))

describe('WeeklyEmotionsCard', () => {
  it('aggregates multiple emotion occurrences on the same day instead of keeping only the last one', () => {
    const wrapper = mount(WeeklyEmotionsCard, {
      props: {
        summary: {
          weekStart: '2026-06-08T00:00:00Z',
          dominantFeelings: [
            { label: 'sad', confidence: 0.99 },
            { label: 'happy', confidence: 0.99 },
            { label: 'relaxed', confidence: 0.99 },
          ],
          mainEvents: [],
          timelinePoints: [
            { date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'relaxed', supportingEvent: '' },
            { date: '2026-06-08', primaryFeeling: 'happy', supportingEvent: '' },
          ],
          generatedAt: '2026-06-08T03:51:37.625Z',
        },
      },
    })

    const props = barChartProps.latest as {
      data: Array<Record<string, string | number>>
      categories: Record<string, { name: string }>
      stacked: boolean
    }

    expect(props.data[0]).toMatchObject({
      label: '08/06',
      sad: 6,
      relaxed: 1,
      happy: 1,
    })
    expect(props.stacked).toBe(false)
    expect(props.categories.sad?.name).toBe('Triste')
    expect(props.categories.relaxed?.name).toBe('Calmo')
    expect(props.categories.happy?.name).toBe('Feliz')

    const legendItems = wrapper.findAll('.emotion-legend-item')
    expect(legendItems).toHaveLength(3)
    expect(legendItems[0].attributes('style')).toContain(
      `background-color: ${hexToRgbString(String(props.categories.sad?.color))}`,
    )
    expect(legendItems[1].attributes('style')).toContain(
      `background-color: ${hexToRgbString(String(props.categories.happy?.color))}`,
    )
    expect(legendItems[2].attributes('style')).toContain(
      `background-color: ${hexToRgbString(String(props.categories.relaxed?.color))}`,
    )
  })
})
