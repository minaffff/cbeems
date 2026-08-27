import { mkdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, '../fixtures/media')

if (!ffmpegPath) {
  throw new Error('ffmpeg-static did not provide a binary for this platform.')
}

await mkdir(outputDirectory, { recursive: true })

const fixtures = [
  {
    locale: 'en',
    colour: '0x0B6B63',
    frequency: '440',
    title: 'C-BEEMS English emulator test video',
  },
  {
    locale: 'hi',
    colour: '0xC65D16',
    frequency: '523',
    title: 'C-BEEMS Hindi emulator test video',
  },
]

for (const fixture of fixtures) {
  const outputPath = path.join(outputDirectory, `lesson-01-${fixture.locale}.mp4`)
  const result = spawnSync(
    ffmpegPath,
    [
      '-y',
      '-f',
      'lavfi',
      '-i',
      `color=c=${fixture.colour}:s=640x360:r=25:d=3`,
      '-f',
      'lavfi',
      '-i',
      `sine=frequency=${fixture.frequency}:sample_rate=44100:duration=3`,
      '-shortest',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      '-movflags',
      '+faststart',
      '-metadata',
      `title=${fixture.title}`,
      outputPath,
    ],
    { encoding: 'utf8' },
  )

  if (result.status !== 0) {
    throw new Error(`Unable to generate ${fixture.locale} fixture:\n${result.stderr}`)
  }

  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`)
}
