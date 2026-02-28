<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import H5VideoPlayer from '@/compontents/h5-video-player.vue'
import bgImage from '@/assets/hotspot/hotspot_bg.png'
import video from '@/assets/hotspot/video.png'
import videoBg from '@/assets/hotspot/video-bg.png'
import localVideo from '@/assets/video/test_video.mp4'

const hotspotSeedCards = [
  { id: 1, size: 'sm', tone: 'olive', thumb: video, url: localVideo },
  { id: 2, size: 'lg', tone: 'gold', thumb: video, url: localVideo },
  { id: 3, size: 'xs', tone: 'rose', thumb: video, url: localVideo },
  { id: 4, size: 'xl', tone: 'red', thumb: video, url: localVideo },
  { id: 5, size: 'md', tone: 'cream', thumb: video, url: localVideo },
  { id: 6, size: 'xs', tone: 'lemon', thumb: video, url: localVideo },
  { id: 7, size: 'sm', tone: 'mint', thumb: video, url: localVideo },
  { id: 8, size: 'md', tone: 'scarlet', thumb: video, url: localVideo },
]

const hotspotSphereRef = ref(null)
const hotspotCards = ref([])
const activeVideoCard = ref(null)

const RADIUS = 130
const VERTICAL_RADIUS = 108
const FOCAL_LENGTH = 460
const BASE_SPEED_Y = 0.003
const BASE_SPEED_X = 0.0008

let animationId = 0
let speedX = BASE_SPEED_X
let speedY = BASE_SPEED_Y
let isDragging = false
let lastX = 0
let lastY = 0

const getPoint = (event) => (event.touches ? event.touches[0] : event)

