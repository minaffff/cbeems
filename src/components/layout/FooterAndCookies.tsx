import { useState } from 'react'
import { Link } from 'react-router-dom'
import { copy } from '../../content'
import { routeFor } from '../../routing/routes'
import type { LocaleProps } from '../../types/domain'
import { SocialIcon } from './SocialIcon'

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
            <div className="footer-socials" aria-label={text.socialLinksLabel}>
              <a href="https://www.facebook.com/wix" target="_blank" rel="noreferrer" aria-label="Facebook">
                <SocialIcon platform="facebook" />
              </a>
              <a href="https://www.instagram.com/wix" target="_blank" rel="noreferrer" aria-label="Instagram">
                <SocialIcon platform="instagram" />
              </a>
              <a href="https://x.com/wix" target="_blank" rel="noreferrer" aria-label="X">
                <SocialIcon platform="x" />
              </a>
              <a href="https://www.tiktok.com/@wix" target="_blank" rel="noreferrer" aria-label="TikTok">
                <SocialIcon platform="tiktok" />
              </a>
            </div>
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
