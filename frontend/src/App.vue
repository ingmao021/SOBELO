<template>
  <div id="app">
    <div class="skip-links">
      <a href="#contenido">{{ uiStore.t('skip_content') }}</a>
      <a href="#nav">{{ uiStore.t('skip_nav') }}</a>
      <a href="#pie">{{ uiStore.t('skip_footer') }}</a>
    </div>

    <main id="contenido" class="shell">
      <template v-if="isLegalPage">
        <NavBar :hide-faq="true" home-href="/" />
        <PrivacySection v-if="isPrivacyPage" />
        <TermsSection v-else />
        <FooterSection />
      </template>

      <template v-else>
        <NavBar />

        <section id="player" class="main-top">
          <div class="video-panel">
            <PlayerVisualizer />
            <PlayerControls />
          </div>

          <SongList />
        </section>

        <HeroSection />
        <FaqSection />
        <FooterSection />
      </template>
    </main>
    <AddSongModal v-if="modalOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import AddSongModal from '@/components/AddSongModal.vue'
import FaqSection from '@/components/FaqSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import NavBar from '@/components/NavBar.vue'
import PlayerControls from '@/components/PlayerControls.vue'
import PlayerVisualizer from '@/components/PlayerVisualizer.vue'
import PrivacySection from '@/components/PrivacySection.vue'
import SongList from '@/components/SongList.vue'
import TermsSection from '@/components/TermsSection.vue'
import { useAudioEngine } from '@/composables/useAudioEngine'
import { usePlayer } from '@/composables/usePlayer'
import { useUiPreferences } from '@/composables/useUiPreferences'
import { audioKey, modalKey, playerKey, uiKey } from '@/appContext'

const playerStore = usePlayer()
const audioStore = useAudioEngine()
const uiStore = useUiPreferences()
const modalOpen = ref<boolean>(false)
const isPrivacyPage = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.location.pathname === '/privacy'
})

const isTermsPage = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.location.pathname === '/terms'
})

const isLegalPage = computed(() => isPrivacyPage.value || isTermsPage.value)

const openModal = (): void => {
  modalOpen.value = true
}

const closeModal = (): void => {
  modalOpen.value = false
}

audioStore.onEnded(() => {
  playerStore.syncCurrentSongById(audioStore.currentSongId.value)
  playerStore.nextSong()
})

provide(playerKey, playerStore)
provide(audioKey, audioStore)
provide(uiKey, uiStore)
provide(modalKey, {
  modalOpen,
  openModal,
  closeModal
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: transparent;
  display: flex;
  flex-direction: column;
}

.skip-links {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 60;
  display: flex;
  gap: 0.5rem;
}

.skip-links a {
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  padding: 7px 10px;
  transform: translateY(-220%);
  transition: transform 0.2s ease;
}

.skip-links a:focus {
  transform: translateY(0);
}

.shell {
  width: 100%;
  max-width: 1560px;
  margin: 0 auto;
  background: var(--surface);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--line);
  display: grid;
  overflow: hidden;
}

.main-top {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: 1rem;
  padding: 1.25rem;
  background: var(--surface-soft);
  border-bottom: 1px solid var(--line);
}

.video-panel {
  display: grid;
  gap: 0.8rem;
}

@media (max-width: 1180px) {
  .main-top {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .main-top {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .main-top {
    padding: 0.85rem;
    gap: 0.8rem;
  }
}
</style>
