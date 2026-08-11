import { describe, expect, it } from 'vitest'
import englishContent from '../src/main/content/english.json'
import { englishContentProvider } from '../src/main/content/english-content-provider'
import { LocalJsonContentProvider } from '../src/main/services/local-json-content-provider'
import { learningLevels } from '../src/shared/models'

describe('LocalJsonContentProvider', () => {
  it('loads exactly 100 cards for every supported level', () => {
    const cards = englishContentProvider.getCards()

    for (const level of learningLevels) {
      expect(cards.filter((card) => card.level === level)).toHaveLength(100)
    }
  })

  it('keeps every card ID unique', () => {
    const cardIds = englishContentProvider.getCards().map((card) => card.id)

    expect(new Set(cardIds).size).toBe(cardIds.length)
  })

  it('rejects duplicate card IDs', () => {
    const firstCard = englishContent.cards[0]
    const invalidContent = {
      ...englishContent,
      cards: [firstCard, firstCard]
    }

    expect(() => new LocalJsonContentProvider(invalidContent)).toThrow(
      `Duplicate learning card ID: ${firstCard.id}.`
    )
  })
})
