import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { env } from './config/env'
import { copy, type Locale, type MediaReference } from './content'
import { useLessonData } from './features/lessons/context/LessonDataContext'

type LocaleProps = { locale: Locale }

const navItems = [
  { key: 'navHome', path: '' },
  { key: 'navResources', path: '/resources' },
  { key: 'navAbout', path: '/about' },
  { key: 'navContact', path: '/contact' },
] as const

const routeFor = (locale: Locale, path = '') => `/${locale}${path || '/'}`

export function LanguageSwitcher({ locale, className = '' }: LocaleProps & { className?: string }) {
  const location = useLocation()
  const navigate = useNavigate()
  const text = copy[locale]
  const nextLocale: Locale = locale === 'en' ? 'hi' : 'en'

  const switchLanguage = () => {
    const segments = location.pathname.split('/')
    segments[1] = nextLocale
    localStorage.setItem('cbeems-locale', nextLocale)
    navigate(`${segments.join('/')}${location.search}${location.hash}`)
  }

  return (
    <button
      type="button"
      className={`language-switcher ${className}`.trim()}
      onClick={switchLanguage}
      aria-label={text.switchLanguageLabel}
    >
      <span className={locale === 'en' ? 'is-active' : ''}>EN</span>
      <i aria-hidden="true">|</i>
      <span className={locale === 'hi' ? 'is-active' : ''}>हिन्दी</span>
    </button>
  )
}

