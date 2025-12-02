import { NextRequest, NextResponse } from 'next/server'
import { storageProvider } from '@/lib/storage'
import type { AnimationSettings } from '@/lib/storage/provider'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const name = (form.get('filename') as string | null) || 'upload.bin'
    const type = (form.get('contentType') as string | null) || file?.type || 'application/octet-stream'
    
    // Parse animation settings if provided
    let animationSettings: AnimationSettings | undefined
    const settingsStr = form.get('animationSettings') as string | null
    if (settingsStr) {
      try {
        animationSettings = JSON.parse(settingsStr)
      } catch (e) {
        // Invalid JSON, skip settings
      }
    }
    
    if (!file) return NextResponse.json({ error: 'file missing' }, { status: 400 })
    const buf = new Uint8Array(await file.arrayBuffer())
    const res = await storageProvider.put({ 
      bytes: buf, 
      filename: name, 
      contentType: type,
      animationSettings
    })
    return NextResponse.json({ 
      url: res.url,
      cid: res.cid,
      animationSettings: res.animationSettings
    })
  } catch (e) {
    return NextResponse.json({ error: 'upload failed' }, { status: 500 })
  }
}
