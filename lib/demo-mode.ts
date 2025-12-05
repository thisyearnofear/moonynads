/**
 * Demo Mode for Judges
 * Password-protected access without wallet/tokens
 */

// Secret password for judges (documented in .kiro/JUDGE_ACCESS.md only)
const JUDGE_PASSWORDS = [
  'kiroween-moonynads-2025',
  'spooky-moon-judge',
  'frankenstein-demo'
];

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check URL parameter with password
  const params = new URLSearchParams(window.location.search)
  const judgeParam = params.get('judge')
  const demoParam = params.get('demo')
  
  if (judgeParam && JUDGE_PASSWORDS.includes(judgeParam)) {
    // Store in session for persistence
    sessionStorage.setItem('judge-mode', 'true')
    return true
  }
  
  if (demoParam && JUDGE_PASSWORDS.includes(demoParam)) {
    sessionStorage.setItem('judge-mode', 'true')
    return true
  }
  
  // Check session storage (set by keyboard shortcut or URL)
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

// Check if demo mode is active (for subtle indicator)
export function isDemoModeActive(): boolean {
  return isDemoMode()
}
