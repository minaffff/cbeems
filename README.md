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
  components/           shared layout and feedback boundaries
  config/               validated environment configuration
  features/
    contact/            contact feature boundary
    lessons/            lesson repository, state and UI boundary
  pages/routes/         route-level lazy-loading entry points
  services/firebase/    Firebase client and emulator connection
  types/                shared domain types
```

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

After uploading the expected files to Storage, verify and create Introduction
media metadata with a dry run followed by an explicit atomic apply:

```bash
npm run seed:production-intro -- --project c-beems-prototype-dev
npm run seed:production-intro -- --project c-beems-prototype-dev --apply
```

The script is locked to `c-beems-prototype-dev`, verifies both Storage objects
and their video content types, and refuses partial or destructive updates.

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
