type AppEnvironment = 'local' | 'development' | 'production'

const readEnvironment = (value: string | undefined): AppEnvironment => {
  const environment = value || 'local'
  if (environment === 'local' || environment === 'development' || environment === 'production') {
    return environment
  }
  throw new Error(`Unsupported VITE_APP_ENVIRONMENT value: ${environment}`)
}

const readBoolean = (name: string, value: string | undefined): boolean => {
  if (value === 'true') return true
  if (value === 'false' || value === undefined) return false
  throw new Error(`${name} must be either "true" or "false".`)
}

const readPort = (name: string, value: string | undefined, fallback: number): number => {
  if (!value) return fallback
  const port = Number(value)
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${name} must be a valid TCP port.`)
  }
  return port
}

const readRemoteValue = (
  name: string,
  value: string | undefined,
  fallback: string,
  required: boolean,
): string => {
  if (value) return value
  if (required) throw new Error(`${name} is required outside the local emulator environment.`)
  return fallback
}

const environment = readEnvironment(import.meta.env.VITE_APP_ENVIRONMENT)
const useEmulators = readBoolean(
  'VITE_USE_FIREBASE_EMULATORS',
  import.meta.env.VITE_USE_FIREBASE_EMULATORS,
)

if (environment === 'production' && useEmulators) {
  throw new Error('Production must not be configured to use Firebase emulators.')
}

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'c-beems-prototype-dev'
const remoteFirebaseRequired = environment !== 'local' && !useEmulators

export const env = Object.freeze({
  app: {
    environment,
  },
  firebase: {
    apiKey: readRemoteValue(
      'VITE_FIREBASE_API_KEY',
      import.meta.env.VITE_FIREBASE_API_KEY,
      'emulator-only-api-key',
      remoteFirebaseRequired,
    ),
    appId: readRemoteValue(
      'VITE_FIREBASE_APP_ID',
      import.meta.env.VITE_FIREBASE_APP_ID,
      '1:000000000000:web:cbeems-emulator-only',
      remoteFirebaseRequired,
    ),
    authDomain: readRemoteValue(
      'VITE_FIREBASE_AUTH_DOMAIN',
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      `${projectId}.firebaseapp.com`,
      remoteFirebaseRequired,
    ),
    functionsRegion:
      import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'australia-southeast1',
    projectId,
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
      `${projectId}.firebasestorage.app`,
    useEmulators,
    emulators: {
      host: import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1',
      firestorePort: readPort(
        'VITE_FIRESTORE_EMULATOR_PORT',
        import.meta.env.VITE_FIRESTORE_EMULATOR_PORT,
        8080,
      ),
      functionsPort: readPort(
        'VITE_FUNCTIONS_EMULATOR_PORT',
        import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT,
        5001,
      ),
      storagePort: readPort(
        'VITE_STORAGE_EMULATOR_PORT',
        import.meta.env.VITE_STORAGE_EMULATOR_PORT,
        9199,
      ),
    },
  },
})
