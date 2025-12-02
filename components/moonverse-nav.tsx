'use client'

export function MoonverseNav() {
  const scrollToMoonverse = () => {
    const moonverseSection = document.querySelector('[data-moonverse]')
    moonverseSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToMoonverse}
      className="font-mono text-sm px-4 py-2 border border-yellow-600/30 hover:border-yellow-600/70 rounded transition-colors text-yellow-700 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/50"
    >
      🌌 Explore Moonverse
    </button>
  )
}