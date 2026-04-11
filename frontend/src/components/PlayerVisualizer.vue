<template>
  <section class="visualizer glass-card" aria-label="Visualizador de playlist">
    <div class="video-frame">
      <canvas ref="visualCanvas" class="visual-canvas" aria-hidden="true"></canvas>
      <div class="visual-controls">
        <span class="mode-badge">Efecto: {{ modeLabel }}</span>
        <button type="button" class="visual-btn" @click="toggleRandomLock">
          {{ isRandomLocked ? 'Random off' : 'Random on' }}
        </button>
        <button type="button" class="visual-btn" @click="nextVisualMode">Cambiar efecto</button>
      </div>
    </div>

    <TransitionGroup name="node" tag="ul" class="node-row">
      <li
        v-for="(song, index) in player.playlist.value"
        :key="song.id"
        class="node-item"
        :class="{ active: index === player.currentIndex.value }"
        @click="player.goToSong(index)"
      >
        <img v-if="song.coverUrl" :src="song.coverUrl" alt="Portada" class="cover" />
        <div v-else class="cover cover-fallback">♪</div>

        <div class="meta">
          <p class="title">{{ song.title }}</p>
          <p class="artist">{{ song.artist }}</p>
          <p class="duration">{{ formatDuration(song.duration) }}</p>
        </div>
      </li>
    </TransitionGroup>

  </section>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { audioKey, playerKey } from '@/appContext'

function mustInject<T>(value: T | undefined, name: string): T {
  if (!value) {
    throw new Error(`SOBELO context unavailable in ${name}`)
  }

  return value
}

const player = mustInject(inject(playerKey), 'PlayerVisualizer/player')
const audio = mustInject(inject(audioKey), 'PlayerVisualizer/audio')

type VisualMode = 'bars' | 'rings' | 'stars'
type ExtendedVisualMode = VisualMode | 'scope' | 'plasma' | 'kaleido' | 'tunnel' | 'neonwave'

const visualCanvas = ref<HTMLCanvasElement | null>(null)
const visualMode = ref<ExtendedVisualMode>('bars')
const isRandomLocked = ref<boolean>(false)
const visualModes: ExtendedVisualMode[] = ['bars', 'rings', 'stars', 'scope', 'plasma', 'kaleido', 'tunnel', 'neonwave']

let rafId: number | null = null
let phase = 0

function pickRandomVisualMode(): void {
  const candidates = visualModes.filter((mode) => mode !== visualMode.value)
  visualMode.value = candidates[Math.floor(Math.random() * candidates.length)] ?? 'bars'
}

function nextVisualMode(): void {
  const current = visualModes.indexOf(visualMode.value)
  visualMode.value = visualModes[(current + 1) % visualModes.length]
}

function toggleRandomLock(): void {
  isRandomLocked.value = !isRandomLocked.value
}

function resizeCanvas(): void {
  if (!visualCanvas.value) {
    return
  }

  const bounds = visualCanvas.value.getBoundingClientRect()
  visualCanvas.value.width = Math.max(1, Math.floor(bounds.width))
  visualCanvas.value.height = Math.max(1, Math.floor(bounds.height))
}

function drawBars(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const barCount = 48
  const gap = 3
  const barWidth = Math.max(2, (width - (barCount - 1) * gap) / barCount)
  const baseline = height * 0.92

  for (let i = 0; i < barCount; i += 1) {
    const bin = Math.floor((i / barCount) * data.length)
    const value = data[bin] ?? 0
    const barHeight = Math.max(8, (value / 255) * (height * 0.74))
    const x = i * (barWidth + gap)
    const gradient = ctx.createLinearGradient(0, baseline - barHeight, 0, baseline)
    gradient.addColorStop(0, 'rgba(125, 211, 252, 0.95)')
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.85)')
    ctx.fillStyle = gradient
    ctx.fillRect(x, baseline - barHeight, barWidth, barHeight)
  }
}

