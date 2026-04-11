# Proyecto: Frontend Vue.js para SOBELO — Plan de Implementación Completo

## Contexto del Proyecto

SOBELO es una aplicación web de reproducción de música que utiliza una lista doblemente enlazada (`doubly-linked-list-typescript`) como estructura de datos para gestionar la cola de canciones. El frontend en Vue.js actúa como interfaz visual e interactiva sobre esa librería.

### Decisiones Técnicas Confirmadas

| Parámetro | Valor |
|---|---|
| Framework | Vue 3 + Vite |
| Lenguaje | TypeScript estricto (`"strict": true`) |
| API de Vue | Composition API con `<script setup>` |
| Librería de datos | `doubly-linked-list-typescript` (ruta relativa `../src/`) |
| Reproducción de audio | Web Audio API (reproducción real) |
| Estilo visual | Premium minimalista  |


## Paleta de Colores y Tokens de Diseño

```css
/* Paleta SOBELO — Light Premium */
--color-bg-primary:     #faf8f5;   /* blanco cálido — fondo principal */
--color-bg-secondary:   #f2ede6;   /* crema suave — cards y panels */
--color-bg-tertiary:    #e8e0d4;   /* arena — fondos de contraste */
--color-bg-glass:       rgba(255, 255, 255, 0.72); /* glassmorphism claro */

--color-accent:         #b8892a;   /* dorado oscuro — acento principal */
--color-accent-light:   #e2c27d;   /* dorado cálido — hover y highlights */
--color-accent-dim:     rgba(184, 137, 42, 0.12);  /* acento translúcido */

--color-text-primary:   #1a1610;   /* marrón casi negro — texto principal */
--color-text-secondary: #6b5f4a;   /* marrón dorado — texto secundario */
--color-text-muted:     #a8998a;   /* arena oscura — placeholders y hints */

--color-border:         rgba(184, 137, 42, 0.18);  /* borde sutil dorado */
--color-border-hover:   rgba(184, 137, 42, 0.45);  /* borde hover */
--color-border-subtle:  rgba(26, 22, 16, 0.08);    /* borde neutro */

--color-success:        #3a7d52;   /* verde oscuro premium */
--color-danger:         #a03030;   /* rojo oscuro premium */

/* Tipografía */
--font-display: 'Rajdhani', sans-serif;      /* headings y logo */
--font-body:    'Inter', sans-serif;          /* texto general */
--font-mono:    'JetBrains Mono', monospace;  /* datos técnicos */

/* Espaciado y radio */
--radius-sm:  8px;
--radius-md:  12px;
--radius-lg:  20px;
--radius-xl:  32px;

/* Sombras — más suaves en light mode */
--shadow-glow: 0 0 32px rgba(184, 137, 42, 0.14);
--shadow-card: 0 2px 16px rgba(26, 22, 16, 0.08), 0 8px 40px rgba(26, 22, 16, 0.06);
--shadow-hover: 0 4px 24px rgba(184, 137, 42, 0.18);
```

---

## Estructura de Archivos a Generar

```
raíz del proyecto/
├── src/                          ← librería existente (no modificar)
│   └── index.ts
├── frontend/                     ← [NUEVO] todo lo siguiente es nuevo
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── style.css
│       ├── types/
│       │   └── song.ts
│       ├── composables/
│       │   ├── usePlayer.ts
│       │   └── useAudioEngine.ts
│       └── components/
│           ├── NavBar.vue
│           ├── HeroSection.vue
│           ├── PlayerVisualizer.vue
│           ├── PlayerControls.vue
│           ├── SongList.vue
│           ├── AddSongModal.vue
│           └── FooterSection.vue
├── vercel.json                   ← [NUEVO]
└── render.yaml                   ← [NUEVO]
```

---

## Especificación de Cada Archivo

### `frontend/package.json`

```json
{
  "name": "sobelo-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^2.0.0"
  }
}
```

