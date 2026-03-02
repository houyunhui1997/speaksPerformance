<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bgImage from '@/assets/homepage/background.png'
import titleImage from '@/assets/homepage/title.png'
import enterButtonImage from '@/assets/homepage/button.png'
import logo_01 from '@/assets/homepage/logo1.png'
import logo_02 from '@/assets/homepage/logo2.png'
import logo_03 from '@/assets/homepage/logo3.png'
import year_2026 from '@/assets/homepage/2026.png'
import H5VideoPlayer from '@/compontents/h5-video-player.vue'
import openingVideo from '@/assets/video/index.mp4'

// --- 预加载资源 ---
// Footprint
import fpArrow from '@/assets/footprint/arrow.png'
import fpBg from '@/assets/footprint/bg.png'
import fpText from '@/assets/footprint/text1.png'
import fpJuxing from '@/assets/footprint/juxing.png'
import fpDidian from '@/assets/footprint/didian.png'

// Hotspot
import hsBg from '@/assets/hotspot/hotspot_bg.png'
import hsVideoThumb from '@/assets/hotspot/video.png'
import hsVideoBg from '@/assets/hotspot/video-bg.png'

// Topic
import tpBg from '@/assets/topic/topic-bg.png'
import tpCardMd from '@/assets/topic/topic-card-md.png'
import tpCardXl from '@/assets/topic/topic-card-xl.png'
import tpCardLg from '@/assets/topic/topic-card-lg.png'
import tpCardSm from '@/assets/topic/topic-card-sm.png'
import tpCardXs from '@/assets/topic/topic-card-xs.png'

// Topic Author
import authListBg from '@/assets/topic/list-bg.png'
import authDefaultAvatar from '@/assets/topic/defaultAvatar.jpg'
import authDialogTop from '@/assets/topic/dialog-top.png'
import authIcon01 from '@/assets/topic/author-icon-01.png'
import authIcon02 from '@/assets/topic/author-icon-02.png'
// ----------------

const router = useRouter()
const showVideo = ref(true)
const showHome = ref(false)
const videoOpacity = ref(1)
const playerRef = ref(null)
const showCover = ref(true)

// 静默预加载逻辑
const preloadAssets = () => {
  const assets = [
    fpArrow,
    fpBg,
    fpText,
    fpJuxing,
    fpDidian,
    hsBg,
    hsVideoThumb,
    hsVideoBg,
    tpBg,
    tpCardMd,
    tpCardXl,
    tpCardLg,
    tpCardSm,
    tpCardXs,
    authListBg,
    authDefaultAvatar,
    authDialogTop,
    authIcon01,
    authIcon02,
  ]

  const load = () => {
    // console.log('开始静默预加载资源...', assets.length)
    assets.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }

  // 优先使用 requestIdleCallback 在浏览器空闲时加载
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    window.requestIdleCallback(load)
  } else {
    // 降级方案：延迟 3 秒执行，避开视频启动的高负载时刻
    setTimeout(load, 3000)
  }
}

// 在组件挂载（视频开始加载/播放）时启动预加载
// 注意：这不会阻塞主线程，因为 Image 加载是异步的
onMounted(() => {
  preloadAssets()
})

const handleVideoEnded = () => {
  showHome.value = true
  showVideo.value = false

  const bgm = globalThis.__SPEAKS_PERF_BGM__
  if (bgm && typeof bgm.play === 'function') {
    bgm.play()
  }
}

const handlePlay = () => {
  showCover.value = false
}

const handleCoverClick = () => {
  if (playerRef.value) {
    playerRef.value.play()
    showCover.value = false
  }
}

const handleTimeUpdate = (e) => {
  const currentTime = e.currentTime || (e.video ? e.video.currentTime : 0)
  const duration = e.duration || (e.video ? e.video.duration : 0)

  if (duration > 0) {
    const timeLeft = duration - currentTime
    // Start fading out in the last 0.5 second
    if (timeLeft <= 0.5) {
      videoOpacity.value = Math.max(0, timeLeft / 0.5)
    } else {
      videoOpacity.value = 1
    }
  }
}

const handleEnter = () => {
  router.push('/footprint')
}
</script>

