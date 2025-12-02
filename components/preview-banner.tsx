'use client'

export function PreviewBanner() {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">👀</span>
        <div>
          <div className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">
            Preview Access
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Sneak a peek at what's coming • The real action starts Dec 13th (don't get caught behind!)
          </div>
        </div>
      </div>
    </div>
  )
}