### `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Importar la librería desde ../src/index.ts
      'doubly-linked-list-typescript': resolve(__dirname, '../src/index.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### `frontend/src/types/song.ts`

Definir el tipo `Song` que representa cada nodo de la lista enlazada:

```typescript
export interface Song {
  id: string
  title: string
  artist: string
  duration: number       // duración en segundos
  audioUrl?: string      // URL de archivo de audio (File o remote)
  coverUrl?: string      // URL de imagen de portada
  addedAt: Date
}

export type AddPosition = 'start' | 'end' | 'index'
```

---

### `frontend/src/composables/usePlayer.ts`

Composable principal que encapsula todas las operaciones de la lista enlazada. Debe:

- Importar la clase de lista enlazada desde `doubly-linked-list-typescript`
- Exponer estado reactivo: `currentSong`, `playlist`, `currentIndex`, `isPlaying`, `isShuffled`, `repeatMode`
- Exponer operaciones:
  - `addSong(song: Song, position: AddPosition, index?: number)` — llama a `push()`, `unshift()` o inserción por índice
  - `removeSong(id: string)` — elimina nodo por id
  - `nextSong()` — avanza al siguiente nodo
  - `prevSong()` — retrocede al nodo anterior
  - `goToSong(index: number)` — salta a posición específica
  - `shufflePlaylist()` — reorganiza aleatoriamente
  - `toggleRepeat()` — cicla entre `off → one → all`
  - `clearPlaylist()` — vacía la lista

```typescript
// Estructura mínima esperada:
import { ref, computed } from 'vue'
// import DoublyLinkedList from 'doubly-linked-list-typescript'

export function usePlayer() {
  // ... implementación
  return {
    currentSong,
    playlist,
    currentIndex,
    isPlaying,
    repeatMode,
    isShuffled,
    addSong,
    removeSong,
    nextSong,
    prevSong,
    goToSong,
    shufflePlaylist,
    toggleRepeat,
    clearPlaylist
  }
}
```

---

### `frontend/src/composables/useAudioEngine.ts`

Composable para manejar Web Audio API. Debe:

- Crear y gestionar `AudioContext`, `AudioBufferSourceNode`, `GainNode`, `AnalyserNode`
- Exponer estado: `currentTime`, `duration`, `volume`, `analyserData` (para visualizador)
- Exponer métodos: `play(song)`, `pause()`, `resume()`, `seek(seconds)`, `setVolume(0-1)`
- Emitir evento/callback `onEnded` para que `usePlayer` avance automáticamente
- El `AnalyserNode` debe alimentar datos de frecuencia en tiempo real (Uint8Array de 128 bins) para animar las barras del ecualizador

```typescript
export function useAudioEngine() {
  const audioCtx = new AudioContext()
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 256  // 128 bins de frecuencia

  // ... implementación completa con play/pause/seek/volume

  return {
    currentTime,
    duration,
    volume,
    analyserData,
    play,
    pause,
    resume,
    seek,
    setVolume,
    onEnded
  }
}
```

---

### `frontend/src/components/NavBar.vue`

Barra de navegación fija en la parte superior. Debe incluir:

- Logo SOBELO a la izquierda con el ícono de ecualizador (SVG inline, dorado sobre fondo transparente)
- Links de navegación: `Inicio`, `Player`, `Acerca de`
- Fondo con efecto `backdrop-filter: blur(20px)` + `background: rgba(250, 248, 245, 0.85)`
- Altura: `64px`
- Borde inferior: `1px solid var(--color-border)`

---

### `frontend/src/components/HeroSection.vue`

Sección hero de bienvenida. Debe incluir:

- Título grande: **"SOBELO"** en fuente Rajdhani, 96px, color `var(--color-accent)` (dorado oscuro)
- Subtítulo: *"Siente cada nota"* en fuente ligera, letra espaciada, color `var(--color-text-secondary)`
- Descripción breve: "Un player de música construido con listas enlazadas"
- Botón CTA: `"Abrir Player"` que hace scroll hacia el visualizador
- Fondo: barras de ecualizador animadas (CSS keyframes) en el fondo, color `var(--color-accent)`, opacidad 0.05
- Altura mínima: `100vh`

---

### `frontend/src/components/PlayerVisualizer.vue`

**Componente central de la aplicación.** Visualizador de nodos de la lista enlazada. Debe:

- Mostrar cada canción de la playlist como un nodo rectangular premium:
  - Borde: `1px solid var(--color-border)`
  - Background: `var(--color-bg-glass)` con `backdrop-filter: blur(8px)`
  - Contenido: portada (o ícono musical), título, artista, duración
  - Nodo activo: borde dorado `var(--color-accent)`, glow suave `var(--shadow-hover)`
- Conectar nodos con flechas bidireccionales CSS (pseudo-elementos `::before` y `::after`)
- Scroll horizontal cuando hay más de 4 nodos
- Usar `<TransitionGroup name="node">` para animar entrada/salida de nodos:
  ```css
  .node-enter-active, .node-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .node-enter-from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  .node-leave-to   { opacity: 0; transform: translateY(20px) scale(0.95); }
  ```
- Barras de ecualizador animadas en tiempo real con datos del `AnalyserNode` (usar `requestAnimationFrame`)

---

### `frontend/src/components/PlayerControls.vue`

Panel de controles del reproductor. Debe incluir:

**Fila 1 — Info de canción actual:**
- Imagen de portada (40x40px, border-radius: 8px)
- Título y artista
- Botón de favorito (corazón)

**Fila 2 — Controles de reproducción:**
- `⏮` Anterior (`prevSong()`)
- `▶/⏸` Play/Pause (toggle con animación)
- `⏭` Siguiente (`nextSong()`)
- `🔀` Shuffle (toggle)
- `🔁` Repeat (off → one → all, con icono diferente por estado)

**Fila 3 — Barra de progreso:**
- Slider de progreso: tiempo actual / duración total
- Input `type="range"` estilizado con thumb dorado

**Fila 4 — Volumen:**
- Ícono de volumen + slider de volumen

**Fila 5 — Acciones de la lista:**
- Botón `"+ Agregar canción"` → abre `AddSongModal`
- Botón `"Limpiar lista"` → llama `clearPlaylist()`

---

### `frontend/src/components/AddSongModal.vue`

Modal para agregar canciones. Debe incluir:

- Overlay con `background: rgba(26, 22, 16, 0.5)` y `backdrop-filter: blur(4px)`
- Formulario con campos:
  - Título (text, requerido)
  - Artista (text, requerido)
  - Archivo de audio (input `type="file"` accept=".mp3,.wav,.ogg,.flac")
  - Imagen de portada (input `type="file"` accept="image/*", opcional)
  - Posición: selector con opciones `"Al inicio"`, `"Al final"`, `"En posición específica"`
  - Si posición = "En posición específica": input numérico para el índice
- Botones: `"Cancelar"` y `"Agregar"`
- Validación TypeScript estricta antes de llamar `addSong()`
- Cerrar al presionar `Escape` o click en overlay
- Animación de entrada: `transform: scale(0.95)` → `scale(1)` + fade in

---

### `frontend/src/components/SongList.vue`

Lista lateral de canciones en la playlist. Debe incluir:

- Lista scrolleable de todas las canciones
- Cada item: portada miniatura, título, artista, duración
- Canción activa resaltada con fondo `var(--color-accent-dim)` y borde izquierdo dorado
- Botón de eliminar (ícono de basura) por canción → `removeSong(id)`
- Click en canción → `goToSong(index)`
- Drag & drop para reordenar (opcional, si se considera pertinente)

---

### `frontend/src/components/FooterSection.vue`

Footer de la página. Debe incluir:

- Logo SOBELO pequeño centrado
- Slogan: *"Siente cada nota"*
- Texto: "Construido con doubly-linked-list-typescript"
- Links: GitHub del proyecto
- Año actual
- Borde superior: `1px solid var(--color-border)`
- Fondo: `var(--color-bg-secondary)`

---

### `frontend/src/App.vue`

Componente raíz que organiza la página completa:

```vue
<template>
  <div id="app">
    <NavBar />
    <main>
      <HeroSection />
      <section id="player">
        <PlayerVisualizer />
        <PlayerControls />
        <SongList />
      </section>
    </main>
    <FooterSection />
    <AddSongModal v-if="modalOpen" @close="modalOpen = false" />
  </div>
</template>
```

Proveer el estado global de `usePlayer()` y `useAudioEngine()` via `provide/inject` para que todos los componentes los consuman sin prop drilling.

---

### `frontend/src/style.css`

CSS global. Debe definir:

1. `@import` de fuentes (Google Fonts: Rajdhani, Inter, JetBrains Mono)
2. `:root` con todos los tokens de diseño (ver sección Paleta de Colores)
3. Reset global: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
4. `body`: background `var(--color-bg-primary)`, color `var(--color-text-primary)`, font `var(--font-body)`
5. Scrollbar personalizado (webkit): thumb color `var(--color-accent)` sobre track `var(--color-bg-tertiary)`
6. Clases utilitarias: `.glass-card`, `.btn-primary`, `.btn-ghost`, `.input-field`
7. Animaciones globales: `@keyframes equalizer-bar`, `@keyframes fade-in`, `@keyframes pulse-glow`

```css
@keyframes equalizer-bar {
  0%, 100% { transform: scaleY(0.3); }
  50%       { transform: scaleY(1);   }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(184, 137, 42, 0.15); }
  50%       { box-shadow: 0 0 28px rgba(184, 137, 42, 0.35); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
```

---

## Archivos de Despliegue

### `vercel.json` (raíz del proyecto)

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Configuración manual en dashboard de Vercel:**
- Framework Preset: `Vite` 
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

---

### `render.yaml` (raíz del proyecto)

```yaml
services:
  - type: web
    name: sobelo
    runtime: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    pullRequestPreviewsEnabled: true
    headers:
      - path: /assets/*
        name: Cache-Control
        value: public, max-age=31536000, immutable
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: NODE_VERSION
        value: "20"
```

---

## Canciones de Demostración

Incluir en el composable `usePlayer.ts` un set de canciones de demo precargadas para que la UI no aparezca vacía al inicio:
> Las canciones demo no tienen `audioUrl`, por lo que el player debe manejar el estado "sin audio" con un aviso visual elegante.
```typescript
const demoSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: 354,
    coverUrl: 'https://picsum.photos/seed/queen/200',
    addedAt: new Date()
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: 200,
    coverUrl: 'https://picsum.photos/seed/weeknd/200',
    addedAt: new Date()
  }
]
```
---
## Plan de Verificación

### 1. Local (Desarrollo)
```bash
cd frontend
npm install
npm run dev
# → Abrir http://localhost:5173
```

**Checklist visual:**
- [ ] Hero con animación de ecualizador de fondo
- [ ] 3 nodos demo visibles con flechas bidireccionales
- [ ] Nodo activo con borde dorado y glow
- [ ] Controls con play/pause, next, prev funcionales
- [ ] Modal de agregar canción abre y cierra correctamente
- [ ] Agregar canción al inicio → nodo aparece con `TransitionGroup`
- [ ] Agregar canción al final → ídem
- [ ] Eliminar canción → nodo desaparece con animación
- [ ] Subir archivo `.mp3` → reproduce con Web Audio API
- [ ] Barras del ecualizador se animan en tiempo real durante reproducción

### 2. Build de Producción
```bash
npm run build
npm run preview
# → Verificar http://localhost:4173
```

**Checklist técnico:**
- [ ] Sin errores TypeScript (`vue-tsc` sin warnings)
- [ ] Sin errores de importación de `doubly-linked-list-typescript`
- [ ] Bundle generado en `frontend/dist/`
- [ ] Assets con hash en nombre de archivo

### 3. Despliegue
- [ ] Conectar repo a **Vercel** → detecta `vercel.json` automáticamente
- [ ] Conectar repo a **Render** → detecta `render.yaml` automáticamente
- [ ] Verificar que la URL pública carga correctamente
- [ ] Verificar que rutas como `/player` no dan 404 (gracias al rewrite)

---

## Notas Finales

1. **Importar la librería siempre por alias** `'doubly-linked-list-typescript'`, no por ruta relativa directa, ya que el alias está configurado en `vite.config.ts`.
2. **TypeScript estricto** — no usar `any`, no ignorar errores con `// @ts-ignore`. Tipar todo explícitamente.
3. **Composition API exclusivamente** — no usar Options API ni `defineComponent` con objeto de opciones.
4. **No usar librerías de UI externas** (Vuetify, PrimeVue, etc.) — todo el diseño es CSS vanilla con las variables definidas.
5. **Web Audio API**: recordar que `AudioContext` debe crearse o reanudarase tras un gesto del usuario (política de autoplay del navegador). Manejar el estado `suspended` del contexto.
6. **Responsive**: la UI debe funcionar en móvil (≥375px) y desktop (≥1280px). El visualizador de nodos usa scroll horizontal en móvil.


# 1) Frontend (modo desarrollo)
cd "/home/mr-robot/Descargas/Telegram Desktop/SOBELO/frontend"
npm install
npm run dev

# 2) Backend/librería (tests)
cd "/home/mr-robot/Descargas/Telegram Desktop/SOBELO"
npm test
