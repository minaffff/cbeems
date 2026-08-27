# C-BEEMS

Bilingual English and Hindi parenting-support website built with React Router
and Firebase. Firebase Hosting serves the application, Cloud Firestore stores
published lesson and media metadata, and Firebase Storage serves the videos.

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm test
npm run test:rules:emulators
npm run build
```

## Firebase Emulator Suite

The local environment connects to Firestore (`8080`), Storage (`9199`) and
Functions (`5001`) emulators. The Hosting emulator serves Vite's `dist`
directory on `5002` (`5000` is commonly reserved by macOS AirPlay).

In terminal 1:

```bash
npm run emulators
```

In terminal 2, load the reproducible English/Hindi lesson and video fixtures:

```bash
npm run seed:emulators
```

Then open `http://127.0.0.1:5002/en/resources/enculturation-and-acculturation`.
Switching language on that page loads the Hindi metadata and Hindi test video.

Run the Firestore and Storage rule suite in an isolated emulator session with:

```bash
npm run test:rules:emulators
```

## Application structure

The formal-development structure now separates responsibilities:

```text
src/
  app/                  application shell and lazy route configuration
  components/           shared content, layout and feedback components
  config/               validated environment configuration
  content/              bilingual copy, policies and lesson manifest
  features/
    contact/            contact feature boundary
    introduction/       locale-specific Introduction video
    lessons/            lesson repository, state and UI boundary
    policies/           policy document rendering
  pages/routes/         route-level lazy-loading entry points
  routing/              localized route helpers
  services/firebase/    Firebase client and emulator connection
  styles/               application-wide and shared button styles
  types/                shared domain types
```

`src/content/lesson-manifest.json` is the single source for the fallback lesson
order, slugs, categories and bilingual titles. The production lesson and media
seed scripts validate and read the same manifest.

`.env.local` is the local Emulator configuration and `.env.test` explicitly
disables Firebase network access during component tests. For a remote
development or production environment, set `VITE_APP_ENVIRONMENT` accordingly,
set `VITE_USE_FIREBASE_EMULATORS=false`, and supply the Web App API key, app ID
and auth domain. Invalid environment names, boolean values and emulator ports
fail fast during startup/build. Production configuration is prevented from
using emulators.

Every page route is loaded through `React.lazy` with an accessible bilingual
loading state. The Firebase lesson repository is also imported on demand, so
the initial JavaScript bundle does not contain the Firebase SDK.

## Production Firebase data

The production project contains eight published lessons, sixteen lesson videos
(English and Hindi for each lesson), and two locale-specific Introduction
videos. Media metadata is stored in `mediaAssets`; lesson metadata is stored in
`lessons`.

All production seed scripts are locked to `c-beems-prototype-dev`, run as a dry
run by default and require `--apply` before writing. They use atomic creates and
refuse to overwrite existing Firestore documents.

After uploading all English and Hindi lesson videos, verify and create the 16
lesson media records:

```bash
npm run seed:production-media -- --project c-beems-prototype-dev
npm run seed:production-media -- --project c-beems-prototype-dev --apply
```

Then verify those media records and create the eight published lessons:

```bash
npm run seed:production-lessons -- --project c-beems-prototype-dev
npm run seed:production-lessons -- --project c-beems-prototype-dev --apply
```

After uploading the two Introduction videos, verify and create their media
records:

```bash
npm run seed:production-intro -- --project c-beems-prototype-dev
npm run seed:production-intro -- --project c-beems-prototype-dev --apply
```

Each media script verifies the expected Storage paths and video content types
before it can write to Firestore.

## Firebase Functions

The Functions workspace is intentionally retained for a future contact-form
backend. It currently exports no functions and is not part of the production
deployment command below.

## Preview and deployment

Build and preview the exact production output locally:

```bash
npm run build
npm run preview
```

When final checks are complete, deploy Hosting and the reviewed security rules:

```bash
firebase deploy --only hosting,firestore:rules,storage
```

## Routes

- `/:locale/`
- `/:locale/resources`
- `/:locale/resources/:lessonSlug`
- `/:locale/about`
- `/:locale/contact`
- `/:locale/privacy`
- `/:locale/accessibility`

Supported locale values are `en` and `hi`. Contact-form submission is currently
disabled; visitors should use the published phone number or email address.
