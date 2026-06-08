import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import DashboardWeekView from './DashboardWeekView.vue'

const getWeeklyDashboard = vi.fn()
const getTimeline = vi.fn()

vi.mock('@/http', () => ({
  useDashboard: () => ({
    getWeeklyDashboard,
    getTimeline,
  }),
}))

vi.mock('./components/WeeklyEmotionsCard.vue', () => ({
  default: {
    props: ['summary'],
    template: '<div class="weekly-emotions-card">{{ summary.weekStart }}</div>',
  },
}))

vi.mock('./components/WeeklyEventsSection.vue', () => ({
  default: {
    props: ['events'],
    template: '<div class="weekly-events-section">{{ events.join(" | ") }}</div>',
  },
}))

describe('DashboardWeekView', () => {
  it('loads the weekly dashboard on mount', async () => {
    getWeeklyDashboard.mockResolvedValue({
      weekStart: '2026-06-08T00:00:00Z',
      dominantFeelings: [{ label: 'sad', confidence: 0.8 }],
      mainEvents: ['Bad meeting'],
      timelinePoints: [{ date: '2026-06-08', primaryFeeling: 'sad', supportingEvent: 'Bad meeting' }],
      generatedAt: '2026-06-08T18:00:00Z',
    })

    const wrapper = mount(DashboardWeekView)

    await Promise.resolve()
    await Promise.resolve()

    expect(getWeeklyDashboard).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('08/06 até 14/06')
    expect(wrapper.text()).toContain('Bad meeting')
  })
})
