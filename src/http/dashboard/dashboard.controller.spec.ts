import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardController } from './dashboard.controller'

const { get } = vi.hoisted(() => ({
  get: vi.fn(),
}))

vi.mock('../api', () => ({
  api: {
    get,
  },
}))

describe('DashboardController', () => {
  beforeEach(() => {
    get.mockReset()
  })

  it('requests weekly dashboard from the backend', async () => {
    get.mockResolvedValue({ weekStart: '2026-06-08T00:00:00Z' })
    const controller = new DashboardController()

    await controller.getWeeklyDashboard()

    expect(get).toHaveBeenCalledWith('/dashboard/week')
  })

  it('requests timeline without filters by default', async () => {
    get.mockResolvedValue({ from: '2026-05-10', to: '2026-06-08', days: [] })
    const controller = new DashboardController()

    await controller.getTimeline()

    expect(get).toHaveBeenCalledWith('/dashboard/timeline')
  })

  it('requests timeline with explicit date filters', async () => {
    get.mockResolvedValue({ from: '2026-06-01', to: '2026-06-07', days: [] })
    const controller = new DashboardController()

    await controller.getTimeline('2026-06-01', '2026-06-07')

    expect(get).toHaveBeenCalledWith('/dashboard/timeline?from=2026-06-01&to=2026-06-07')
  })
})
