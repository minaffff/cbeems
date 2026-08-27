import { access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const projectId = 'c-beems-prototype-dev'
const storageBucket = `${projectId}.firebasestorage.app`

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080'
process.env.FIREBASE_STORAGE_EMULATOR_HOST ??= '127.0.0.1:9199'
process.env.GCLOUD_PROJECT ??= projectId

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const fixtureDirectory = path.resolve(scriptDirectory, '../fixtures/media')

const media = {
  en: {
    assetId: 'lesson-01-en',
    fixture: path.join(fixtureDirectory, 'lesson-01-en.mp4'),
    storagePath: 'public/media/lessons/lesson-01/en/video.mp4',
    downloadToken: '00000000-0000-4000-8000-000000000001',
  },
  hi: {
    assetId: 'lesson-01-hi',
    fixture: path.join(fixtureDirectory, 'lesson-01-hi.mp4'),
    storagePath: 'public/media/lessons/lesson-01/hi/video.mp4',
    downloadToken: '00000000-0000-4000-8000-000000000002',
  },
}

for (const item of Object.values(media)) {
  await access(item.fixture)
}

const app = initializeApp({ projectId, storageBucket })
const firestore = getFirestore(app)
const bucket = getStorage(app).bucket()

await Promise.all(
  Object.entries(media).map(async ([language, item]) => {
    await bucket.upload(item.fixture, {
      destination: item.storagePath,
      metadata: {
        contentType: 'video/mp4',
        cacheControl: 'public,max-age=300',
        metadata: {
          firebaseStorageDownloadTokens: item.downloadToken,
          fixture: 'true',
          language,
        },
      },
    })

    await firestore.collection('mediaAssets').doc(item.assetId).set({
      type: 'video',
      storagePath: item.storagePath,
      language,
      durationSeconds: 3,
      status: 'published',
      placeholder: false,
      rightsStatus: 'synthetic-emulator-fixture',
      updatedAt: FieldValue.serverTimestamp(),
    })
  }),
)

await firestore.collection('lessons').doc('lesson-01').set({
  slug: 'enculturation-and-acculturation',
  order: 1,
  status: 'published',
  translations: {
    en: {
      title: 'Enculturation & Acculturation',
      summary: 'Emulator-backed bilingual lesson metadata for local development.',
    },
    hi: {
      title: 'संस्कृतिकरण और नई संस्कृति को अपनाना',
      summary: 'तकनीकी प्रोटोटाइप के लिए एमुलेटर से प्राप्त द्विभाषी पाठ जानकारी।',
    },
  },
  videos: {
    en: { assetId: media.en.assetId, placeholder: false },
    hi: { assetId: media.hi.assetId, placeholder: false },
  },
  updatedAt: FieldValue.serverTimestamp(),
})

await firestore.collection('siteSettings').doc('global').set({
  brandName: 'C-BEEMS',
  defaultLocale: 'en',
  supportedLocales: ['en', 'hi'],
  prototype: true,
  updatedAt: FieldValue.serverTimestamp(),
})

console.log('Seeded 1 published lesson, 2 media records, 2 videos and site settings.')
