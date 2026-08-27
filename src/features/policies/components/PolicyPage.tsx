import type { PolicyDocument } from '../../../content/policies'
import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { PolicyText } from './PolicyText'

type PolicyPageProps = {
  title: string
  document: PolicyDocument
}

export function PolicyPage({ title, document }: PolicyPageProps) {
  useDocumentTitle(title)

  return (
    <section className="section page-section">
      <div className="content-wrap narrow-content">
        <div className="page-heading">
          <span className="eyebrow">C-BEEMS</span>
          <h1>{title}</h1>
        </div>
        <article className="policy-content">
          {document.notice && (
            <aside className="policy-notice">
              {document.notice.map((paragraph, index) => (
                <p key={index}><PolicyText paragraph={paragraph} /></p>
              ))}
            </aside>
          )}
          {document.introduction.length > 0 && (
            <div className="policy-introduction">
              {document.introduction.map((paragraph, index) => (
                <p key={index}><PolicyText paragraph={paragraph} /></p>
              ))}
            </div>
          )}
          {document.sections.map((policySection) => (
            <section className="policy-section" key={policySection.heading}>
              <h2>{policySection.heading}</h2>
              {policySection.paragraphs?.map((paragraph, index) => (
                <p key={index}><PolicyText paragraph={paragraph} /></p>
              ))}
              {policySection.items && (
                <ul>
                  {policySection.items.map((item, index) => (
                    <li key={index}><PolicyText paragraph={item} /></li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </section>
  )
}
