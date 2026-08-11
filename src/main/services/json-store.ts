import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import type {
  AppSettings,
  CardFeedback,
  LearningCard,
  PersistedState
} from '../../shared/models'
import { appSettingsSchema, defaultSettings } from '../../shared/models'
import { calculateReviewAt, calculateSkippedReviewAt } from '../../domain/review-schedule'

const createInitialState = (): PersistedState => ({
  settings: defaultSettings,
  progress: {},
  currentCardId: null,
  history: [],
  nextNotificationAt: new Date(
    Date.now() + defaultSettings.notificationIntervalMinutes * 60_000
  ).toISOString(),
  pausedUntil: null
})

export class JsonStore {
  private state: PersistedState

  constructor(private readonly filePath: string) {
    this.state = this.read()
  }

  getState(): PersistedState {
    return structuredClone(this.state)
  }

  updateSettings(settings: AppSettings): void {
    this.state.settings = appSettingsSchema.parse(settings)
    this.write()
  }

  setCurrentCard(
    card: LearningCard,
    source: 'manual' | 'notification' = 'manual',
    shownAt = new Date()
  ): void {
    const currentProgress = this.state.progress[card.id]
    this.state.currentCardId = card.id
    this.state.progress[card.id] = {
      seenCount: (currentProgress?.seenCount ?? 0) + 1,
      lastSeenAt: shownAt.toISOString(),
      nextReviewAt: currentProgress?.nextReviewAt ?? null,
      learned: currentProgress?.learned ?? false
    }
    this.state.history.unshift({
      id: randomUUID(),
      cardId: card.id,
      title: card.title,
      category: card.category,
      level: card.level,
      shownAt: shownAt.toISOString(),
      feedback: null,
      source
    })
    this.state.history = this.state.history.slice(0, 100)
    this.write()
  }

  setFeedback(cardId: string, feedback: CardFeedback, now = new Date()): void {
    const progress = this.state.progress[cardId]
    if (!progress) return

    this.state.progress[cardId] = {
      ...progress,
      learned: feedback === 'understood',
      nextReviewAt: calculateReviewAt(progress, feedback, now).toISOString()
    }

    const historyItem = this.state.history.find(
      (item) => item.cardId === cardId && item.feedback === null
    )
    if (historyItem) historyItem.feedback = feedback
    this.write()
  }

  deferCard(cardId: string, now = new Date()): void {
    const progress = this.state.progress[cardId]
    if (!progress) return

    this.state.progress[cardId] = {
      ...progress,
      nextReviewAt: calculateSkippedReviewAt(now).toISOString()
    }
    this.write()
  }

  setNextNotificationAt(date: Date): void {
    this.state.nextNotificationAt = date.toISOString()
    this.write()
  }

  setPausedUntil(date: Date | null): void {
    this.state.pausedUntil = date?.toISOString() ?? null
    this.write()
  }

  private read(): PersistedState {
    if (!existsSync(this.filePath)) return createInitialState()

    try {
      const candidate = JSON.parse(readFileSync(this.filePath, 'utf8')) as Partial<PersistedState>
      const settingsResult = appSettingsSchema.safeParse(candidate.settings)
      const fallback = createInitialState()

      return {
        settings: settingsResult.success ? settingsResult.data : fallback.settings,
        progress: candidate.progress ?? fallback.progress,
        currentCardId: candidate.currentCardId ?? fallback.currentCardId,
        history: candidate.history ?? fallback.history,
        nextNotificationAt: candidate.nextNotificationAt ?? fallback.nextNotificationAt,
        pausedUntil: candidate.pausedUntil ?? fallback.pausedUntil
      }
    } catch {
      return createInitialState()
    }
  }

  private write(): void {
    const temporaryPath = `${this.filePath}.tmp`
    writeFileSync(temporaryPath, JSON.stringify(this.state, null, 2), 'utf8')
    renameSync(temporaryPath, this.filePath)
  }
}
