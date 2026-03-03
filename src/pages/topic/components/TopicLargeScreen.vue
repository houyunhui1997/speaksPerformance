<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-bg-web.png'
import { useTopicSphere } from './useTopicSphere'

const { sphereRef, tags, getCardFrame, handleTopicClick, handleTopicTouchEnd } = useTopicSphere({
  radius: 280,
  horizontalSpread: 4,
  focalLength: 860,
  baseSpeed: 0.002,
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
  padding-top: 120px;
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: 650px;
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;
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
  width: 230px;
  height: 96px;
  margin-left: -115px;
  margin-top: -48px;
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
  gap: 8px;
  z-index: 2;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 0 8px rgb(0 0 0 / 80%);
  white-space: nowrap;
  font-size: 24px;
}

.topic-item__num-placeholder {
  font-size: 0.8em;
  opacity: 0.9;
}

.topic-item--wide {
  width: 420px;
  height: 104px;
  margin-left: -210px;
  margin-top: -52px;
}
.topic-item--wide .topic-item__text {
  font-size: 28px;
}

.topic-item--xl {
  width: 320px;
  height: 122px;
  margin-left: -160px;
  margin-top: -61px;
}
.topic-item--xl .topic-item__text {
  font-size: 30px;
}

.topic-item--lg {
  width: 280px;
  height: 112px;
  margin-left: -140px;
  margin-top: -56px;
}
.topic-item--lg .topic-item__text {
  font-size: 28px;
}

.topic-item--sm {
  width: 210px;
  height: 84px;
  margin-left: -105px;
  margin-top: -42px;
}

.topic-item--xs {
  width: 186px;
  height: 74px;
  margin-left: -93px;
  margin-top: -37px;
}
</style>
