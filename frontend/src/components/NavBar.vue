<template>
  <header id="nav" class="header">
    <nav :aria-label="ui.t('nav_aria')">
      <a href="#top" class="brand" aria-label="SOBELO">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.7" />
            <path d="M7 12.1c0-2.6 2.1-4.6 4.8-4.6c2 0 3.6 1 4.3 2.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            <path d="M17 11.9c0 2.6-2.1 4.6-4.8 4.6c-2 0-3.6-1-4.3-2.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        </span>
        <span class="brand-text">SOBELO</span>
      </a>

      <div class="nav-actions">
        <a href="#top" class="nav-link active">{{ ui.t('nav_home') }}</a>
        <a href="#faq" class="nav-link">{{ ui.t('nav_faq') }}</a>
        <button
          id="themeToggle"
          class="theme-toggle"
          type="button"
          :aria-label="ui.theme.value === 'dark' ? ui.t('theme_to_light') : ui.t('theme_to_dark')"
          @click="ui.toggleTheme"
        >
          {{ ui.theme.value === 'dark' ? '☾' : '☀' }}
        </button>
        <button type="button" @click="ui.toggleLanguage">
          {{ ui.language.value === 'es' ? ui.t('lang_button_en') : ui.t('lang_button_es') }}
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { uiKey } from '@/appContext'

const ui = inject(uiKey)

if (!ui) {
  throw new Error('SOBELO context unavailable in NavBar')
}
</script>

<style scoped>
.header {
  height: 66px;
  border-bottom: 1px solid var(--line);
  padding: 0 34px;
  background: var(--surface);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 40;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.82rem;
  line-height: 1;
  font-weight: 500;
  color: var(--text-muted);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text-main);
  text-decoration: none;
}

.brand-mark {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--blue);
}

.brand-mark svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  font: 800 0.9rem/1 var(--font-display);
  letter-spacing: 0.08em;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
}

button {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 8px 10px;
  border-radius: 6px;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.45);
  outline-offset: 2px;
}

.active {
  color: var(--blue);
  font-weight: 700;
}

.theme-toggle {
  font-size: 0.95rem;
  color: var(--text-muted);
  padding: 0;
  width: 36px;
  height: 36px;
}

@media (max-width: 760px) {
  .header {
    padding: 0 14px;
  }

  .brand-text {
    font-size: 0.76rem;
    letter-spacing: 0.06em;
  }

  .nav-actions {
    gap: 3px;
  }

  .nav-link,
  .nav-actions button {
    padding: 8px 6px;
    font-size: 0.73rem;
  }
}
</style>
