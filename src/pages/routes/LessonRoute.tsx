import { Link, useParams } from 'react-router-dom'
import { NotFoundContent } from '../../components/content/NotFoundContent'
import { copy } from '../../content'
import { LessonMedia } from '../../features/lessons/components/LessonMedia'
import { useLessonData } from '../../features/lessons/context/LessonDataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { routeFor } from '../../routing/routes'
import type { LocaleProps } from '../../types/domain'

export default function LessonPage({ locale }: LocaleProps) {
  const text = copy[locale]
  const { lessonSlug } = useParams()
  const { lessons } = useLessonData()
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug)
  const lesson = lessons[lessonIndex]

  useDocumentTitle(lesson?.title[locale] ?? text.notFoundTitle)

  if (!lesson) return <NotFoundContent locale={locale} />

  const previousLesson = lessons[lessonIndex - 1]
  const nextLesson = lessons[lessonIndex + 1]

  return (
    <section className="section page-section">
      <div className="content-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to={routeFor(locale)}>{text.breadcrumbHome}</Link>
          <span aria-hidden="true">/</span>
          <Link to={routeFor(locale, '/resources')}>{text.resourcesTitle}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{text.lesson} {lessonIndex + 1}</span>
        </nav>

        <div className="lesson-layout">
          <article>
            <header className="lesson-heading">
              <span className="eyebrow">{text.lesson} {lessonIndex + 1} / {lessons.length}</span>
              <h1>{lesson.title[locale]}</h1>
              <p>{lesson.summary?.[locale] || text.heroIntro}</p>
            </header>

            <LessonMedia
              key={`${lesson.slug}-${locale}-${lesson.videos?.[locale]?.assetId || 'placeholder'}`}
              locale={locale}
              label={lesson.title[locale]}
              media={lesson.videos?.[locale]}
            />

            <nav className="lesson-navigation" aria-label="Lesson navigation">
              <div>
                {previousLesson && (
                  <Link className="button button-secondary" to={routeFor(locale, `/resources/${previousLesson.slug}`)}>
                    <span aria-hidden="true">←</span> {text.previous}
                  </Link>
                )}
              </div>
              <Link className="back-link" to={routeFor(locale, '/resources')}>
                {text.backToResources}
              </Link>
              <div>
                {nextLesson && (
                  <Link className="button button-primary" to={routeFor(locale, `/resources/${nextLesson.slug}`)}>
                    {text.next} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </nav>
          </article>

          <aside className="lesson-aside" aria-label={text.resourcesTitle}>
            <strong>{text.resourcesTitle}</strong>
            <ol>
              {lessons.map((item, index) => (
                <li key={item.slug}>
                  <Link
                    to={routeFor(locale, `/resources/${item.slug}`)}
                    aria-current={item.slug === lesson.slug ? 'page' : undefined}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item.title[locale]}
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
