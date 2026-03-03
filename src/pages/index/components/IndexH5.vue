<script setup>
import bgImage from '@/assets/homepage/background.png'
import H5VideoPlayer from '@/compontents/h5-video-player.vue'
import { useIndexLanding } from './useIndexLanding'

const {
  showVideo,
  showHome,
  videoOpacity,
  playerRef,
  showCover,
  handlePlayerReady,
  handleVideoEnded,
  handleTimeUpdate,
  handlePlay,
  handleCoverClick,
  handleSkipVideo,
  handleEnter,
  year_2026,
  enterButtonImage,
  openingVideo,
  skipBtn,
} = useIndexLanding()
</script>

<template>
  <transition name="video-fade">
    <div v-if="showVideo" class="opening-video" :style="{ opacity: videoOpacity }">
      <div class="opening-video__player">
        <H5VideoPlayer
          ref="playerRef"
          :src="openingVideo"
          :autoplay="false"
          :controls="false"
          :muted="false"
          fill-mode="fill"
          @ready="handlePlayerReady"
          @ended="handleVideoEnded"
          @timeupdate="handleTimeUpdate"
          @play="handlePlay"
        />
        <div v-if="showCover" class="video-cover" @click="handleCoverClick">
          <div class="video-cover__play-icon"></div>
        </div>
      </div>
      <button v-if="!showCover" type="button" class="skip-btn" @click="handleSkipVideo">
        <img :src="skipBtn" class="skip-btn__img" alt="skip" />
      </button>
    </div>
  </transition>

  <transition name="home-reveal">
    <main v-if="showHome" class="landing-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section class="landing-page__stage">
        <img class="year-element" :src="year_2026" alt="2026" />
        <button class="landing-page__enter" type="button" @click="handleEnter">
          <img :src="enterButtonImage" alt="Enter" />
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

.year-element {
  position: absolute;
  bottom: 24%;
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
    transform: translateX(-48%) skew(5deg);
    filter: brightness(2) hue-rotate(90deg);
  }
  34% {
    transform: translateX(-50%) skew(0deg);
    filter: brightness(1);
  }
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

.skip-btn {
  position: absolute;
  right: calc(16px + env(safe-area-inset-right));
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 1000;
  padding: 0;
  border: 0;
  background: transparent;
}

.skip-btn .skip-btn__img {
  display: block;
  width: 46px;
  height: auto;
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
  margin-left: 5px;
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
