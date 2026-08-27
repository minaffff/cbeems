import { Link } from 'react-router-dom'
import { SupportBand } from '../../components/content/SupportBand'
import { copy } from '../../content'
import { HomeIntroductionVideo } from '../../features/introduction/components/HomeIntroductionVideo'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { routeFor } from '../../routing/routes'
import type { LocaleProps } from '../../types/domain'

export default function HomePage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.navHome)

  return (
    <>
      <section className="hero-section">
        <div className="content-wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{text.heroEyebrow}</span>
            <h1>{text.heroTitle}</h1>
            <p>{text.heroIntro}</p>
            <div className="hero-actions">
              <Link className="button button-primary" to={routeFor(locale, '/resources')}>
                {text.explore}
              </Link>
              <Link className="button button-secondary" to={routeFor(locale, '/about')}>
                {text.aboutCta}
              </Link>
            </div>
          </div>
          <HomeIntroductionVideo key={locale} locale={locale} />
        </div>
      </section>

      <SupportBand locale={locale} />
    </>
  )
}
