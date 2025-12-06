import { useState, useCallback } from 'react'
import type { AnimationSettings } from '@/lib/storage/provider'

interface UploadError {
  message: string
  code?: string
}

interface UseAnimationUploadReturn {
  uploadUrl: string | null
  isUploading: boolean
  error: UploadError | null
  uploadFile: (file: File, settings: AnimationSettings) => Promise<void>
  clearError: () => void
  clearUpload: () => void
}

const validateAnimationSettings = (settings: AnimationSettings): UploadError | null => {
  if (!settings.mode) return { message: 'Animation mode is required', code: 'INVALID_MODE' }
  if (!settings.palette) return { message: 'Palette is required', code: 'INVALID_PALETTE' }
  if (typeof settings.speed !== 'number' || settings.speed < 0) {
    return { message: 'Speed must be a non-negative number', code: 'INVALID_SPEED' }
  }
  if (typeof settings.amplitude !== 'number' || settings.amplitude < 0) {
    return { message: 'Amplitude must be a non-negative number', code: 'INVALID_AMPLITUDE' }
  }
  return null
}

export function useAnimationUpload(): UseAnimationUploadReturn {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<UploadError | null>(null)

  const uploadFile = useCallback(
    async (file: File, settings: AnimationSettings) => {
      // Validate input
      if (!file) {
        setError({ message: 'No file selected', code: 'NO_FILE' })
        return
      }

      if (file.size === 0) {
        setError({ message: 'File is empty', code: 'EMPTY_FILE' })
        return
      }

      const settingsError = validateAnimationSettings(settings)
      if (settingsError) {
        setError(settingsError)
        return
      }

      setError(null)
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', file.name)
        formData.append('contentType', file.type || 'application/octet-stream')
        formData.append('animationSettings', JSON.stringify(settings))

        const response = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Upload failed with status ${response.status}`)
        }

        const result = await response.json()

        if (!result.url) {
          throw new Error('Upload succeeded but no URL returned')
        }

        setUploadUrl(result.url)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        setError({ message, code: 'UPLOAD_FAILED' })
        console.error('Upload error:', err)
      } finally {
        setIsUploading(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearUpload = useCallback(() => {
    setUploadUrl(null)
  }, [])

  return {
    uploadUrl,
    isUploading,
    error,
    uploadFile,
    clearError,
    clearUpload,
  }
}
