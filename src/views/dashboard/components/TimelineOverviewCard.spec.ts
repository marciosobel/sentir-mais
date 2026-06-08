import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import TimelineOverviewCard from './TimelineOverviewCard.vue'

const chartProps = vi.hoisted(() => ({
  lineLatest: null as null | Record<string, unknown>,
  barLatest: null as null | Record<string, unknown>,
}))

vi.mock('vue-chrts', () => ({
  LineChart: {
    props: ['data', 'categories', 'yAxis', 'xAxis'],
    template: '<div class="line-chart-stub"></div>',
    created(this: { data: unknown; categories: unknown; yAxis: unknown; xAxis: unknown }) {
      chartProps.lineLatest = {
        data: this.data,
        categories: this.categories,
        yAxis: this.yAxis,
        xAxis: this.xAxis,
      }
    },
    updated(this: { data: unknown; categories: unknown; yAxis: unknown; xAxis: unknown }) {
      chartProps.lineLatest = {
        data: this.data,
        categories: this.categories,
        yAxis: this.yAxis,
        xAxis: this.xAxis,
      }
    },
  },
  BarChart: {
    props: ['data', 'categories', 'yAxis', 'xAxis', 'stacked'],
    template: '<div class="bar-chart-stub"></div>',
    created(this: { data: unknown; categories: unknown; yAxis: unknown; xAxis: unknown; stacked: unknown }) {
      chartProps.barLatest = {
        data: this.data,
        categories: this.categories,
        yAxis: this.yAxis,
        xAxis: this.xAxis,
        stacked: this.stacked,
      }
    },
    updated(this: { data: unknown; categories: unknown; yAxis: unknown; xAxis: unknown; stacked: unknown }) {
      chartProps.barLatest = {
        data: this.data,
        categories: this.categories,
        yAxis: this.yAxis,
        xAxis: this.xAxis,
        stacked: this.stacked,
      }
    },
  },
}))

describe('TimelineOverviewCard', () => {
  it('uses grouped bars for a single day while preserving separate emotion counts', () => {
    const wrapper = mount(TimelineOverviewCard, {
      props: {
        days: [
          {
            dayStart: '2026-06-08T00:00:00Z',
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
        ],
      },
    })

    const props = chartProps.barLatest as {
      data: Array<Record<string, string | number>>
      categories: Record<string, { name: string }>
      stacked: boolean
    }

    expect(wrapper.text()).toContain('Como há apenas um dia no período')
    expect(wrapper.find('.bar-chart-stub').exists()).toBe(true)
    expect(wrapper.find('.line-chart-stub').exists()).toBe(false)
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
  })
})
