import { copy } from '../../content'
import { accessibilityStatements } from '../../content/policies'
import { PolicyPage } from '../../features/policies/components/PolicyPage'
import type { LocaleProps } from '../../types/domain'

export default function AccessibilityPage({ locale }: LocaleProps) {
  return (
    <PolicyPage
      title={copy[locale].accessibilityTitle}
      document={accessibilityStatements[locale]}
    />
  )
}
