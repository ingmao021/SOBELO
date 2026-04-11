<template>
  <section id="terms" class="terms" aria-labelledby="terms-heading">
    <div class="terms-wrap">
      <h2 id="terms-heading">{{ ui.t('terms_title') }}</h2>
      <p class="updated">{{ ui.t('terms_updated') }}</p>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_1_title') }}</h3>
        <p>{{ ui.t('terms_section_1_p1') }}</p>
        <p>{{ ui.t('terms_section_1_p2') }}</p>
        <p>{{ ui.t('terms_section_1_p3') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_2_title') }}</h3>
        <p>{{ ui.t('terms_section_2_p1') }}</p>
        <p>{{ ui.t('terms_section_2_p2') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_3_title') }}</h3>
        <p>{{ ui.t('terms_section_3_intro') }}</p>
        <ul>
          <li>{{ ui.t('terms_section_3_item_1') }}</li>
          <li>{{ ui.t('terms_section_3_item_2') }}</li>
          <li>{{ ui.t('terms_section_3_item_3') }}</li>
          <li>{{ ui.t('terms_section_3_item_4') }}</li>
          <li>{{ ui.t('terms_section_3_item_5') }}</li>
        </ul>
        <p>{{ ui.t('terms_section_3_p2') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_4_title') }}</h3>
        <p>{{ ui.t('terms_section_4_intro') }}</p>
        <ul>
          <li>{{ ui.t('terms_section_4_item_1') }}</li>
          <li>{{ ui.t('terms_section_4_item_2') }}</li>
          <li>{{ ui.t('terms_section_4_item_3') }}</li>
          <li>{{ ui.t('terms_section_4_item_4') }}</li>
          <li>{{ ui.t('terms_section_4_item_5') }}</li>
        </ul>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_5_title') }}</h3>
        <p>{{ ui.t('terms_section_5_p1') }}</p>
        <p>{{ ui.t('terms_section_5_p2') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_6_title') }}</h3>
        <p>{{ ui.t('terms_section_6_p1') }}</p>
        <p>{{ ui.t('terms_section_6_p2') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_7_title') }}</h3>
        <p>{{ ui.t('terms_section_7_p1') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_8_title') }}</h3>
        <p>{{ ui.t('terms_section_8_p1') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_9_title') }}</h3>
        <p>{{ ui.t('terms_section_9_p1') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_10_title') }}</h3>
        <p>{{ ui.t('terms_section_10_p1') }}</p>
      </article>

      <article class="terms-item">
        <h3>{{ ui.t('terms_section_11_title') }}</h3>
        <p>{{ ui.t('terms_section_11_contact') }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { uiKey } from '@/appContext'

const ui = inject(uiKey)

if (!ui) {
  throw new Error('SOBELO context unavailable in TermsSection')
}
</script>

<style scoped>
.terms {
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 2.4rem 1.4rem;
}

.terms-wrap {
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  margin: 0;
  text-align: center;
  font: 700 2rem/1.1 var(--font-display);
  color: var(--text-main);
}

.updated {
  margin: 0.55rem 0 1.4rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.terms-item {
  margin-bottom: 0.9rem;
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 1rem 1.1rem;
}

.terms-item h3 {
  margin: 0;
  color: var(--text-main);
  font: 700 1rem/1.2 var(--font-display);
}

.terms-item p {
  margin: 0.65rem 0 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.86rem;
}

.terms-item ul {
  margin: 0.65rem 0 0;
  padding-left: 1.1rem;
  color: var(--text-main);
  font-size: 0.86rem;
  line-height: 1.6;
}

.terms-item li + li {
  margin-top: 0.4rem;
}

@media (max-width: 760px) {
  h2 {
    font-size: 1.7rem;
  }

  .terms-item {
    padding: 0.95rem;
  }
}
</style>
