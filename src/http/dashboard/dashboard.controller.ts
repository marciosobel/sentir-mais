import { api } from '../api'
import type { IDashboard } from './dashboard.interface'
import type { DashboardTimeline, WeeklySummary } from './dashboard.model'

export class DashboardController implements IDashboard {
  async getWeeklyDashboard(): Promise<WeeklySummary> {
    return await api.get<WeeklySummary>('/dashboard/week')
  }

  async getTimeline(from?: string, to?: string): Promise<DashboardTimeline> {
    const params = new URLSearchParams()
    if (from && to) {
      params.set('from', from)
      params.set('to', to)
    }

    const query = params.toString()
    return await api.get<DashboardTimeline>(`/dashboard/timeline${query ? `?${query}` : ''}`)
  }
}
