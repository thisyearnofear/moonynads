'use client'

import { useEffect } from 'react'
import { enableDemoMode } from '@/lib/demo-mode'

export function DemoModeHandler() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Shift+J (Cmd+Shift+J on Mac) activates demo mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        enableDemoMode()
        window.location.reload()
      }
    }
    
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  
  return null
}
