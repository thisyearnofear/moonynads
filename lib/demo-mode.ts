/**
 * Demo Mode for Judges
 * Allows full access without wallet/tokens
 */

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check URL parameter
  const params = new URLSearchParams(window.location.search)
  if (params.get('demo') === 'true') return true
  
  // Check session storage (set by keyboard shortcut)
  if (sessionStorage.getItem('judge-mode') === 'true') return true
  
  return false
}

export function enableDemoMode() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('judge-mode', 'true')
}

export function disableDemoMode() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('judge-mode')
}
