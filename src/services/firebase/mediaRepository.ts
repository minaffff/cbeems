import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { firestore, storage } from './client'

type MediaAsset = {
  storagePath: string
  status: 'published'
  placeholder: boolean
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
