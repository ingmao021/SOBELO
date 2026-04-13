<template>
  <aside class="song-list" :class="{ 'drag-active': isDragging }" :aria-label="ui.t('player_list_aria')">
    <div class="playlist-head">
      <h2>{{ ui.t('player_title') }}</h2>
      <div class="playlist-actions">
        <button type="button" class="btn-primary" @click="modal.openModal">+ {{ ui.t('player_add_button') }}</button>
        <button type="button" class="btn-secondary" @click="openFolderPicker">{{ ui.t('player_add_folder_button') }}</button>
        <button type="button" class="btn-secondary" @click="player.clearPlaylist">{{ ui.t('player_clear_button') }}</button>
      </div>
    </div>

    <input
      ref="folderInput"
      class="folder-input"
      type="file"
      webkitdirectory
      multiple
      @change="onFolderSelection"
    />

    <div v-if="player.playlist.value.length === 0" class="playlist-empty">
      <div class="icon">⌗</div>
      <h3>{{ ui.t('player_empty_title') }}</h3>
      <p>{{ ui.t('player_empty_copy') }}</p>
    </div>

    <ul
      v-else
      ref="playlistRef"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
    >
      <template v-for="(song, index) in player.playlist.value" :key="song.id">
        <li
          v-if="isDragging && dragOverIndex === index"
          class="drop-placeholder"
          :data-drop-index="index"
          aria-hidden="true"
        >
          <span>Soltar aqui</span>
        </li>

        <li
          class="song-item"
          :class="{
            active: index === player.currentIndex.value,
            dragging: isDragging && index === draggedIndex,
            'drag-peer': isDragging && index !== draggedIndex
          }"
          :data-song-index="index"
          role="button"
          tabindex="0"
          @pointerdown="onPointerDown(index, $event)"
          @click="onSongClick(index)"
          @dblclick.prevent="onSongDoubleClick(index, song)"
          @keydown.enter="player.goToSong(index)"
          @keydown.space.prevent="player.goToSong(index)"
        >
          <img v-if="song.coverUrl" :src="song.coverUrl" alt="Portada" class="thumb" />
          <div v-else class="thumb thumb-fallback">♪</div>

          <div class="song-meta">
            <p>{{ song.title }}</p>
            <small>{{ song.artist }} · {{ formatDuration(song.duration) }}</small>
          </div>

          <button
            type="button"
            class="remove-btn"
            :disabled="isDragging"
            :aria-label="ui.t('player_remove_song')"
            @click.stop="player.removeSong(song.id)"
          >
            🗑
          </button>
        </li>
      </template>

      <li
        v-if="isDragging && dragOverIndex === player.playlist.value.length"
        class="drop-placeholder"
        :data-drop-index="player.playlist.value.length"
        aria-hidden="true"
      >
        <span>Soltar aqui</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { audioKey, modalKey, playerKey, uiKey } from '@/appContext'
import { validateAudioFile } from '@/lib/audioFormats'
import { formatDuration } from '@/lib/formatters'
import { mustInject } from '@/lib/inject'
import type { Song } from '@/types/song'

const player = mustInject(inject(playerKey), 'SongList/player')
const audio = mustInject(inject(audioKey), 'SongList/audio')
const modal = mustInject(inject(modalKey), 'SongList/modal')
const ui = mustInject(inject(uiKey), 'SongList/ui')

const HOLD_DELAY_MS = 150
const MOVE_TOLERANCE_PX = 8

const folderInput = ref<HTMLInputElement | null>(null)
const playlistRef = ref<HTMLUListElement | null>(null)

let holdTimerId: number | null = null
let pointerStartX = 0
let pointerStartY = 0
let activePointerId: number | null = null
let holdSourceIndex: number | null = null
let suppressPressUntil = 0

const isDragging = ref<boolean>(false)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function openFolderPicker(): void {
  folderInput.value?.click()
}

function clearHoldTimer(): void {
  if (holdTimerId === null) {
    return
  }

  window.clearTimeout(holdTimerId)
  holdTimerId = null
}

function cleanupDragState(): void {
  clearHoldTimer()
  isDragging.value = false
  draggedIndex.value = null
  dragOverIndex.value = null
  activePointerId = null
  holdSourceIndex = null
}

function resolveDropIndexFromEvent(event: PointerEvent): number {
  const target = event.target as HTMLElement | null
  const dropTarget = target?.closest('[data-drop-index]') as HTMLElement | null
  if (dropTarget?.dataset.dropIndex) {
    return Number(dropTarget.dataset.dropIndex)
  }

  const songTarget = target?.closest('[data-song-index]') as HTMLElement | null
  if (songTarget?.dataset.songIndex) {
    const itemIndex = Number(songTarget.dataset.songIndex)
    const rect = songTarget.getBoundingClientRect()
    if (rect.height > 0 && event.clientY > rect.top + rect.height / 2) {
      return itemIndex + 1
    }

    if (rect.height <= 0 && event.clientY >= rect.top) {
      return itemIndex + 1
    }

    return itemIndex
  }

  const listElement = playlistRef.value
  if (!listElement) {
    return player.playlist.value.length
  }

  const songElements = listElement.querySelectorAll<HTMLElement>('[data-song-index]')
  for (const element of songElements) {
    const indexValue = Number(element.dataset.songIndex)
    const rect = element.getBoundingClientRect()

    if (event.clientY <= rect.top + rect.height / 2) {
      return indexValue
    }
  }

  return player.playlist.value.length
}

