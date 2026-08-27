import { readFile } from 'node:fs/promises'

const manifestUrl = new URL('../../src/content/lesson-manifest.json', import.meta.url)
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'))
const categories = new Set(['culture', 'parenting', 'wellbeing'])
const ids = new Set()
const slugs = new Set()

if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error('The lesson manifest must contain at least one lesson.')
}

export const lessonManifest = manifest.map((lesson, index) => {
  const hasRequiredStrings =
    typeof lesson.id === 'string' &&
    typeof lesson.slug === 'string' &&
    typeof lesson.title?.en === 'string' &&
    typeof lesson.title?.hi === 'string'

  if (!hasRequiredStrings || !categories.has(lesson.category)) {
    throw new Error(`Invalid lesson manifest entry at position ${index + 1}.`)
  }

  if (ids.has(lesson.id) || slugs.has(lesson.slug)) {
    throw new Error(`Duplicate lesson id or slug at position ${index + 1}.`)
  }

  ids.add(lesson.id)
  slugs.add(lesson.slug)

  return { ...lesson, order: index + 1 }
})
