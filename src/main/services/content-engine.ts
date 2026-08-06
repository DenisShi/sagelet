import type { AppSettings, CardProgress, LearningCard } from '../../shared/models'

type SelectCardInput = {
  settings: AppSettings
  progress: Record<string, CardProgress>
  currentCardId: string | null
  now?: Date
}

export class ContentEngine {
  constructor(private readonly cards: LearningCard[]) {}

  getById(cardId: string | null): LearningCard | undefined {
    return this.cards.find((card) => card.id === cardId)
  }

  selectNext({ settings, progress, currentCardId, now = new Date() }: SelectCardInput): LearningCard {
    const eligible = this.cards.filter(
      (card) => card.topic === settings.topic && card.level === settings.level
    )

    if (eligible.length === 0) {
      throw new Error(`No learning cards found for ${settings.topic} ${settings.level}.`)
    }

    const dueForReview = eligible
      .filter((card) => {
        const nextReviewAt = progress[card.id]?.nextReviewAt
        return nextReviewAt !== null && nextReviewAt !== undefined && new Date(nextReviewAt) <= now
      })
      .sort((left, right) => {
        const leftReview = progress[left.id]?.nextReviewAt ?? ''
        const rightReview = progress[right.id]?.nextReviewAt ?? ''
        return leftReview.localeCompare(rightReview)
      })

    const dueDifferentCard = dueForReview.find((card) => card.id !== currentCardId)
    if (dueDifferentCard) return dueDifferentCard
    if (dueForReview[0]) return dueForReview[0]

    const unseen = eligible.filter((card) => progress[card.id] === undefined)
    const unseenDifferentCard = unseen.find((card) => card.id !== currentCardId)
    if (unseenDifferentCard) return unseenDifferentCard
    if (unseen[0]) return unseen[0]

    return [...eligible].sort((left, right) => {
      if (left.id === currentCardId) return 1
      if (right.id === currentCardId) return -1

      return progress[left.id].lastSeenAt.localeCompare(progress[right.id].lastSeenAt)
    })[0]
  }
}
