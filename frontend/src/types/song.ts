export interface Song {
  id: string
  title: string
  artist: string
  duration: number
  audioUrl?: string
  coverUrl?: string
  addedAt: Date
}

export type RepeatMode = 'off' | 'one' | 'all'

export type AddPosition = 'start' | 'end' | 'index'
