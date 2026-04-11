<template>
  <footer id="pie" class="footer">
    <div class="footer-links">
      <span>{{ ui.t('footer_copy') }}</span>
      <a href="privacy">{{ ui.t('footer_privacy') }}</a>
      <a href="terms">{{ ui.t('footer_terms') }}</a>
      <a href="https://github.com/ingmao021/SOBELO" target="_blank" rel="noreferrer">{{ ui.t('footer_github') }}</a>
    </div>
    <small>
      {{ ui.t('footer_disclaimer') }}
      {{ currentYear }}.
    </small>
  </footer>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { uiKey } from '@/appContext'

const currentYear = new Date().getFullYear()
const ui = inject(uiKey)

if (!ui) {
  throw new Error('SOBELO context unavailable in FooterSection')
}
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  background: var(--surface-soft);
  padding: 1.2rem 1.25rem 2rem;
  text-align: center;
}

.footer-links {
  margin-bottom: 0.7rem;
  color: var(--text-muted);
  font-size: 0.74rem;
}

.footer-links a {
  color: var(--blue);
  text-decoration: none;
  margin: 0 8px;
}

small {
  display: block;
  max-width: 860px;
  margin: 8px auto 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.74rem;
}
</style>
