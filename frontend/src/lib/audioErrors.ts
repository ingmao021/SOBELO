export type AudioPlaybackErrorCode =
  | 'audio_context_unsupported'
  | 'audio_network_error'
  | 'audio_invalid_content_type'
  | 'audio_decode_unsupported'
  | 'audio_decode_corrupt'
  | 'audio_decode_failed'
  | 'audio_buffer_invalid'
  | 'audio_missing_url'

export class AudioPlaybackError extends Error {
  code: AudioPlaybackErrorCode

  constructor(code: AudioPlaybackErrorCode, detail?: string) {
    super(detail ? `${code}:${detail}` : code)
    this.name = 'AudioPlaybackError'
    this.code = code
  }
}

export function getPlaybackErrorMessageKey(error: unknown): string {
  if (!(error instanceof AudioPlaybackError)) {
    return 'control_notice_play_failed'
  }

  if (error.code === 'audio_context_unsupported') {
    return 'control_notice_browser_unsupported'
  }

  if (error.code === 'audio_missing_url') {
    return 'control_notice_missing_audio'
  }

  if (error.code === 'audio_invalid_content_type' || error.code === 'audio_decode_unsupported') {
    return 'control_notice_format_unsupported'
  }

  if (error.code === 'audio_decode_corrupt' || error.code === 'audio_buffer_invalid') {
    return 'control_notice_audio_corrupt'
  }

  if (error.code === 'audio_network_error') {
    return 'control_notice_audio_load_failed'
  }

  return 'control_notice_play_failed'
}
