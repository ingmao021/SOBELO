<template>
  <section id="faq" class="faq">
    <div class="faq-wrap">
      <h2>{{ ui.t('faq_heading') }}</h2>
      <div class="faq-list">
        <article class="faq-item">
          <h3>{{ ui.t('faq_1_q') }}</h3>
          <p>
            {{ ui.t('faq_1_a') }}
          </p>
        </article>

        <article class="faq-item">
          <h3>{{ ui.t('faq_2_q') }}</h3>
          <p>
            {{ ui.t('faq_2_a') }}
          </p>
        </article>

        <article class="faq-item">
          <h3>{{ ui.t('faq_3_q') }}</h3>
          <p>
            {{ ui.t('faq_3_a') }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { uiKey } from '@/appContext'

const ui = inject(uiKey)

if (!ui) {
  throw new Error('SOBELO context unavailable in FaqSection')
}
</script>

<style scoped>
.faq {
  background: var(--surface-soft);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 2.4rem 1.4rem;
}

.faq-wrap {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  margin: 0;
  font: 700 2rem/1.1 var(--font-display);
  color: var(--text-main);
}

.faq-list {
  margin-top: 1.4rem;
  display: grid;
  gap: 1rem;
}

.faq-item {
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 1.1rem 1.2rem;
}

.faq-item h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: var(--text-main);
}

.faq-item p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.6;
}

</style>
