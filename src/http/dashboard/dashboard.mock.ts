import type { IDashboard } from './dashboard.interface'
import type { WeeklySummary } from './dashboard.model'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const STORAGE_KEY = 'mock-weekly-dashboard'

const defaultSummary = (): WeeklySummary => {
  const now = new Date()
  const weekStart = new Date(now)
  const day = weekStart.getDay()
  const diff = day === 0 ? -6 : 1 - day
  weekStart.setDate(weekStart.getDate() + diff)
  weekStart.setHours(0, 0, 0, 0)

  return {
    weekStart: weekStart.toISOString(),
    dominantFeelings: [
      { label: 'Calma', confidence: 0.72 },
      { label: 'Gratidão', confidence: 0.56 },
      { label: 'Ansiedade', confidence: 0.31 },
      { label: 'Alegria', confidence: 0.47 },
    ],
    mainEvents: [
      'Conseguiu organizar melhor rotina de sono.',
      'Teve conversa importante com pessoa próxima.',
      'Finalizou tarefa que estava pendente há dias.',
      'Percebeu momento de pausa e respiração no meio do dia.',
    ],
    timelinePoints: [
      {
        date: new Date(weekStart).toISOString(),
        primaryFeeling: 'Calma',
        supportingEvent: 'Começou semana com rotina mais leve.',
      },
      {
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        primaryFeeling: 'Ansiedade',
        supportingEvent: 'Pressão no trabalho aumentou no meio da semana.',
      },
      {
        date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        primaryFeeling: 'Gratidão',
        supportingEvent: 'Recebeu apoio de alguém importante.',
      },
    ],
    generatedAt: now.toISOString(),
  }
}

export class MockDashboard implements IDashboard {
  async getWeeklyDashboard(): Promise<WeeklySummary> {
    await wait(180)

    if (typeof window === 'undefined') {
      return defaultSummary()
    }

    const storedSummary = window.sessionStorage.getItem(STORAGE_KEY)
    if (!storedSummary) {
      return defaultSummary()
    }

    try {
      return JSON.parse(storedSummary) as WeeklySummary
    } catch (error) {
      console.error('Failed to load mock weekly dashboard from session storage:', error)
      return defaultSummary()
    }
  }
}
