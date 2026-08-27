import { ReservedCard } from '../../components/content/ReservedCard'
import { copy } from '../../content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { LocaleProps } from '../../types/domain'

export default function AboutPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.aboutTitle)

  return (
    <section className="section page-section">
      <div className="content-wrap narrow-content">
        <div className="page-heading">
          <span className="eyebrow">C-BEEMS</span>
          <h1>{text.aboutTitle}</h1>
        </div>
        <ReservedCard label={text.reservedLabel} text={text.aboutText} />
      </div>
    </section>
  )
}
