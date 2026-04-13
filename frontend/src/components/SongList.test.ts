import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import SongList from '@/components/SongList.vue'
import { audioKey, modalKey, playerKey, uiKey } from '@/appContext'
import type { Song } from '@/types/song'

function makeSong(id: string, withAudio = true): Song {
  return {
    id,
    title: `Song ${id}`,
    artist: `Artist ${id}`,
    duration: 120,
    audioUrl: withAudio ? `https://example.com/${id}.mp3` : undefined,
    addedAt: new Date('2026-01-01T00:00:00.000Z')
  }
}

function createStores(songs: Song[]) {
  const playlist = ref<Song[]>(songs)
  const currentIndex = ref<number>(0)
  const isPlaying = ref<boolean>(false)

  const player = {
    playlist,
    currentIndex,
    isPlaying,
    addSong: vi.fn(),
    removeSong: vi.fn(),
    nextSong: vi.fn(),
    prevSong: vi.fn(),
    syncCurrentSongById: vi.fn(),
    shufflePlaylist: vi.fn(),
    toggleRepeat: vi.fn(),
    clearPlaylist: vi.fn(),
    moveSong: vi.fn((fromIndex: number, toIndex: number) => {
      if (fromIndex < 0 || fromIndex >= playlist.value.length) {
        return
      }

      const boundedToIndex = Math.max(0, Math.min(toIndex, playlist.value.length))
      if (boundedToIndex === fromIndex || boundedToIndex === fromIndex + 1) {
        return
      }

      const [song] = playlist.value.splice(fromIndex, 1)
      if (!song) {
        return
      }

      const insertion = boundedToIndex > fromIndex ? boundedToIndex - 1 : boundedToIndex
      playlist.value.splice(insertion, 0, song)

      if (currentIndex.value === fromIndex) {
        currentIndex.value = insertion
      }
    }),
    goToSong: vi.fn((index: number) => {
      currentIndex.value = index
    })
  }

  const audio = {
    currentTime: ref(0),
    duration: ref(0),
    volume: ref(1),
    analyserData: ref(new Uint8Array()),
    isPlaying: ref(false),
    currentSongId: ref<string | null>(null),
    play: vi.fn(async (song: Song) => {
      audio.currentSongId.value = song.id
      audio.isPlaying.value = true
    }),
    pause: vi.fn(),
    resume: vi.fn(async () => {}),
    seek: vi.fn(async () => {}),
    setVolume: vi.fn(),
    onEnded: vi.fn()
  }

  const modal = {
    modalOpen: ref(false),
    openModal: vi.fn(),
    closeModal: vi.fn()
  }

  const ui = {
    language: ref<'es' | 'en'>('es'),
    theme: ref<'light' | 'dark'>('light'),
    toggleTheme: vi.fn(),
    setLanguage: vi.fn(),
    t: (key: string) => key
  }

  return { player, audio, modal, ui }
}

describe('SongList double click playback', () => {
  it('reproduce inmediatamente la cancion seleccionada con doble clic', async () => {
    const songs = [makeSong('a'), makeSong('b')]
    const { player, audio, modal, ui } = createStores(songs)

    const wrapper = mount(SongList, {
      global: {
        provide: {
          [playerKey as symbol]: player,
          [audioKey as symbol]: audio,
          [modalKey as symbol]: modal,
          [uiKey as symbol]: ui
        }
      }
    })

    const items = wrapper.findAll('li.song-item')
    await items[1]?.trigger('dblclick')

    expect(player.goToSong).toHaveBeenCalledWith(1)
    expect(audio.play).toHaveBeenCalledWith(songs[1])
    expect(player.isPlaying.value).toBe(true)
  })

  it('mantiene clic simple como seleccion sin reproducir', async () => {
    const songs = [makeSong('a'), makeSong('b')]
    const { player, audio, modal, ui } = createStores(songs)

    const wrapper = mount(SongList, {
      global: {
        provide: {
          [playerKey as symbol]: player,
          [audioKey as symbol]: audio,
          [modalKey as symbol]: modal,
          [uiKey as symbol]: ui
        }
      }
    })

    const items = wrapper.findAll('li.song-item')
    await items[1]?.trigger('click')

    expect(player.goToSong).toHaveBeenCalledWith(1)
    expect(audio.play).not.toHaveBeenCalled()
    expect(player.isPlaying.value).toBe(false)
  })

  it('si no hay audioUrl no intenta reproducir y deja estado pausado', async () => {
    const songs = [makeSong('a'), makeSong('b', false)]
    const { player, audio, modal, ui } = createStores(songs)

    const wrapper = mount(SongList, {
      global: {
        provide: {
          [playerKey as symbol]: player,
          [audioKey as symbol]: audio,
          [modalKey as symbol]: modal,
          [uiKey as symbol]: ui
        }
      }
    })

    const items = wrapper.findAll('li.song-item')
    await items[1]?.trigger('dblclick')

    expect(player.goToSong).toHaveBeenCalledWith(1)
    expect(audio.play).not.toHaveBeenCalled()
    expect(player.isPlaying.value).toBe(false)
  })

  it('reordena la cancion al mantener clic, arrastrar y soltar', async () => {
    vi.useFakeTimers()

    try {
      const songs = [makeSong('a'), makeSong('b'), makeSong('c')]
      const { player, audio, modal, ui } = createStores(songs)

      const wrapper = mount(SongList, {
        global: {
          provide: {
            [playerKey as symbol]: player,
            [audioKey as symbol]: audio,
            [modalKey as symbol]: modal,
            [uiKey as symbol]: ui
          }
        }
      })

      const items = wrapper.findAll('li.song-item')
      const list = wrapper.find('ul')

      await items[1]?.trigger('pointerdown', {
        button: 0,
        pointerId: 11,
        isPrimary: true,
        clientX: 10,
        clientY: 10
      })

      vi.advanceTimersByTime(301)

      await items[2]?.trigger('pointermove', {
        pointerId: 11,
        clientX: 12,
        clientY: 999
      })

      await list.trigger('pointerup', { pointerId: 11 })

      expect(player.moveSong).toHaveBeenCalledWith(1, 3)
      expect(player.playlist.value.map((song) => song.id)).toEqual(['a', 'c', 'b'])
      expect(wrapper.find('.drop-placeholder').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('no inicia drag si no se cumple el tiempo de hold', async () => {
    vi.useFakeTimers()

    try {
      const songs = [makeSong('a'), makeSong('b'), makeSong('c')]
      const { player, audio, modal, ui } = createStores(songs)

      const wrapper = mount(SongList, {
        global: {
          provide: {
            [playerKey as symbol]: player,
            [audioKey as symbol]: audio,
            [modalKey as symbol]: modal,
            [uiKey as symbol]: ui
          }
        }
      })

      const items = wrapper.findAll('li.song-item')
      const list = wrapper.find('ul')

      await items[1]?.trigger('pointerdown', {
        button: 0,
        pointerId: 7,
        isPrimary: true,
        clientX: 10,
        clientY: 10
      })

      vi.advanceTimersByTime(120)
      await list.trigger('pointerup', { pointerId: 7 })

      expect(player.moveSong).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })
})
