import type { CardFeedback, CardProgress } from '../shared/models'

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE

const randomDuration = (minimum: number, maximum: number, random: () => number): number =>
  minimum + Math.floor(random() * (maximum - minimum + 1))

export const calculateReviewAt = (
  progress: CardProgress,
  feedback: CardFeedback,
  now = new Date(),
  random: () => number = Math.random
): Date => {
  if (feedback === 'repeat') {
    return new Date(now.getTime() + randomDuration(30, 120, random) * MINUTE)
  }

  const baseDays = Math.min(30, Math.max(2, 2 ** Math.min(progress.seenCount, 5)))
  const jitter = randomDuration(75, 125, random) / 100
  return new Date(now.getTime() + Math.round(baseDays * jitter * DAY))
}

export const calculateSkippedReviewAt = (
  now = new Date(),
  random: () => number = Math.random
): Date => new Date(now.getTime() + randomDuration(4, 12, random) * 60 * MINUTE)
