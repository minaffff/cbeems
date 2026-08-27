import { useEffect, useState } from 'react'
import { env } from '../../../config/env'
import { copy } from '../../../content'
import type { LocaleProps, MediaReference } from '../../../types/domain'
import { VideoPlaceholder } from './VideoPlaceholder'

type LessonMediaProps = LocaleProps & {
  label: string
  media?: MediaReference
}

export function LessonMedia({ locale, label, media }: LessonMediaProps) {
  const text = copy[locale]
  const playable =
    env.firebase.enabled && media?.placeholder === false && Boolean(media.assetId)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'placeholder'>(
    playable ? 'loading' : 'placeholder',
  )
  const [videoUrl, setVideoUrl] = useState<string>()

  useEffect(() => {
    if (!playable || !media?.assetId) return
    let active = true

    void import('../../../services/firebase/mediaRepository')
      .then(({ loadMediaUrl }) => loadMediaUrl(media.assetId!))
      .then((url) => {
        if (!active) return
        setVideoUrl(url)
        setState('ready')
      })
      .catch(() => {
        if (!active) return
        setState('error')
      })

    return () => {
      active = false
    }
  }, [attempt, media?.assetId, playable])

  if (!playable || state === 'placeholder') {
    return <VideoPlaceholder locale={locale} label={label} />
  }

  return (
    <section className="video-card" aria-label={label}>
      <div className="video-card-heading">
        <div>
          <span className="eyebrow">{text.videoLesson}</span>
          <h2>{label}</h2>
        </div>
        <span className="media-language">{locale.toUpperCase()}</span>
      </div>
      {state === 'ready' && videoUrl ? (
        <video
          className="video-player"
          controls
          playsInline
          preload="metadata"
          src={videoUrl}
          aria-label={`${text.videoLesson}: ${label}`}
        />
      ) : (
        <div className={`video-placeholder ${state === 'error' ? 'is-error' : ''}`}>
          <span className="play-placeholder" aria-hidden="true">
            {state === 'error' ? '!' : '…'}
          </span>
          <strong>{state === 'error' ? text.videoError : text.videoLoading}</strong>
          {state === 'error' && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setState('loading')
                setAttempt((value) => value + 1)
              }}
            >
              {text.retry}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
