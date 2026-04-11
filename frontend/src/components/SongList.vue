<template>
  <aside class="song-list" :aria-label="ui.t('player_list_aria')">
    <div class="playlist-head">
      <h2>{{ ui.t('player_title') }}</h2>
      <div class="playlist-actions">
        <button type="button" class="btn-primary" @click="modal.openModal">+ {{ ui.t('player_add_button') }}</button>
        <button type="button" class="btn-secondary" @click="player.clearPlaylist">{{ ui.t('player_clear_button') }}</button>
      </div>
    </div>

    <div v-if="player.playlist.value.length === 0" class="playlist-empty">
      <div class="icon">⌗</div>
      <h3>{{ ui.t('player_empty_title') }}</h3>
      <p>{{ ui.t('player_empty_copy') }}</p>
    </div>

    <ul v-else>
      <li
        v-for="(song, index) in player.playlist.value"
        :key="song.id"
        class="song-item"
        :class="{ active: index === player.currentIndex.value }"
        role="button"
        tabindex="0"
        @click="player.goToSong(index)"
        @keydown.enter="player.goToSong(index)"
        @keydown.space.prevent="player.goToSong(index)"
      >
        <img v-if="song.coverUrl" :src="song.coverUrl" alt="Portada" class="thumb" />
        <div v-else class="thumb thumb-fallback">♪</div>

        <div class="song-meta">
          <p>{{ song.title }}</p>
          <small>{{ song.artist }} · {{ formatDuration(song.duration) }}</small>
        </div>

        <button type="button" class="remove-btn" :aria-label="ui.t('player_remove_song')" @click.stop="player.removeSong(song.id)">
          🗑
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { modalKey, playerKey, uiKey } from '@/appContext'

const player = inject(playerKey)
const modal = inject(modalKey)
const ui = inject(uiKey)

if (!player || !modal || !ui) {
  throw new Error('SOBELO context unavailable in SongList')
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
  gap: 0.5rem;
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
}

.song-item.active {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: var(--blue);
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
