import { copy } from '../../../content'
import type { LocaleProps } from '../../../types/domain'

type VideoPlaceholderProps = LocaleProps & {
  label: string
}

export function VideoPlaceholder({ locale, label }: VideoPlaceholderProps) {
  const text = copy[locale]

  return (
    <section className="video-card" aria-label={label}>
      <div className="video-card-heading">
        <div>
          <span className="eyebrow">{text.videoLesson}</span>
          <h2>{label}</h2>
        </div>
        <span className="media-language">{locale.toUpperCase()}</span>
      </div>
      <div className="video-placeholder">
        <span className="play-placeholder" aria-hidden="true">▶</span>
        <strong>{text.videoPlaceholder}</strong>
        <span>{text.mediaStatus}</span>
      </div>
    </section>
  )
}
