import { Link } from 'react-router-dom'
import { copy } from '../../content'
import { routeFor } from '../../routing/routes'
import type { LocaleProps } from '../../types/domain'

export function SupportBand({ locale }: LocaleProps) {
  const text = copy[locale]

  return (
    <aside className="support-band">
      <div className="content-wrap support-inner">
        <div>
          <span className="eyebrow">C-BEEMS</span>
          <h2>{text.supportTitle}</h2>
          <p>{text.supportText}</p>
        </div>
        <Link className="button button-primary" to={routeFor(locale, '/contact')}>
          {text.getHelp}
        </Link>
      </div>
    </aside>
  )
}
