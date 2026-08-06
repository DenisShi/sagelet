import { z } from 'zod'

export const learningLevels = ['A1', 'A2', 'B1', 'B2'] as const
export const cardCategories = ['grammar', 'vocabulary', 'phrase'] as const

export const learningCardSchema = z.object({
  id: z.string().min(1),
  topic: z.literal('english'),
  category: z.enum(cardCategories),
  level: z.enum(learningLevels),
  title: z.string().min(1),
  notificationText: z.string().min(1).max(220),
  explanation: z.string().min(1),
  example: z.string().min(1),
  russian: z.object({
    title: z.string().min(1),
    notificationText: z.string().min(1),
    explanation: z.string().min(1),
    example: z.string().min(1)
  }),
  tags: z.array(z.string()),
  estimatedSeconds: z.number().int().positive()
})

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

export const appSettingsSchema = z
  .object({
    topic: z.literal('english'),
    level: z.enum(learningLevels),
    notificationsEnabled: z.boolean(),
    notificationIntervalMinutes: z.number().int().min(1).max(1440),
    activeStart: z.string().regex(timePattern),
    activeEnd: z.string().regex(timePattern),
    activeDays: z.array(z.number().int().min(0).max(6)).min(1),
    maxNotificationsPerDay: z.number().int().min(1).max(24),
    startAtLogin: z.boolean()
  })
  .superRefine((settings, context) => {
    if (settings.activeStart >= settings.activeEnd) {
      context.addIssue({
        code: 'custom',
        path: ['activeEnd'],
        message: 'Active end time must be later than the start time.'
      })
    }
  })

export type LearningLevel = (typeof learningLevels)[number]
export type CardCategory = (typeof cardCategories)[number]
export type LearningCard = z.infer<typeof learningCardSchema>
export type AppSettings = z.infer<typeof appSettingsSchema>
export type CardFeedback = 'understood' | 'repeat'

export const cardFeedbackSchema = z.enum(['understood', 'repeat'])

export type CardProgress = {
  seenCount: number
  lastSeenAt: string
  nextReviewAt: string | null
  learned: boolean
}

export type HistoryItem = {
  id: string
  cardId: string
  title: string
  category: CardCategory
  level: LearningLevel
  shownAt: string
  feedback: CardFeedback | null
  source: 'manual' | 'notification'
}

export type PersistedState = {
  settings: AppSettings
  progress: Record<string, CardProgress>
  currentCardId: string | null
  history: HistoryItem[]
  nextNotificationAt: string
  pausedUntil: string | null
}

export const defaultSettings: AppSettings = {
  topic: 'english',
  level: 'B1',
  notificationsEnabled: true,
  notificationIntervalMinutes: 60,
  activeStart: '09:00',
  activeEnd: '18:00',
  activeDays: [1, 2, 3, 4, 5],
  maxNotificationsPerDay: 8,
  startAtLogin: false
}