<template>
  <transition name="video-fade">
    <div v-if="showVideo" class="opening-video" :style="{ opacity: videoOpacity }">
      <div class="opening-video__player">
        <H5VideoPlayer
          ref="playerRef"
          :src="openingVideo"
          :autoplay="true"
          :controls="false"
          :muted="false"
          fill-mode="fill"
          @ended="handleVideoEnded"
          @timeupdate="handleTimeUpdate"
          @play="handlePlay"
        />
        <div v-if="showCover" class="video-cover" @click="handleCoverClick">
          <div class="video-cover__play-icon"></div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="home-reveal">
    <main v-if="showHome" class="landing-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section class="landing-page__stage">
        <div class="landing-page__logo">
          <img class="landing-page__logo_01" :src="logo_01" alt="Top-left logo" />
          <img class="landing-page__logo_02" :src="logo_02" alt="Top-left logo" />
          <img class="landing-page__logo_03" :src="logo_03" alt="Top-left logo" />
        </div>
        <img class="landing-page__title" :src="titleImage" alt="Title placeholder" />
        <img class="year-element" :src="year_2026" alt="2026" />
        <button class="landing-page__enter" type="button" @click="handleEnter">
          <img :src="enterButtonImage" alt="Enter button placeholder" />
        </button>
      </section>
    </main>
  </transition>
</template>

<style scoped>
.landing-page {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: relative;
  overflow: hidden;
  background: #05145f;
  display: flex;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
}

.landing-page__stage {
  position: relative;
  width: min(100vw, calc(100dvh * 380 / 823));
  height: 100%;
}

.landing-page__logo {
  position: absolute;
  top: 3%;
  left: 3%;
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.2vw, 12px);
}

.landing-page__logo_01 {
  width: clamp(96px, 30vw, 138px);
  height: auto;
}

.landing-page__logo_02 {
  width: clamp(34px, 10vw, 52px);
  height: auto;
}

.landing-page__logo_03 {
  width: clamp(40px, 14vw, 58px);
  height: auto;
}

.landing-page__title {
  position: absolute;
  top: 12.5%;
  left: 50%;
  width: 78%;
  transform: translateX(-50%);
}

.year-element {
  position: absolute;
  bottom: 27%;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: auto;
  animation: year-spin 6s linear infinite;
}

@keyframes year-spin {
  0% {
    transform: perspective(1000px) translateX(-50%) rotateY(0deg);
  }
  100% {
    transform: perspective(1000px) translateX(-50%) rotateY(-360deg);
  }
}

.landing-page__enter {
  position: absolute;
  left: 50%;
  bottom: calc(6% + env(safe-area-inset-bottom));
  width: 44%;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
  /* 故障闪烁动画 */
  animation: glitch-skew 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite both;
}

.landing-page__enter img {
  display: block;
  width: 100%;
  height: auto;
}
@keyframes glitch-skew {
  0%,
  100% {
    transform: translateX(-50%) skew(0deg);
    opacity: 1;
  }
  10% {
    transform: translateX(-50%) skew(-2deg);
    opacity: 0.9;
  }
  20% {
    transform: translateX(-50%) skew(2deg);
    opacity: 1;
  }
  30% {
    transform: translateX(-50%) skew(0deg);
    filter: brightness(1);
  }
  32% {
    transform: translateX(-48%) skew(5deg); /* 瞬间错位 */
    filter: brightness(2) hue-rotate(90deg); /* 瞬间变色变亮 */
  }
  34% {
    transform: translateX(-50%) skew(0deg);
    filter: brightness(1);
  }
  /* 后面大部分时间保持静止，制造随机感 */
  40%,
  90% {
    transform: translateX(-50%);
  }
}

.opening-video {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.opening-video__player {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.video-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: radial-gradient(circle, #2b6cb0 0%, #05145f 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.video-cover__play-icon {
  width: 80px;
  height: 80px;
  border: 2px solid #fff;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-cover__play-icon::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 0 12px 20px;
  border-color: transparent transparent transparent #fff;
  margin-left: 5px; /* Adjust for visual center */
}

.video-fade-leave-active {
  transition: opacity 0.5s ease;
}

.video-fade-leave-to {
  opacity: 0;
}

.home-reveal-enter-active {
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.8s ease;
}

.home-reveal-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(1.02);
  filter: blur(8px);
}
</style>
