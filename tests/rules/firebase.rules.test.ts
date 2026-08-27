import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { getBytes, ref, uploadString } from 'firebase/storage'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

const projectId = 'c-beems-rules-test'
let testEnvironment: RulesTestEnvironment

beforeAll(async () => {
  const [firestoreRules, storageRules] = await Promise.all([
    readFile(resolve('firestore.rules'), 'utf8'),
    readFile(resolve('storage.rules'), 'utf8'),
  ])

  testEnvironment = await initializeTestEnvironment({
    projectId,
    firestore: { host: '127.0.0.1', port: 8080, rules: firestoreRules },
    storage: { host: '127.0.0.1', port: 9199, rules: storageRules },
  })
})

beforeEach(async () => {
  await Promise.all([
    testEnvironment.clearFirestore(),
    testEnvironment.clearStorage(),
  ])

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const firestore = context.firestore()
    const storage = context.storage()

    await Promise.all([
      setDoc(doc(firestore, 'lessons/published'), {
        slug: 'published',
        status: 'published',
      }),
      setDoc(doc(firestore, 'lessons/draft'), {
        slug: 'draft',
        status: 'draft',
      }),
      setDoc(doc(firestore, 'mediaAssets/video-en'), {
        status: 'published',
        storagePath: 'public/media/video-en.mp4',
      }),
      setDoc(doc(firestore, 'siteSettings/global'), {
        defaultLocale: 'en',
      }),
      uploadString(ref(storage, 'public/media/video-en.mp4'), 'public fixture'),
      uploadString(ref(storage, 'private/source.mp4'), 'private fixture'),
    ])
  })
})

afterAll(async () => {
  await testEnvironment?.cleanup()
})

describe('Firestore rules', () => {
  it('allows public reads of published content and rejects draft content', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore()

    await assertSucceeds(getDoc(doc(firestore, 'lessons/published')))
    await assertFails(getDoc(doc(firestore, 'lessons/draft')))
    await assertSucceeds(getDoc(doc(firestore, 'mediaAssets/video-en')))
  })

  it('requires collection queries to constrain lessons to published status', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore()
    const publishedQuery = query(
      collection(firestore, 'lessons'),
      where('status', '==', 'published'),
    )

    await assertSucceeds(getDocs(publishedQuery))
    await assertFails(getDocs(collection(firestore, 'lessons')))
  })

  it('rejects public writes and protects contact submissions', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore()

    await assertFails(setDoc(doc(firestore, 'lessons/new'), { status: 'published' }))
    await assertFails(setDoc(doc(firestore, 'contactSubmissions/new'), { message: 'test' }))
    await assertFails(getDoc(doc(firestore, 'contactSubmissions/new')))
  })

  it('allows only the explicitly public site settings document', async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore()

    await assertSucceeds(getDoc(doc(firestore, 'siteSettings/global')))
    await assertFails(getDoc(doc(firestore, 'siteSettings/internal')))
  })
})

describe('Storage rules', () => {
  it('allows reads only below public/media', async () => {
    const storage = testEnvironment.unauthenticatedContext().storage()

    await assertSucceeds(getBytes(ref(storage, 'public/media/video-en.mp4')))
    await assertFails(getBytes(ref(storage, 'private/source.mp4')))
  })

  it('rejects public uploads, including below public/media', async () => {
    const storage = testEnvironment.unauthenticatedContext().storage()

    await assertFails(uploadString(ref(storage, 'public/media/new.mp4'), 'blocked'))
    await assertFails(uploadString(ref(storage, 'private/new.mp4'), 'blocked'))
  })
})
