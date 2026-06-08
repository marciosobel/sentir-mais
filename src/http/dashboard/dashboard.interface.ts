import type { DashboardTimeline, WeeklySummary } from './dashboard.model'

export interface IDashboard {
  getWeeklyDashboard(): Promise<WeeklySummary>
  getTimeline(from?: string, to?: string): Promise<DashboardTimeline>
}
