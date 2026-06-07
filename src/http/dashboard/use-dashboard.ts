import { DashboardController } from './dashboard.controller'
import type { IDashboard } from './dashboard.interface'

let currentDashboard: IDashboard | undefined

export function useDashboard(): IDashboard {
  return (currentDashboard ??= new DashboardController())
}
