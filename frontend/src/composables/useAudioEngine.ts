import { onBeforeUnmount, ref } from 'vue'
import { AudioPlaybackError } from '@/lib/audioErrors'
import { isSupportedAudioMime } from '@/lib/audioFormats'
import type { Song } from '@/types/song'

type EndedHandler = () => void

export function useAudioEngine() {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) {
    throw new AudioPlaybackError('audio_context_unsupported')
  }

  const audioCtx = new AudioContextCtor()

  const gainNode = audioCtx.createGain()
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 256

  gainNode.connect(analyser)
  analyser.connect(audioCtx.destination)

  const analyserData = ref<Uint8Array<ArrayBuffer>>(
    new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
  )
  const currentTime = ref<number>(0)
  const duration = ref<number>(0)
  const volume = ref<number>(1)
  const isPlaying = ref<boolean>(false)

  const sourceNode = ref<AudioBufferSourceNode | null>(null)
  const currentBuffer = ref<AudioBuffer | null>(null)
  const playbackStartedAt = ref<number>(0)
  const pausedAt = ref<number>(0)

  let endedHandler: EndedHandler | null = null
  let rafId: number | null = null
  let progressIntervalId: number | null = null
  let manualStop = false

  gainNode.gain.value = volume.value

  async function ensureContextReady(): Promise<void> {
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    }
  }

  async function fetchBuffer(audioUrl: string): Promise<AudioBuffer> {
    const response = await fetch(audioUrl)
    if (!response.ok) {
      throw new AudioPlaybackError('audio_network_error')
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType !== 'application/octet-stream' && !isSupportedAudioMime(contentType)) {
      throw new AudioPlaybackError('audio_invalid_content_type', contentType)
    }

    const bytes = await response.arrayBuffer()

    try {
      const decoded = await audioCtx.decodeAudioData(bytes)
      if (!Number.isFinite(decoded.duration) || decoded.duration <= 0) {
        throw new AudioPlaybackError('audio_buffer_invalid')
      }

      return decoded
    } catch (error) {
      if (error instanceof AudioPlaybackError) {
        throw error
      }

      const name = error instanceof DOMException ? error.name : ''
      if (name === 'NotSupportedError') {
        throw new AudioPlaybackError('audio_decode_unsupported')
      }

      if (name === 'EncodingError' || name === 'DataError' || name === 'SyntaxError') {
        throw new AudioPlaybackError('audio_decode_corrupt')
      }

      throw new AudioPlaybackError('audio_decode_failed')
    }
  }

  function startAnalyserLoop(): void {
    stopAnalyserLoop()

    const update = () => {
      analyser.getByteFrequencyData(analyserData.value)
      rafId = window.requestAnimationFrame(update)
    }

    update()
  }

  function stopAnalyserLoop(): void {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function startProgressLoop(): void {
    stopProgressLoop()

    progressIntervalId = window.setInterval(() => {
      if (!isPlaying.value) {
        return
      }

      const elapsed = audioCtx.currentTime - playbackStartedAt.value
      currentTime.value = Math.min(pausedAt.value + elapsed, duration.value)
    }, 100)
  }

  function stopProgressLoop(): void {
    if (progressIntervalId !== null) {
      window.clearInterval(progressIntervalId)
      progressIntervalId = null
    }
  }

  function detachSource(): void {
    if (!sourceNode.value) {
      return
    }

    sourceNode.value.onended = null
    sourceNode.value.disconnect()
    sourceNode.value = null
  }

  function createSource(buffer: AudioBuffer): AudioBufferSourceNode {
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(gainNode)

    source.onended = () => {
      if (manualStop) {
        manualStop = false
        return
      }

      isPlaying.value = false
      pausedAt.value = 0
      currentTime.value = duration.value
      stopProgressLoop()
      stopAnalyserLoop()
      detachSource()

      if (endedHandler) {
        endedHandler()
      }
    }

    return source
  }

  function startBufferAt(offsetSeconds: number): void {
    if (!currentBuffer.value) {
      return
    }

    const startOffset = Math.max(0, Math.min(offsetSeconds, currentBuffer.value.duration))

    detachSource()
    const source = createSource(currentBuffer.value)
    sourceNode.value = source
    playbackStartedAt.value = audioCtx.currentTime
    pausedAt.value = startOffset
    source.start(0, startOffset)

    isPlaying.value = true
    currentTime.value = startOffset
    startProgressLoop()
    startAnalyserLoop()
  }

  async function play(song: Song): Promise<void> {
    if (!song.audioUrl) {
      throw new AudioPlaybackError('audio_missing_url')
    }

    await ensureContextReady()

    if (isPlaying.value && sourceNode.value) {
      manualStop = true
      sourceNode.value.stop()
      detachSource()
    }

    currentBuffer.value = await fetchBuffer(song.audioUrl)
    duration.value = currentBuffer.value.duration
    currentTime.value = 0
    pausedAt.value = 0

    startBufferAt(0)
  }

  function pause(): void {
    if (!isPlaying.value || !sourceNode.value) {
      return
    }

    const elapsed = audioCtx.currentTime - playbackStartedAt.value
    pausedAt.value = Math.min(pausedAt.value + elapsed, duration.value)
    currentTime.value = pausedAt.value

    manualStop = true
    sourceNode.value.stop()
    detachSource()

    isPlaying.value = false
    stopProgressLoop()
    stopAnalyserLoop()
  }

  async function resume(): Promise<void> {
    if (isPlaying.value || !currentBuffer.value) {
      return
    }

    await ensureContextReady()
    startBufferAt(pausedAt.value)
  }

  async function seek(seconds: number): Promise<void> {
    if (!currentBuffer.value) {
      return
    }

    const clamped = Math.max(0, Math.min(seconds, duration.value))

    if (isPlaying.value && sourceNode.value) {
      manualStop = true
      sourceNode.value.stop()
      detachSource()

      await ensureContextReady()
      startBufferAt(clamped)
      return
    }

    pausedAt.value = clamped
    currentTime.value = clamped
  }

  function setVolume(nextVolume: number): void {
    const clamped = Math.max(0, Math.min(1, nextVolume))
    volume.value = clamped
    gainNode.gain.value = clamped
  }

  function onEnded(handler: EndedHandler): void {
    endedHandler = handler
  }

  onBeforeUnmount(() => {
    stopProgressLoop()
    stopAnalyserLoop()

    if (sourceNode.value) {
      manualStop = true
      sourceNode.value.stop()
      detachSource()
    }

    void audioCtx.close()
  })

  return {
    currentTime,
    duration,
    volume,
    analyserData,
    isPlaying,
    play,
    pause,
    resume,
    seek,
    setVolume,
    onEnded
  }
}
