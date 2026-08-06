import { describe, expect, it } from 'vitest'
import { englishCards } from '../src/main/content/english'
import { ContentEngine } from '../src/main/services/content-engine'
import { defaultSettings, type CardProgress } from '../src/shared/models'

describe('ContentEngine', () => {
  const engine = new ContentEngine(englishCards)

  it('selects an unseen card for the configured level', () => {
    const card = engine.selectNext({
      settings: defaultSettings,
      progress: {},
      currentCardId: null,
      now: new Date('2026-08-06T10:00:00.000Z')
    })

    expect(card.level).toBe('B1')
    expect(card.id).toBe('english-b1-used-to')
  })

  it('prioritizes a card that is due for review', () => {
    const progress: Record<string, CardProgress> = {
      'english-b1-used-to': {
        seenCount: 1,
        lastSeenAt: '2026-08-06T08:00:00.000Z',
        nextReviewAt: '2026-08-06T09:00:00.000Z',
        learned: false
      }
    }

    const card = engine.selectNext({
      settings: defaultSettings,
      progress,
      currentCardId: 'english-b1-actually',
      now: new Date('2026-08-06T10:00:00.000Z')
    })

    expect(card.id).toBe('english-b1-used-to')
  })

  it('does not return content from another level', () => {
    const card = engine.selectNext({
      settings: { ...defaultSettings, level: 'A2' },
      progress: {},
      currentCardId: null
    })

    expect(card.level).toBe('A2')
  })
})
