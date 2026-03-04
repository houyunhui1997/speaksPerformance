<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-bg-web.png'
import { useTopicSphere } from './useTopicSphere'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080
const topicScale = ref(1)

const updateTopicScale = () => {
  const viewportScale = Math.min(window.innerWidth / BASE_WIDTH, window.innerHeight / BASE_HEIGHT)
  topicScale.value = Math.max(1, Math.min(viewportScale * 0.82, 1.75))
}

onMounted(() => {
  updateTopicScale()
  window.addEventListener('resize', updateTopicScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTopicScale)
})

const { sphereRef, tags, getCardFrame, handleTopicClick, handleTopicTouchEnd } = useTopicSphere({
  radius: computed(() => Math.round(280 * topicScale.value)),
  horizontalSpread: computed(() => Number((3.75 + (topicScale.value - 1) * 0.4).toFixed(2))),
  focalLength: computed(() => Math.round(860 * topicScale.value)),
  baseSpeed: computed(() => Number((0.002 / Math.sqrt(topicScale.value)).toFixed(4))),
})
</script>

<template>
  <div class="page">
    <main
      class="topic-page"
      :style="{ backgroundImage: `url(${bgImage})`, '--topic-scale': String(topicScale) }"
    >
      <section
        ref="sphereRef"
        class="topic-sphere"
        @click="handleTopicClick()"
        @touchend.stop.prevent="handleTopicTouchEnd()"
        @keydown.enter.prevent="handleTopicClick()"
      >
        <article
          v-for="item in tags"
          :key="item.key"
          class="topic-item"
          :class="`topic-item--${item.size}`"
          :style="item.style"
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
  --topic-scale: 1;
  width: 100%;
  height: 100%;
  padding-bottom: calc(92px * var(--topic-scale));
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: calc(120px * var(--topic-scale));
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: calc(650px * var(--topic-scale));
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: calc(1500px * var(--topic-scale));
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
  width: calc(230px * var(--topic-scale));
  height: calc(96px * var(--topic-scale));
  margin-left: calc(-115px * var(--topic-scale));
  margin-top: calc(-48px * var(--topic-scale));
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
  font-size: calc(24px * var(--topic-scale));
}

.topic-item__num-placeholder {
  font-size: 0.8em;
  opacity: 0.9;
}

.topic-item--wide {
  width: calc(420px * var(--topic-scale));
  height: calc(104px * var(--topic-scale));
  margin-left: calc(-210px * var(--topic-scale));
  margin-top: calc(-52px * var(--topic-scale));
}
.topic-item--wide .topic-item__text {
  font-size: calc(28px * var(--topic-scale));
}

.topic-item--xl {
  width: calc(320px * var(--topic-scale));
  height: calc(122px * var(--topic-scale));
  margin-left: calc(-160px * var(--topic-scale));
  margin-top: calc(-61px * var(--topic-scale));
}
.topic-item--xl .topic-item__text {
  font-size: calc(30px * var(--topic-scale));
}

.topic-item--lg {
  width: calc(280px * var(--topic-scale));
  height: calc(112px * var(--topic-scale));
  margin-left: calc(-140px * var(--topic-scale));
  margin-top: calc(-56px * var(--topic-scale));
}
.topic-item--lg .topic-item__text {
  font-size: calc(28px * var(--topic-scale));
}

.topic-item--sm {
  width: calc(210px * var(--topic-scale));
  height: calc(84px * var(--topic-scale));
  margin-left: calc(-105px * var(--topic-scale));
  margin-top: calc(-42px * var(--topic-scale));
}

.topic-item--xs {
  width: calc(186px * var(--topic-scale));
  height: calc(74px * var(--topic-scale));
  margin-left: calc(-93px * var(--topic-scale));
  margin-top: calc(-37px * var(--topic-scale));
}
</style>
