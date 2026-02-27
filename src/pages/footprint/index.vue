<template>
  <div class="footprint-page">
    <div class="footprint-stage">
      <img class="footprint-bg" :src="bgImage" alt="" />

      <svg
        class="footprint-overlay"
        :viewBox="`0 0 ${bgMeta.width} ${bgMeta.height}`"
        preserveAspectRatio="xMidYMid slice"
      >
        <path ref="riverPathEl" class="footprint-path" :d="riverPathD" />
        <g class="footprint-arrow" :transform="arrowTransform">
          <image :href="arrowImage" :width="arrowSize" :height="arrowSize" />
        </g>

        <g
          v-for="city in renderedCities"
          :key="city.id"
          :transform="`translate(${city.x} ${city.y})`"
        >
          <g class="city-label-inner" :class="{ 'city-label-inner--visible': isCityVisible(city) }">
            <rect
              class="city-label-rect"
              :x="-city.boxWidth / 2"
              :y="-city.boxHeight / 2"
              :width="city.boxWidth"
              :height="city.boxHeight"
              :rx="city.boxRadius"
              :ry="city.boxRadius"
            />
            <text
              class="city-label-text"
              x="0"
              y="0"
              text-anchor="middle"
              dominant-baseline="middle"
              :style="{ fontSize: `${city.fontSize}px` }"
            >
              {{ city.name }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <Tabbar />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import arrowImage from '@/assets/footprint/arrow.png'
import bgImage from '@/assets/footprint/bg.png'
import Tabbar from '@/compontents/tabbar.vue'

const bgMeta = ref({ width: 1000, height: 2000 })

const riverPathPoints = [
  { x: 0.61, y: 0.89 },
  { x: 0.62, y: 0.85 },
  { x: 0.38, y: 0.8 },
  { x: 0.46, y: 0.76 },
  { x: 0.56, y: 0.72 },
  { x: 0.66, y: 0.67 },
  { x: 0.73, y: 0.62 },
  { x: 0.68, y: 0.56 },
  { x: 0.6, y: 0.52 },
  { x: 0.55, y: 0.47 },
  { x: 0.62, y: 0.42 },
  { x: 0.7, y: 0.36 },
  { x: 0.66, y: 0.3 },
  { x: 0.58, y: 0.25 },
  { x: 0.54, y: 0.19 },
  { x: 0.52, y: 0.12 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const catmullRomToBezierD = (width, height, pts) => {
  if (!pts || pts.length < 2) return ''

  const p = pts.map((pt) => ({ x: pt.x * width, y: pt.y * height }))
  let d = `M ${p[0].x} ${p[0].y}`

  for (let i = 0; i < p.length - 1; i += 1) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2

    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`
  }

  return d
}

const riverPathD = computed(() =>
  catmullRomToBezierD(bgMeta.value.width, bgMeta.value.height, riverPathPoints)
)

const arrowSize = computed(() => clamp(bgMeta.value.width * 0.085, 54, 110))

const riverPathEl = ref(null)
const progress = ref(0)
const arrowPoint = ref({ x: -9999, y: -9999, angle: 0 })

const cities = [
  { id: 'city-1', name: '南京', at: 0.12, offsetX: 0.08, offsetY: -0.02 },
  { id: 'city-2', name: '合肥', at: 0.22, offsetX: -0.09, offsetY: -0.02 },
  { id: 'city-3', name: '武汉', at: 0.34, offsetX: 0.09, offsetY: 0.0 },
  { id: 'city-4', name: '长沙', at: 0.44, offsetX: -0.1, offsetY: 0.01 },
  { id: 'city-5', name: '南昌', at: 0.55, offsetX: 0.09, offsetY: 0.01 },
  { id: 'city-6', name: '广州', at: 0.67, offsetX: -0.1, offsetY: 0.02 },
  { id: 'city-7', name: '深圳', at: 0.74, offsetX: 0.09, offsetY: 0.02 },
  { id: 'city-8', name: '桂林', at: 0.84, offsetX: -0.09, offsetY: 0.02 },
  { id: 'city-9', name: '昆明', at: 0.93, offsetX: 0.09, offsetY: 0.02 },
]

const isCityVisible = (city) => {
  const rawDelta = Math.abs(progress.value - city.at)
  const delta = Math.min(rawDelta, 1 - rawDelta)
  return delta <= 0.06
}

const cityBasePoints = ref([])

const renderedCities = computed(() => {
  const width = bgMeta.value.width
  const fontSize = clamp(width * 0.028, 14, 22)
  const paddingX = fontSize * 0.8
  const paddingY = fontSize * 0.5
  const charWidth = fontSize * 0.92
  const minWidth = fontSize * 3.4

  return cities.map((city) => {
    const base = cityBasePoints.value.find((p) => p.id === city.id)
    const x = base?.x ?? -9999
    const y = base?.y ?? -9999
    const textWidth = Math.max(minWidth, city.name.length * charWidth)
    const boxWidth = textWidth + paddingX * 2
    const boxHeight = fontSize + paddingY * 2
    const boxRadius = clamp(boxHeight / 2, 10, 18)

    return {
      ...city,
      x,
      y,
      fontSize,
      boxWidth,
      boxHeight,
      boxRadius,
    }
  })
})

const arrowTransform = computed(() => {
  const { x, y, angle } = arrowPoint.value
  const half = arrowSize.value / 2
  return `translate(${x} ${y}) rotate(${angle}) translate(${-half} ${-half})`
})

let rafId = 0
let startAt = 0
let cachedLength = 0

const computeCityBasePoints = () => {
  if (!riverPathEl.value) return
  const path = riverPathEl.value
  cachedLength = path.getTotalLength()

  cityBasePoints.value = cities.map((city) => {
    const distance = cachedLength * city.at
    const point = path.getPointAtLength(distance)
    return {
      id: city.id,
      x: point.x + city.offsetX * bgMeta.value.width,
      y: point.y + city.offsetY * bgMeta.value.height,
    }
  })
}

const tick = (now) => {
  if (!riverPathEl.value) return
  if (!startAt) startAt = now

  const durationMs = 6500
  const elapsed = (now - startAt) % durationMs
  const t = elapsed / durationMs
  progress.value = t

  const path = riverPathEl.value
  const length = cachedLength || path.getTotalLength()
  cachedLength = length
  const distance = length * t
  const point = path.getPointAtLength(distance)
  const nextPoint = path.getPointAtLength(Math.min(distance + 2, length))

  const angle = (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) / Math.PI

  arrowPoint.value = {
    x: point.x,
    y: point.y,
    angle,
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const img = new Image()
  img.onload = () => {
    bgMeta.value = { width: img.naturalWidth || 1000, height: img.naturalHeight || 2000 }
    requestAnimationFrame(() => {
      computeCityBasePoints()

      if (prefersReducedMotion) {
        progress.value = 0
        const path = riverPathEl.value
        const length = path.getTotalLength()
        cachedLength = length
        const p = path.getPointAtLength(0)
        const p2 = path.getPointAtLength(Math.min(2, length))
        const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI
        arrowPoint.value = { x: p.x, y: p.y, angle }
        return
      }

      rafId = requestAnimationFrame(tick)
    })
  }
  img.src = bgImage
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.footprint-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background-color: #010d3d;
}

.footprint-stage {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.footprint-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  user-select: none;
  pointer-events: none;
}

.footprint-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.footprint-path {
  fill: none;
  stroke: transparent;
  stroke-width: 1;
}

.city-label-inner {
  opacity: 0;
  transform: scale(0.92);
  transform-origin: center;
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.city-label-inner--visible {
  opacity: 1;
  transform: scale(1);
}

.city-label-rect {
  fill: rgba(4, 18, 66, 0.6);
  stroke: rgba(120, 210, 255, 0.35);
  stroke-width: 2;
}

.city-label-text {
  fill: rgba(240, 251, 255, 0.95);
  letter-spacing: 1px;
}
</style>
