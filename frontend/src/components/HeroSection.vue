<template>
  <section id="top" class="intro">
    <div class="intro-wrap">
      <h1>{{ ui.t('intro_title') }}</h1>
      <p class="subtitle">{{ ui.t('intro_copy') }}</p>

      <h2>{{ ui.t('intro_features') }}</h2>
      <div class="features">
        <article class="feature">
          <h3>{{ ui.t('intro_feature_1_title') }}</h3>
          <p>{{ ui.t('intro_feature_1_copy') }}</p>
        </article>
        <article class="feature">
          <h3>{{ ui.t('intro_feature_2_title') }}</h3>
          <p>{{ ui.t('intro_feature_2_copy') }}</p>
        </article>
        <article class="feature">
          <h3>{{ ui.t('intro_feature_3_title') }}</h3>
          <p>{{ ui.t('intro_feature_3_copy') }}</p>
        </article>
        <article class="feature">
          <h3>{{ ui.t('intro_feature_4_title') }}</h3>
          <p>{{ ui.t('intro_feature_4_copy') }}</p>
        </article>
      </div>

      <h2>{{ ui.t('intro_how_to') }}</h2>
      <ol class="steps">
        <li>{{ ui.t('intro_step_1') }}</li>
        <li>{{ ui.t('intro_step_2') }}</li>
        <li>{{ ui.t('intro_step_3') }}</li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { uiKey } from '@/appContext'

const ui = inject(uiKey)

if (!ui) {
  throw new Error('SOBELO context unavailable in HeroSection')
}
</script>

<style scoped>
.intro {
  background: var(--surface);
  padding: 2.4rem 1.4rem 2.1rem;
}

.intro-wrap {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  margin: 0;
  font: 800 2.8rem/1.04 var(--font-display);
  color: var(--text-main);
}

.subtitle {
  margin: 0.9rem auto 0;
  max-width: 840px;
  font-size: 0.95rem;
  color: var(--text-muted);
}

h2 {
  margin: 2rem 0 1rem;
  font: 700 1.9rem/1.1 var(--font-display);
  color: var(--text-main);
}

.features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  text-align: left;
}

.feature {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1rem;
  background: var(--surface-elevated);
}

.feature h3 {
  margin: 0 0 0.4rem;
  color: var(--blue);
  font-size: 0.95rem;
}

.feature p {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.steps {
  margin: 0.75rem auto 0;
  max-width: 780px;
  text-align: left;
  color: var(--text-main);
  font-size: 0.9rem;
  line-height: 1.8;
  font-weight: 500;
}

@media (max-width: 760px) {
  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style>
