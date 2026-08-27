import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { env } from '../../../config/env'
import { lessons as staticLessons } from '../../../content'
import type { Lesson, ResolvedLesson } from '../../../types/domain'
import type { RemoteLesson } from '../api/lessonRepository'

type DataStatus = 'static' | 'loading' | 'connected' | 'error'

type LessonDataValue = {
  lessons: ResolvedLesson[]
  remoteLessonCount: number
  status: DataStatus
  retry: () => void
}

const initialLessons: ResolvedLesson[] = staticLessons.map((lesson, index) => ({
  ...lesson,
  order: index + 1,
}))

const LessonDataContext = createContext<LessonDataValue>({
  lessons: initialLessons,
  remoteLessonCount: 0,
  status: 'static',
  retry: () => undefined,
})

const mergeLessons = (
  localLessons: Lesson[],
  remoteLessons: RemoteLesson[],
): ResolvedLesson[] => {
  const remoteBySlug = new Map(remoteLessons.map((lesson) => [lesson.slug, lesson]))

  return localLessons.map((lesson, index) => {
    const remote = remoteBySlug.get(lesson.slug)
    if (!remote) return { ...lesson, order: index + 1 }

    return {
      ...lesson,
      order: remote.order,
      title: {
        en: remote.translations.en.title,
        hi: remote.translations.hi.title,
      },
      summary: {
        en: remote.translations.en.summary,
        hi: remote.translations.hi.summary,
      },
      videos: remote.videos,
    }
  })
}

export function LessonDataProvider({ children }: PropsWithChildren) {
  const [lessons, setLessons] = useState(initialLessons)
  const [status, setStatus] = useState<DataStatus>(
    env.firebase.enabled ? 'loading' : 'static',
  )
  const [remoteLessonCount, setRemoteLessonCount] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!env.firebase.enabled) return

    let active = true

    void import('../api/lessonRepository')
      .then(({ loadPublishedLessons }) => loadPublishedLessons())
      .then((remoteLessons) => {
        if (!active) return
        setLessons(mergeLessons(staticLessons, remoteLessons))
        setRemoteLessonCount(remoteLessons.length)
        setStatus('connected')
      })
      .catch(() => {
        if (!active) return
        setLessons(initialLessons)
        setRemoteLessonCount(0)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const retry = useCallback(() => {
    setStatus('loading')
    setReloadKey((value) => value + 1)
  }, [])

  const value = useMemo(
    () => ({ lessons, remoteLessonCount, retry, status }),
    [lessons, remoteLessonCount, retry, status],
  )

  return <LessonDataContext.Provider value={value}>{children}</LessonDataContext.Provider>
}

// The provider and its hook intentionally share one module so they cannot drift.
// oxlint-disable-next-line react/only-export-components
export const useLessonData = () => useContext(LessonDataContext)
