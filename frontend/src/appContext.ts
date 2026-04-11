import type { InjectionKey, Ref } from 'vue'
import type { useAudioEngine } from '@/composables/useAudioEngine'
import type { usePlayer } from '@/composables/usePlayer'
import type { useUiPreferences } from '@/composables/useUiPreferences'

export type PlayerStore = ReturnType<typeof usePlayer>
export type AudioStore = ReturnType<typeof useAudioEngine>
export type UiStore = ReturnType<typeof useUiPreferences>

export interface ModalControls {
  modalOpen: Ref<boolean>
  openModal: () => void
  closeModal: () => void
}

export const playerKey = Symbol('player') as InjectionKey<PlayerStore>
export const audioKey = Symbol('audio') as InjectionKey<AudioStore>
export const modalKey = Symbol('modal') as InjectionKey<ModalControls>
export const uiKey = Symbol('ui') as InjectionKey<UiStore>
