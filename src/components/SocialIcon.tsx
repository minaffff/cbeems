type SocialPlatform = 'facebook' | 'instagram' | 'x' | 'tiktok'

export function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="17.5" cy="6.7" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  const paths: Record<Exclude<SocialPlatform, 'instagram'>, string> = {
    facebook:
      'M13.6 8.1h-2.1V6.7c0-.7.5-.9 1-.9h1.1V3.2h-2c-2.3 0-3.4 1.4-3.4 3.3v1.6H6v2.8h2.2v6.9h3.3v-6.9h1.8l.3-2.8Z',
    x: 'M5.2 4h3.2l3.9 5.2L16.8 4h2l-5.6 6.6L19 20h-3.2l-4.3-5.7L6.7 20h-2l5.9-7.1L5.2 4Zm2.1 1.6 9.3 12.8h1.1L8.4 5.6H7.3Z',
    tiktok:
      'M14.2 3.2h2.7c.2 1.5 1.1 2.5 2.6 2.9v2.8c-1 0-1.9-.3-2.7-.8v5.4a5.3 5.3 0 1 1-4.6-5.2v2.8a2.6 2.6 0 1 0 1.9 2.5V3.2h.1Z',
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={paths[platform]} fill="currentColor" />
    </svg>
  )
}