function drawRings(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const cx = width / 2
  const cy = height / 2
  const avg = data.length > 0 ? data.reduce((sum, v) => sum + v, 0) / data.length : 0
  const pulse = avg / 255
  const ringCount = 7

  for (let i = 0; i < ringCount; i += 1) {
    const radius = 36 + i * 24 + pulse * 22
    const alpha = 0.1 + i * 0.08
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(59,130,246,${Math.min(alpha, 0.75)})`
    ctx.lineWidth = 2 + pulse * 3
    ctx.stroke()
  }
}

function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const count = 90
  const avg = data.length > 0 ? data.reduce((sum, v) => sum + v, 0) / data.length : 0
  const energy = avg / 255

  for (let i = 0; i < count; i += 1) {
    const angle = phase * (0.5 + (i % 7) * 0.08) + i
    const orbit = 20 + (i / count) * Math.min(width, height) * 0.45
    const x = width / 2 + Math.cos(angle) * orbit
    const y = height / 2 + Math.sin(angle) * orbit
    const size = 0.8 + ((i % 5) / 5) * 2.6 + energy * 2
    const alpha = 0.12 + ((i % 10) / 10) * 0.5
    ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawScope(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const centerY = height / 2
  const step = Math.max(1, Math.floor(data.length / width))

  ctx.lineWidth = 2.2
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.95)'
  ctx.beginPath()

  for (let x = 0; x < width; x += 1) {
    const idx = Math.min(data.length - 1, x * step)
    const value = data[idx] ?? 0
    const normalized = (value / 255) * 2 - 1
    const y = centerY + normalized * height * 0.24

    if (x === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }

  ctx.stroke()

  ctx.strokeStyle = 'rgba(37, 99, 235, 0.45)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(width, centerY)
  ctx.stroke()
}

function drawPlasma(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const avg = data.length > 0 ? data.reduce((sum, v) => sum + v, 0) / data.length : 0
  const energy = avg / 255
  const blobs = 7

  for (let i = 0; i < blobs; i += 1) {
    const t = phase * (0.8 + i * 0.11)
    const x = width / 2 + Math.cos(t + i) * (width * (0.15 + i * 0.02))
    const y = height / 2 + Math.sin(t * 1.2 + i) * (height * (0.18 + i * 0.02))
    const radius = 50 + i * 18 + energy * 34
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
    g.addColorStop(0, `rgba(56, 189, 248, ${0.22 + energy * 0.35})`)
    g.addColorStop(1, 'rgba(37, 99, 235, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawKaleido(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const cx = width / 2
  const cy = height / 2
  const avg = data.length > 0 ? data.reduce((sum, v) => sum + v, 0) / data.length : 0
  const energy = avg / 255
  const slices = 14

  for (let i = 0; i < slices; i += 1) {
    const angle = (Math.PI * 2 * i) / slices + phase * 0.55
    const radius = 42 + ((i % 5) + 1) * 24 + energy * 70
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)
    ctx.fillStyle = `hsla(${(phase * 180 + i * 28) % 360}, 92%, 60%, ${0.25 + energy * 0.55})`
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(radius * 0.64, 14 + energy * 18)
    ctx.lineTo(radius, 0)
    ctx.lineTo(radius * 0.64, -14 - energy * 18)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    ctx.fillStyle = `hsla(${(phase * 200 + i * 21) % 360}, 100%, 68%, ${0.2 + energy * 0.45})`
    ctx.beginPath()
    ctx.arc(x, y, 4 + energy * 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawTunnel(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const cx = width / 2
  const cy = height / 2
  const avg = data.length > 0 ? data.reduce((sum, v) => sum + v, 0) / data.length : 0
  const energy = avg / 255
  const rings = 18

  for (let i = 0; i < rings; i += 1) {
    const t = (i / rings + phase * 0.18) % 1
    const radius = 10 + t * Math.min(width, height) * 0.72
    const alpha = (1 - t) * (0.18 + energy * 0.55)
    ctx.strokeStyle = `hsla(${(phase * 150 + i * 16) % 360}, 95%, 60%, ${alpha})`
    ctx.lineWidth = 1.5 + (1 - t) * 2.2
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  for (let i = 0; i < 28; i += 1) {
    const angle = (Math.PI * 2 * i) / 28 + phase * 0.22
    const length = 18 + energy * 90
    ctx.strokeStyle = `rgba(125, 211, 252, ${0.08 + energy * 0.35})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20)
    ctx.lineTo(cx + Math.cos(angle) * (20 + length), cy + Math.sin(angle) * (20 + length))
    ctx.stroke()
  }
}