const initCards = () => {
  const len = hotspotSeedCards.length
  const phi = Math.PI * (3 - Math.sqrt(5))

  hotspotCards.value = hotspotSeedCards.map((item, i) => {
    const y = 1 - (i / (len - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = phi * i

    const x = Math.cos(theta) * radiusAtY * RADIUS
    const z = Math.sin(theta) * radiusAtY * RADIUS
    const yPos = y * VERTICAL_RADIUS

    return {
      ...item,
      x,
      y: yPos,
      z,
      nodeStyle: {},
    }
  })
}

const animateCards = () => {
  if (!isDragging) {
    speedY = speedY * 0.98
    if (Math.abs(speedY) < BASE_SPEED_Y) speedY = Math.sign(speedY || 1) * BASE_SPEED_Y
    speedX = speedX * 0.96
  }

  const sx = Math.sin(speedX)
  const cx = Math.cos(speedX)
  const sy = Math.sin(speedY)
  const cy = Math.cos(speedY)

  hotspotCards.value.forEach((item) => {
    const y1 = item.y * cx - item.z * sx
    const z1 = item.z * cx + item.y * sx
    const x1 = item.x * cy - z1 * sy
    const z2 = z1 * cy + item.x * sy

    item.x = x1
    item.y = y1
    item.z = z2

    const scale = FOCAL_LENGTH / (FOCAL_LENGTH - z2)
    const alpha = (scale - 0.55) / 0.55
    const opacity = Math.max(0.45, Math.min(1, alpha))

    item.nodeStyle = {
      transform: `translate3d(${x1}px, ${y1}px, 0) scale(${scale})`,
      opacity,
      zIndex: Math.round(300 + z2),
      filter: `brightness(${0.78 + opacity * 0.25})`,
    }
  })

  animationId = requestAnimationFrame(animateCards)
}

const onPointerStart = (event) => {
  isDragging = true
  const point = getPoint(event)
  lastX = point.clientX
  lastY = point.clientY
  speedX = 0
  speedY = 0
}

const onPointerMove = (event) => {
  if (!isDragging) return

  const point = getPoint(event)
  const deltaX = point.clientX - lastX
  const deltaY = point.clientY - lastY

  speedY = deltaX * 0.0042
  speedX = -deltaY * 0.0024
  lastX = point.clientX
  lastY = point.clientY

  if (event.cancelable) event.preventDefault()
}

const onPointerEnd = () => {
  isDragging = false
}

const openVideo = (card) => {
  if (!card?.url) return
  activeVideoCard.value = card
  document.body.style.overflow = 'hidden'
}

const closeVideo = () => {
  activeVideoCard.value = null
  document.body.style.overflow = ''
}

onMounted(() => {
  initCards()
  animationId = requestAnimationFrame(animateCards)

  const sphere = hotspotSphereRef.value
  if (sphere) {
    sphere.addEventListener('mousedown', onPointerStart)
    sphere.addEventListener('touchstart', onPointerStart, { passive: true })
  }

  window.addEventListener('mousemove', onPointerMove)
  window.addEventListener('touchmove', onPointerMove, { passive: false })
  window.addEventListener('mouseup', onPointerEnd)
  window.addEventListener('touchend', onPointerEnd)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)

  const sphere = hotspotSphereRef.value
  if (sphere) {
    sphere.removeEventListener('mousedown', onPointerStart)
    sphere.removeEventListener('touchstart', onPointerStart)
  }

  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('touchmove', onPointerMove)
  window.removeEventListener('mouseup', onPointerEnd)
  window.removeEventListener('touchend', onPointerEnd)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="page">
    <main class="hotspot-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section class="hotspot-canvas">
        <section ref="hotspotSphereRef" class="hotspot-sphere">
          <article
            v-for="card in hotspotCards"
            :key="card.id"
            class="hotspot-node"
            :style="card.nodeStyle"
          >
            <div
              class="hotspot-card"
              :style="{ backgroundImage: `url(${videoBg})` }"
              :class="[`hotspot-card--${card.size}`, `hotspot-card--${card.tone}`]"
              role="button"
              tabindex="0"
              @click.stop="openVideo(card)"
              @keydown.enter.prevent="openVideo(card)"
            >
              <div class="hotspot-card__thumb">
                <video
                  class="hotspot-card__video"
                  :src="`${card.url}#t=0.1`"
                  muted
                  preload="metadata"
                  playsinline
                ></video>
              </div>
            </div>
          </article>
        </section>

        <section v-if="activeVideoCard" class="video-layer" @click.self="closeVideo">
          <div class="video-layer__panel">
            <button
              type="button"
              class="video-layer__close"
              aria-label="关闭视频"
              @click="closeVideo"
            ></button>
            <div class="video-layer__content">
              <H5VideoPlayer
                :src="activeVideoCard.url"
                :poster="activeVideoCard.thumb"
                :autoplay="true"
                :muted="true"
                :controls="true"
                fill-mode="contain"
              />
            </div>
          </div>
        </section>
      </section>
    </main>
    <Tabbar v-if="!activeVideoCard" />
  </div>
</template>

<style scoped lang="scss">
@use 'sass:list';

$line-color: rgba(107, 230, 255, 0.45);
$card-border: rgba(107, 228, 255, 0.85);
$card-sizes: (
  xl: (
    146px,
    86px,
  ),
  lg: (
    126px,
    76px,
  ),
  md: (
    108px,
    66px,
  ),
  sm: (
    92px,
    56px,
  ),
  xs: (
    72px,
    44px,
  ),
);
$card-tones: (
  'olive': #55651f,
  'gold': #6f5a1d,
  'rose': #8a5e79,
  'red': #6f2e1f,
  'cream': #8d7f53,
  'lemon': #7f7337,
  'mint': #4f7a6b,
  'scarlet': #762f32,
);
$tower-layouts: (
  a: (
    left: 4px,
    width: 34px,
    height: 42px,
  ),
  b: (
    left: 52px,
    width: 44px,
    height: 68px,
  ),
  c: (
    left: 106px,
    width: 42px,
    height: 96px,
  ),
  d: (
    left: 160px,
    width: 30px,
    height: 82px,
  ),
  e: (
    right: 0,
    width: 38px,
    height: 54px,
  ),
);

@mixin place($props) {
  @each $key, $value in $props {
    #{$key}: $value;
  }
}

.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.hotspot-page {
  position: relative;
  height: 100%;
  padding-bottom: calc(95px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.hotspot-canvas {
  position: relative;
  width: min(100%, 420px);
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.hotspot-sphere {
  position: absolute;
  left: 0;
  right: 0;
  top: 18px;
  height: 370px;
  z-index: 4;
  perspective: 900px;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.hotspot-node {
  position: absolute;
  left: 50%;
  top: 48%;
  will-change: transform, opacity, filter;
}

.hotspot-card {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  border: 0;
  border-radius: 8px;
  padding: 0;
  box-sizing: border-box;
  overflow: visible;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  filter: drop-shadow(0 0 8px rgba(90, 231, 255, 0.45));

  &__marker {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 4;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid rgba(109, 244, 255, 0.95);
    box-shadow: 0 0 6px rgba(88, 229, 255, 0.7);
  }

  &__thumb {
    position: absolute;
    inset: 4px;
    border-radius: 4px;
    background-size: 100% 100%;
    background-position: center;
    overflow: hidden;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:focus-visible {
    outline: 2px solid rgba(129, 238, 255, 0.95);
    outline-offset: 2px;
  }

  @each $size, $dimension in $card-sizes {
    &--#{$size} {
      width: list.nth($dimension, 1);
      height: list.nth($dimension, 2);
    }
  }

  @each $tone, $color in $card-tones {
    &--#{$tone} &__thumb::before {
      background: rgba($color, 0.38);
    }
  }
}

.city-placeholder {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 80px;
  height: 210px;
  z-index: 1;

  &__glow {
    position: absolute;
    left: 50%;
    bottom: 18px;
    width: 320px;
    height: 180px;
    transform: translateX(-50%);
    border-radius: 52% 52% 44% 44%;
    background:
      radial-gradient(circle at 50% 70%, rgba(114, 250, 255, 0.56), rgba(114, 250, 255, 0) 68%),
      linear-gradient(180deg, rgba(44, 129, 255, 0.68), rgba(14, 79, 230, 0.1));
    box-shadow:
      0 -4px 34px rgba(72, 200, 255, 0.55),
      0 0 42px rgba(47, 117, 255, 0.42) inset;
  }

  &__skyline {
    position: absolute;
    left: 50%;
    bottom: 40px;
    width: 250px;
    height: 104px;
    transform: translateX(-50%);
  }
}

.tower {
  position: absolute;
  bottom: 0;
  border: 1px solid rgba(130, 240, 255, 0.9);
  background: linear-gradient(180deg, rgba(129, 242, 255, 0.42), rgba(26, 120, 255, 0.1));
  box-shadow: 0 0 14px rgba(106, 217, 255, 0.65);

  @each $name, $props in $tower-layouts {
    &--#{$name} {
      @include place($props);
    }
  }
}

.video-layer {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(1, 10, 45, 0.92);
  backdrop-filter: blur(2px);
  padding: 0;
  box-sizing: border-box;

  &__panel {
    position: relative;
    width: 100vw;
    height: 100vh;
    border: 0;
    border-radius: 0;
    background: #000;
    overflow: hidden;
  }

  &__content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(100vw, calc(100vh * 16 / 9));
    aspect-ratio: 16 / 9;
    max-height: 100vh;
    transform: translate(-50%, -50%);
  }

  &__close {
    position: absolute;
    top: calc(10px + env(safe-area-inset-top));
    right: calc(10px + env(safe-area-inset-right));
    z-index: 5;
    width: 38px;
    height: 38px;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 16px;
      height: 2px;
      border-radius: 2px;
      background: #fff;
    }

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}
</style>
