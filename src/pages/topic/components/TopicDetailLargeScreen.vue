<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-detail-bg-web.png'
import webDialogRight from '@/assets/topic/web/topic-detail-right-web.png'
import webDialogTopRight from '@/assets/topic/web/topic-detail-top-right-web.png'
import webDialogBottomRight from '@/assets/topic/web/topic-detail-bottomright-web.png'
import webQuoteIconTop from '@/assets/topic/web/quote-icon-top-web.png'
import webQuoteIconBottom from '@/assets/topic/web/quote-icon-bottom-web.png'
import tagBg from '@/assets/topic/h5/tag-bg.png'
import { useTopicDetail } from './useTopicDetail'

const largeBubbleConfigs = [
  {
    type: 'left-top',
    img: webDialogBottomRight,
    padding: '150px 46px 96px 38px',
    tagStyle: { top: '42px', bottom: 'none', left: '36px', right: 'none', textAlign: 'right' },
    minHeight: '500px',
  },
  {
    type: 'left-bottom',
    img: webDialogRight,
    padding: '140px 122px 42px 38px',
    tagStyle: { top: '32px', left: '40px' },
    minHeight: '440px',
  },
  {
    type: 'right-top',
    img: webDialogTopRight,
    padding: '260px 120px 72px 58px',
    tagStyle: { top: '148px', right: '120px', textAlign: 'left' },
    minHeight: '500px',
  },
  {
    type: 'right-bottom',
    img: webDialogRight,
    padding: '160px 152px 84px 46px',
    tagStyle: { top: '40px', bottom: 'none', left: '38px', textAlign: 'right' },
    minHeight: '460px',
  },
]

const { activeYear, topicYearTabs, displayList, setYear, handleCardClick } = useTopicDetail({
  bubbleConfigs: largeBubbleConfigs,
})

const BASE_STAGE_WIDTH = 3840
const BASE_STAGE_HEIGHT = 2160
const stageScale = ref(1)

const updateStageScale = () => {
  const widthScale = window.innerWidth / BASE_STAGE_WIDTH
  const heightScale = window.innerHeight / BASE_STAGE_HEIGHT
  stageScale.value = Math.min(widthScale, heightScale)
}

onMounted(() => {
  updateStageScale()
  window.addEventListener('resize', updateStageScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateStageScale)
})

const getLargeCardBoxStyle = (index, total) => {
  const fullLayouts = [
    { top: '32%', left: '39%', width: '40%', zIndex: 3 },
    { top: '8%', left: '30%', width: '27%', zIndex: 2 },
    { top: '6%', right: '0%', width: '34%', zIndex: 2 },
    { top: '34%', left: '1%', width: '32%', zIndex: 4 },
  ]
  return fullLayouts[index] || fullLayouts[fullLayouts.length - 1]
}

const largeDisplayList = computed(() => {
  const total = displayList.value.length
  return displayList.value.map((card, index) => ({
    ...card,
    boxStyle: getLargeCardBoxStyle(index, total),
  }))
})
</script>

<template>
  <div class="page">
    <main class="topic-detail" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="topic-detail__viewport">
        <div
          class="topic-detail__stage"
          :style="{ transform: `translate(-50%, -50%) scale(${stageScale})` }"
        >
          <nav class="year-tabs">
            <button
              v-for="year in topicYearTabs"
              :key="year"
              type="button"
              class="year-tabs__item"
              :class="{ 'year-tabs__item--active': activeYear === year }"
              :aria-label="`${year}年`"
              @click="setYear(year)"
            >
              <span class="year-tabs__label">{{ year }}年</span>
            </button>
          </nav>

          <img class="topic-detail__icon" :src="webQuoteIconTop" alt="" aria-hidden="true" />
          <img
            class="topic-detail__city-right"
            :src="webQuoteIconBottom"
            alt=""
            aria-hidden="true"
          />

          <section class="scroll-wrapper" :key="activeYear">
            <div class="scroll-track scroll-track--large">
              <div
                v-for="card in largeDisplayList"
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
  width: 3840px;
  height: 2160px;
  transform-origin: center center;
}

.year-tabs {
  position: absolute;
  top: 2.4%;
  left: 3.3%;
  z-index: 20;
  display: flex;
  align-items: stretch;
  width: 34%;
  height: 6.4%;
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
  background: linear-gradient(180deg, #2f58ea 0%, #173da8 100%);
  padding: 0;
  cursor: pointer;
  clip-path: polygon(32px 0, 100% 0, calc(100% - 32px) 100%, 0 100%);
  opacity: 0.95;
}
.year-tabs__item + .year-tabs__item {
  margin-left: -32px;
}

.year-tabs__item:first-child {
  clip-path: polygon(0 0, 100% 0, calc(100% - 32px) 100%, 0 100%);
}

.year-tabs__item:last-child {
  clip-path: polygon(32px 0, 100% 0, 100% 100%, 0 100%);
}

.year-tabs__item:not(:first-child)::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 10px;
  background: rgb(166 222 255 / 58%);
  transform: skewX(-13deg);
}
.year-tabs__item--active {
  opacity: 1;
  background: linear-gradient(180deg, #66ebef 0%, #2baecc 100%);
  box-shadow: inset 0 0 18px rgb(138 253 255 / 32%);
  z-index: 1;
}

.year-tabs__label {
  font-size: 62px;
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

.scroll-wrapper {
  position: absolute;
  top: 12.8%;
  left: 2.2%;
  right: 2.2%;
  bottom: 10.8%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  z-index: 10;
}

.scroll-track {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.scroll-track--large {
  position: relative;
  width: 100%;
  min-height: 1320px;
  padding: 0 28px 140px;
}

.detail-card-box {
  position: absolute;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.detail-card {
  position: relative;
  width: 100%;
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
  font-size: 52px;
  line-height: 1.6;
  font-weight: 700;
  text-align: justify;
  text-shadow: 0 3px 8px rgb(0 0 0 / 55%);
  margin-bottom: 18px;
  word-break: break-word;
}

.detail-card__tag-abs {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  font-size: 48px;
  color: #fff;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  white-space: nowrap;
  z-index: 2;
  cursor: pointer;
}

.topic-detail__icon {
  position: absolute;
  top: 12%;
  left: 2.6%;
  width: 11%;
  z-index: 15;
  opacity: 0.9;
  pointer-events: none;
}

.topic-detail__city-right {
  position: absolute;
  top: 37.4%;
  right: 2.6%;
  width: 11%;
  z-index: 13;
  pointer-events: none;
}
</style>
