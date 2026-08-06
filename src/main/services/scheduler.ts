import type { AppSettings, HistoryItem, PersistedState } from '../../shared/models'
import type { JsonStore } from './json-store'

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE

const timeParts = (value: string): [number, number] => {
  const [hours, minutes] = value.split(':').map(Number)
  return [hours, minutes]
}

const withTime = (date: Date, time: string): Date => {
  const [hours, minutes] = timeParts(time)
  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

const isSameLocalDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

export const isWithinActiveHours = (date: Date, settings: AppSettings): boolean => {
  if (!settings.activeDays.includes(date.getDay())) return false

  const start = withTime(date, settings.activeStart)
  const end = withTime(date, settings.activeEnd)
  return date >= start && date <= end
}

export const getNextActiveAt = (candidate: Date, settings: AppSettings): Date => {
  if (isWithinActiveHours(candidate, settings)) return new Date(candidate)

  for (let dayOffset = 0; dayOffset <= 7; dayOffset += 1) {
    const day = new Date(candidate.getTime() + dayOffset * DAY)
    const start = withTime(day, settings.activeStart)
    const end = withTime(day, settings.activeEnd)

    if (!settings.activeDays.includes(day.getDay())) continue
    if (dayOffset === 0 && candidate > end) continue
    if (start >= candidate) return start
  }

  return new Date(candidate.getTime() + DAY)
}

export const notificationsShownToday = (history: HistoryItem[], now: Date): number =>
  history.filter(
    (item) => item.source === 'notification' && isSameLocalDay(new Date(item.shownAt), now)
  ).length

const startOfTomorrow = (now: Date): Date => {
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

export const calculateNextNotificationAt = (now: Date, settings: AppSettings): Date => {
  const intervalEnd = new Date(now.getTime() + settings.notificationIntervalMinutes * MINUTE)
  return getNextActiveAt(intervalEnd, settings)
}

export const getDeferredNotificationAt = (
  now: Date,
  state: PersistedState
): Date => {
  const pauseEnd = state.pausedUntil ? new Date(state.pausedUntil) : now
  const afterPause = pauseEnd > now ? pauseEnd : now

  if (notificationsShownToday(state.history, now) >= state.settings.maxNotificationsPerDay) {
    return getNextActiveAt(startOfTomorrow(now), state.settings)
  }

  return getNextActiveAt(afterPause, state.settings)
}

type SchedulerOptions = {
  store: JsonStore
  onDue: () => Promise<void> | void
  isScreenLocked: () => boolean
  tickIntervalMs?: number
}

export class NotificationScheduler {
  private timer: NodeJS.Timeout | null = null
  private running = false

  constructor(private readonly options: SchedulerOptions) {}

  start(): void {
    if (this.timer) return
    const tickIntervalMs = this.options.tickIntervalMs ?? 30_000
    this.timer = setInterval(() => void this.tick(), tickIntervalMs)
    void this.tick()
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }

  rescheduleFromNow(now = new Date()): void {
    const { settings } = this.options.store.getState()
    this.options.store.setNextNotificationAt(calculateNextNotificationAt(now, settings))
  }

  async tick(now = new Date()): Promise<void> {
    if (this.running) return
    this.running = true

    try {
      const state = this.options.store.getState()
      if (!state.settings.notificationsEnabled) return
      if (new Date(state.nextNotificationAt) > now) return
      if (this.options.isScreenLocked()) return

      const paused = state.pausedUntil !== null && new Date(state.pausedUntil) > now
      const dailyLimitReached =
        notificationsShownToday(state.history, now) >= state.settings.maxNotificationsPerDay
      const canNotify =
        !paused &&
        !dailyLimitReached &&
        isWithinActiveHours(now, state.settings)

      if (canNotify) {
        await this.options.onDue()
        this.options.store.setNextNotificationAt(
          calculateNextNotificationAt(now, state.settings)
        )
        return
      }

      this.options.store.setNextNotificationAt(getDeferredNotificationAt(now, state))
    } finally {
      this.running = false
    }
  }
}
