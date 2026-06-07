import type { WeeklySummary } from './dashboard.model'

export interface IDashboard {
  getWeeklyDashboard(): Promise<WeeklySummary>
}
