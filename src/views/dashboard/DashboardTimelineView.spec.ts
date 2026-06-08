import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import DashboardTimelineView from './DashboardTimelineView.vue'

const getWeeklyDashboard = vi.fn()
const getTimeline = vi.fn()

vi.mock('@/http', () => ({
  useDashboard: () => ({
    getWeeklyDashboard,
    getTimeline,
  }),
}))

vi.mock('./components/TimelineDayCard.vue', () => ({
  default: {
    props: ['day'],
    template: '<div class="timeline-day-card">{{ day.dayStart }} - {{ day.mainEvents[0] }}</div>',
  },
}))

vi.mock('./components/TimelineOverviewCard.vue', () => ({
  default: {
    props: ['days'],
    template: '<div class="timeline-overview-card">overview {{ days.length }}</div>',
  },
}))

describe('DashboardTimelineView', () => {
  it('loads the timeline on mount and applies explicit range filters', async () => {
    getTimeline
      .mockResolvedValueOnce({
        from: '2026-05-10',
        to: '2026-06-08',
        days: [
          {
            dayStart: '2026-06-07T00:00:00Z',
            dominantFeelings: [{ label: 'sad', confidence: 0.8 }],
            mainEvents: ['Bad meeting'],
            timelinePoints: [],
            generatedAt: '2026-06-07T18:00:00Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        from: '2026-06-01',
        to: '2026-06-07',
        days: [
          {
            dayStart: '2026-06-01T00:00:00Z',
            dominantFeelings: [{ label: 'calm', confidence: 0.9 }],
            mainEvents: ['Quiet day'],
            timelinePoints: [],
            generatedAt: '2026-06-01T18:00:00Z',
          },
        ],
      })

    const wrapper = mount(DashboardTimelineView)

    await Promise.resolve()
    await Promise.resolve()

    expect(getTimeline).toHaveBeenNthCalledWith(1, undefined, undefined)
    expect(wrapper.text()).toContain('Um resumo diário')
    expect(wrapper.text()).toContain('overview 1')
    expect(wrapper.text()).toContain('Bad meeting')

    const inputs = wrapper.findAll('input[type="date"]')
    await inputs[0]?.setValue('2026-06-01')
    await inputs[1]?.setValue('2026-06-07')
    await wrapper.find('form').trigger('submit.prevent')
    await Promise.resolve()
    await Promise.resolve()

    expect(getTimeline).toHaveBeenNthCalledWith(2, '2026-06-01', '2026-06-07')
    expect(wrapper.text()).toContain('Quiet day')
  })
})
