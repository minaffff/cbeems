import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { firestore, storage } from '../../../services/firebase/client'
import type { Locale, MediaReference } from '../../../types/domain'

export type RemoteLesson = {
  id: string
  slug: string
  order: number
  status: 'published'
  translations: Record<Locale, { title: string; summary?: string }>
  videos: Record<Locale, MediaReference>
}

type MediaAsset = {
  storagePath: string
  status: 'published'
  placeholder: boolean
}

const isRemoteLesson = (value: unknown): value is Omit<RemoteLesson, 'id'> => {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.slug === 'string' &&
    typeof record.order === 'number' &&
    record.status === 'published' &&
    typeof record.translations === 'object' &&
    typeof record.videos === 'object'
  )
}

export async function loadPublishedLessons(): Promise<RemoteLesson[]> {
  const publishedLessons = query(
    collection(firestore, 'lessons'),
    where('status', '==', 'published'),
  )
  const snapshot = await getDocs(publishedLessons)

  return snapshot.docs
    .map((lessonDocument) => {
      const data: unknown = lessonDocument.data()
      return isRemoteLesson(data) ? { id: lessonDocument.id, ...data } : null
    })
    .filter((lesson): lesson is RemoteLesson => lesson !== null)
    .sort((left, right) => left.order - right.order)
}

export async function loadMediaUrl(assetId: string): Promise<string> {
  const mediaDocument = await getDoc(doc(firestore, 'mediaAssets', assetId))
  if (!mediaDocument.exists()) throw new Error(`Media asset ${assetId} was not found.`)

  const media = mediaDocument.data() as Partial<MediaAsset>
  if (
    media.status !== 'published' ||
    media.placeholder !== false ||
    typeof media.storagePath !== 'string'
  ) {
    throw new Error(`Media asset ${assetId} is not a published playable asset.`)
  }

  return getDownloadURL(ref(storage, media.storagePath))
}
