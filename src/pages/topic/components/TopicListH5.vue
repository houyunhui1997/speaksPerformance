<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/h5/list-bg.png'
import dialogRight from '@/assets/topic/h5/dialog-right.png'
import dialogLeft from '@/assets/topic/h5/dialog-left.png'
import { useTopicList } from './useTopicList'

const {
  listWrapperRef,
  cityName,
  scrollList,
  handleCardLink,
  goAuthorDetail,
  pauseAutoScroll,
  syncScrollPos,
} = useTopicList({
  autoScrollSpeed: 0.1,
})

const getDialogBg = (index) => (index % 2 === 0 ? dialogRight : dialogLeft)
</script>

<template>
  <div class="page">
    <main class="topic-list" :style="{ backgroundImage: `url(${bgImage})` }">
      <div v-if="cityName" class="city-header">当前城市：{{ cityName }}</div>
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

.topic-list {
  position: relative;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
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

.city-header {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  z-index: 20;
  text-shadow: 0 2px 4px rgb(0 0 0 / 50%);
}
</style>
