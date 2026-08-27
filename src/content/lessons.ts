import lessonManifest from './lesson-manifest.json'
import type { Lesson, LessonCategory } from '../types/domain'

const toLessonCategory = (value: string): LessonCategory => {
  if (value === 'culture' || value === 'parenting' || value === 'wellbeing') {
    return value
  }

  throw new Error(`Unsupported lesson category: ${value}`)
}

export const lessons: Lesson[] = lessonManifest.map(({ category, slug, title }) => ({
  slug,
  category: toLessonCategory(category),
  title,
}))
