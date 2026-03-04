<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-detail-bg-web.png'
import quoteIcon from '@/assets/topic/topic-detail-left-top.png'
import cityBottom from '@/assets/topic/topic-detail-bottom.png'
import cityRight from '@/assets/topic/topic-detail-right-bottom.png'
import tagBg from '@/assets/topic/tag-bg.png'
import { useTopicDetail } from './useTopicDetail'

const largeBubbleConfigs = [
  {
    type: 'left-top',
    padding: '32px 36px 18px 110px',
    tagStyle: { bottom: '34px', right: '44px', textAlign: 'right' },
    boxWidth: 'min(62vw, 980px)',
  },
  {
    type: 'left-bottom',
    padding: '86px 40px 34px 112px',
    tagStyle: { top: '34px', left: '112px' },
    boxWidth: 'min(60vw, 920px)',
    minHeight: '236px',
  },
  {
    type: 'right-top',
    padding: '132px 88px 62px 40px',
    tagStyle: { top: '86px', right: '66px', textAlign: 'left' },
    boxWidth: 'min(66vw, 1040px)',
    minHeight: '320px',
  },
  {
    type: 'right-bottom',
    padding: '44px 122px 70px 38px',
    tagStyle: { bottom: '38px', left: '44px', textAlign: 'right' },
    boxWidth: 'min(64vw, 980px)',
    minHeight: '252px',
  },
]

const largeStackOffsets = [
  { shiftX: 0, overlap: 0 },
  { shiftX: 24, overlap: -56 },
  { shiftX: -18, overlap: -28 },
  { shiftX: 10, overlap: 26 },
]

const { activeYear, topicYearTabs, displayList, setYear, handleCardClick } = useTopicDetail({
  bubbleConfigs: largeBubbleConfigs,
  stackOffsets: largeStackOffsets,
})
</script>

<template>
  <div class="page">
    <main class="topic-detail" :style="{ backgroundImage: `url(${bgImage})` }">
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

.year-tabs {
  position: absolute;
  top: 56px;
  left: 82px;
  z-index: 20;
  display: flex;
  align-items: stretch;
  width: min(44vw, 980px);
  height: 92px;
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
  clip-path: polygon(22px 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
  opacity: 0.95;
}

.year-tabs__item + .year-tabs__item {
  margin-left: -22px;
}

.year-tabs__item:first-child {
  clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
}

.year-tabs__item:last-child {
  clip-path: polygon(22px 0, 100% 0, 100% 100%, 0 100%);
}

.year-tabs__item:not(:first-child)::before {
  content: '';
  position: absolute;
  left: 10px;
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
  font-size: clamp(32px, 1.3vw, 40px);
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
  top: 170px;
  left: 76px;
  width: min(14vw, 260px);
  z-index: 15;
  opacity: 0.9;
  pointer-events: none;
}

.scroll-wrapper {
  position: absolute;
  top: 190px;
  left: 72px;
  right: 72px;
  bottom: 220px;
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
  width: min(90vw, 2240px);
  margin: 0 auto;
  padding: 0 16px 120px;
  box-sizing: border-box;
}

.detail-card-box {
  position: relative;
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
  font-size: clamp(28px, 1.35vw, 40px);
  line-height: 1.55;
  font-weight: 700;
  text-align: justify;
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  margin-bottom: 14px;
  word-break: break-word;
}

.detail-card__tag-abs {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 18px;
  font-size: clamp(18px, 0.85vw, 24px);
  color: #fff;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  white-space: nowrap;
  z-index: 2;
  cursor: pointer;
}

.topic-detail__city {
  position: absolute;
  left: 50%;
  bottom: 86px;
  transform: translateX(-50%);
  width: min(70vw, 1720px);
  z-index: 12;
  pointer-events: none;
}

.topic-detail__city-right {
  position: absolute;
  right: 72px;
  bottom: 214px;
  width: min(17vw, 430px);
  z-index: 13;
  pointer-events: none;
}
</style>
