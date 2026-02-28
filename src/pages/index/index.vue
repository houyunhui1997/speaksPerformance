<script setup>
import { ref } from 'vue'
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

const router = useRouter()
const showVideo = ref(true)
const showHome = ref(false)
const videoOpacity = ref(1)
const playerRef = ref(null)
const showCover = ref(true)

const handleVideoEnded = () => {
  showHome.value = true
  showVideo.value = false
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

        <img class="landing-page__year2026" :src="year_2026" aria-label="2026 image" />

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
  background-size: cover;
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

.landing-page__year2026 {
  position: absolute;
  left: 50%;
  bottom: 27.5%;
  width: 52%;
  aspect-ratio: 2.5 / 1;
  transform: translateX(-50%);
  /* 动画设置：先执行入场(1s)，紧接着执行悬浮(3s无限循环) */
  animation:
    enter2026 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
    floatGlow 4s ease-in-out infinite 1s; /* 延迟1s等待入场结束 */
  opacity: 0; /* 初始隐藏，由动画控制显示 */
}

.landing-page__enter img {
  display: block;
  width: 100%;
  height: auto;
}
@media screen and (max-width: 390px) {
  .landing-page__year2026 {
    bottom: 22.2%;
    width: 54%;
  }
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
/* 入场动画：从下往上 + 模糊变清晰 */
@keyframes enter2026 {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(40px) scale(0.9);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    filter: blur(0);
  }
}

/* 持续动画：上下悬浮 + 投影呼吸 */
@keyframes floatGlow {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
    filter: drop-shadow(0 0 0px rgba(138, 200, 255, 0));
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
    /* 如果图片是透明PNG，drop-shadow会产生很好的发光效果 */
    filter: drop-shadow(0 0 15px rgba(100, 220, 255, 0.6));
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
