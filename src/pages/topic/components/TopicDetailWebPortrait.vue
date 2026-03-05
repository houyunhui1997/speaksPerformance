<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/h5/topic-detail-bg.png'
import quoteIcon from '@/assets/topic/h5/topic-detail-left-top.png'
import cityBottom from '@/assets/topic/h5/topic-detail-bottom.png'
import cityRight from '@/assets/topic/h5/topic-detail-right-bottom.png'
import tagBg from '@/assets/topic/h5/tag-bg.png'
import { useTopicDetail } from './useTopicDetail'

const BASE_STAGE_WIDTH = 375
const BASE_STAGE_HEIGHT = 667
const MIN_STAGE_SCALE = 0.72
const MAX_STAGE_SCALE = 8
const stageScale = ref(1)

const { activeYear, topicYearTabs, displayList, setYear, handleCardClick } = useTopicDetail()

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
    <main class="topic-detail" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="topic-detail__viewport">
        <div
          class="topic-detail__stage"
          :style="{ transform: `translate(-50%, -50%) scale(${stageScale.toFixed(2)})` }"
        >
          <nav class="year-tabs">
            <button
              v-for="year in topicYearTabs"
              :key="year"
              type="button"
              class="year-tabs__item"
              :class="{ 'year-tabs__item--active': activeYear === year }"
              :aria-label="`year-${year}`"
              @click="setYear(year)"
            >
              <span class="year-tabs__label">{{ year }}年</span>
            </button>
          </nav>

          <img class="topic-detail__icon" :src="quoteIcon" alt="" aria-hidden="true" />

          <section class="scroll-wrapper" :key="activeYear">
            <div class="scroll-track">
              <div
                v-for="card in displayList"
                :key="card.uniqueKey"
                class="detail-card-box"
                :style="card.boxStyle"
              >
                <div
                  class="detail-card"
                  :style="{
                    backgroundImage: `url(${card.bgImg})`,
                    ...card.cardStyle,
                  }"
                  role="button"
                  tabindex="0"
                  @click="handleCardClick(card)"
                  @keydown.enter.prevent="handleCardClick(card)"
                >
                  <p class="detail-card__content">{{ card.content }}</p>
                  <div
                    class="detail-card__tag-abs"
                    :style="{ ...card.tagStyle, backgroundImage: `url(${tagBg})` }"
                    role="button"
                    tabindex="0"
                    @click.stop="handleCardClick(card)"
                    @keydown.enter.stop.prevent="handleCardClick(card)"
                  >
                    {{ card.tag }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <img class="topic-detail__city" :src="cityBottom" alt="" aria-hidden="true" />
          <img class="topic-detail__city-right" :src="cityRight" alt="" aria-hidden="true" />
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

.topic-detail {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.topic-detail__viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.topic-detail__stage {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 375px;
  height: 667px;
  transform-origin: center center;
}

.year-tabs {
  position: absolute;
  top: 0;
  z-index: 20;
  display: flex;
  height: 56px;
  width: 100%;
  align-items: stretch;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgb(117 201 255 / 20%);
}

.year-tabs__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border: none;
  padding: 0;
  background: linear-gradient(180deg, #2f58ea 0%, #173da8 100%);
  clip-path: polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
  opacity: 0.95;
}

.year-tabs__item + .year-tabs__item {
  margin-left: -16px;
}

.year-tabs__item:first-child {
  clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
}

.year-tabs__item:last-child {
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%);
}

.year-tabs__item:not(:first-child)::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgb(166 222 255 / 58%);
  transform: skewX(-16deg);
}

.year-tabs__item--active {
  opacity: 1;
  background: linear-gradient(180deg, #66ebef 0%, #2baecc 100%);
  box-shadow: inset 0 0 18px rgb(138 253 255 / 32%);
  z-index: 1;
}

.year-tabs__label {
  font-size: 20px;
  font-weight: 700;
  color: #dbeeff;
  text-shadow: 0 1px 4px rgb(0 20 84 / 85%);
  pointer-events: none;
  letter-spacing: 0.5px;
}

.year-tabs__item--active .year-tabs__label {
  color: #e9ffff;
  text-shadow: 0 0 12px rgb(126 244 255 / 95%);
}

.topic-detail__icon {
  position: absolute;
  top: 74px;
  left: 6px;
  width: 100px;
  z-index: 15;
  opacity: 0.9;
  pointer-events: none;
}

.scroll-wrapper {
  position: absolute;
  top: 76px;
  left: 0;
  right: 0;
  bottom: calc(180px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  z-index: 10;
}

.scroll-track {
  display: flex;
  flex-direction: column;
  padding: 0 16px 36px;
  width: 100%;
  box-sizing: border-box;
}

.detail-card-box {
  width: min(92%, 500px);
  position: relative;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.detail-card {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 130px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: transparent;
  border: none;
  box-shadow: none;
  will-change: transform;
}

.detail-card__content {
  margin: 0;
  color: #eef8ff;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 700;
  text-align: justify;
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  margin-bottom: 8px;
  word-break: break-all;
}

.detail-card__tag-abs {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  font-size: 12px;
  color: #fff;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  white-space: nowrap;
  z-index: 2;
  cursor: pointer;
}

.topic-detail__city {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 12;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.topic-detail__city-right {
  position: absolute;
  right: 0;
  bottom: calc(120px + env(safe-area-inset-bottom));
  width: 79px;
  z-index: 13;
  pointer-events: none;
}
</style>
