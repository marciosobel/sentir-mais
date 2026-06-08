import { DashboardController } from './dashboard.controller'
import type { IDashboard } from './dashboard.interface'
import { MockDashboard } from './dashboard.mock'

let currentDashboard: IDashboard | undefined

export function useDashboard(): IDashboard {
  return (currentDashboard ??= new MockDashboard())
}
