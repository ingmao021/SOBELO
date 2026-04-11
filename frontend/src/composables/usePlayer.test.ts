import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePlayer } from '@/composables/usePlayer'
import type { Song } from '@/types/song'

function makeSong(id: string): Song {
  return {
    id,
    title: `Song ${id}`,
    artist: 'Test Artist',
    duration: 180,
    addedAt: new Date('2026-01-01T00:00:00.000Z')
  }
}

describe('usePlayer shuffle', () => {
  beforeEach(() => {
    const player = usePlayer()
    player.clearPlaylist()
    player.isPlaying.value = false

    while (player.repeatMode.value !== 'off') {
      player.toggleRepeat()
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mantiene la cancion actual y next/prev siguen el orden visible tras shuffle', () => {
    const player = usePlayer()
    const songs = ['a', 'b', 'c', 'd'].map(makeSong)

    for (const song of songs) {
      player.addSong(song, 'end')
    }

    player.goToSong(1)

    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    player.shufflePlaylist()

    expect(player.isShuffled.value).toBe(true)
    expect(player.playlist.value.map((song) => song.id)).toEqual(['b', 'c', 'd', 'a'])
    expect(player.currentSong.value?.id).toBe('b')

    player.nextSong()
    expect(player.currentSong.value?.id).toBe('c')

    player.prevSong()
    expect(player.currentSong.value?.id).toBe('b')
  })

  it('al desactivar shuffle restaura el orden original', () => {
    const player = usePlayer()
    const songs = ['a', 'b', 'c', 'd'].map(makeSong)

    for (const song of songs) {
      player.addSong(song, 'end')
    }

    player.goToSong(2)

    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    player.shufflePlaylist()
    expect(player.playlist.value.map((song) => song.id)).toEqual(['b', 'c', 'd', 'a'])
    expect(player.currentSong.value?.id).toBe('c')

    player.shufflePlaylist()

    expect(player.isShuffled.value).toBe(false)
    expect(player.playlist.value.map((song) => song.id)).toEqual(['a', 'b', 'c', 'd'])
    expect(player.currentSong.value?.id).toBe('c')
  })

  it('si la playlist cambia durante shuffle, se invalida snapshot previo', () => {
    const player = usePlayer()
    const songs = ['a', 'b', 'c'].map(makeSong)

    for (const song of songs) {
      player.addSong(song, 'end')
    }

    vi.spyOn(Math, 'random').mockReturnValue(0)
    player.shufflePlaylist()

    expect(player.isShuffled.value).toBe(true)

    player.addSong(makeSong('x'), 'end')

    expect(player.isShuffled.value).toBe(false)
    expect(player.playlist.value.map((song) => song.id)).toEqual(['b', 'c', 'a', 'x'])

    vi.spyOn(Math, 'random').mockReturnValue(0)
    player.shufflePlaylist()
    player.shufflePlaylist()

    expect(player.playlist.value.map((song) => song.id)).toEqual(['b', 'c', 'a', 'x'])
  })

  it('mantiene comportamiento de repeat one y repeat all con shuffle activo', () => {
    const player = usePlayer()
    const songs = ['a', 'b', 'c'].map(makeSong)

    for (const song of songs) {
      player.addSong(song, 'end')
    }

    vi.spyOn(Math, 'random').mockReturnValue(0)
    player.shufflePlaylist()

    player.goToSong(1)
    const beforeRepeatOne = player.currentSong.value?.id

    player.toggleRepeat()
    expect(player.repeatMode.value).toBe('one')
    player.nextSong()
    expect(player.currentSong.value?.id).toBe(beforeRepeatOne)

    player.toggleRepeat()
    expect(player.repeatMode.value).toBe('all')
    player.goToSong(player.playlist.value.length - 1)
    player.nextSong()
    expect(player.currentIndex.value).toBe(0)
  })
})

describe('usePlayer syncCurrentSongById', () => {
  beforeEach(() => {
    const player = usePlayer()
    player.clearPlaylist()
    player.isPlaying.value = false

    while (player.repeatMode.value !== 'off') {
      player.toggleRepeat()
    }
  })

  it('sincroniza currentIndex al id de la cancion activa', () => {
    const player = usePlayer()
    const songs = ['a', 'b', 'c', 'd'].map(makeSong)

    for (const song of songs) {
      player.addSong(song, 'end')
    }

    player.goToSong(3)
    player.syncCurrentSongById('a')

    expect(player.currentIndex.value).toBe(0)
    expect(player.currentSong.value?.id).toBe('a')
  })

  it('ignora id inexistente y mantiene seleccion actual', () => {
    const player = usePlayer()
    const songs = ['a', 'b', 'c'].map(makeSong)

    for (const song of songs) {
      player.addSong(song, 'end')
    }

    player.goToSong(2)
    player.syncCurrentSongById('missing')

    expect(player.currentIndex.value).toBe(2)
    expect(player.currentSong.value?.id).toBe('c')
  })
})
