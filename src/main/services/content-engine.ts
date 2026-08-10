import type { AppSettings, CardProgress, LearningCard } from '../../shared/models'

type SelectCardInput = {
  settings: AppSettings
  progress: Record<string, CardProgress>
  currentCardId: string | null
  now?: Date
}

export class ContentEngine {
  constructor(
    private readonly cards: LearningCard[],
    private readonly random: () => number = Math.random
  ) {}

  getById(cardId: string | null): LearningCard | undefined {
    return this.cards.find((card) => card.id === cardId)
  }

  getLessonProgress(
    settings: AppSettings,
    progress: Record<string, CardProgress>
  ): { current: number; total: number } {
    const eligible = this.getEligibleCards(settings)
    const seenCards = eligible.filter((card) => progress[card.id] !== undefined).length

    return {
      current: Math.max(1, Math.min(seenCards, eligible.length)),
      total: eligible.length
    }
  }

  selectNext({ settings, progress, currentCardId, now = new Date() }: SelectCardInput): LearningCard {
    const eligible = this.getEligibleCards(settings)

    if (eligible.length === 0) {
      throw new Error(`No learning cards found for ${settings.topic} ${settings.level}.`)
    }

    const pickRandom = (cards: LearningCard[]): LearningCard | undefined =>
      cards[Math.floor(this.random() * cards.length)]

    const unseen = eligible.filter(
      (card) => progress[card.id] === undefined && card.id !== currentCardId
    )
    const unseenCard = pickRandom(unseen)
    if (unseenCard) return unseenCard

    const dueForReview = eligible
      .filter((card) => {
        const nextReviewAt = progress[card.id]?.nextReviewAt
        return (
          card.id !== currentCardId &&
          nextReviewAt !== null &&
          nextReviewAt !== undefined &&
          new Date(nextReviewAt) <= now
        )
      })

    const dueCard = pickRandom(dueForReview)
    if (dueCard) return dueCard

    const previouslySeen = eligible
      .filter((card) => card.id !== currentCardId && progress[card.id] !== undefined)
      .sort((left, right) =>
        progress[right.id].lastSeenAt.localeCompare(progress[left.id].lastSeenAt)
      )
    const recentCardsToAvoid = Math.min(4, Math.max(0, previouslySeen.length - 1))
    const fallback = pickRandom(previouslySeen.slice(recentCardsToAvoid))
    if (fallback) return fallback

    return eligible[0]
  }

  private getEligibleCards(settings: AppSettings): LearningCard[] {
    return this.cards.filter(
      (card) => card.topic === settings.topic && card.level === settings.level
    )
  }
}