export function Header({ locale }: LocaleProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const text = copy[locale]

  return (
    <header className="site-header">
      <div className="content-wrap header-inner">
        <Link className="brand" to={routeFor(locale)} aria-label={`C-BEEMS — ${text.navHome}`}>
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>
            <strong>C-BEEMS</strong>
            <small>{text.brandSub}</small>
          </span>
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={routeFor(locale, item.path)}
              end={item.path === ''}
              className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
            >
              {text[item.key]}
            </NavLink>
          ))}
          <LanguageSwitcher locale={locale} />
        </nav>

        <div className="compact-actions">
          <LanguageSwitcher locale={locale} className="compact-language" />
          <button
            type="button"
            className="button button-secondary menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
            {menuOpen ? text.closeMenu : text.menu}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-navigation ${menuOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        <div className="content-wrap mobile-navigation-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={routeFor(locale, item.path)}
              end={item.path === ''}
              className={({ isActive }) => (isActive ? 'mobile-nav-link is-active' : 'mobile-nav-link')}
              onClick={() => setMenuOpen(false)}
            >
              {text[item.key]}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export function FooterAndCookies({ locale }: LocaleProps) {
  const text = copy[locale]
  const [cookieOpen, setCookieOpen] = useState(() => !localStorage.getItem('cbeems-cookie-choice'))

  const saveChoice = () => {
    localStorage.setItem('cbeems-cookie-choice', 'essential')
    setCookieOpen(false)
  }

  return (
    <>
      <footer className="site-footer">
        <div className="content-wrap footer-grid">
          <div className="footer-contact">
            <a href="tel:1234567890">123-456-7890</a>
            <a href="mailto:info@mysite.com">info@mysite.com</a>
            <address>
              500 Terry Francine Street,<br />
              6th Floor, San Francisco,<br />
              CA 94158
            </address>
          </div>
          <div className="footer-socials" aria-label={text.socialLinksLabel}>
            <a href="https://www.facebook.com/wix" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
            <a href="https://www.instagram.com/wix" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
            <a href="https://x.com/wix" target="_blank" rel="noreferrer" aria-label="X">X</a>
            <a href="https://www.tiktok.com/@wix" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>
          </div>
          <div className="footer-links">
            <Link to={routeFor(locale, '/privacy')}>{text.privacyTitle}</Link>
            <Link to={routeFor(locale, '/accessibility')}>{text.accessibilityTitle}</Link>
            <button
              type="button"
              className="text-button"
              onClick={() => setCookieOpen(true)}
            >
              {text.cookiePreferences}
            </button>
          </div>
        </div>
        <div className="content-wrap footer-bottom">
          <span>
            © 2035 by BEEMS. Powered and secured by{' '}
            <a href="https://www.wix.com/" target="_blank" rel="noreferrer">Wix</a>
          </span>
        </div>
      </footer>

      {cookieOpen && (
        <section className="cookie-banner" aria-label={text.cookieTitle} aria-live="polite">
          <div className="cookie-copy">
            <strong>{text.cookieTitle}</strong>
            <p>{text.cookieText}</p>
          </div>
          <div className="cookie-options">
            <label><input type="checkbox" checked disabled /> {text.essential}</label>
            <button type="button" className="button button-primary" onClick={saveChoice}>
              {text.saveChoices}
            </button>
          </div>
        </section>
      )}
    </>
  )
}

export function ResourceGrid({ locale, limit }: LocaleProps & { limit?: number }) {
  const text = copy[locale]
  const { lessons, remoteLessonCount, retry, status } = useLessonData()
  const visibleLessons = typeof limit === 'number' ? lessons.slice(0, limit) : lessons

  return (
    <>
      {status === 'loading' && (
        <div className="data-status is-loading" role="status">{text.emulatorLoading}</div>
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
        {visibleLessons.map((lesson) => (
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
            <span className="resource-meta">
              {text.videoLesson}
            </span>
            <span className="card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </>
  )
}

export function VideoPlaceholder({ locale, label }: LocaleProps & { label: string }) {
  const text = copy[locale]
  return (
    <section className="video-card" aria-label={label}>
      <div className="video-card-heading">
        <div>
          <span className="eyebrow">{text.videoLesson}</span>
          <h2>{label}</h2>
        </div>
        <span className="media-language">{locale.toUpperCase()}</span>
      </div>
      <div className="video-placeholder">
        <span className="play-placeholder" aria-hidden="true">▶</span>
        <strong>{text.videoPlaceholder}</strong>
        <span>{text.mediaStatus}</span>
      </div>
    </section>
  )
}

export function LessonMedia({
  locale,
  label,
  media,
}: LocaleProps & { label: string; media?: MediaReference }) {
  const text = copy[locale]
  const playable =
    env.firebase.enabled && media?.placeholder === false && Boolean(media.assetId)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'placeholder'>(
    playable ? 'loading' : 'placeholder',
  )
  const [videoUrl, setVideoUrl] = useState<string>()

  useEffect(() => {
    if (!playable || !media?.assetId) return
    let active = true

    void import('./services/firebase/mediaRepository')
      .then(({ loadMediaUrl }) => loadMediaUrl(media.assetId!))
      .then((url) => {
        if (!active) return
        setVideoUrl(url)
        setState('ready')
      })
      .catch(() => {
        if (!active) return
        setState('error')
      })

    return () => {
      active = false
    }
  }, [attempt, media?.assetId, playable])

  if (!playable || state === 'placeholder') {
    return <VideoPlaceholder locale={locale} label={label} />
  }

  return (
    <section className="video-card" aria-label={label}>
      <div className="video-card-heading">
        <div>
          <span className="eyebrow">{text.videoLesson}</span>
          <h2>{label}</h2>
        </div>
        <span className="media-language">{locale.toUpperCase()}</span>
      </div>
      {state === 'ready' && videoUrl ? (
        <video
          className="video-player"
          controls
          playsInline
          preload="metadata"
          src={videoUrl}
          aria-label={`${text.videoLesson}: ${label}`}
        />
      ) : (
        <div className={`video-placeholder ${state === 'error' ? 'is-error' : ''}`}>
          <span className="play-placeholder" aria-hidden="true">{state === 'error' ? '!' : '…'}</span>
          <strong>{state === 'error' ? text.videoError : text.videoLoading}</strong>
          {state === 'error' && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setState('loading')
                setAttempt((value) => value + 1)
              }}
            >
              {text.retry}
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export function DisabledContactForm({ locale }: LocaleProps) {
  const text = copy[locale]
  const preventSubmission = (event: FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <form className="contact-form" onSubmit={preventSubmission} aria-describedby="form-status">
      <div className="form-row">
        <label>
          <span>{text.formName}</span>
          <input type="text" disabled />
        </label>
        <label>
          <span>{text.formEmail}</span>
          <input type="email" disabled />
        </label>
      </div>
      <label>
        <span>{text.formMessage}</span>
        <textarea rows={5} disabled />
      </label>
      <div className="form-footer">
        <button type="submit" className="button button-primary" disabled>{text.formSubmit}</button>
        <span id="form-status" className="form-status">{text.formDisabled}</span>
      </div>
    </form>
  )
}
