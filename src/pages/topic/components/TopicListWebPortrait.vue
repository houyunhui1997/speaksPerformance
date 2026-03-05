<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/h5/list-bg.png'
import dialogRight from '@/assets/topic/h5/dialog-right.png'
import dialogLeft from '@/assets/topic/h5/dialog-left.png'
import { useTopicList } from './useTopicList'

const BASE_STAGE_WIDTH = 375
const BASE_STAGE_HEIGHT = 667
const MIN_STAGE_SCALE = 0.72
const MAX_STAGE_SCALE = 8
const stageScale = ref(1)

const {
  listWrapperRef,
  scrollList,
  handleCardLink,
  goAuthorDetail,
  pauseAutoScroll,
  syncScrollPos,
} = useTopicList({
  autoScrollSpeed: 0.1,
})

const getDialogBg = (index) => (index % 2 === 0 ? dialogRight : dialogLeft)

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

const updateStageScale = () => {
  const { width, height } = getViewportSize()
  const fittedScale = Math.min(width / BASE_STAGE_WIDTH, height / BASE_STAGE_HEIGHT)
  stageScale.value = Math.max(MIN_STAGE_SCALE, Math.min(fittedScale, MAX_STAGE_SCALE))
}

onMounted(() => {
  updateStageScale()
  window.addEventListener('resize', updateStageScale)
  window.visualViewport?.addEventListener('resize', updateStageScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateStageScale)
  window.visualViewport?.removeEventListener('resize', updateStageScale)
})
</script>

<template>
  <div class="page">
    <main class="topic-list" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="topic-list__viewport">
        <div
          class="topic-list__stage"
          :style="{ transform: `translate(-50%, -50%) scale(${stageScale.toFixed(4)})` }"
        >
          <section
            ref="listWrapperRef"
            class="list-wrapper"
            @scroll.passive="syncScrollPos"
            @wheel.passive="pauseAutoScroll"
            @touchstart.passive="pauseAutoScroll"
            @touchmove.passive="pauseAutoScroll"
          >
            <article
              v-for="(card, index) in scrollList"
              :key="card.uniqueKey"
              class="list-card"
              :class="index % 2 === 0 ? 'list-card--right' : 'list-card--left'"
              :style="{ backgroundImage: `url(${getDialogBg(index)})` }"
              role="button"
              tabindex="0"
              :data-clickable="Boolean(card.link)"
              @click="handleCardLink(card)"
              @keydown.enter.prevent="handleCardLink(card)"
            >
              <h3 class="list-card__title">{{ card.title }}</h3>
              <div class="list-card__meta">
                <button
                  v-if="card.author"
                  type="button"
                  class="list-card__author-btn"
                  @click.stop="goAuthorDetail(card)"
                  @keydown.enter.stop.prevent="goAuthorDetail(card)"
                >
                  <span class="list-card__author">{{ card.author }}</span>
                </button>
              </div>
            </article>
          </section>
        </div>
      </div>
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

.topic-list {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.topic-list__viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.topic-list__stage {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 375px;
  height: 667px;
  transform-origin: center center;
}

.list-wrapper {
  position: absolute;
  top: 62px;
  left: 0;
  right: 0;
  bottom: calc(95px + env(safe-area-inset-bottom));
  overflow-y: auto;
  padding: 0 12px 22px;
  box-sizing: border-box;
  z-index: 10;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.list-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.list-card {
  width: min(92%, 500px);
  margin: 0 auto 14px;
  min-height: 146px;
  padding: 24px 22px 28px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.list-card[data-clickable='true'] {
  cursor: pointer;
}

.list-card--right {
  padding-right: 18px;
}

.list-card--left {
  padding-left: 18px;
}

.list-card__title {
  margin: 0;
  color: #f0f8ff;
  font-size: 16px;
  line-height: 1.45;
  font-weight: 700;
  text-shadow: 0 1px 2px rgb(0 0 0 / 45%);
}

.list-card__meta {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.list-card__author-btn {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.list-card__author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  line-height: 1;
  color: #57ecff;
  font-weight: 700;
  white-space: nowrap;
}

.list-card__author::before {
  content: '';
  width: 78px;
  height: 2px;
  background: linear-gradient(90deg, rgb(95 236 255 / 18%), #73f2ff);
  box-shadow: 0 0 8px rgb(115 242 255 / 38%);
}
</style>
