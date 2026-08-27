import type { LocaleProps } from '../../types/domain'

export function RouteLoading({ locale }: LocaleProps) {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading-mark" aria-hidden="true" />
      {locale === 'hi' ? 'पृष्ठ लोड हो रहा है…' : 'Loading page…'}
    </div>
  )
}
