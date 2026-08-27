import { NotFoundContent } from '../../components/content/NotFoundContent'
import { copy } from '../../content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { LocaleProps } from '../../types/domain'

export default function NotFoundPage({ locale }: LocaleProps) {
  useDocumentTitle(copy[locale].notFoundTitle)
  return <NotFoundContent locale={locale} />
}
