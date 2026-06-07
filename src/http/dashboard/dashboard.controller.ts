import { api } from '../api'
import type { IDashboard } from './dashboard.interface'
import type { WeeklySummary } from './dashboard.model'

export class DashboardController implements IDashboard {
  async getWeeklyDashboard(): Promise<WeeklySummary> {
    return await api.get<WeeklySummary>('/dashboard/week')
  }
}
