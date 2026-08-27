import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { copy } from '../../content'
import { routeFor } from '../../routing/routes'
import type { LocaleProps } from '../../types/domain'
import { LanguageSwitcher } from './LanguageSwitcher'

const navItems = [
  { key: 'navHome', path: '' },
  { key: 'navResources', path: '/resources' },
  { key: 'navAbout', path: '/about' },
  { key: 'navContact', path: '/contact' },
] as const

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
        className="mobile-navigation"
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