function onPointerDown(index: number, event: PointerEvent): void {
  if (Date.now() < suppressPressUntil || event.button !== 0 || event.isPrimary === false) {
    return
  }

  const target = event.target as HTMLElement | null
  if (target?.closest('.remove-btn')) {
    return
  }

  clearHoldTimer()

  pointerStartX = event.clientX
  pointerStartY = event.clientY
  activePointerId = event.pointerId
  holdSourceIndex = index

  holdTimerId = window.setTimeout(() => {
    if (holdSourceIndex === null || activePointerId !== event.pointerId) {
      return
    }

    isDragging.value = true
    draggedIndex.value = holdSourceIndex
    dragOverIndex.value = holdSourceIndex
  }, HOLD_DELAY_MS)
}

function onPointerMove(event: PointerEvent): void {
  if (activePointerId !== event.pointerId) {
    return
  }

  if (!isDragging.value) {
    const moveX = Math.abs(event.clientX - pointerStartX)
    const moveY = Math.abs(event.clientY - pointerStartY)
    if (moveX > MOVE_TOLERANCE_PX || moveY > MOVE_TOLERANCE_PX) {
      clearHoldTimer()
    }

    return
  }

  event.preventDefault()
  dragOverIndex.value = resolveDropIndexFromEvent(event)
}

function onPointerUp(event: PointerEvent): void {
  if (activePointerId !== event.pointerId) {
    return
  }

  const wasDragging = isDragging.value
  const fromIndex = draggedIndex.value
  const toIndex = dragOverIndex.value

  cleanupDragState()

  if (wasDragging && fromIndex !== null && toIndex !== null) {
    player.moveSong(fromIndex, toIndex)
    suppressPressUntil = Date.now() + 180
  }
}

function onPointerCancel(event: PointerEvent): void {
  if (activePointerId !== event.pointerId) {
    return
  }

  cleanupDragState()
}

function onSongClick(index: number): void {
  if (Date.now() < suppressPressUntil) {
    return
  }

  player.goToSong(index)
}

function fileNameToSongTitle(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0) {
    return fileName
  }

  return fileName.slice(0, dotIndex)
}

function createSongFromFile(file: File): Song {
  const generatedId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `song-${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id: generatedId,
    title: fileNameToSongTitle(file.name),
    artist: ui.t('player_unknown_artist'),
    duration: 0,
    audioUrl: URL.createObjectURL(file),
    addedAt: new Date()
  }
}

function onFolderSelection(event: Event): void {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0) {
    return
  }

  const acceptedFiles = Array.from(files).filter((file) => validateAudioFile(file).ok)

  for (const file of acceptedFiles) {
    player.addSong(createSongFromFile(file), 'end')
  }

  input.value = ''
}

async function onSongDoubleClick(index: number, song: Song): Promise<void> {
  if (Date.now() < suppressPressUntil || isDragging.value) {
    return
  }

  player.goToSong(index)

  if (!song.audioUrl) {
    player.isPlaying.value = false
    return
  }

  try {
    await audio.play(song)
    player.isPlaying.value = true
  } catch {
    player.isPlaying.value = false
  }
}

</script>

<style scoped>
.song-list {
  border: 1px solid var(--line-soft);
  background: var(--surface-overlay);
  border-radius: var(--radius-sm);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-height: 560px;
}

.playlist-head {
  border-bottom: 1px solid rgba(59, 130, 246, 0.25);
  padding-bottom: 0.7rem;
  margin-bottom: 0.8rem;
}

h2 {
  margin: 0 0 0.7rem;
  color: var(--blue);
  font: 700 1.35rem/1.1 var(--font-display);
}

.playlist-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.folder-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

ul {
  list-style: none;
  display: grid;
  gap: 0.6rem;
  max-height: 440px;
  overflow-y: auto;
}

.playlist-empty {
  margin: auto;
  text-align: center;
  color: var(--text-muted);
  max-width: 270px;
}

.playlist-empty .icon {
  font-size: 2.2rem;
  color: var(--blue);
  opacity: 0.9;
}

.playlist-empty h3 {
  margin: 0.7rem 0 0.4rem;
  font: 700 1.8rem/1.12 var(--font-display);
  color: var(--text-main);
}

.playlist-empty p {
  margin: 0;
  font-size: 0.8rem;
}

.song-item {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 0.55rem;
  align-items: center;
  padding: 0.45rem;
  border-radius: 10px;
  border-left: 3px solid transparent;
  cursor: pointer;
  background: var(--surface-elevated);
  transition: transform 0.16s ease, opacity 0.16s ease, box-shadow 0.16s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.song-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
}

.song-item:active {
  transform: scale(0.994);
}

.song-item.active {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: var(--blue);
}

.drag-active .song-item {
  cursor: grabbing;
  user-select: none;
}

.drag-active ul {
  touch-action: none;
}

.song-item.dragging {
  opacity: 0.45;
  transform: scale(0.985);
}

.song-item.drag-peer {
  opacity: 0.8;
}

.drop-placeholder {
  min-height: 58px;
  border-radius: 10px;
  border: 1px dashed var(--blue);
  background: rgba(59, 130, 246, 0.12);
  display: grid;
  place-items: center;
  color: var(--text-main);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.remove-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.thumb-fallback {
  background: rgba(59, 130, 246, 0.18);
  color: var(--text-main);
  display: grid;
  place-items: center;
}

.song-meta p {
  color: var(--text-main);
}

.song-meta small {
  color: var(--text-muted);
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.75;
}

.btn-secondary {
  border: 0;
  border-radius: 999px;
  padding: 0.65rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--surface-interactive);
  color: var(--text-muted);
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--surface-interactive-hover);
}

.song-item:focus-visible,
.remove-btn:focus-visible,
.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.45);
  outline-offset: 2px;
}

@media (max-width: 1180px) {
  .song-list {
    min-height: 380px;
  }
}
</style>
