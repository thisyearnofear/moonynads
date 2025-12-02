import type { StorageProvider, StoreResult, AnimationSettings } from './provider'

export const groveStorageProvider: StorageProvider = {
  async put({ bytes, filename, contentType, animationSettings }): Promise<StoreResult> {
    const url = process.env.GROVE_URL || 'https://api.grove.storage'
    const fd = new FormData()
    const blob = new Blob([new Uint8Array(bytes)], { type: contentType || 'application/octet-stream' })
    fd.append('file', blob, filename)
    fd.append('filename', filename)
    
    // Attach animation settings if provided
    if (animationSettings) {
      fd.append('animationSettings', JSON.stringify(animationSettings))
    }
    
    const chainId = process.env.GROVE_CHAIN_ID || '1' // Ethereum mainnet default
    const res = await fetch(`${url}?chain_id=${chainId}`, {
      method: 'POST',
      body: fd,
    })
    if (!res.ok) throw new Error('Grove upload failed')
    const json = await res.json().catch(() => ({})) as any
    return {
      url: json.gatewayUrl || json.uri || '',
      cid: json.cid,
      animationSettings
    }
  }
}
