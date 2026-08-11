import { z } from 'zod'
import { learningCardSchema, type LearningCard } from '../../shared/models'
import type { ContentProvider } from './content-provider'

export const contentDatabaseSchema = z
  .object({
    version: z.literal(1),
    topic: z.literal('english'),
    cards: learningCardSchema.array().min(1)
  })
  .superRefine((database, context) => {
    const cardIds = new Set<string>()

    database.cards.forEach((card, index) => {
      if (cardIds.has(card.id)) {
        context.addIssue({
          code: 'custom',
          path: ['cards', index, 'id'],
          message: `Duplicate learning card ID: ${card.id}.`
        })
      }
      cardIds.add(card.id)
    })
  })

export class LocalJsonContentProvider implements ContentProvider {
  private readonly cards: readonly LearningCard[]

  constructor(content: unknown) {
    this.cards = contentDatabaseSchema.parse(content).cards
  }

  getCards(): readonly LearningCard[] {
    return this.cards
  }
}
