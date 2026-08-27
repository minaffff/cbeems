# C-BEEMS V1 technical prototype

Local React Router prototype for the C-BEEMS Wix-to-React/Firebase migration.
This stage validates bilingual routing, page structure, responsive behaviour,
Firestore lesson reads and Storage video playback against the local Firebase
Emulator Suite. It does not connect to or deploy a real Firebase environment.

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

## Firebase Emulator prototype

The browser is configured to connect only to local Firestore (`8080`), Storage
(`9199`) and Functions (`5001`) emulators. The Hosting emulator serves Vite's
`dist` directory on `5002` (`5000` is commonly reserved by macOS AirPlay).

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

## Prototype routes

- `/:locale/`
- `/:locale/resources`
- `/:locale/resources/:lessonSlug`
- `/:locale/about`
- `/:locale/contact`
- `/:locale/privacy`
- `/:locale/accessibility`

Supported locale values are `en` and `hi`. Production media, analytics and
contact submission remain deliberately disconnected in this stage. Do not run
`firebase deploy` for this prototype.
