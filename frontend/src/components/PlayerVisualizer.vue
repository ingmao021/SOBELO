<template>
  <section class="visualizer glass-card" aria-label="Visualizador de playlist">
    <div class="video-frame">
      <div class="upload-cloud" aria-hidden="true">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
        </svg>
      </div>
      <button type="button" class="btn-primary" @click="modal.openModal">{{ ui.t('player_select_files') }}</button>
      <p class="upload-hint">{{ ui.t('player_upload_hint') }}</p>
    </div>

    <TransitionGroup name="node" tag="ul" class="node-row">
      <li
        v-for="(song, index) in player.playlist.value"
        :key="song.id"
        class="node-item"
        :class="{ active: index === player.currentIndex.value }"
        @click="player.goToSong(index)"
      >
        <img v-if="song.coverUrl" :src="song.coverUrl" alt="Portada" class="cover" />
        <div v-else class="cover cover-fallback">♪</div>

        <div class="meta">
          <p class="title">{{ song.title }}</p>
          <p class="artist">{{ song.artist }}</p>
          <p class="duration">{{ formatDuration(song.duration) }}</p>
        </div>
      </li>
    </TransitionGroup>

  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { audioKey, modalKey, playerKey, uiKey } from '@/appContext'

const player = inject(playerKey)
const audio = inject(audioKey)
const modal = inject(modalKey)
const ui = inject(uiKey)

if (!player || !audio || !modal || !ui) {
  throw new Error('SOBELO context unavailable in PlayerVisualizer')
}

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.visualizer {
  display: grid;
  gap: 1rem;
}

.video-frame {
  margin: 0;
  min-height: 290px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--surface-elevated-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--text-muted);
  text-align: center;
}

.upload-cloud {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: var(--blue);
  font-size: 2.2rem;
  font-weight: 700;
}

.upload-hint {
  margin: 0;
  font-size: 0.72rem;
  color: var(--text-muted);
  max-width: 520px;
}

.node-row {
  list-style: none;
  display: flex;
  gap: 1.2rem;
  overflow-x: auto;
  padding: 0.2rem 0.2rem 0.7rem;
}

.node-item {
  min-width: 210px;
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 0.7rem;
  position: relative;
  border: 1px solid var(--line-soft);
  background: var(--surface-overlay);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 0.8rem;
  cursor: pointer;
}

.node-item::before,
.node-item::after {
  content: '↔';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(59, 130, 246, 0.55);
}

.node-item::before {
  left: -0.85rem;
}

.node-item::after {
  right: -0.85rem;
}

.node-item.active {
  border-color: var(--blue);
  box-shadow: 0 4px 24px rgba(59, 130, 246, 0.2);
}

.cover {
  width: 62px;
  height: 62px;
  border-radius: 10px;
  object-fit: cover;
}

.cover-fallback {
  display: grid;
  place-items: center;
  background: rgba(59, 130, 246, 0.18);
  font-size: 1.3rem;
  color: var(--text-main);
}

.meta {
  display: grid;
  align-content: center;
  gap: 0.25rem;
}

.title {
  font-weight: 600;
  color: var(--text-main);
}

.artist,
.duration,
.audio-hint {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.node-enter-active,
.node-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.node-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
