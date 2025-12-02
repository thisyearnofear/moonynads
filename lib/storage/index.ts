import type { StorageProvider } from './provider'
import { localStorageProvider } from './local'
import { groveStorageProvider } from './grove'

const providerName = process.env.STORAGE_PROVIDER || 'local'
export const storageProvider: StorageProvider = providerName === 'grove' ? groveStorageProvider : localStorageProvider
