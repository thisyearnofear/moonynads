import fs from 'fs/promises'
import path from 'path'
import type { StorageProvider, StoreResult } from './provider'

export const localStorageProvider: StorageProvider = {
  async put({ bytes, filename, contentType, animationSettings }): Promise<StoreResult> {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const unique = `${Date.now()}-${safe}`
    const fullPath = path.join(uploadsDir, unique)
    await fs.writeFile(fullPath, Buffer.from(bytes))
    const url = `/uploads/${unique}`
    
    // Store animation settings as JSON metadata if provided
    if (animationSettings) {
      const metaPath = fullPath + '.meta.json'
      await fs.writeFile(metaPath, JSON.stringify(animationSettings, null, 2))
    }
    
    return { url, animationSettings }
  }
}
