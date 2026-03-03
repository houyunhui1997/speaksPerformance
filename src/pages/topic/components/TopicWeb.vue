<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-bg-web.png'
import { useTopicSphere } from './useTopicSphere'

const { sphereRef, tags, getCardFrame, handleTopicClick, handleTopicTouchEnd } = useTopicSphere({
  radius: 220,
  horizontalSpread: 3.75,
  focalLength: 640,
  baseSpeed: 0.0024,
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
  padding-bottom: 92px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 90px;
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: 520px;
  margin-top: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
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
  width: 180px;
  height: 76px;
  margin-left: -90px;
  margin-top: -38px;
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
  gap: 6px;
  z-index: 2;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 0 6px rgb(0 0 0 / 80%);
  white-space: nowrap;
  font-size: 20px;
}

.topic-item__num-placeholder {
  font-size: 0.8em;
  opacity: 0.9;
}

.topic-item--wide {
  width: 320px;
  height: 80px;
  margin-left: -160px;
  margin-top: -40px;
}
.topic-item--wide .topic-item__text {
  font-size: 22px;
}

.topic-item--xl {
  width: 240px;
  height: 92px;
  margin-left: -120px;
  margin-top: -46px;
}
.topic-item--xl .topic-item__text {
  font-size: 24px;
}

.topic-item--lg {
  width: 210px;
  height: 84px;
  margin-left: -105px;
  margin-top: -42px;
}
.topic-item--lg .topic-item__text {
  font-size: 22px;
}

.topic-item--sm {
  width: 150px;
  height: 60px;
  margin-left: -75px;
  margin-top: -30px;
}

.topic-item--xs {
  width: 132px;
  height: 52px;
  margin-left: -66px;
  margin-top: -26px;
}
</style>
