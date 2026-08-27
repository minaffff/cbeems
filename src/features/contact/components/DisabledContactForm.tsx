import type { FormEvent } from 'react'
import { copy } from '../../../content'
import type { LocaleProps } from '../../../types/domain'

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
