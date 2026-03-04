<script setup>
import { computed } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-detail-bg-web.png'
import yearTabsBg from '@/assets/topic/web/topic-detail-tabs-web.png'
import webDialogRight from '@/assets/topic/web/topic-detail-right-web.png'
import webDialogTopRight from '@/assets/topic/web/topic-detail-top-right-web.png'
import webDialogBottomRight from '@/assets/topic/web/topic-detail-bottomright-web.png'
import webQuoteIconTop from '@/assets/topic/web/quote-icon-top-web.png'
import webQuoteIconBottom from '@/assets/topic/web/quote-icon-bottom-web.png'
import tagBg from '@/assets/topic/h5/tag-bg.png'
import { useTopicDetail } from './useTopicDetail'

const webBubbleConfigs = [
  {
    type: 'left-top',
    img: webDialogBottomRight,
    padding: '70px 30px 70px 24px',
    tagStyle: { top: '30px', bottom: 'none', left: '24px', right: 'none', textAlign: 'right' },
    boxWidth: 'min(64vw, 780px)',
    minHeight: '340px',
  },
  {
    type: 'left-bottom',
    img: webDialogRight,
    padding: '60px 74px 27px 24px',
    tagStyle: { top: '20px', left: '28px' },
    boxWidth: 'min(40vw, 720px)',
    minHeight: '206px',
  },
  {
    type: 'right-top',
    img: webDialogTopRight,
    padding: '112px 72px 52px 34px',
    tagStyle: { top: '72px', right: '70px', textAlign: 'left' },
    boxWidth: 'min(68vw, 840px)',
    minHeight: '252px',
  },
  {
    type: 'right-bottom',
    img: webDialogRight,
    padding: '60px 96px 58px 32px',
    tagStyle: { top: '20px', bottom: 'none', left: '28px', textAlign: 'right' },
    boxWidth: 'min(66vw, 820px)',
    minHeight: '236px',
  },
]

const { activeYear, topicYearTabs, displayList, setYear, handleCardClick } = useTopicDetail({
  bubbleConfigs: webBubbleConfigs,
})

const getWebCardBoxStyle = (index, total) => {
  const fullLayouts = [
    { top: '30%', left: '40%', width: 'min(33vw, 620px)', zIndex: 3 },
    { top: '10%', left: '28%', width: 'min(26vw, 560px)', zIndex: 2 },
    { top: '10%', right: '0%', width: 'min(30vw, 560px)', zIndex: 2 },
    { top: '20%', left: '0%', width: 'min(30vw, 680px)', zIndex: 4 },
  ]
  return fullLayouts[index] || fullLayouts[fullLayouts.length - 1]
}

const webDisplayList = computed(() => {
  const total = displayList.value.length
  return displayList.value.map((card, index) => ({
    ...card,
    boxStyle: getWebCardBoxStyle(index, total),
  }))
})
</script>

<template>
  <div class="page">
    <main class="topic-detail" :style="{ backgroundImage: `url(${bgImage})` }">
      <nav class="year-tabs" :style="{ backgroundImage: `url(${yearTabsBg})` }">
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

      <section class="scroll-wrapper" :key="activeYear">
        <div class="scroll-track scroll-track--web">
          <div
            v-for="card in webDisplayList"
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
      <img class="topic-detail__city-right" :src="webQuoteIconBottom" alt="" aria-hidden="true" />
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
  left: 80px;
  z-index: 20;
  display: flex;
  align-items: stretch;
  width: min(46vw, 760px);
  height: 74px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.year-tabs__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border: none;
  padding: 0;
  background: transparent;
  clip-path: polygon(18px 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
  opacity: 0.95;
}
.year-tabs__item {
  &:nth-child(2),
  &:nth-child(3) {
    left: -30px;
  }
}

.year-tabs__item--active {
  opacity: 1;
  z-index: 1;
}

.year-tabs__label {
  font-size: clamp(28px, 1.5vw, 34px);
  font-weight: 700;
  color: #dbeeff;
  text-shadow: 0 1px 4px rgb(0 20 84 / 85%);
  pointer-events: none;
  letter-spacing: 0.5px;
  transform: scale(1);
  transform-origin: center;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    text-shadow 0.2s ease;
}

.year-tabs__item--active .year-tabs__label {
  color: #e9ffff;
  text-shadow: 0 0 12px rgb(126 244 255 / 95%);
  transform: scale(1.14);
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
  width: min(92vw, 1720px);
  margin: 0 auto;
  padding: 0 10px 80px;
  box-sizing: border-box;
}

.scroll-track--web {
  position: relative;
  width: min(94vw, 1760px);
  min-height: clamp(520px, calc(100vh - 360px), 760px);
  padding: 0 14px 96px;
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
.topic-detail__icon {
  position: absolute;
  top: 170px;
  left: 76px;
  width: clamp(180px, 22vw, 180px);
  z-index: 15;
  opacity: 0.9;
  pointer-events: none;
}
.topic-detail__city-right {
  position: absolute;
  top: 430px;
  right: 80px;
  width: clamp(78px, 21vw, 180px);
  z-index: 13;
  pointer-events: none;
}
</style>
