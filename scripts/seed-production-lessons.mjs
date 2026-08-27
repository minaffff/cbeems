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

const lessons = [
  {
    id: 'lesson-01',
    slug: 'enculturation-and-acculturation',
    title: {
      en: 'Enculturation & Acculturation',
      hi: 'संस्कृतिकरण और नई संस्कृति को अपनाना',
    },
  },
  {
    id: 'lesson-02',
    slug: 'four-ways-of-acculturation',
    title: {
      en: 'Four Ways of Acculturation',
      hi: 'नई संस्कृति अपनाने के चार तरीके',
    },
  },
  {
    id: 'lesson-03',
    slug: 'children-adapt-faster',
    title: {
      en: 'Children Adapt Faster',
      hi: 'बच्चे अधिक तेज़ी से अनुकूल होते हैं',
    },
  },
  {
    id: 'lesson-04',
    slug: 'lived-experiences',
    title: {
      en: 'Lived Experiences',
      hi: 'जीवन के अनुभव',
    },
  },
  {
    id: 'lesson-05',
    slug: 'protective-parental-factors',
    title: {
      en: 'Protective Parental Factors',
      hi: 'माता-पिता के सुरक्षात्मक कारक',
    },
  },
  {
    id: 'lesson-06',
    slug: 'less-helpful-parenting-approaches',
    title: {
      en: 'Less Helpful Parenting Approaches',
      hi: 'कम सहायक पालन-पोषण के तरीके',
    },
  },
  {
    id: 'lesson-07',
    slug: 'mental-health-wellbeing-spectrum',
    title: {
      en: 'Mental Health Well-Being Spectrum',
      hi: 'मानसिक स्वास्थ्य और कल्याण का दायरा',
    },
  },
  {
    id: 'lesson-08',
    slug: 'immigrant-specific-mental-health-risk-factors',
    title: {
      en: 'Immigrant Specific Mental Health Risk Factors',
      hi: 'प्रवासी परिवारों के मानसिक स्वास्थ्य जोखिम',
    },
  },
].map((lesson, index) => ({ ...lesson, order: index + 1 }))

const databaseRoot = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
const firebaseAccount = getGlobalDefaultAccount()
if (!firebaseAccount) {
  throw new Error('Firebase CLI is not authenticated. Run: npx firebase login')
}
setActiveAccount({ project: projectId }, firebaseAccount)
const accessToken = await getAccessToken()

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }

  return response.status === 204 ? undefined : response.json()
}

const documentExists = async (collection, documentId) => {
  const response = await fetch(`${databaseRoot}/${collection}/${documentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 404) return false
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }
  return true
}

const assetIds = lessons.flatMap((lesson) => [
  `${lesson.slug}-en`,
  `${lesson.slug}-hi`,
])

const [assetChecks, lessonChecks] = await Promise.all([
  Promise.all(assetIds.map(async (id) => [id, await documentExists('mediaAssets', id)])),
  Promise.all(lessons.map(async ({ id }) => [id, await documentExists('lessons', id)])),
])

const missingAssets = assetChecks.filter(([, exists]) => !exists).map(([id]) => id)
const existingLessons = lessonChecks.filter(([, exists]) => exists).map(([id]) => id)

console.log(`Target project: ${projectId}`)
console.log(`Media assets found: ${assetIds.length - missingAssets.length}/${assetIds.length}`)
console.log(`Existing lesson documents: ${existingLessons.length}/${lessons.length}`)

if (missingAssets.length) {
  console.error('\nMissing mediaAssets documents:')
  for (const id of missingAssets) console.error(`- ${id}`)
  throw new Error('Create all mediaAssets documents before creating lessons.')
}

if (existingLessons.length) {
  console.error('\nExisting lessons that would be preserved:')
  for (const id of existingLessons) console.error(`- ${id}`)
  throw new Error('Refusing to overwrite existing lesson documents.')
}

if (!applyChanges) {
  console.log('\nDry run passed. Re-run with --apply to create the 8 lesson documents.')
  process.exit(0)
}

const toFirestoreDocument = (lesson) => ({
  fields: {
    slug: { stringValue: lesson.slug },
    order: { integerValue: String(lesson.order) },
    status: { stringValue: 'published' },
    translations: {
      mapValue: {
        fields: {
          en: {
            mapValue: {
              fields: { title: { stringValue: lesson.title.en } },
            },
          },
          hi: {
            mapValue: {
              fields: { title: { stringValue: lesson.title.hi } },
            },
          },
        },
      },
    },
    videos: {
      mapValue: {
        fields: {
          en: {
            mapValue: {
              fields: {
                assetId: { stringValue: `${lesson.slug}-en` },
                placeholder: { booleanValue: false },
              },
            },
          },
          hi: {
            mapValue: {
              fields: {
                assetId: { stringValue: `${lesson.slug}-hi` },
                placeholder: { booleanValue: false },
              },
            },
          },
        },
      },
    },
    updatedAt: { timestampValue: new Date().toISOString() },
  },
})

const lessonWrites = lessons.map((lesson) => ({
  update: {
    name: `projects/${projectId}/databases/(default)/documents/lessons/${lesson.id}`,
    ...toFirestoreDocument(lesson),
  },
  currentDocument: { exists: false },
}))

await request(
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`,
  {
    method: 'POST',
    body: JSON.stringify({ writes: lessonWrites }),
  },
)
console.log('Created 8 lesson documents in one atomic commit.')

const verification = await Promise.all(
  lessons.map(({ id }) => documentExists('lessons', id)),
)

if (!verification.every(Boolean)) {
  throw new Error('Post-write verification failed: one or more lessons are missing.')
}

console.log('\nVerified all 8 production lesson documents.')
