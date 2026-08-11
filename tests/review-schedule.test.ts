import { describe, expect, it } from 'vitest'
import {
  calculateReviewAt,
  calculateSkippedReviewAt
} from '../src/domain/review-schedule'
import type { CardProgress } from '../src/shared/models'

const progress: CardProgress = {
  seenCount: 1,
  lastSeenAt: '2026-08-06T10:00:00.000Z',
  nextReviewAt: null,
  learned: false
}

describe('review schedule', () => {
  const now = new Date('2026-08-06T10:00:00.000Z')

  it('returns a repeated card after a randomized short interval', () => {
    const earliest = calculateReviewAt(progress, 'repeat', now, () => 0)
    const latest = calculateReviewAt(progress, 'repeat', now, () => 0.999)

    expect(earliest.getTime() - now.getTime()).toBe(30 * 60_000)
    expect(latest.getTime() - now.getTime()).toBe(120 * 60_000)
  })

  it('spaces understood cards by days', () => {
    const reviewAt = calculateReviewAt(progress, 'understood', now, () => 0)

    expect(reviewAt.getTime() - now.getTime()).toBe(36 * 60 * 60_000)
  })

  it('defers a skipped card for several hours', () => {
    const reviewAt = calculateSkippedReviewAt(now, () => 0)

    expect(reviewAt.getTime() - now.getTime()).toBe(4 * 60 * 60_000)
  })
})
