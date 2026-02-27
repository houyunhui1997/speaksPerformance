<script setup>
import { useRouter } from 'vue-router'
import bgImage from '@/assets/homepage/background.png'
import titleImage from '@/assets/homepage/title.png'
import enterButtonImage from '@/assets/homepage/button.png'
import logo_01 from '@/assets/homepage/logo1.png'
import logo_02 from '@/assets/homepage/logo2.png'
import logo_03 from '@/assets/homepage/logo3.png'
const router = useRouter()
const handleEnter = () => {
  router.push('/footprint')
}
</script>

<template>
  <main class="landing-page" :style="{ backgroundImage: `url(${bgImage})` }">
    <div class="landing-page__logo">
      <img class="landing-page__logo_01" :src="logo_01" alt="Top-left logo" />
      <img class="landing-page__logo_02" :src="logo_02" alt="Top-left logo" />
      <img class="landing-page__logo_03" :src="logo_03" alt="Top-left logo" />
    </div>
    <img class="landing-page__title" :src="titleImage" alt="Title placeholder" />

    <button class="landing-page__enter" type="button" @click="handleEnter">
      <img :src="enterButtonImage" alt="Enter button placeholder" />
    </button>
  </main>
</template>

<style scoped>
.landing-page {
  position: relative;
  width: 100vw;
  max-width: none;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #05145f;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
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
  top: 13%;
  left: 50%;
  width: 78%;
  max-width: 520px;
  transform: translateX(-50%);
}

.landing-page__enter {
  position: absolute;
  left: 50%;
  bottom: 7%;
  width: 44%;
  min-width: 180px;
  max-width: 300px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
}

.landing-page__enter img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
