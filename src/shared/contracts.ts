import type { AppSettings, CardFeedback, LearningCard } from './models'

export type BootstrapPayload = {
  settings: AppSettings
  currentCard: LearningCard
  lessonProgress: {
    current: number
    total: number
  }
  nextNotificationAt: string
  pausedUntil: string | null
}

export type SageletApi = {
  getBootstrap: () => Promise<BootstrapPayload>
  showNextCard: () => Promise<BootstrapPayload>
  submitFeedback: (feedback: CardFeedback) => Promise<BootstrapPayload>
  updateSettings: (settings: AppSettings) => Promise<BootstrapPayload>
  pauseForMinutes: (minutes: number) => Promise<BootstrapPayload>
  hideWindow: () => Promise<void>
  onCardChanged: (callback: () => void) => () => void
}
