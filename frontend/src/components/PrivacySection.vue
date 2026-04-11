<template>
  <section id="privacy" class="privacy" aria-labelledby="privacy-heading">
    <div class="privacy-wrap">
      <h2 id="privacy-heading">{{ ui.t('privacy_title') }}</h2>
      <p class="updated">{{ ui.t('privacy_updated') }}</p>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_1_title') }}</h3>
        <p>{{ ui.t('privacy_section_1_p1') }}</p>
        <p>{{ ui.t('privacy_section_1_p2') }}</p>
        <p>{{ ui.t('privacy_section_1_p3') }}</p>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_2_title') }}</h3>
        <p>{{ ui.t('privacy_section_2_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_2_item_1') }}</li>
          <li>{{ ui.t('privacy_section_2_item_2') }}</li>
          <li>{{ ui.t('privacy_section_2_item_3') }}</li>
        </ul>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_3_title') }}</h3>
        <p>{{ ui.t('privacy_section_3_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_3_item_1') }}</li>
          <li>{{ ui.t('privacy_section_3_item_2') }}</li>
          <li>{{ ui.t('privacy_section_3_item_3') }}</li>
          <li>{{ ui.t('privacy_section_3_item_4') }}</li>
        </ul>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_4_title') }}</h3>
        <p>{{ ui.t('privacy_section_4_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_4_item_1') }}</li>
          <li>{{ ui.t('privacy_section_4_item_2') }}</li>
          <li>{{ ui.t('privacy_section_4_item_3') }}</li>
          <li>{{ ui.t('privacy_section_4_item_4') }}</li>
        </ul>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_5_title') }}</h3>
        <p>{{ ui.t('privacy_section_5_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_5_item_1') }}</li>
          <li>{{ ui.t('privacy_section_5_item_2') }}</li>
          <li>{{ ui.t('privacy_section_5_item_3') }}</li>
          <li>{{ ui.t('privacy_section_5_item_4') }}</li>
        </ul>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_6_title') }}</h3>
        <p>{{ ui.t('privacy_section_6_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_6_item_1') }}</li>
          <li>{{ ui.t('privacy_section_6_item_2') }}</li>
          <li>{{ ui.t('privacy_section_6_item_3') }}</li>
        </ul>
        <p>
          {{ ui.t('privacy_section_6_ads_link_label') }}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">https://adssettings.google.com</a>
        </p>
        <p class="note">{{ ui.t('privacy_section_6_note') }}</p>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_7_title') }}</h3>
        <p>{{ ui.t('privacy_section_7_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_7_item_1') }}</li>
          <li>{{ ui.t('privacy_section_7_item_2') }}</li>
        </ul>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_8_title') }}</h3>
        <p>{{ ui.t('privacy_section_8_p1') }}</p>
        <p>{{ ui.t('privacy_section_8_p2') }}</p>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_9_title') }}</h3>
        <p>{{ ui.t('privacy_section_9_intro') }}</p>
        <ul>
          <li>{{ ui.t('privacy_section_9_item_1') }}</li>
          <li>{{ ui.t('privacy_section_9_item_2') }}</li>
          <li>{{ ui.t('privacy_section_9_item_3') }}</li>
          <li>{{ ui.t('privacy_section_9_item_4') }}</li>
          <li>{{ ui.t('privacy_section_9_item_5') }}</li>
        </ul>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_10_title') }}</h3>
        <p>{{ ui.t('privacy_section_10_contact') }}</p>
        <p>{{ ui.t('privacy_section_10_p2') }}</p>
      </article>

      <article class="privacy-item">
        <h3>{{ ui.t('privacy_section_11_title') }}</h3>
        <p>{{ ui.t('privacy_section_11_p1') }}</p>
        <p>{{ ui.t('privacy_section_11_p2') }}</p>
        <p>{{ ui.t('privacy_section_11_p3') }}</p>
        <p>{{ ui.t('privacy_section_11_p4') }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { uiKey } from '@/appContext'

const ui = inject(uiKey)

if (!ui) {
  throw new Error('SOBELO context unavailable in PrivacySection')
}
</script>

<style scoped>
.privacy {
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 2.4rem 1.4rem;
}

.privacy-wrap {
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

.privacy-item {
  margin-bottom: 0.9rem;
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 1rem 1.1rem;
}

.privacy-item h3 {
  margin: 0;
  color: var(--text-main);
  font: 700 1rem/1.2 var(--font-display);
}

.privacy-item p {
  margin: 0.65rem 0 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.86rem;
}

.privacy-item ul {
  margin: 0.65rem 0 0;
  padding-left: 1.1rem;
  color: var(--text-main);
  font-size: 0.86rem;
  line-height: 1.6;
}

.privacy-item li + li {
  margin-top: 0.4rem;
}

.privacy-item a {
  color: var(--blue);
}

.note {
  font-size: 0.8rem;
}

@media (max-width: 760px) {
  h2 {
    font-size: 1.7rem;
  }

  .privacy-item {
    padding: 0.95rem;
  }
}
</style>
