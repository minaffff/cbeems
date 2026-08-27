import { getApp, getApps, initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { env } from '../../config/env'

const app = getApps().length
  ? getApp()
  : initializeApp({
      apiKey: env.firebase.apiKey,
      appId: env.firebase.appId,
      authDomain: env.firebase.authDomain,
      projectId: env.firebase.projectId,
      storageBucket: env.firebase.storageBucket,
    })

export const firestore = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app, env.firebase.functionsRegion)
export const firebaseEmulatorsEnabled = env.firebase.useEmulators

type EmulatorGlobal = typeof globalThis & {
  __cbeemsFirebaseEmulatorsConnected?: boolean
}

const emulatorGlobal = globalThis as EmulatorGlobal

if (
  firebaseEmulatorsEnabled &&
  typeof window !== 'undefined' &&
  !emulatorGlobal.__cbeemsFirebaseEmulatorsConnected
) {
  const { host, firestorePort, functionsPort, storagePort } = env.firebase.emulators
  connectFirestoreEmulator(firestore, host, firestorePort)
  connectStorageEmulator(storage, host, storagePort)
  connectFunctionsEmulator(functions, host, functionsPort)
  emulatorGlobal.__cbeemsFirebaseEmulatorsConnected = true
}
