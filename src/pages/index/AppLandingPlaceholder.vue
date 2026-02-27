<script setup>
import { useRouter } from 'vue-router'
import bgImage from '@/assets/homepage/background.png'
import topLogoImage from '@/assets/placeholders/app-logo.svg'
import titleImage from '@/assets/homepage/title.png'
import enterButtonImage from '@/assets/homepage/button.png'

const router = useRouter()
const handleEnter = () => {
  router.push('/index')
}
</script>

<template>
  <main class="landing-page" :style="{ backgroundImage: `url(${bgImage})` }">
    <img class="landing-page__logo" :src="topLogoImage" alt="Top-left logo placeholder" />
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
  width: 40%;
  max-width: 240px;
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
