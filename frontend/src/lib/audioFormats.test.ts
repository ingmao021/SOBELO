import { describe, expect, it } from 'vitest'
import { getAudioExtension, isSupportedAudioMime, validateAudioFile } from '@/lib/audioFormats'

function makeFile(name: string, type: string, size: number): File {
  return new File(['a'.repeat(Math.max(1, size))], name, { type })
}

describe('audioFormats', () => {
  it('detecta extension de audio correctamente', () => {
    expect(getAudioExtension('track.MP3')).toBe('.mp3')
    expect(getAudioExtension('demo.flac')).toBe('.flac')
    expect(getAudioExtension('archivo')).toBe('')
  })

  it('valida MIME soportado para formatos objetivo', () => {
    expect(isSupportedAudioMime('audio/mpeg')).toBe(true)
    expect(isSupportedAudioMime('audio/ogg; codecs=vorbis')).toBe(true)
    expect(isSupportedAudioMime('audio/x-flac')).toBe(true)
    expect(isSupportedAudioMime('video/mp4')).toBe(false)
  })

  it('rechaza extensiones no soportadas', () => {
    const result = validateAudioFile(makeFile('track.aac', 'audio/aac', 20))
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('unsupported_extension')
  })

  it('rechaza MIME incompatible cuando viene informado', () => {
    const result = validateAudioFile(makeFile('track.mp3', 'video/mp4', 20))
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('unsupported_mime')
  })

  it('acepta archivos de audio validos', () => {
    const result = validateAudioFile(makeFile('track.ogg', 'audio/ogg', 20))
    expect(result.ok).toBe(true)
  })

  it('rechaza archivo por tamaño maximo', () => {
    const result = validateAudioFile(makeFile('track.wav', 'audio/wav', 20), 10)
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('file_too_large')
  })
})
