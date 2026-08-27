import { copy } from '../../content'
import { DisabledContactForm } from '../../features/contact/components/DisabledContactForm'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { LocaleProps } from '../../types/domain'

export default function ContactPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.contactTitle)

  return (
    <section className="section page-section">
      <div className="content-wrap narrow-content">
        <div className="page-heading">
          <span className="eyebrow">C-BEEMS</span>
          <h1>{text.contactTitle}</h1>
          <p>{text.contactText}</p>
        </div>
        <div className="contact-details" aria-label={text.contactDetailsLabel}>
          <a href="tel:1234567890">123-456-7890</a>
          <a href="mailto:info@mysite.com">info@mysite.com</a>
        </div>
        <DisabledContactForm locale={locale} />
      </div>
    </section>
  )
}
