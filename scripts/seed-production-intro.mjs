import { getAccessToken } from '../node_modules/firebase-tools/lib/apiv2.js'
import {
  getGlobalDefaultAccount,
  setActiveAccount,
} from '../node_modules/firebase-tools/lib/auth.js'

const expectedProjectId = 'c-beems-prototype-dev'
const projectArgument = process.argv.indexOf('--project')
const projectId = projectArgument >= 0 ? process.argv[projectArgument + 1] : undefined
const applyChanges = process.argv.includes('--apply')

if (!projectId) {
  throw new Error('Pass the Firebase project explicitly: --project <project-id>')
}

if (projectId !== expectedProjectId) {
  throw new Error(
    `Refusing to target ${projectId}. This script is locked to ${expectedProjectId}.`,
  )
}

const media = [
  {
    id: 'introduction-en',
    language: 'en',
    storagePath: 'public/media/intro/en/video.mp4',
  },
  {
    id: 'introduction-hi',
    language: 'hi',
    storagePath: 'public/media/intro/hi/video.mp4',
  },
]

const bucket = `${projectId}.firebasestorage.app`
const databaseRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
const firebaseAccount = getGlobalDefaultAccount()
if (!firebaseAccount) {
  throw new Error('Firebase CLI is not authenticated. Run: npx firebase login')
}
setActiveAccount({ project: projectId }, firebaseAccount)
const accessToken = await getAccessToken()

const authenticatedFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

const storageListUrl = new URL(
  `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o`,
)
storageListUrl.searchParams.set('prefix', 'public/media/intro/')
storageListUrl.searchParams.set('fields', 'items(name,contentType,size)')

const storageResponse = await authenticatedFetch(storageListUrl)
if (!storageResponse.ok) {
  throw new Error(
    `Unable to list Storage objects: ${storageResponse.status} ${await storageResponse.text()}`,
  )
}

const storagePayload = await storageResponse.json()
const storageObjects = new Map(
  (storagePayload.items || []).map((item) => [item.name, item]),
)
const expectedPaths = new Set(media.map(({ storagePath }) => storagePath))
const missingFiles = media.filter(({ storagePath }) => !storageObjects.has(storagePath))
const unexpectedFiles = [...storageObjects.keys()].filter((path) => !expectedPaths.has(path))
const invalidTypes = media.filter(({ storagePath }) => {
  const object = storageObjects.get(storagePath)
  return object && !object.contentType?.startsWith('video/')
})

const documentExists = async (documentId) => {
  const response = await authenticatedFetch(`${databaseRoot}/mediaAssets/${documentId}`)
  if (response.status === 404) return false
  if (!response.ok) {
    throw new Error(
      `Unable to inspect mediaAssets/${documentId}: ${response.status} ${await response.text()}`,
    )
  }
  return true
}

const existingChecks = await Promise.all(
  media.map(async ({ id }) => [id, await documentExists(id)]),
)
const existingDocuments = existingChecks.filter(([, exists]) => exists).map(([id]) => id)

console.log(`Target project: ${projectId}`)
console.log(`Storage bucket: ${bucket}`)
console.log(`Expected introduction videos found: ${media.length - missingFiles.length}/${media.length}`)
console.log(`Existing introduction mediaAssets: ${existingDocuments.length}/${media.length}`)

if (missingFiles.length) {
  console.error('\nMissing Storage files:')
  for (const item of missingFiles) console.error(`- ${item.storagePath}`)
  if (unexpectedFiles.length) {
    console.error('\nOther files currently below public/media/intro/:')
    for (const path of unexpectedFiles) console.error(`- ${path}`)
  }
  throw new Error('Upload or move both expected introduction videos before continuing.')
}

if (invalidTypes.length) {
  console.error('\nFiles without a video content type:')
  for (const item of invalidTypes) {
    console.error(`- ${item.storagePath}: ${storageObjects.get(item.storagePath).contentType}`)
  }
  throw new Error('Correct the Storage content type before creating mediaAssets.')
}

if (existingDocuments.length === media.length) {
  console.log('\nBoth introduction mediaAssets already exist. Verification passed; no changes made.')
  process.exit(0)
}

if (existingDocuments.length > 0) {
  throw new Error(
    `Only ${existingDocuments.length}/2 introduction mediaAssets exist. Refusing a partial update.`,
  )
}

if (!applyChanges) {
  console.log('\nDry run passed. Re-run with --apply to create the two mediaAssets documents.')
  process.exit(0)
}

const writes = media.map((item) => {
  const storageObject = storageObjects.get(item.storagePath)
  return {
    update: {
      name: `projects/${projectId}/databases/(default)/documents/mediaAssets/${item.id}`,
      fields: {
        type: { stringValue: 'video' },
        storagePath: { stringValue: item.storagePath },
        language: { stringValue: item.language },
        status: { stringValue: 'published' },
        placeholder: { booleanValue: false },
        rightsStatus: { stringValue: 'approved' },
        contentType: { stringValue: storageObject.contentType },
        sizeBytes: { integerValue: storageObject.size },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    },
    currentDocument: { exists: false },
  }
})

const commitUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`
const commitResponse = await authenticatedFetch(commitUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ writes }),
})
if (!commitResponse.ok) {
  throw new Error(
    `Unable to create introduction mediaAssets atomically: ${commitResponse.status} ${await commitResponse.text()}`,
  )
}

const verification = await Promise.all(media.map(({ id }) => documentExists(id)))
if (!verification.every(Boolean)) {
  throw new Error('Post-write verification failed: an introduction mediaAsset is missing.')
}

console.log('\nCreated and verified both introduction mediaAssets in one atomic commit.')
