import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FooterAndCookies } from '../components/layout/FooterAndCookies'
import { Header } from '../components/layout/Header'
import { copy } from '../content'
import type { LocaleProps } from '../types/domain'

export function AppShell({ locale }: LocaleProps) {
  const location = useLocation()
  const text = copy[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    localStorage.setItem('cbeems-locale', locale)
  }, [locale])

  useEffect(() => {
    const main = document.getElementById('main-content')
    main?.focus({ preventScroll: true })
    window.scrollTo?.({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">{text.skipToContent}</a>
      <Header key={location.pathname} locale={locale} />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <FooterAndCookies locale={locale} />
    </div>
  )
}
