<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-bg-web.png'
import { useTopicSphere } from './useTopicSphere'

const BASE_WEB_WIDTH = 1920
const BASE_WEB_HEIGHT = 1080
const topicScale = ref(1)

const updateTopicScale = () => {
  const viewportScale = Math.min(
    window.innerWidth / BASE_WEB_WIDTH,
    window.innerHeight / BASE_WEB_HEIGHT
  )
  topicScale.value = Math.max(0.78, Math.min(viewportScale, 1.2))
}

onMounted(() => {
  updateTopicScale()
  window.addEventListener('resize', updateTopicScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTopicScale)
})

const { sphereRef, tags, getCardFrame, handleTopicClick, handleTopicTouchEnd } = useTopicSphere({
  radius: computed(() => Math.round(220 * topicScale.value)),
  horizontalSpread: computed(() => Number((3.75 + (topicScale.value - 1) * 0.28).toFixed(2))),
  focalLength: computed(() => Math.round(640 * topicScale.value)),
  baseSpeed: computed(() => Number((0.0024 / Math.sqrt(topicScale.value)).toFixed(4))),
})
</script>

<template>
  <div class="page">
    <main
      class="topic-page"
      :style="{ backgroundImage: `url(${bgImage})`, '--topic-scale': String(topicScale) }"
    >
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
  padding-top: calc(90px * var(--topic-scale));
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: calc(520px * var(--topic-scale));
  margin-top: calc(-20px * var(--topic-scale));
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: calc(1200px * var(--topic-scale));
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
  width: calc(180px * var(--topic-scale));
  height: calc(76px * var(--topic-scale));
  margin-left: calc(-90px * var(--topic-scale));
  margin-top: calc(-38px * var(--topic-scale));
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
  gap: calc(6px * var(--topic-scale));
  z-index: 2;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 0 6px rgb(0 0 0 / 80%);
  white-space: nowrap;
  font-size: calc(20px * var(--topic-scale));
}

.topic-item__num-placeholder {
  font-size: 0.8em;
  opacity: 0.9;
}

.topic-item--wide {
  width: calc(320px * var(--topic-scale));
  height: calc(80px * var(--topic-scale));
  margin-left: calc(-160px * var(--topic-scale));
  margin-top: calc(-40px * var(--topic-scale));
}
.topic-item--wide .topic-item__text {
  font-size: calc(22px * var(--topic-scale));
}

.topic-item--xl {
  width: calc(240px * var(--topic-scale));
  height: calc(92px * var(--topic-scale));
  margin-left: calc(-120px * var(--topic-scale));
  margin-top: calc(-46px * var(--topic-scale));
}
.topic-item--xl .topic-item__text {
  font-size: calc(24px * var(--topic-scale));
}

.topic-item--lg {
  width: calc(210px * var(--topic-scale));
  height: calc(84px * var(--topic-scale));
  margin-left: calc(-105px * var(--topic-scale));
  margin-top: calc(-42px * var(--topic-scale));
}
.topic-item--lg .topic-item__text {
  font-size: calc(22px * var(--topic-scale));
}

.topic-item--sm {
  width: calc(150px * var(--topic-scale));
  height: calc(60px * var(--topic-scale));
  margin-left: calc(-75px * var(--topic-scale));
  margin-top: calc(-30px * var(--topic-scale));
}

.topic-item--xs {
  width: calc(132px * var(--topic-scale));
  height: calc(52px * var(--topic-scale));
  margin-left: calc(-66px * var(--topic-scale));
  margin-top: calc(-26px * var(--topic-scale));
}
</style>
