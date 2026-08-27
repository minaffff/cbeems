import { Link } from 'react-router-dom'
import { copy } from '../../../content'
import { routeFor } from '../../../routing/routes'
import type { LocaleProps } from '../../../types/domain'
import { useLessonData } from '../context/LessonDataContext'

export function ResourceGrid({ locale }: LocaleProps) {
  const text = copy[locale]
  const { lessons, remoteLessonCount, retry, status } = useLessonData()

  return (
    <>
      {status === 'loading' && (
        <div className="data-status" role="status">{text.emulatorLoading}</div>
      )}
      {status === 'connected' && (
        <div className="data-status is-connected" role="status">
          <span aria-hidden="true">●</span>
          {text.emulatorConnected} · {remoteLessonCount}
        </div>
      )}
      {status === 'error' && (
        <div className="data-status is-error" role="alert">
          <span>{text.emulatorError}</span>
          <button type="button" className="text-button" onClick={retry}>{text.retry}</button>
        </div>
      )}
      <div className="resource-grid">
        {lessons.map((lesson) => (
          <Link
            className={`resource-card category-${lesson.category}`}
            key={lesson.slug}
            to={routeFor(locale, `/resources/${lesson.slug}`)}
            aria-label={`${text.lesson} ${lesson.order}: ${lesson.title[locale]}`}
          >
            <span className="resource-card-top">
              <span className="resource-number">{String(lesson.order).padStart(2, '0')}</span>
              <span className="resource-availability">EN / HI</span>
            </span>
            <strong>{lesson.title[locale]}</strong>
            <span className="resource-meta">{text.videoLesson}</span>
            <span className="card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </>
  )
}
