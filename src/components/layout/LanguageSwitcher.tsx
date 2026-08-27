import { useLocation, useNavigate } from 'react-router-dom'
import { copy } from '../../content'
import type { Locale, LocaleProps } from '../../types/domain'

type LanguageSwitcherProps = LocaleProps & {
  className?: string
}

export function LanguageSwitcher({ locale, className = '' }: LanguageSwitcherProps) {
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
