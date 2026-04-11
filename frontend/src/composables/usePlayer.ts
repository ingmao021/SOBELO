import { computed, ref } from 'vue'
import { List } from 'doubly-linked-list-typescript'
import type { AddPosition, RepeatMode, Song } from '@/types/song'

const list = new List<Song>()

const playlist = ref<Song[]>(list.toArray())
const currentIndex = ref<number>(playlist.value.length > 0 ? 0 : -1)
const isPlaying = ref<boolean>(false)
const isShuffled = ref<boolean>(false)
const repeatMode = ref<RepeatMode>('off')
let originalOrderSnapshot: Song[] | null = null

function revokeBlobUrl(url?: string): void {
  if (!url || !url.startsWith('blob:')) {
    return
  }

  URL.revokeObjectURL(url)
}

function disposeSongMedia(song: Song): void {
  revokeBlobUrl(song.audioUrl)
  revokeBlobUrl(song.coverUrl)
}

const currentSong = computed<Song | null>(() => {
  if (currentIndex.value < 0 || currentIndex.value >= playlist.value.length) {
    return null
  }

  return playlist.value[currentIndex.value] ?? null
})

function syncPlaylistState(): void {
  playlist.value = list.toArray()

  if (playlist.value.length === 0) {
    currentIndex.value = -1
    isPlaying.value = false
    return
  }

  if (currentIndex.value < 0) {
    currentIndex.value = 0
    return
  }

  if (currentIndex.value >= playlist.value.length) {
    currentIndex.value = playlist.value.length - 1
  }
}

function resetShuffleState(): void {
  isShuffled.value = false
  originalOrderSnapshot = null
}

function replaceListContent(songs: Song[]): void {
  while (list.length > 0) {
    list.removeByIndex(0)
  }

  for (const song of songs) {
    list.push(song)
  }
}

function restoreCurrentIndexBySongId(songId: string | null): void {
  if (playlist.value.length === 0) {
    currentIndex.value = -1
    return
  }

  if (!songId) {
    currentIndex.value = 0
    return
  }

  const nextIndex = playlist.value.findIndex((song) => song.id === songId)
  currentIndex.value = nextIndex >= 0 ? nextIndex : 0
}

function addSong(song: Song, position: AddPosition, index?: number): void {
  resetShuffleState()

  if (position === 'start') {
    list.unshift(song)
    currentIndex.value = currentIndex.value < 0 ? 0 : currentIndex.value + 1
    syncPlaylistState()
    return
  }

  if (position === 'index') {
    if (typeof index !== 'number') {
      throw new RangeError('Index is required when position is index')
    }

    list.insertAt(index, song)
    if (currentIndex.value < 0) {
      currentIndex.value = 0
    } else if (index <= currentIndex.value) {
      currentIndex.value += 1
    }

    syncPlaylistState()
    return
  }

  list.push(song)
  if (currentIndex.value < 0) {
    currentIndex.value = 0
  }
  syncPlaylistState()
}

function removeSong(id: string): void {
  const songToRemove = playlist.value.find((song) => song.id === id)
  if (!songToRemove) {
    return
  }

  const removedIndex = playlist.value.findIndex((song) => song.id === id)
  list.removeByData(songToRemove)

  if (playlist.value.length === 1) {
    currentIndex.value = -1
  } else if (removedIndex < currentIndex.value) {
    currentIndex.value -= 1
  } else if (removedIndex === currentIndex.value && currentIndex.value >= playlist.value.length - 1) {
    currentIndex.value -= 1
  }

  disposeSongMedia(songToRemove)

  resetShuffleState()
  syncPlaylistState()
}

function goToSong(index: number): void {
  if (index < 0 || index >= playlist.value.length) {
    return
  }
  currentIndex.value = index
}

function nextSong(): void {
  if (playlist.value.length === 0) {
    return
  }

  if (repeatMode.value === 'one') {
    return
  }

  if (currentIndex.value < 0) {
    currentIndex.value = 0
    return
  }

  if (currentIndex.value >= playlist.value.length) {
    currentIndex.value = repeatMode.value === 'all' ? 0 : playlist.value.length - 1
    return
  }

  if (currentIndex.value < playlist.value.length - 1) {
    currentIndex.value += 1
    return
  }

  if (repeatMode.value === 'all') {
    currentIndex.value = 0
    return
  }

  isPlaying.value = false
}

function prevSong(): void {
  if (playlist.value.length === 0) {
    return
  }

  if (repeatMode.value === 'one') {
    return
  }

  if (currentIndex.value < 0) {
    currentIndex.value = 0
    return
  }

  if (currentIndex.value >= playlist.value.length) {
    currentIndex.value = playlist.value.length - 1
    return
  }

  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    return
  }

  if (repeatMode.value === 'all') {
    currentIndex.value = playlist.value.length - 1
  }
}

function shufflePlaylist(): void {
  if (playlist.value.length <= 1) {
    return
  }

  const currentSongId = currentSong.value?.id ?? null

  if (isShuffled.value) {
    const restoredOrder = originalOrderSnapshot ?? [...playlist.value]
    replaceListContent(restoredOrder)
    syncPlaylistState()
    restoreCurrentIndexBySongId(currentSongId)
    resetShuffleState()
    return
  }

  originalOrderSnapshot = [...playlist.value]
  const shuffled = [...playlist.value]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  replaceListContent(shuffled)
  syncPlaylistState()
  restoreCurrentIndexBySongId(currentSongId)

  isShuffled.value = true
}

function toggleRepeat(): void {
  if (repeatMode.value === 'off') {
    repeatMode.value = 'one'
    return
  }

  if (repeatMode.value === 'one') {
    repeatMode.value = 'all'
    return
  }

  repeatMode.value = 'off'
}

function clearPlaylist(): void {
  for (const song of playlist.value) {
    disposeSongMedia(song)
  }

  replaceListContent([])
  resetShuffleState()
  syncPlaylistState()
}

export function usePlayer() {
  return {
    currentSong,
    playlist,
    currentIndex,
    isPlaying,
    repeatMode,
    isShuffled,
    addSong,
    removeSong,
    nextSong,
    prevSong,
    goToSong,
    shufflePlaylist,
    toggleRepeat,
    clearPlaylist
  }
}
