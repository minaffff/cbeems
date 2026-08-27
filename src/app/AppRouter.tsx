import {
  Suspense,
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { RouteLoading } from '../components/feedback/RouteLoading'
import { isLocale } from '../content'
import type { LocaleProps } from '../types/domain'
import { AppShell } from './AppShell'

const HomePage = lazy(() => import('../pages/routes/HomeRoute'))
const ResourcesPage = lazy(() => import('../pages/routes/ResourcesRoute'))
const LessonPage = lazy(() => import('../pages/routes/LessonRoute'))
const AboutPage = lazy(() => import('../pages/routes/AboutRoute'))
const ContactPage = lazy(() => import('../pages/routes/ContactRoute'))
const PrivacyPage = lazy(() => import('../pages/routes/PrivacyRoute'))
const AccessibilityPage = lazy(() => import('../pages/routes/AccessibilityRoute'))
const NotFoundPage = lazy(() => import('../pages/routes/NotFoundRoute'))

type LazyPage = LazyExoticComponent<ComponentType<LocaleProps>>

function RootRedirect() {
  const storedLocale = localStorage.getItem('cbeems-locale')
  const locale = isLocale(storedLocale ?? undefined) ? storedLocale : 'en'
  return <Navigate to={`/${locale}/`} replace />
}

function LocaleRoute() {
  const { locale } = useParams()
  if (!isLocale(locale)) return <Navigate to="/en/not-found" replace />
  return <AppShell locale={locale} />
}

function LocalizedPage({ page: Page }: { page: LazyPage }) {
  const { locale } = useParams()
  if (!isLocale(locale)) return null

  return (
    <Suspense fallback={<RouteLoading locale={locale} />}>
      <Page locale={locale} />
    </Suspense>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:locale" element={<LocaleRoute />}>
        <Route index element={<LocalizedPage page={HomePage} />} />
        <Route path="resources" element={<LocalizedPage page={ResourcesPage} />} />
        <Route
          path="resources/:lessonSlug"
          element={<LocalizedPage page={LessonPage} />}
        />
        <Route path="about" element={<LocalizedPage page={AboutPage} />} />
        <Route path="contact" element={<LocalizedPage page={ContactPage} />} />
        <Route path="privacy" element={<LocalizedPage page={PrivacyPage} />} />
        <Route
          path="accessibility"
          element={<LocalizedPage page={AccessibilityPage} />}
        />
        <Route path="*" element={<LocalizedPage page={NotFoundPage} />} />
      </Route>
      <Route path="*" element={<Navigate to="/en/not-found" replace />} />
    </Routes>
  )
}