function drawNeonWave(ctx: CanvasRenderingContext2D, width: number, height: number, data: Uint8Array<ArrayBuffer>): void {
  const lines = 5
  const step = Math.max(1, Math.floor(data.length / width))

  for (let line = 0; line < lines; line += 1) {
    const yBase = (height / (lines + 1)) * (line + 1)
    const hue = (phase * 210 + line * 32) % 360
    ctx.strokeStyle = `hsla(${hue}, 100%, 67%, 0.7)`
    ctx.lineWidth = 1.8 + line * 0.2
    ctx.beginPath()

    for (let x = 0; x < width; x += 1) {
      const idx = Math.min(data.length - 1, x * step)
      const amp = ((data[idx] ?? 0) / 255) * (14 + line * 4)
      const y = yBase + Math.sin((x * 0.03) + phase * 2 + line) * amp
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }
}

function drawFrame(): void {
  if (!visualCanvas.value) {
    return
  }

  const ctx = visualCanvas.value.getContext('2d')
  if (!ctx) {
    return
  }

  const width = visualCanvas.value.width
  const height = visualCanvas.value.height
  const data = audio.analyserData.value
  const isActive = audio.isPlaying.value

  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, 'rgba(15, 23, 42, 0.85)')
  bg.addColorStop(1, 'rgba(30, 41, 59, 0.9)')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  if (!isActive) {
    for (let i = 0; i < width; i += 22) {
      const alpha = 0.08 + 0.03 * Math.sin((i + phase * 40) * 0.03)
      ctx.strokeStyle = `rgba(59,130,246,${Math.max(0.02, alpha)})`
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    phase += 0.012
    rafId = window.requestAnimationFrame(drawFrame)
    return
  }

  if (visualMode.value === 'bars') {
    drawBars(ctx, width, height, data)
  } else if (visualMode.value === 'rings') {
    drawRings(ctx, width, height, data)
  } else if (visualMode.value === 'scope') {
    drawScope(ctx, width, height, data)
  } else if (visualMode.value === 'plasma') {
    drawPlasma(ctx, width, height, data)
  } else if (visualMode.value === 'kaleido') {
    drawKaleido(ctx, width, height, data)
  } else if (visualMode.value === 'tunnel') {
    drawTunnel(ctx, width, height, data)
  } else if (visualMode.value === 'neonwave') {
    drawNeonWave(ctx, width, height, data)
  } else {
    drawStars(ctx, width, height, data)
  }

  phase += 0.02
  rafId = window.requestAnimationFrame(drawFrame)
}

watch(
  () => audio.isPlaying.value,
  (isPlayingNow, wasPlaying) => {
    if (isPlayingNow && !wasPlaying && !isRandomLocked.value) {
      pickRandomVisualMode()
    }
  }
)

watch(
  () => player.currentSong.value?.id,
  () => {
    if (audio.isPlaying.value && !isRandomLocked.value) {
      pickRandomVisualMode()
    }
  }
)

const modeLabel = ref<string>('Barras')

watch(
  () => visualMode.value,
  (mode) => {
    if (mode === 'bars') {
      modeLabel.value = 'Barras'
      return
    }

    if (mode === 'rings') {
      modeLabel.value = 'Anillos'
      return
    }

    if (mode === 'stars') {
      modeLabel.value = 'Estrellas'
      return
    }

    if (mode === 'scope') {
      modeLabel.value = 'Scope'
      return
    }

    if (mode === 'kaleido') {
      modeLabel.value = 'Kaleido'
      return
    }

    if (mode === 'tunnel') {
      modeLabel.value = 'Tunel'
      return
    }

    if (mode === 'neonwave') {
      modeLabel.value = 'Neon Wave'
      return
    }

    modeLabel.value = 'Plasma'
  },
  { immediate: true }
)

onMounted(() => {
  pickRandomVisualMode()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  drawFrame()
})

onBeforeUnmount(() => {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
  window.removeEventListener('resize', resizeCanvas)
})

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.visualizer {
  display: grid;
  gap: 1rem;
}

.video-frame {
  margin: 0;
  min-height: 290px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: #020617;
  overflow: hidden;
  padding: 0;
  position: relative;
}

.visual-canvas {
  display: block;
  width: 100%;
  height: 290px;
}

.visual-controls {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mode-badge {
  display: inline-flex;
  align-items: center;
  height: 30px;
  border-radius: 999px;
  padding: 0 0.7rem;
  color: #dbeafe;
  background: rgba(2, 6, 23, 0.58);
  border: 1px solid rgba(148, 163, 184, 0.28);
  font-size: 0.72rem;
  font-weight: 600;
}

.visual-btn {
  border: 1px solid rgba(148, 163, 184, 0.34);
  background: rgba(2, 6, 23, 0.68);
  color: #dbeafe;
  border-radius: 999px;
  height: 30px;
  padding: 0 0.7rem;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
}

.visual-btn:hover {
  background: rgba(15, 23, 42, 0.9);
}

.visual-btn:focus-visible {
  outline: 2px solid rgba(125, 211, 252, 0.8);
  outline-offset: 2px;
}

.node-row {
  list-style: none;
  display: flex;
  gap: 1.2rem;
  overflow-x: auto;
  padding: 0.2rem 0.2rem 0.7rem;
}

.node-item {
  min-width: 210px;
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 0.7rem;
  position: relative;
  border: 1px solid var(--line-soft);
  background: var(--surface-overlay);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 0.8rem;
  cursor: pointer;
}

.node-item::before,
.node-item::after {
  content: '↔';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(59, 130, 246, 0.55);
}

.node-item::before {
  left: -0.85rem;
}

.node-item::after {
  right: -0.85rem;
}

.node-item.active {
  border-color: var(--blue);
  box-shadow: 0 4px 24px rgba(59, 130, 246, 0.2);
}

.cover {
  width: 62px;
  height: 62px;
  border-radius: 10px;
  object-fit: cover;
}

.cover-fallback {
  display: grid;
  place-items: center;
  background: rgba(59, 130, 246, 0.18);
  font-size: 1.3rem;
  color: var(--text-main);
}

.meta {
  display: grid;
  align-content: center;
  gap: 0.25rem;
}

.title {
  font-weight: 600;
  color: var(--text-main);
}

.artist,
.duration {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.node-enter-active,
.node-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.node-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@media (max-width: 760px) {
  .visual-controls {
    left: 10px;
    right: 10px;
    bottom: 10px;
    justify-content: space-between;
    gap: 0.35rem;
  }

  .mode-badge,
  .visual-btn {
    font-size: 0.66rem;
    height: 28px;
    padding: 0 0.55rem;
  }
}
</style>
