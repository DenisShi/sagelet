import { describe, expect, it } from 'vitest'
import {
  calculateNextNotificationAt,
  getNextActiveAt,
  isWithinActiveHours,
  notificationsShownToday
} from '../src/main/services/scheduler'
import { defaultSettings, type HistoryItem } from '../src/shared/models'

describe('scheduler', () => {
  it('recognizes a moment inside active hours', () => {
    const thursdayMorning = new Date(2026, 7, 6, 10, 30)
    expect(isWithinActiveHours(thursdayMorning, defaultSettings)).toBe(true)
  })

  it('moves a late reminder to the next active morning', () => {
    const thursdayEvening = new Date(2026, 7, 6, 19, 30)
    const next = getNextActiveAt(thursdayEvening, defaultSettings)

    expect(next.getDay()).toBe(5)
    expect(next.getHours()).toBe(9)
    expect(next.getMinutes()).toBe(0)
  })

  it('applies the interval before checking active hours', () => {
    const thursday = new Date(2026, 7, 6, 17, 30)
    const next = calculateNextNotificationAt(thursday, defaultSettings)

    expect(next.getDay()).toBe(5)
    expect(next.getHours()).toBe(9)
  })

  it('counts only cards shown today', () => {
    const now = new Date(2026, 7, 6, 15, 0)
    const baseItem: HistoryItem = {
      id: 'one',
      cardId: 'card',
      title: 'Card',
      category: 'grammar',
      level: 'B1',
      shownAt: new Date(2026, 7, 6, 9, 0).toISOString(),
      feedback: null,
      source: 'notification'
    }
    const history = [
      baseItem,
      { ...baseItem, id: 'two', shownAt: new Date(2026, 7, 5, 9, 0).toISOString() }
    ]

    expect(notificationsShownToday(history, now)).toBe(1)
  })

  it('does not count cards opened manually toward the notification limit', () => {
    const now = new Date(2026, 7, 6, 15, 0)
    const history: HistoryItem[] = [
      {
        id: 'manual',
        cardId: 'card',
        title: 'Card',
        category: 'grammar',
        level: 'B1',
        shownAt: new Date(2026, 7, 6, 14, 0).toISOString(),
        feedback: null,
        source: 'manual'
      }
    ]

    expect(notificationsShownToday(history, now)).toBe(0)
  })
})
