import { copy } from '../../content'
import { privacyPolicies } from '../../content/policies'
import { PolicyPage } from '../../features/policies/components/PolicyPage'
import type { LocaleProps } from '../../types/domain'

export default function PrivacyPage({ locale }: LocaleProps) {
  return (
    <PolicyPage
      title={copy[locale].privacyTitle}
      document={privacyPolicies[locale]}
    />
  )
}
