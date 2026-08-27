import { useEffect, useState } from 'react'
import { env } from '../../../config/env'
import { copy } from '../../../content'
import type { Locale } from '../../../types/domain'

const assetIds: Record<Locale, string> = {
  en: 'introduction-en',
  hi: 'introduction-hi',
}

export function HomeIntroductionVideo({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const assetId = assetIds[locale]
  const playable = env.firebase.enabled
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'unavailable'>(
    playable ? 'loading' : 'unavailable',
  )
  const [videoUrl, setVideoUrl] = useState<string>()

  useEffect(() => {
    if (!playable) return
    let active = true

    void import('../../../services/firebase/mediaRepository')
      .then(({ loadMediaUrl }) => loadMediaUrl(assetId))
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
  }, [assetId, attempt, playable])

  return (
    <section
      className="home-introduction"
      aria-label={text.introductionTitle}
      data-media-asset={assetId}
    >
      <div className="home-introduction-heading">
        <strong>{text.introductionTitle}</strong>
        <span>{locale.toUpperCase()}</span>
      </div>
      {state === 'ready' && videoUrl ? (
        <video
          className="home-introduction-player"
          controls
          playsInline
          preload="metadata"
          src={videoUrl}
          aria-label={`${text.introductionTitle} — ${locale.toUpperCase()}`}
        />
      ) : (
        <div className={`home-introduction-status ${state === 'error' ? 'is-error' : ''}`}>
          <span className="play-placeholder" aria-hidden="true">
            {state === 'error' ? '!' : state === 'loading' ? '…' : '▶'}
          </span>
          <strong>
            {state === 'error'
              ? text.introductionError
              : state === 'loading'
                ? text.introductionLoading
                : text.introductionUnavailable}
          </strong>
          {state === 'error' && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setState('loading')
                setVideoUrl(undefined)
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
