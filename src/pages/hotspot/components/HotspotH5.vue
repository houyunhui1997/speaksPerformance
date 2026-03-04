<script setup>
import { onUnmounted, ref } from 'vue'
import { Events } from 'xgplayer'
import Tabbar from '@/compontents/tabbar.vue'
import H5VideoPlayer from '@/compontents/h5-video-player.vue'
import bgImage from '@/assets/hotspot/h5/hotspot_bg.png'
import video from '@/assets/hotspot/h5/video.png'
import videoBg from '@/assets/hotspot/h5/video-bg.png'
import localVideo from '@/assets/video/index.mp4'
import { hotspotSeedCards, useHotspotSphere } from './useHotspotSphere'

const { hotspotSphereRef, hotspotCards } = useHotspotSphere({
  cards: hotspotSeedCards,
  fallbackThumb: video,
  fallbackVideo: localVideo,
  radius: 150,
  verticalRadius: 180,
  focalLength: 460,
  baseSpeedY: 0.003,
  baseSpeedX: 0.0008,
})

const activePopupCard = ref(null)
const popupPlayerRef = ref(null)
const wasBgmPlaying = ref(false)

const openExternal = (href) => {
  if (!href) return
  const opened = window.open(href, '_blank')
  if (!opened) window.location.href = href
}

const popupPanelRef = ref(null)
const isPopupVideoFullscreen = ref(false)
let popupFullscreenBound = false

const bindPopupVideoFullscreen = () => {
  const player = popupPlayerRef.value?.player?.()
  if (!player) return

  if (popupFullscreenBound) return
  popupFullscreenBound = true

  if (typeof player.on === 'function') {
    player.on(Events.FULLSCREEN_CHANGE, (isFullscreen) => {
      isPopupVideoFullscreen.value = !!isFullscreen
    })
  }
}

const exitPopupVideoFullscreen = () => {
  const player = popupPlayerRef.value?.player?.()
  if (player) {
    if (typeof player.exitFullscreen === 'function' && player.fullscreen) {
      player.exitFullscreen()
      return
    }

    if (typeof player.exitCssFullscreen === 'function') {
      if (player.isCssfullScreen) player.exitCssFullscreen()
      return
    }

    const fullscreenPlugin =
      typeof player.getPlugin === 'function' ? player.getPlugin('fullscreen') : null
    const toggle =
      fullscreenPlugin &&
      (fullscreenPlugin.toggleFullScreen ||
        fullscreenPlugin.changeFullScreen ||
        fullscreenPlugin.toggle)
    if (typeof toggle === 'function' && player.fullscreen) {
      toggle.call(fullscreenPlugin)
      return
    }

    if (typeof player.exitFullscreen === 'function') {
      player.exitFullscreen()
      return
    }
  }
  if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
    document.exitFullscreen().catch(() => {})
  }
}

const openPopup = (card) => {
  if (!card) return
  if (card.kind === 'video' && !card.url) return
  if (card.kind === 'link' && !card.href) return

  const bgm = globalThis.__SPEAKS_PERF_BGM__
  if (bgm && typeof bgm.getAudio === 'function' && typeof bgm.pause === 'function') {
    const audio = bgm.getAudio()
    wasBgmPlaying.value = audio && !audio.paused
    bgm.pause()
  } else {
    wasBgmPlaying.value = false
  }

  activePopupCard.value = card
  document.body.style.overflow = 'hidden'
}

const closePopup = () => {
  exitPopupVideoFullscreen()
  activePopupCard.value = null
  document.body.style.overflow = ''
  isPopupVideoFullscreen.value = false
  popupFullscreenBound = false

  if (wasBgmPlaying.value) {
    const bgm = globalThis.__SPEAKS_PERF_BGM__
    if (bgm && typeof bgm.play === 'function') {
      bgm.play()
    }
  }
}

onUnmounted(() => {
  document.body.style.overflow = ''

  if (activePopupCard.value && wasBgmPlaying.value) {
    const bgm = globalThis.__SPEAKS_PERF_BGM__
    if (bgm && typeof bgm.play === 'function') {
      bgm.play()
    }
  }
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
              @click.stop="openPopup(card)"
              @keydown.enter.prevent="openPopup(card)"
            >
              <div class="hotspot-card__thumb">
                <img
                  class="hotspot-card__video"
                  :src="card.thumb"
                  :style="card.thumbStyle"
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        </section>

        <section v-if="activePopupCard" class="video-layer" @click.self="closePopup">
          <div ref="popupPanelRef" class="video-layer__panel">
            <button
              type="button"
              class="video-layer__close"
              aria-label="关闭视频"
              @click="closePopup"
            ></button>
            <div v-if="activePopupCard.kind === 'video'" class="video-layer__content">
              <H5VideoPlayer
                ref="popupPlayerRef"
                :fullscreen-target="popupPanelRef"
                :src="activePopupCard.url"
                :poster="activePopupCard.thumb"
                :autoplay="true"
                :muted="false"
                :controls="true"
                fill-mode="contain"
                @ready="bindPopupVideoFullscreen"
              />
            </div>
            <div v-else class="link-layer">
              <img class="link-layer__cover" :src="activePopupCard.thumb" alt="" />
              <button
                type="button"
                class="link-layer__open"
                @click="openExternal(activePopupCard.href)"
              >
                打开链接
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
    <Tabbar v-if="!activePopupCard" />
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
  height: 500px;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    width: min(100vw, calc(100vh * 16 / 9));
    aspect-ratio: 16 / 9;
    max-height: 100vh;
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

.link-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: calc(18px + env(safe-area-inset-top)) 18px calc(18px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.link-layer__cover {
  width: min(92vw, 520px);
  max-height: 70vh;
  object-fit: contain;
  border-radius: 10px;
}

.link-layer__open {
  min-width: 160px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.5px;
}
</style>
