<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-bg-web.png'
import { useTopicSphere } from './useTopicSphere'

const BASE_PORTRAIT_WIDTH = 1080
const BASE_PORTRAIT_HEIGHT = 1920
const MIN_TOPIC_SCALE = 0.8
const MAX_TOPIC_SCALE = 3.2
const topicScale = ref(1)

const getViewportSize = () => {
  const viewport = window.visualViewport
  if (viewport) {
    return {
      width: viewport.width,
      height: viewport.height,
    }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

const updateTopicScale = () => {
  const { width, height } = getViewportSize()
  const fittedWidth = Math.min(width, (height * BASE_PORTRAIT_WIDTH) / BASE_PORTRAIT_HEIGHT)
  const viewportScale = fittedWidth / BASE_PORTRAIT_WIDTH
  topicScale.value = Math.max(MIN_TOPIC_SCALE, Math.min(viewportScale, MAX_TOPIC_SCALE))
}

onMounted(() => {
  updateTopicScale()
  window.addEventListener('resize', updateTopicScale)
  window.visualViewport?.addEventListener('resize', updateTopicScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTopicScale)
  window.visualViewport?.removeEventListener('resize', updateTopicScale)
})

const { sphereRef, tags, getCardFrame, handleTopicClick, handleTopicTouchEnd } = useTopicSphere({
  radius: computed(() => Math.round(280 * topicScale.value)),
  horizontalSpread: computed(() => Number((1.5 + (topicScale.value - 1) * 0.14).toFixed(2))),
  focalLength: computed(() => Math.round(720 * topicScale.value)),
  baseSpeed: computed(() => Number((0.0022 / Math.sqrt(topicScale.value)).toFixed(4))),
  enableBrightness: false,
  use3dTransform: false,
})
</script>

<template>
  <div class="page">
    <main
      class="topic-page"
      :style="{ backgroundImage: `url(${bgImage})`, '--topic-scale': topicScale.toFixed(4) }"
    >
      <section class="topic-stage">
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
  height: 100dvh;
  overflow: hidden;
  background: #010d3d;
  color: #fff;
}

.topic-page {
  --topic-scale: 1;
  width: 100%;
  height: 100%;
  padding-bottom: calc((92px * var(--topic-scale)) + env(safe-area-inset-bottom));
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  justify-content: center;
}

.topic-stage {
  position: relative;
  width: min(100vw, 56.25vh);
  height: 100%;
  padding-top: calc(146px * var(--topic-scale));
  box-sizing: border-box;
}

@supports (height: 100dvh) {
  .topic-stage {
    width: min(100vw, 56.25dvh);
  }
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: calc(600px * var(--topic-scale));
  margin-top: calc(-10px * var(--topic-scale));
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
  width: calc(194px * var(--topic-scale));
  height: calc(82px * var(--topic-scale));
  margin-left: calc(-97px * var(--topic-scale));
  margin-top: calc(-41px * var(--topic-scale));
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: auto;
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
  gap: calc(4px * var(--topic-scale));
  z-index: 2;
  color: #fff;
  font-weight: 700;
  font-family:
    Microsoft YaHei,
    PingFang SC,
    Helvetica Neue,
    Arial,
    sans-serif;
  text-shadow: 0 0 2px rgb(0 0 0 / 65%);
  white-space: nowrap;
  font-size: calc(21px * var(--topic-scale));
  text-rendering: auto;
}

.topic-item__num-placeholder {
  font-size: 0.85em;
  opacity: 0.9;
}

.topic-item--wide {
  width: calc(340px * var(--topic-scale));
  height: calc(86px * var(--topic-scale));
  margin-left: calc(-170px * var(--topic-scale));
  margin-top: calc(-43px * var(--topic-scale));
}
.topic-item--wide .topic-item__text {
  font-size: calc(24px * var(--topic-scale));
}

.topic-item--xl {
  width: calc(258px * var(--topic-scale));
  height: calc(100px * var(--topic-scale));
  margin-left: calc(-129px * var(--topic-scale));
  margin-top: calc(-50px * var(--topic-scale));
}
.topic-item--xl .topic-item__text {
  font-size: calc(26px * var(--topic-scale));
}

.topic-item--lg {
  width: calc(226px * var(--topic-scale));
  height: calc(90px * var(--topic-scale));
  margin-left: calc(-113px * var(--topic-scale));
  margin-top: calc(-45px * var(--topic-scale));
}
.topic-item--lg .topic-item__text {
  font-size: calc(24px * var(--topic-scale));
}

.topic-item--sm {
  width: calc(162px * var(--topic-scale));
  height: calc(66px * var(--topic-scale));
  margin-left: calc(-81px * var(--topic-scale));
  margin-top: calc(-33px * var(--topic-scale));
}

.topic-item--xs {
  width: calc(142px * var(--topic-scale));
  height: calc(58px * var(--topic-scale));
  margin-left: calc(-71px * var(--topic-scale));
  margin-top: calc(-29px * var(--topic-scale));
}
</style>
