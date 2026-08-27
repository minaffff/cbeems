import { Link } from 'react-router-dom'
import { copy } from '../../content'
import { routeFor } from '../../routing/routes'
import type { LocaleProps } from '../../types/domain'

export function NotFoundContent({ locale }: LocaleProps) {
  const text = copy[locale]

  return (
    <section className="section page-section not-found">
      <div className="content-wrap narrow-content">
        <span className="error-code">404</span>
        <h1>{text.notFoundTitle}</h1>
        <p>{text.notFoundText}</p>
        <div className="not-found-actions">
          <Link className="button button-primary" to={routeFor(locale)}>{text.returnHome}</Link>
          <Link className="button button-secondary" to={routeFor(locale, '/resources')}>
            {text.resourcesTitle}
          </Link>
        </div>
      </div>
    </section>
  )
}
