<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-detail-bg-web.png'
// import quoteIcon from '@/assets/topic/topic-detail-left-top.png'
// import cityBottom from '@/assets/topic/topic-detail-bottom.png'
// import cityRight from '@/assets/topic/topic-detail-right-bottom.png'
import tagBg from '@/assets/topic/tag-bg.png'
import { useTopicDetail } from './useTopicDetail'

const webBubbleConfigs = [
  {
    type: 'left-top',
    padding: '26px 30px 14px 90px',
    tagStyle: { bottom: '30px', right: '34px', textAlign: 'right' },
    boxWidth: 'min(64vw, 780px)',
  },
  {
    type: 'left-bottom',
    padding: '72px 34px 30px 92px',
    tagStyle: { top: '28px', left: '90px' },
    boxWidth: 'min(62vw, 720px)',
    minHeight: '196px',
  },
  {
    type: 'right-top',
    padding: '112px 72px 52px 34px',
    tagStyle: { top: '72px', right: '54px', textAlign: 'left' },
    boxWidth: 'min(68vw, 840px)',
    minHeight: '260px',
  },
  {
    type: 'right-bottom',
    padding: '36px 96px 58px 32px',
    tagStyle: { bottom: '30px', left: '36px', textAlign: 'right' },
    boxWidth: 'min(66vw, 820px)',
    minHeight: '208px',
  },
]

const webStackOffsets = [
  { shiftX: 0, overlap: 0 },
  { shiftX: 20, overlap: -42 },
  { shiftX: -14, overlap: -20 },
  { shiftX: 6, overlap: 18 },
]

const { activeYear, topicYearTabs, displayList, setYear, handleCardClick } = useTopicDetail({
  bubbleConfigs: webBubbleConfigs,
  stackOffsets: webStackOffsets,
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

      <!-- <img class="topic-detail__icon" :src="quoteIcon" alt="" aria-hidden="true" /> -->

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

      <!-- <img class="topic-detail__city" :src="cityBottom" alt="" aria-hidden="true" />
      <img class="topic-detail__city-right" :src="cityRight" alt="" aria-hidden="true" /> -->
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
  top: 40px;
  left: 56px;
  z-index: 20;
  display: flex;
  align-items: stretch;
  width: min(46vw, 760px);
  height: 74px;
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
  clip-path: polygon(18px 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
  opacity: 0.95;
}

.year-tabs__item + .year-tabs__item {
  margin-left: -18px;
}

.year-tabs__item:first-child {
  clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
}

.year-tabs__item:last-child {
  clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%);
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
  font-size: clamp(28px, 1.5vw, 34px);
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
  top: 128px;
  left: 48px;
  width: min(16vw, 190px);
  z-index: 15;
  opacity: 0.9;
  pointer-events: none;
}

.scroll-wrapper {
  position: absolute;
  top: 140px;
  left: 42px;
  right: 42px;
  bottom: 170px;
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
  width: min(92vw, 1720px);
  margin: 0 auto;
  padding: 0 10px 80px;
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
  font-size: clamp(22px, 1.42vw, 30px);
  line-height: 1.55;
  font-weight: 700;
  text-align: justify;
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  margin-bottom: 12px;
  word-break: break-word;
}

.detail-card__tag-abs {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 14px;
  font-size: clamp(14px, 0.95vw, 18px);
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
  bottom: 64px;
  transform: translateX(-50%);
  width: min(74vw, 1380px);
  z-index: 12;
  pointer-events: none;
}

.topic-detail__city-right {
  position: absolute;
  right: 48px;
  bottom: 170px;
  width: min(18vw, 320px);
  z-index: 13;
  pointer-events: none;
}
</style>
