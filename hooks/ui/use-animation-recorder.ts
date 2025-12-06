import { useRef, useState, useCallback } from 'react'

interface UseAnimationRecorderProps {
  fps?: number
  duration?: number
}

export function useAnimationRecorder({ fps = 12, duration = 3 }: UseAnimationRecorderProps = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordFps, setRecordFps] = useState(fps)
  const [recordDuration, setRecordDuration] = useState(duration)
  const [recordUrl, setRecordUrl] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const startRecording = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas || isRecording) return

    setRecordUrl(null)
    chunksRef.current = []

    try {
      const stream = canvas.captureStream(recordFps)
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setRecordUrl(url)
        setIsRecording(false)
        recorderRef.current = null
      }

      recorderRef.current = recorder
      setIsRecording(true)
      recorder.start()

      setTimeout(() => {
        if (recorderRef.current) {
          recorderRef.current.stop()
        }
      }, recordDuration * 1000)
    } catch (e) {
      console.error('Recording failed:', e)
      setIsRecording(false)
    }
  }, [isRecording, recordFps, recordDuration])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop()
    }
  }, [isRecording])

  const clearRecording = useCallback(() => {
    if (recordUrl) {
      URL.revokeObjectURL(recordUrl)
    }
    setRecordUrl(null)
    chunksRef.current = []
  }, [recordUrl])

  return {
    isRecording,
    recordFps,
    setRecordFps,
    recordDuration,
    setRecordDuration,
    recordUrl,
    startRecording,
    stopRecording,
    clearRecording,
  }
}
