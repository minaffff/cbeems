/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENVIRONMENT?: 'local' | 'development' | 'production'
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_FUNCTIONS_REGION?: string
  readonly VITE_USE_FIREBASE_EMULATORS?: 'true' | 'false'
  readonly VITE_FIREBASE_EMULATOR_HOST?: string
  readonly VITE_FIRESTORE_EMULATOR_PORT?: string
  readonly VITE_STORAGE_EMULATOR_PORT?: string
  readonly VITE_FUNCTIONS_EMULATOR_PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
