export type Locale = 'en' | 'hi'

export type LocaleProps = {
  locale: Locale
}

export type LessonCategory = 'culture' | 'parenting' | 'wellbeing'

export type MediaReference = {
  assetId?: string
  placeholder: boolean
}

export type Lesson = {
  slug: string
  category: LessonCategory
  title: Record<Locale, string>
}

export type ResolvedLesson = Lesson & {
  order: number
  summary?: Partial<Record<Locale, string>>
  videos?: Partial<Record<Locale, MediaReference>>
}
