<script setup>
import bgImage from '@/assets/placeholders/app-bg.svg'
import topLogoImage from '@/assets/placeholders/app-logo.svg'
import titleImage from '@/assets/homepage/title.png'
import enterButtonImage from '@/assets/placeholders/app-enter.svg'
</script>

<template>
  <main class="landing-page">
    <img class="landing-page__bg" :src="bgImage" alt="Background placeholder" />

    <img class="landing-page__logo" :src="topLogoImage" alt="Top-left logo placeholder" />
    <img class="landing-page__title" :src="titleImage" alt="Title placeholder" />

    <button class="landing-page__enter" type="button">
      <img :src="enterButtonImage" alt="Enter button placeholder" />
    </button>
  </main>
</template>

<style scoped>
.landing-page {
  position: relative;
  width: 100%;
  max-width: 640px;
  height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  background: #05145f;
}

.landing-page__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
