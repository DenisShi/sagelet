import type { LearningCard } from '../../shared/models'

export interface ContentProvider {
  getCards(): readonly LearningCard[]
}
