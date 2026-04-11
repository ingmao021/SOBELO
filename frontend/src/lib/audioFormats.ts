const ACCEPTED_AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav', '.ogg'] as const

const ACCEPTED_AUDIO_MIME_PREFIXES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/x-mpeg-3',
  'audio/flac',
  'audio/x-flac',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'application/ogg'
] as const

export const MAX_AUDIO_FILE_SIZE_BYTES = 100 * 1024 * 1024

export type AudioFileValidationReason =
  | 'missing_file'
  | 'unsupported_extension'
  | 'unsupported_mime'
  | 'file_too_large'

export interface AudioFileValidationResult {
  ok: boolean
  reason?: AudioFileValidationReason
}

export function getAcceptedAudioExtensions(): readonly string[] {
  return ACCEPTED_AUDIO_EXTENSIONS
}

export function getAudioExtension(fileName: string): string {
  const lower = fileName.toLowerCase()
  const dotIndex = lower.lastIndexOf('.')
  if (dotIndex < 0) {
    return ''
  }

  return lower.slice(dotIndex)
}

export function isSupportedAudioMime(mime: string): boolean {
  const normalized = mime.toLowerCase().split(';')[0].trim()
  return ACCEPTED_AUDIO_MIME_PREFIXES.some((accepted) => normalized.startsWith(accepted))
}

export function validateAudioFile(file: File | null, maxBytes = MAX_AUDIO_FILE_SIZE_BYTES): AudioFileValidationResult {
  if (!file) {
    return { ok: false, reason: 'missing_file' }
  }

  if (file.size > maxBytes) {
    return { ok: false, reason: 'file_too_large' }
  }

  const extension = getAudioExtension(file.name)
  if (!ACCEPTED_AUDIO_EXTENSIONS.includes(extension as (typeof ACCEPTED_AUDIO_EXTENSIONS)[number])) {
    return { ok: false, reason: 'unsupported_extension' }
  }

  if (file.type && !isSupportedAudioMime(file.type)) {
    return { ok: false, reason: 'unsupported_mime' }
  }

  return { ok: true }
}
