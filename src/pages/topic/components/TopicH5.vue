<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/topic-bg.png'
import { useTopicSphere } from './useTopicSphere'

const { sphereRef, tags, getCardFrame, handleTopicClick, handleTopicTouchEnd } = useTopicSphere({
  radius: 160,
  focalLength: 400,
  baseSpeed: 0.003,
})
</script>

<template>
  <div class="page">
    <main class="topic-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section ref="sphereRef" class="topic-sphere">
        <article
          v-for="item in tags"
          :key="item.key"
          class="topic-item"
          :class="`topic-item--${item.size}`"
          :style="item.style"
          @click="handleTopicClick(item)"
          @touchend.stop.prevent="handleTopicTouchEnd(item)"
          @keydown.enter.prevent="handleTopicClick(item)"
        >
          <img class="topic-item__frame" :src="getCardFrame(item)" alt="" />
          <span class="topic-item__text">
            {{ item.label }}
            <span class="topic-item__num-placeholder">{{ item.num ?? '00' }}</span>
          </span>
        </article>
      </section>
    </main>
    <Tabbar />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #010d3d;
  color: #fff;
}

.topic-page {
  width: 100%;
  height: 100%;
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 120px;
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: -60px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
  touch-action: none;
  cursor: grab;
}
.topic-sphere:active {
  cursor: grabbing;
}

.topic-item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 50px;
  margin-left: -60px;
  margin-top: -25px;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.topic-item__frame {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
}

.topic-item__text {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  z-index: 2;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0 4px rgb(0 0 0 / 80%);
  white-space: nowrap;
  font-size: 14px;
}

.topic-item__num-placeholder {
  font-size: 0.85em;
  opacity: 0.9;
}

.topic-item--wide {
  width: 240px;
  height: 50px;
  margin-left: -120px;
  margin-top: -25px;
}
.topic-item--wide .topic-item__text {
  font-size: 16px;
}

.topic-item--xl {
  width: 160px;
  height: 60px;
  margin-left: -80px;
  margin-top: -30px;
}
.topic-item--xl .topic-item__text {
  font-size: 18px;
}

.topic-item--lg {
  width: 140px;
  height: 55px;
  margin-left: -70px;
  margin-top: -27px;
}
.topic-item--lg .topic-item__text {
  font-size: 16px;
}

.topic-item--sm {
  width: 100px;
  height: 40px;
  margin-left: -50px;
  margin-top: -20px;
}

.topic-item--xs {
  width: 90px;
  height: 36px;
  margin-left: -45px;
  margin-top: -18px;
}
</style>
