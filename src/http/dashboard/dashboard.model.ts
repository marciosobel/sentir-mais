export type FeelingScore = {
  label: string
  confidence: number
}

export type TimelinePoint = {
  date: string
  primaryFeeling: string
  supportingEvent: string
}

export type WeeklySummary = {
  weekStart: string
  dominantFeelings: FeelingScore[]
  mainEvents: string[]
  timelinePoints: TimelinePoint[]
  generatedAt: string
}
