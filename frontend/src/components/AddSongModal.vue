<template>
  <section class="overlay" role="dialog" aria-modal="true" @click.self="closeModal">
    <form class="modal" @submit.prevent="submitSong">
      <h3>{{ ui.t('modal_title') }}</h3>

      <label>
        {{ ui.t('modal_label_title') }}
        <input v-model.trim="title" class="input-field" type="text" required />
      </label>

      <label>
        {{ ui.t('modal_label_artist') }}
        <input v-model.trim="artist" class="input-field" type="text" required />
      </label>

      <label>
        {{ ui.t('modal_label_audio') }}
        <input
          class="input-field"
          type="file"
          accept=".mp3,.wav,.ogg,.flac"
          @change="onAudioFileChange"
        />
      </label>

      <label>
        {{ ui.t('modal_label_cover') }}
        <input class="input-field" type="file" accept="image/*" @change="onCoverFileChange" />
      </label>

      <label>
        {{ ui.t('modal_label_position') }}
        <select v-model="position" class="input-field">
          <option value="start">{{ ui.t('modal_pos_start') }}</option>
          <option value="end">{{ ui.t('modal_pos_end') }}</option>
          <option value="index">{{ ui.t('modal_pos_index') }}</option>
        </select>
      </label>

      <label v-if="position === 'index'">
        {{ ui.t('modal_label_index') }}
        <input v-model.number="index" class="input-field" type="number" min="0" required />
      </label>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="actions">
        <button type="button" class="btn-ghost" @click="closeModal">{{ ui.t('modal_cancel') }}</button>
        <button type="submit" class="btn-primary">{{ ui.t('modal_add') }}</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { modalKey, playerKey, uiKey } from '@/appContext'
import type { AddPosition, Song } from '@/types/song'

function mustInject<T>(value: T | undefined, name: string): T {
  if (!value) {
    throw new Error(`SOBELO context unavailable in ${name}`)
  }

  return value
}

const modal = mustInject(inject(modalKey), 'AddSongModal/modal')
const player = mustInject(inject(playerKey), 'AddSongModal/player')
const ui = mustInject(inject(uiKey), 'AddSongModal/ui')

const title = ref<string>('')
const artist = ref<string>('')
const position = ref<AddPosition>('end')
const index = ref<number>(0)
const audioFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)
const errorMessage = ref<string>('')

function onAudioFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  audioFile.value = target.files?.[0] ?? null
}

function onCoverFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  coverFile.value = target.files?.[0] ?? null
}

function closeModal(): void {
  modal.closeModal()
}

function submitSong(): void {
  errorMessage.value = ''

  if (!title.value || !artist.value) {
    errorMessage.value = ui.t('modal_error_required')
    return
  }

  if (position.value === 'index' && (!Number.isInteger(index.value) || index.value < 0)) {
    errorMessage.value = ui.t('modal_error_index')
    return
  }

  const generatedId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `song-${Date.now()}`

  const createdSong: Song = {
    id: generatedId,
    title: title.value,
    artist: artist.value,
    duration: 0,
    audioUrl: audioFile.value ? URL.createObjectURL(audioFile.value) : undefined,
    coverUrl: coverFile.value ? URL.createObjectURL(coverFile.value) : undefined,
    addedAt: new Date()
  }

  const targetIndex = position.value === 'index' ? index.value : undefined

  try {
    player.addSong(createdSong, position.value, targetIndex)
    closeModal()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : ui.t('modal_error_add')
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 80;
}

.modal {
  width: min(560px, calc(100% - 2rem));
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1.2rem;
  display: grid;
  gap: 0.75rem;
  animation: fade-in 0.2s ease;
  transform-origin: center;
}

h3 {
  margin: 0;
  color: var(--text-main);
  font: 700 1.15rem/1.2 var(--font-display);
}

label {
  display: grid;
  gap: 0.3rem;
  color: var(--text-muted);
  font-size: 0.86rem;
}

.actions {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.error {
  color: var(--danger);
  font-size: 0.84rem;
}

@media (max-width: 640px) {
  .modal {
    width: calc(100% - 1.2rem);
    padding: 0.95rem;
  }
}
</style>
