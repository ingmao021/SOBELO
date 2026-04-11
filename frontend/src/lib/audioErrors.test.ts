import { describe, expect, it } from 'vitest'
import { AudioPlaybackError, getPlaybackErrorMessageKey } from '@/lib/audioErrors'

describe('audioErrors', () => {
  it('mapea errores de formato no soportado', () => {
    const error = new AudioPlaybackError('audio_decode_unsupported')
    expect(getPlaybackErrorMessageKey(error)).toBe('control_notice_format_unsupported')
  })

  it('mapea errores de archivo corrupto', () => {
    const error = new AudioPlaybackError('audio_decode_corrupt')
    expect(getPlaybackErrorMessageKey(error)).toBe('control_notice_audio_corrupt')
  })

  it('mapea errores de carga de red', () => {
    const error = new AudioPlaybackError('audio_network_error')
    expect(getPlaybackErrorMessageKey(error)).toBe('control_notice_audio_load_failed')
  })

  it('usa fallback para errores no tipificados', () => {
    expect(getPlaybackErrorMessageKey(new Error('x'))).toBe('control_notice_play_failed')
  })
})
