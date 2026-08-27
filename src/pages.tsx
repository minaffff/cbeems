import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DisabledContactForm } from './features/contact/components'
import { HomeIntroductionVideo } from './features/introduction/components'
import { LessonMedia, ResourceGrid } from './features/lessons/components'
import { useLessonData } from './features/lessons/context/LessonDataContext'
import { copy, type Locale } from './content'
import {
  accessibilityStatement,
  privacyPolicy,
  type PolicyDocument,
} from './content/policies'

type LocaleProps = { locale: Locale }

const routeFor = (locale: Locale, path = '') => `/${locale}${path || '/'}`

function useDocumentTitle(title: string, locale: Locale) {
  useEffect(() => {
    document.title = `${title} | C-BEEMS`
    document.documentElement.lang = locale
  }, [locale, title])
}

export function HomePage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.navHome, locale)

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

export function ResourcesPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.resourcesTitle, locale)

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

export function LessonPage({ locale }: LocaleProps) {
  const text = copy[locale]
  const { lessonSlug } = useParams()
  const { lessons } = useLessonData()
  const lessonIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug)
  const lesson = lessons[lessonIndex]

  useDocumentTitle(lesson?.title[locale] ?? text.notFoundTitle, locale)

  if (!lesson) return <NotFoundPage locale={locale} />

  const previousLesson = lessons[lessonIndex - 1]
  const nextLesson = lessons[lessonIndex + 1]

  return (
    <section className="section page-section lesson-page">
      <div className="content-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to={routeFor(locale)}>{text.breadcrumbHome}</Link>
          <span aria-hidden="true">/</span>
          <Link to={routeFor(locale, '/resources')}>{text.resourcesTitle}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{text.lesson} {lessonIndex + 1}</span>
        </nav>

        <div className="lesson-layout">
          <article className="lesson-content">
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
              <Link className="back-link" to={routeFor(locale, '/resources')}>{text.backToResources}</Link>
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

export function AboutPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.aboutTitle, locale)

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

export function ContactPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.contactTitle, locale)

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

export function PrivacyPage({ locale }: LocaleProps) {
  const text = copy[locale]
  return <PolicyPage locale={locale} title={text.privacyTitle} document={privacyPolicy} />
}

export function AccessibilityPage({ locale }: LocaleProps) {
  const text = copy[locale]
  return (
    <PolicyPage
      locale={locale}
      title={text.accessibilityTitle}
      document={accessibilityStatement}
    />
  )
}

function PolicyPage({
  locale,
  title,
  document,
}: LocaleProps & { title: string; document: PolicyDocument }) {
  useDocumentTitle(title, locale)
  return (
    <section className="section page-section">
      <div className="content-wrap narrow-content">
        <div className="page-heading">
          <span className="eyebrow">C-BEEMS</span>
          <h1>{title}</h1>
        </div>
        <article className="policy-content">
          {document.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {document.sections.map((policySection) => (
            <section className="policy-section" key={policySection.heading}>
              <h2>{policySection.heading}</h2>
              {policySection.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {policySection.items && (
                <ul>
                  {policySection.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {policySection.links?.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  )
}

export function NotFoundPage({ locale }: LocaleProps) {
  const text = copy[locale]
  useDocumentTitle(text.notFoundTitle, locale)
  return (
    <section className="section page-section not-found">
      <div className="content-wrap narrow-content">
        <span className="error-code">404</span>
        <h1>{text.notFoundTitle}</h1>
        <p>{text.notFoundText}</p>
        <div className="not-found-actions">
          <Link className="button button-primary" to={routeFor(locale)}>{text.returnHome}</Link>
          <Link className="button button-secondary" to={routeFor(locale, '/resources')}>{text.resourcesTitle}</Link>
        </div>
      </div>
    </section>
  )
}

function ReservedCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="reserved-card">
      <span className="reserved-mark" aria-hidden="true">i</span>
      <div>
        <strong>{label}</strong>
        <p>{text}</p>
      </div>
    </div>
  )
}

function SupportBand({ locale }: LocaleProps) {
  const text = copy[locale]
  return (
    <aside className="support-band">
      <div className="content-wrap support-inner">
        <div>
          <span className="eyebrow">C-BEEMS</span>
          <h2>{text.supportTitle}</h2>
          <p>{text.supportText}</p>
        </div>
        <Link className="button button-primary" to={routeFor(locale, '/contact')}>{text.getHelp}</Link>
      </div>
    </aside>
  )
}
