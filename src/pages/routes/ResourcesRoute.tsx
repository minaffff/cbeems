import { copy } from '../../content'
import { ResourceGrid } from '../../features/lessons/components/ResourceGrid'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { LocaleProps } from '../../types/domain'

export default function ResourcesPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.resourcesTitle)

  return (
    <section className="section page-section">
      <div className="content-wrap">
        <div className="page-heading">
          <span className="eyebrow">C-BEEMS</span>
          <h1>{text.resourcesTitle}</h1>
          <p>{text.resourcesIntro}</p>
        </div>
        <ResourceGrid locale={locale} />
      </div>
    </section>
  )
}
