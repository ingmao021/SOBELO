<template>
  <section class="controls glass-card" aria-label="Controles del reproductor">
    <div class="row now-playing">
      <img v-if="song?.coverUrl" :src="song.coverUrl" alt="Portada" class="cover" />
      <div v-else class="cover cover-fallback">♪</div>

      <div class="meta">
        <p class="title">{{ song?.title ?? 'Sin seleccion' }}</p>
        <small>{{ song?.artist ?? 'Selecciona una cancion' }}</small>
      </div>

      <button type="button" class="icon-btn" :aria-label="ui.t('control_favorite')">♡</button>
    </div>

    <div class="row transport">
      <button type="button" class="icon-btn" :aria-label="ui.t('control_prev')" @click="goPrev">⏮</button>
      <button type="button" class="play-btn" :aria-label="audio.isPlaying.value ? ui.t('control_pause') : ui.t('control_play')" @click="togglePlay">{{ audio.isPlaying.value ? '⏸' : '▶' }}</button>
      <button type="button" class="icon-btn" :aria-label="ui.t('control_next')" @click="goNext">⏭</button>
      <button type="button" class="icon-btn" :aria-label="ui.t('control_shuffle')" :class="{ active: player.isShuffled.value }" @click="toggleShuffle">🔀</button>
      <button type="button" class="icon-btn" :aria-label="ui.t('control_repeat')" @click="player.toggleRepeat()">{{ repeatIcon }}</button>
    </div>

    <div class="row progress">
      <span>{{ formatDuration(audio.currentTime.value) }}</span>
      <input
        :value="audio.currentTime.value"
        type="range"
        min="0"
        :max="Math.max(audio.duration.value, 1)"
        step="0.1"
        @input="onSeek"
      />
      <span>{{ formatDuration(audio.duration.value) }}</span>
    </div>

    <div class="row volume">
      <span>🔊</span>
      <input
        :value="audio.volume.value"
        type="range"
        min="0"
        max="1"
        step="0.01"
        @input="onVolume"
      />
    </div>

    <p v-if="notice" class="notice">{{ notice }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { audioKey, playerKey, uiKey } from '@/appContext'
import { getPlaybackErrorMessageKey } from '@/lib/audioErrors'

function mustInject<T>(value: T | undefined, name: string): T {
  if (!value) {
    throw new Error(`SOBELO context unavailable in ${name}`)
  }

  return value
}

const player = mustInject(inject(playerKey), 'PlayerControls/player')
const audio = mustInject(inject(audioKey), 'PlayerControls/audio')
const ui = mustInject(inject(uiKey), 'PlayerControls/ui')

const notice = ref<string>('')
const lastPlayedId = ref<string | null>(null)

const song = computed(() => player.currentSong.value)
const repeatIcon = computed<string>(() => {
  if (player.repeatMode.value === 'one') {
    return '🔂'
  }

  if (player.repeatMode.value === 'all') {
    return '🔁'
  }

  return '↩'
})

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function setNotice(message: string): void {
  notice.value = message
  window.setTimeout(() => {
    if (notice.value === message) {
      notice.value = ''
    }
  }, 2600)
}

async function playCurrent(forceRestart = false): Promise<void> {
  const current = player.currentSong.value
  if (!current) {
    setNotice(ui.t('control_notice_empty_list'))
    return
  }

  if (!current.audioUrl) {
    setNotice(ui.t('control_notice_missing_audio'))
    player.isPlaying.value = false
    return
  }

  try {
    if (!forceRestart && lastPlayedId.value === current.id && !audio.isPlaying.value) {
      await audio.resume()
    } else {
      await audio.play(current)
      lastPlayedId.value = current.id
    }

    player.isPlaying.value = true
  } catch (error) {
    const key = getPlaybackErrorMessageKey(error)
    const message = error instanceof Error && key === 'control_notice_play_failed'
      ? error.message
      : ui.t(key)
    setNotice(message)
    player.isPlaying.value = false
  }
}

async function togglePlay(): Promise<void> {
  if (audio.isPlaying.value) {
    audio.pause()
    player.isPlaying.value = false
    return
  }

  await playCurrent(false)
}

async function goNext(): Promise<void> {
  player.nextSong()
  if (player.isPlaying.value || audio.isPlaying.value) {
    await playCurrent(true)
  }
}

async function goPrev(): Promise<void> {
  player.prevSong()
  if (player.isPlaying.value || audio.isPlaying.value) {
    await playCurrent(true)
  }
}

function onSeek(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  void audio.seek(value)
}

function onVolume(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  audio.setVolume(value)
}

function toggleShuffle(): void {
  player.shufflePlaylist()
}
</script>

<style scoped>
.controls {
  display: grid;
  gap: 0.9rem;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  background: var(--surface-overlay);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
}

.row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.now-playing {
  display: grid;
  grid-template-columns: 40px 1fr auto;
}

.cover {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.cover-fallback {
  display: grid;
  place-items: center;
  background: rgba(59, 130, 246, 0.18);
  color: var(--text-main);
}

.meta {
  min-width: 0;
}

.title {
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

small {
  color: var(--text-muted);
}

.transport {
  justify-content: center;
}

.icon-btn,
.play-btn {
  border: 0;
  background: var(--surface-interactive);
  color: var(--text-main);
  border-radius: 999px;
  padding: 0.45rem 0.65rem;
  cursor: pointer;
  opacity: 0.8;
}

.icon-btn:hover,
.play-btn:hover {
  background: var(--surface-interactive-hover);
}

.play-btn {
  font-size: 1.25rem;
  padding: 0.4rem 0.9rem;
}

.icon-btn.active {
  color: var(--blue);
  background: rgba(59, 130, 246, 0.14);
}

.progress {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.6rem;
}

.progress span,
.volume span {
  color: var(--text-muted);
  font-size: 0.86rem;
}

input[type='range'] {
  width: 100%;
}

.notice {
  font-size: 0.9rem;
  color: var(--text-muted);
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.45);
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .row {
    gap: 0.45rem;
  }

  .icon-btn,
  .play-btn {
    min-width: 34px;
    min-height: 34px;
  }
}
</style>
