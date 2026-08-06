import type { AppSettings, CardFeedback, LearningCard } from './models'

export type BootstrapPayload = {
  settings: AppSettings
  currentCard: LearningCard
  nextNotificationAt: string
  pausedUntil: string | null
}

export type SageletApi = {
  getBootstrap: () => Promise<BootstrapPayload>
  showNextCard: () => Promise<BootstrapPayload>
  submitFeedback: (feedback: CardFeedback) => Promise<BootstrapPayload>
  updateSettings: (settings: AppSettings) => Promise<BootstrapPayload>
  pauseForMinutes: (minutes: number) => Promise<BootstrapPayload>
  showTestNotification: () => Promise<{ shown: boolean }>
  hideWindow: () => Promise<void>
  onCardChanged: (callback: () => void) => () => void
}
