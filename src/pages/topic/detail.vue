<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/topic-detail-bg.png'
import quoteIcon_01 from '@/assets/topic/topic-detail-left-top.png'
import cityBottom from '@/assets/topic/topic-detail-bottom.png'
import cityRight from '@/assets/topic/topic-detail-right-bottom.png'

import contentRightTop from '@/assets/topic/content-right-top.png'
import contentRightBottom from '@/assets/topic/content-right-bottom.png'
import contentLeftTop from '@/assets/topic/content-left-top.png'
import contentLeftBottom from '@/assets/topic/content-left-bottom.png'
import { topicDetailByYear, topicYearTabs } from '@/pages/topic/mock'

const activeYear = ref('2025')
const router = useRouter()

// 根据气泡尾巴的位置，避让相应的区域
const bubbleConfigs = [
  {
    type: 'left-top',
    img: contentLeftTop,
    // 尾巴在左上：上边距和左边距要大
    padding: '35px 15px 45px 60px',
    tagStyle: { bottom: '20px', right: '25px', textAlign: 'right' },
  },
  {
    type: 'left-bottom',
    img: contentLeftBottom,
    // 尾巴在左下：下边距和左边距要大
    padding: '40px 25px 55px 70px',
    tagStyle: { top: '10px', left: '70px' },
  },
  {
    type: 'right-top',
    img: contentRightTop,
    // 尾巴在右上：上边距和右边距要大
    padding: '45px 40px 35px 25px',
    tagStyle: { bottom: '20px', left: '25px', textAlign: 'left' },
  },
  {
    type: 'right-bottom',
    img: contentRightBottom,
    // 尾巴在右下：下边距和右边距要大
    padding: '30px 60px 20px 25px',
    tagStyle: { bottom: '25px', left: '20px', textAlign: 'right' },
  },
]

const processItem = (item, index) => {
  return {
    ...item,
    uniqueKey: `${item.id}-${index}`,
    bgImg: contentRightBottom,
    tagStyle: bubbleConfigs[3].tagStyle,
    cardStyle: {
      padding: bubbleConfigs[3].padding,
      ...getWobbleStyle(index),
    },
    boxStyle: {
      margin: '10px auto 0',
      zIndex: index,
    },
  }
}

const displayList = computed(() => {
  const origin = topicDetailByYear[activeYear.value] || []
  if (origin.length === 0) return []

  let list = [...origin]
  // 确保列表足够长
  while (list.length < 8) {
    list = [...list, ...origin]
  }
  return [...list, ...list].map((item, index) => processItem(item, index))
})

const setYear = (year) => {
  activeYear.value = year
}

const handleCardClick = () => {
  router.push({
    name: 'topicList',
    query: { year: activeYear.value },
  })
}

const getWobbleStyle = () => {
  return {
    animationDelay: `-${Math.random() * 5}s`,
    animationDuration: `${4 + Math.random() * 3}s`,
  }
}
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

      <img class="topic-detail__icon" :src="quoteIcon_01" alt="" aria-hidden="true" />

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
              @click="handleCardClick"
              @keydown.enter.prevent="handleCardClick"
            >
              <p class="detail-card__content">“{{ card.content }}”</p>

              <div class="detail-card__footer">
                <span class="detail-card__author">{{ card.author }}</span>
              </div>

              <!-- Tag 绝对定位 -->
              <div class="detail-card__tag-abs" :style="card.tagStyle">
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
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

/* Tabs */
.year-tabs {
  position: absolute;
  top: 0;
  z-index: 20;
  display: flex;
  height: 56px;
  width: 100%;
  align-items: stretch;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(117, 201, 255, 0.2);
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
  background: rgba(166, 222, 255, 0.58);
  transform: skewX(-16deg);
}
.year-tabs__item--active {
  opacity: 1;
  background: linear-gradient(180deg, #66ebef 0%, #2baecc 100%);
  box-shadow: inset 0 0 18px rgba(138, 253, 255, 0.32);
  z-index: 1;
}
.year-tabs__label {
  font-size: clamp(20px, 4.6vw, 30px);
  font-weight: 700;
  color: #dbeeff;
  text-shadow: 0 1px 4px rgba(0, 20, 84, 0.85);
  pointer-events: none;
  letter-spacing: 0.5px;
}
.year-tabs__item--active .year-tabs__label {
  color: #e9ffff;
  text-shadow: 0 0 12px rgba(126, 244, 255, 0.95);
}
.topic-detail__icon {
  position: absolute;
  top: 74px;
  left: 6px;
  width: clamp(100px, 22vw, 112px);
  z-index: 15;
  opacity: 0.9;
  pointer-events: none;
}

/* --- 滚动区域 --- */
.scroll-wrapper {
  position: absolute;
  top: 76px;
  left: 0;
  right: 0;
  bottom: calc(100px + env(safe-area-inset-bottom));
  overflow: hidden;
  z-index: 10;
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
}

.scroll-track {
  display: flex;
  flex-direction: column;
  padding: 40px 16px;
  gap: 0;
  /* 增加动画时长，让滚动更平缓，方便阅读 */
  animation: scrollUp 55s linear infinite;
  width: 100%;
  box-sizing: border-box;
}

/* --- 卡片盒子 --- */
.detail-card-box {
  width: min(92%, 500px);
  position: relative;
  flex-shrink: 0;
}

/* --- 卡片本体 --- */
.detail-card {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 140px;
  box-sizing: border-box; /* 确保 padding 包含在宽度内 */
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
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 8px;
  /* 防止长单词撑破布局 */
  word-break: break-all;
}

.detail-card__footer {
  text-align: right;
  /* 增加底部留白，防止和Tag重叠 */
  padding-bottom: 5px;
}

.detail-card__author {
  font-size: 13px;
  color: #c5e9ff;
  opacity: 0.9;
  font-weight: normal;
}

/* --- Tag --- */
.detail-card__tag-abs {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  font-size: 12px;
  color: #ffffff;
  background: rgba(18, 56, 150, 0.6);
  border: 1px solid rgba(127, 215, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  backdrop-filter: blur(2px);
  z-index: 2;
}

.topic-detail__city {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 12;
  pointer-events: none;
}
.topic-detail__city-right {
  position: absolute;
  right: 0;
  bottom: calc(120px + env(safe-area-inset-bottom));
  width: clamp(78px, 21vw, 140px);
  z-index: 13;
  pointer-events: none;
}

@keyframes scrollUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
