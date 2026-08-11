import { describe, expect, it } from 'vitest'
import { englishCards } from '../src/main/content/english'
import { ContentEngine } from '../src/main/services/content-engine'
import { defaultSettings, type CardProgress } from '../src/shared/models'

const createProgress = (cardId: string, nextReviewAt: string | null = null): CardProgress => ({
  seenCount: 1,
  lastSeenAt: '2026-08-06T08:00:00.000Z',
  nextReviewAt,
  learned: nextReviewAt === null
})

describe('ContentEngine', () => {
  it('selects a random unseen card for the configured level', () => {
    const engine = new ContentEngine(englishCards, () => 0.9)
    const card = engine.selectNext({
      settings: defaultSettings,
      progress: {},
      currentCardId: null,
      now: new Date('2026-08-06T10:00:00.000Z')
    })

    expect(card.level).toBe('B1')
    expect(card.id).not.toBe('english-b1-used-to')
  })

  it('does not immediately return the current card', () => {
    const engine = new ContentEngine(englishCards, () => 0)
    const card = engine.selectNext({
      settings: defaultSettings,
      progress: {},
      currentCardId: 'english-b1-used-to'
    })

    expect(card.id).not.toBe('english-b1-used-to')
  })

  it('prioritizes unseen content before a due review', () => {
    const engine = new ContentEngine(englishCards, () => 0)
    const progress = {
      'english-b1-used-to': createProgress(
        'english-b1-used-to',
        '2026-08-06T09:00:00.000Z'
      )
    }

    const card = engine.selectNext({
      settings: defaultSettings,
      progress,
      currentCardId: 'english-b1-used-to',
      now: new Date('2026-08-06T10:00:00.000Z')
    })

    expect(progress[card.id as keyof typeof progress]).toBeUndefined()
  })

  it('selects a due review after all cards at the level have been seen', () => {
    const engine = new ContentEngine(englishCards, () => 0)
    const progress = Object.fromEntries(
      englishCards
        .filter((card) => card.level === 'B1')
        .map((card) => [card.id, createProgress(card.id)])
    )
    progress['english-b1-used-to'] = createProgress(
      'english-b1-used-to',
      '2026-08-06T09:00:00.000Z'
    )

    const card = engine.selectNext({
      settings: defaultSettings,
      progress,
      currentCardId: 'english-b1-actually',
      now: new Date('2026-08-06T10:00:00.000Z')
    })

    expect(card.id).toBe('english-b1-used-to')
  })

  it('avoids the most recently shown cards when no review is due', () => {
    const engine = new ContentEngine(englishCards, () => 0)
    const cards = englishCards.filter((card) => card.level === 'B1')
    const progress = Object.fromEntries(
      cards.map((card, index) => [
        card.id,
        {
          ...createProgress(card.id),
          lastSeenAt: new Date(Date.UTC(2026, 7, 6, 10, 0) - index * 60_000).toISOString()
        }
      ])
    )
    const recentIds = cards.slice(0, 5).map((card) => card.id)

    const card = engine.selectNext({
      settings: defaultSettings,
      progress,
      currentCardId: cards[0].id,
      now: new Date('2026-08-06T10:00:00.000Z')
    })

    expect(recentIds).not.toContain(card.id)
  })

  it('does not return content from another level', () => {
    const engine = new ContentEngine(englishCards, () => 0)
    const card = engine.selectNext({
      settings: { ...defaultSettings, level: 'A2' },
      progress: {},
      currentCardId: null
    })

    expect(card.level).toBe('A2')
  })

  it('reports the active card position for the configured level', () => {
    const engine = new ContentEngine(englishCards)
    const b1Cards = englishCards.filter((card) => card.level === 'B1')

    expect(engine.getLessonProgress(defaultSettings, b1Cards[4].id)).toEqual({
      current: 5,
      total: b1Cards.length
    })
  })

  it('returns the card at the requested lesson position', () => {
    const engine = new ContentEngine(englishCards)
    const b1Cards = englishCards.filter((card) => card.level === 'B1')

    expect(engine.getLessonCard(defaultSettings, 5)).toEqual(b1Cards[4])
  })

  it('rejects a lesson position outside the configured level', () => {
    const engine = new ContentEngine(englishCards)
    const b1Cards = englishCards.filter((card) => card.level === 'B1')

    expect(() => engine.getLessonCard(defaultSettings, b1Cards.length + 1)).toThrow(
      `Question ${b1Cards.length + 1} is not available for english B1.`
    )
  })

  it('falls back to the first position when the active card is not eligible', () => {
    const engine = new ContentEngine(englishCards)
    const b1Cards = englishCards.filter((card) => card.level === 'B1')

    expect(engine.getLessonProgress(defaultSettings, 'unknown-card')).toEqual({
      current: 1,
      total: b1Cards.length
    })
  })
})
